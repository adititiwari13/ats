package com.ats.service;

import com.ats.dto.ApplicationResponse;
import com.ats.exception.BadRequestException;
import com.ats.exception.DuplicateResourceException;
import com.ats.exception.ResourceNotFoundException;
import com.ats.model.*;
import com.ats.repository.ApplicationRepository;
import com.ats.repository.JobRepository;
import com.ats.repository.ResumeRepository;
import com.ats.util.ResumeScorer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling job application business logic.
 */
@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeScorer resumeScorer;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              ResumeRepository resumeRepository,
                              ResumeScorer resumeScorer) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.resumeRepository = resumeRepository;
        this.resumeScorer = resumeScorer;
    }

    /**
     * Apply for a job as a candidate.
     */
    public ApplicationResponse applyForJob(Long jobId, User candidate, String coverLetter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getActive()) {
            throw new BadRequestException("This job is no longer accepting applications");
        }

        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            throw new DuplicateResourceException("You have already applied for this job");
        }

        // Calculate resume score if candidate has uploaded a resume
        Double resumeScore = null;
        Resume resume = resumeRepository.findByUserId(candidate.getId()).orElse(null);
        if (resume != null && resume.getExtractedSkills() != null && job.getRequiredSkills() != null) {
            resumeScore = resumeScorer.calculateScore(resume.getExtractedSkills(), job.getRequiredSkills());
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.PENDING)
                .resumeScore(resumeScore)
                .coverLetter(coverLetter)
                .build();

        application = applicationRepository.save(application);
        return mapToResponse(application);
    }

    /**
     * Get all applications for a candidate.
     */
    public List<ApplicationResponse> getApplicationsByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all applications for a specific job.
     */
    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all applications (admin view).
     */
    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get applications for jobs posted by a specific recruiter.
     */
    public List<ApplicationResponse> getApplicationsByRecruiter(Long recruiterId) {
        return applicationRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update application status.
     */
    public ApplicationResponse updateStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        try {
            application.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        application = applicationRepository.save(application);
        return mapToResponse(application);
    }

    private ApplicationResponse mapToResponse(Application app) {
        Resume resume = resumeRepository.findByUserId(app.getCandidate().getId()).orElse(null);
        boolean hasResume = resume != null;
        
        List<String> matched = null;
        List<String> missing = null;
        
        if (resume != null && app.getJob().getRequiredSkills() != null) {
            var comparison = resumeScorer.getComparison(resume.getExtractedSkills(), app.getJob().getRequiredSkills());
            matched = comparison.get("matched").stream().collect(Collectors.toList());
            missing = comparison.get("missing").stream().collect(Collectors.toList());
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .company(app.getJob().getCompany())
                .candidateId(app.getCandidate().getId())
                .candidateName(app.getCandidate().getName())
                .candidateEmail(app.getCandidate().getEmail())
                .status(app.getStatus().name())
                .resumeScore(app.getResumeScore())
                .coverLetter(app.getCoverLetter())
                .appliedAt(app.getAppliedAt())
                .hasResume(hasResume)
                .matchedSkills(matched)
                .missingSkills(missing)
                .build();
    }
}
