package com.mockmate.service;

import com.mockmate.dto.SubmitCodeRequest;
import com.mockmate.model.CodingSubmission;
import com.mockmate.model.TestCase;
import com.mockmate.model.Question;
import com.mockmate.model.InterviewSession;
import com.mockmate.model.User;
import com.mockmate.repository.CodingSubmissionRepository;
import com.mockmate.repository.UserRepository;
import com.mockmate.repository.QuestionRepository;
import com.mockmate.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodingEvaluationService {

    private final CodingSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final InterviewSessionRepository interviewSessionRepository;

    @Transactional
    public CodingSubmission submitCode(SubmitCodeRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        InterviewSession interviewSession = null;
        if (request.getInterviewSessionId() != null) {
            interviewSession = interviewSessionRepository.findById(request.getInterviewSessionId())
                    .orElse(null);
        }

        CodingSubmission submission = new CodingSubmission();
        submission.setUser(user);
        submission.setQuestion(question);
        submission.setInterviewSession(interviewSession);
        submission.setCode(request.getCode());
        submission.setLanguage(request.getLanguage());
        submission.setStatus(CodingSubmission.SubmissionStatus.PENDING);
        submission.setSubmittedAt(LocalDateTime.now());

        submission = submissionRepository.save(submission);

        // For now, synchronously evaluate
        evaluateCodeAsync(submission);

        return submission;
    }

    private void evaluateCodeAsync(CodingSubmission submission) {
        try {
            evaluateCode(submission);
        } catch (Exception e) {
            log.error("Error evaluating code for submission {}", submission.getId(), e);
            submission.setStatus(CodingSubmission.SubmissionStatus.FAILED);
            submission.setRuntimeError(e.getMessage());
            submissionRepository.save(submission);
        }
    }

    private void evaluateCode(CodingSubmission submission) {
        submission.setStatus(CodingSubmission.SubmissionStatus.COMPILING);
        submissionRepository.save(submission);

        try {
            // Convert the possibly null set of test cases into a list
            Set<TestCase> testCaseSet = submission.getQuestion().getTestCases();
            List<TestCase> testCases = new ArrayList<>();
            if (testCaseSet != null) {
                testCases.addAll(testCaseSet);
            }

            if (testCases.isEmpty()) {
                submission.setStatus(CodingSubmission.SubmissionStatus.COMPLETED);
                submission.setScore(0.0);
                submission.setFeedback("No test cases available");
                submission.setEvaluatedAt(LocalDateTime.now());
                submissionRepository.save(submission);
                return;
            }

            Path tempDir = Files.createTempDirectory("coding-eval");
            String fileName = getFileName(submission.getLanguage());
            Path codeFile = tempDir.resolve(fileName);
            Files.write(codeFile, submission.getCode().getBytes());

            int passedTests = 0;
            int totalTests = testCases.size();
            StringBuilder feedback = new StringBuilder();

            for (TestCase testCase : testCases) {
                ExecutionResult result = executeCode(codeFile, submission.getLanguage(), testCase.getInput());
                String expected = safeTrim(testCase.getExpectedOutput());
                String got = safeTrim(result.getOutput());

                if (result.isSuccess() && got.equals(expected)) {
                    passedTests++;
                    feedback.append("✓ Test case passed\n");
                } else {
                    feedback.append("✗ Test case failed\n");
                    if (!result.isSuccess()) {
                        feedback.append("Error: ").append(result.getError()).append("\n");
                    } else {
                        feedback.append("Expected: ").append(expected).append("\n");
                        feedback.append("Got: ").append(got).append("\n");
                    }
                }
            }

            double score = (double) passedTests / totalTests * 100.0;

            submission.setStatus(CodingSubmission.SubmissionStatus.COMPLETED);
            submission.setScore(score);
            submission.setTestCasesPassed(passedTests);
            submission.setTotalTestCases(totalTests);
            submission.setFeedback(feedback.toString());
            submission.setEvaluatedAt(LocalDateTime.now());

            // cleanup
            deleteDirectory(tempDir);

        } catch (Exception e) {
            submission.setStatus(CodingSubmission.SubmissionStatus.FAILED);
            submission.setRuntimeError(e.getMessage());
            log.error("Error during code evaluation", e);
        }

        submissionRepository.save(submission);
    }

    private String safeTrim(String s) {
        return s == null ? "" : s.trim();
    }

    private ExecutionResult executeCode(Path codeFile, CodingSubmission.ProgrammingLanguage language, String input) {
        try {
            String command = getExecutionCommand(codeFile, language);
            ProcessBuilder pb = new ProcessBuilder(command.split(" "));
            pb.directory(codeFile.getParent().toFile());

            Process proc = pb.start();

            if (input != null && !input.isBlank()) {
                try (OutputStreamWriter w = new OutputStreamWriter(proc.getOutputStream())) {
                    w.write(input);
                    w.flush();
                }
            }

            boolean finished = proc.waitFor(10, TimeUnit.SECONDS);
            if (!finished) {
                proc.destroyForcibly();
                return new ExecutionResult(false, "", "Execution timeout");
            }

            String output = readStream(proc.getInputStream());
            String error = readStream(proc.getErrorStream());

            if (proc.exitValue() != 0) {
                return new ExecutionResult(false, output, error);
            }

            return new ExecutionResult(true, output, error);

        } catch (Exception e) {
            return new ExecutionResult(false, "", e.getMessage());
        }
    }

    private String getFileName(CodingSubmission.ProgrammingLanguage lang) {
        return switch (lang) {
            case JAVA -> "Solution.java";
            case PYTHON -> "solution.py";
            case CPP -> "solution.cpp";
            case JAVASCRIPT -> "solution.js";
        };
    }

    private String getExecutionCommand(Path codeFile, CodingSubmission.ProgrammingLanguage lang) {
        return switch (lang) {
            case JAVA -> {
                String className = codeFile.getFileName().toString().replace(".java", "");
                yield "java " + className;
            }
            case PYTHON -> "python " + codeFile.getFileName().toString();
            case CPP -> {
                String exe = codeFile.getFileName().toString().replace(".cpp", "");
                yield "./" + exe;
            }
            case JAVASCRIPT -> "node " + codeFile.getFileName().toString();
        };
    }

    private String readStream(InputStream in) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString().trim();
    }

    private void deleteDirectory(Path directory) throws IOException {
        try (var stream = Files.walk(directory)) {
            stream.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(file -> {
                        boolean deleted = file.delete();
                        if (!deleted) {
                            log.warn("Failed to delete file or directory: {}", file.getAbsolutePath());
                        }
                    });
        }
    }

    // Restored helper methods used by controller

    public List<CodingSubmission> getUserSubmissions(String username, Long questionId, Long interviewSessionId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (questionId != null) {
            return submissionRepository.findByUser(user)
                    .stream()
                    .filter(s -> s.getQuestion() != null && Objects.equals(s.getQuestion().getId(), questionId))
                    .toList();
        }

        if (interviewSessionId != null) {
            InterviewSession session = interviewSessionRepository.findById(interviewSessionId)
                    .orElseThrow(() -> new RuntimeException("Interview session not found"));
            return submissionRepository.findByInterviewSession(session)
                    .stream()
                    .filter(s -> s.getUser() != null && Objects.equals(s.getUser().getId(), user.getId()))
                    .toList();
        }

        return submissionRepository.findByUser(user);
    }

    public CodingSubmission getSubmission(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return submissionRepository.findById(id)
                .filter(s -> s.getUser() != null && Objects.equals(s.getUser().getId(), user.getId()))
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    public Map<String, Object> testCode(String code, String language, String input) {
        try {
            Path tempDir = Files.createTempDirectory("code-test");
            String fileName = getFileName(CodingSubmission.ProgrammingLanguage.valueOf(language.toUpperCase()));
            Path codeFile = tempDir.resolve(fileName);

            Files.write(codeFile, code.getBytes());

            ExecutionResult result = executeCode(codeFile, CodingSubmission.ProgrammingLanguage.valueOf(language.toUpperCase()), input);

            deleteDirectory(tempDir);

            Map<String, Object> response = new HashMap<>();
            response.put("success", result.isSuccess());
            response.put("output", result.getOutput());
            response.put("error", result.getError());

            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("output", "");
            response.put("error", e.getMessage());
            return response;
        }
    }

    // Inner helper class
    private static class ExecutionResult {
        private final boolean success;
        private final String output;
        private final String error;

        public ExecutionResult(boolean success, String output, String error) {
            this.success = success;
            this.output = output;
            this.error = error;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getOutput() {
            return output;
        }

        public String getError() {
            return error;
        }
    }
}
