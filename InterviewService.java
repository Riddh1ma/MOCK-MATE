package com.mockmate.service;

import com.mockmate.dto.CreateInterviewRequest;
import com.mockmate.model.InterviewSession;
import com.mockmate.model.User;
import com.mockmate.repository.InterviewSessionRepository;
import com.mockmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository interviewSessionRepository;
    private final UserRepository userRepository;

    @Transactional
    public InterviewSession createInterview(CreateInterviewRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        InterviewSession session = new InterviewSession();
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setType(request.getType());
        session.setUser(user);
        session.setScheduledAt(request.getScheduledAt());
        session.setDurationMinutes(request.getDurationMinutes());
        session.setStatus(InterviewSession.SessionStatus.SCHEDULED);
        session.setPeerInterview(request.isPeerInterview());

        // Assign mentor if provided
        if (request.getMentorId() != null) {
            User mentor = userRepository.findById(request.getMentorId())
                    .orElseThrow(() -> new RuntimeException("Mentor not found"));
            session.setMentor(mentor);
        }

        // Set peer user for peer interviews
        if (request.isPeerInterview() && request.getPeerUserId() != null) {
            User peerUser = userRepository.findById(request.getPeerUserId())
                    .orElseThrow(() -> new RuntimeException("Peer user not found"));
            session.setPeerUser(peerUser);
        }

        return interviewSessionRepository.save(session);
    }

    public List<InterviewSession> getUserInterviews(String username, InterviewSession.SessionStatus status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (status != null) {
            return interviewSessionRepository.findByUserAndStatus(user, status);
        }
        return interviewSessionRepository.findByUser(user);
    }

    public InterviewSession getInterview(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return interviewSessionRepository.findById(id)
                .filter(session -> session.getUser().getId().equals(user.getId()) || 
                                 (session.getMentor() != null && session.getMentor().getId().equals(user.getId())) ||
                                 (session.getPeerUser() != null && session.getPeerUser().getId().equals(user.getId())))
                .orElseThrow(() -> new RuntimeException("Interview not found"));
    }

    @Transactional
    public InterviewSession startInterview(Long id, String username) {
        InterviewSession session = getInterview(id, username);
        
        if (session.getStatus() != InterviewSession.SessionStatus.SCHEDULED) {
            throw new RuntimeException("Interview cannot be started in current status");
        }

        session.setStatus(InterviewSession.SessionStatus.IN_PROGRESS);
        session.setStartedAt(LocalDateTime.now());

        return interviewSessionRepository.save(session);
    }

    @Transactional
    public InterviewSession completeInterview(Long id, String username, String feedback) {
        InterviewSession session = getInterview(id, username);
        
        if (session.getStatus() != InterviewSession.SessionStatus.IN_PROGRESS) {
            throw new RuntimeException("Interview is not in progress");
        }

        session.setStatus(InterviewSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        session.setFeedback(feedback);

        return interviewSessionRepository.save(session);
    }

    @Transactional
    public void cancelInterview(Long id, String username) {
        InterviewSession session = getInterview(id, username);
        
        if (session.getStatus() == InterviewSession.SessionStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed interview");
        }

        session.setStatus(InterviewSession.SessionStatus.CANCELLED);
        interviewSessionRepository.save(session);
    }

    public List<InterviewSession> getAvailablePeerInterviews() {
        return interviewSessionRepository.findPeerInterviewSessions(InterviewSession.SessionStatus.SCHEDULED);
    }

    @Transactional
    public InterviewSession joinPeerInterview(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        InterviewSession session = interviewSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        if (!session.isPeerInterview()) {
            throw new RuntimeException("This is not a peer interview");
        }

        if (session.getPeerUser() != null) {
            throw new RuntimeException("Interview already has a peer participant");
        }

        if (session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot join your own interview");
        }

        session.setPeerUser(user);
        return interviewSessionRepository.save(session);
    }
}
