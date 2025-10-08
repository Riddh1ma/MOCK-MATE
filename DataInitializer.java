package com.mockmate.config;

import com.mockmate.model.*;
import com.mockmate.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TestCaseRepository testCaseRepository;
    private final OptionRepository optionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        
        if (questionRepository.count() == 0) {
            initializeQuestions();
        }
        
        log.info("Data initialization completed");
    }

    private void initializeUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@mockmate.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setRole(User.Role.ADMIN);
        admin.setEnabled(true);
        userRepository.save(admin);

        // Create mentor user
        User mentor = new User();
        mentor.setUsername("mentor");
        mentor.setEmail("mentor@mockmate.com");
        mentor.setPassword(passwordEncoder.encode("mentor123"));
        mentor.setFirstName("John");
        mentor.setLastName("Mentor");
        mentor.setRole(User.Role.MENTOR);
        mentor.setEnabled(true);
        mentor.setBio("Experienced software engineer with 10+ years in the industry");
        userRepository.save(mentor);

        // Create sample students
        for (int i = 1; i <= 5; i++) {
            User student = new User();
            student.setUsername("student" + i);
            student.setEmail("student" + i + "@mockmate.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setFirstName("Student");
            student.setLastName(i + "");
            student.setRole(User.Role.STUDENT);
            student.setEnabled(true);
            student.setBio("Computer Science student preparing for interviews");
            userRepository.save(student);
        }

        log.info("Users initialized");
    }

    private void initializeQuestions() {
        // Coding Questions
        createCodingQuestions();
        
        // MCQ Questions
        createMCQQuestions();
        
        // Behavioral Questions
        createBehavioralQuestions();

        log.info("Questions initialized");
    }

    private void createCodingQuestions() {
        // Two Sum Problem
        Question twoSum = createQuestion(
            "Two Sum",
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
            Question.QuestionType.CODING,
            Question.DifficultyLevel.EASY,
            Question.Category.ALGORITHMS,
            "array, hash table, two pointers",
            15,
            10
        );

        // Test cases for Two Sum
        createTestCase(twoSum, "[2,7,11,15]", "[0,1]", true, 2);
        createTestCase(twoSum, "[3,2,4]", "[1,2]", true, 2);
        createTestCase(twoSum, "[3,3]", "[0,1]", true, 2);

        // Valid Parentheses
        Question validParentheses = createQuestion(
            "Valid Parentheses",
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample:\nInput: s = \"()\"\nOutput: true",
            Question.QuestionType.CODING,
            Question.DifficultyLevel.EASY,
            Question.Category.DATA_STRUCTURES,
            "stack, string",
            10,
            10
        );

        createTestCase(validParentheses, "\"()\"", "true", true, 2);
        createTestCase(validParentheses, "\"()[]{}\"", "true", true, 2);
        createTestCase(validParentheses, "\"(]\"", "false", true, 2);

        // Merge Two Sorted Lists
        Question mergeLists = createQuestion(
            "Merge Two Sorted Lists",
            "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
            Question.QuestionType.CODING,
            Question.DifficultyLevel.EASY,
            Question.Category.DATA_STRUCTURES,
            "linked list, recursion",
            20,
            15
        );

        createTestCase(mergeLists, "[1,2,4] [1,3,4]", "[1,1,2,3,4,4]", true, 3);
        createTestCase(mergeLists, "[] []", "[]", true, 1);
        createTestCase(mergeLists, "[] [0]", "[0]", true, 1);
    }

    private void createMCQQuestions() {
        // Java MCQ
        Question javaInheritance = createQuestion(
            "Java Inheritance",
            "Which keyword is used to inherit a class in Java?",
            Question.QuestionType.MCQ,
            Question.DifficultyLevel.EASY,
            Question.Category.JAVA,
            "java, inheritance, oop",
            2,
            5
        );

        createOption(javaInheritance, "extends", true, "A");
        createOption(javaInheritance, "implements", false, "B");
        createOption(javaInheritance, "inherits", false, "C");
        createOption(javaInheritance, "super", false, "D");

        // Data Structures MCQ
        Question hashTableComplexity = createQuestion(
            "Hash Table Complexity",
            "What is the average time complexity of search, insert, and delete operations in a hash table?",
            Question.QuestionType.MCQ,
            Question.DifficultyLevel.MEDIUM,
            Question.Category.DATA_STRUCTURES,
            "hash table, complexity, algorithms",
            3,
            8
        );

        createOption(hashTableComplexity, "O(1)", true, "A");
        createOption(hashTableComplexity, "O(log n)", false, "B");
        createOption(hashTableComplexity, "O(n)", false, "C");
        createOption(hashTableComplexity, "O(n log n)", false, "D");

        // System Design MCQ
        Question loadBalancing = createQuestion(
            "Load Balancing",
            "Which load balancing algorithm distributes requests evenly across all servers without considering server load?",
            Question.QuestionType.MCQ,
            Question.DifficultyLevel.MEDIUM,
            Question.Category.SYSTEM_DESIGN,
            "load balancing, distributed systems",
            5,
            10
        );

        createOption(loadBalancing, "Round Robin", true, "A");
        createOption(loadBalancing, "Least Connections", false, "B");
        createOption(loadBalancing, "Weighted Round Robin", false, "C");
        createOption(loadBalancing, "IP Hash", false, "D");
    }

    private void createBehavioralQuestions() {
        // Leadership question
        createQuestion(
            "Tell me about a time you led a team",
            "Describe a situation where you had to lead a team or group of people. What challenges did you face and how did you overcome them?",
            Question.QuestionType.BEHAVIORAL,
            Question.DifficultyLevel.MEDIUM,
            Question.Category.LEADERSHIP,
            "leadership, teamwork, problem solving",
            5,
            10
        );

        // Problem solving question
        createQuestion(
            "Describe a difficult problem you solved",
            "Tell me about a challenging problem you faced in your previous role or project. How did you approach it and what was the outcome?",
            Question.QuestionType.BEHAVIORAL,
            Question.DifficultyLevel.MEDIUM,
            Question.Category.PROBLEM_SOLVING,
            "problem solving, critical thinking",
            5,
            10
        );

        // Conflict resolution question
        createQuestion(
            "How do you handle conflicts?",
            "Describe a time when you had a disagreement with a colleague or team member. How did you resolve it?",
            Question.QuestionType.BEHAVIORAL,
            Question.DifficultyLevel.EASY,
            Question.Category.BEHAVIORAL,
            "conflict resolution, communication",
            3,
            8
        );

        // Time management question
        createQuestion(
            "How do you prioritize tasks?",
            "Explain your approach to managing multiple tasks and deadlines. Give an example of how you prioritized competing demands.",
            Question.QuestionType.BEHAVIORAL,
            Question.DifficultyLevel.EASY,
            Question.Category.BEHAVIORAL,
            "time management, prioritization",
            3,
            8
        );
    }

    private Question createQuestion(String title, String content, Question.QuestionType type,
                                   Question.DifficultyLevel difficulty, Question.Category category,
                                   String tags, Integer timeLimit, Integer points) {
        Question question = new Question();
        question.setTitle(title);
        question.setContent(content);
        question.setType(type);
        question.setDifficulty(difficulty);
        question.setCategory(category);
        question.setTags(tags);
        question.setTimeLimitMinutes(timeLimit);
        question.setPoints(points);
        question.setActive(true);
        return questionRepository.save(question);
    }

    private TestCase createTestCase(Question question, String input, String expectedOutput,
                                   boolean isHidden, Integer points) {
        TestCase testCase = new TestCase();
        testCase.setQuestion(question);
        testCase.setInput(input);
        testCase.setExpectedOutput(expectedOutput);
        testCase.setHidden(isHidden);
        testCase.setPoints(points);
        return testCaseRepository.save(testCase);
    }

    private Option createOption(Question question, String text, boolean isCorrect, String optionLabel) {
        Option option = new Option();
        option.setQuestion(question);
        option.setText(text);
        option.setCorrect(isCorrect);
        option.setOptionLabel(optionLabel);
        return optionRepository.save(option);
    }
}
