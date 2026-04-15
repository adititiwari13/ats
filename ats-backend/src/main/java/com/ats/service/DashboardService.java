package com.ats.service;

import com.ats.dto.DashboardStats;
import com.ats.model.ApplicationStatus;
import com.ats.model.Role;
import com.ats.repository.ApplicationRepository;
import com.ats.repository.JobRepository;
import com.ats.repository.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Service providing dashboard analytics and statistics.
 */
@Service
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DashboardService(JobRepository jobRepository,
                            ApplicationRepository applicationRepository,
                            UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get comprehensive dashboard statistics.
     */
    public DashboardStats getStats() {
        double avgScore;
        try {
            avgScore = applicationRepository.averageResumeScore();
        } catch (Exception e) {
            avgScore = 0.0;
        }

        return DashboardStats.builder()
                .totalJobs(jobRepository.count())
                .activeJobs(jobRepository.countByActiveTrue())
                .totalApplications(applicationRepository.count())
                .pendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING))
                .shortlistedApplications(applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED))
                .rejectedApplications(applicationRepository.countByStatus(ApplicationStatus.REJECTED))
                .acceptedApplications(applicationRepository.countByStatus(ApplicationStatus.ACCEPTED))
                .totalCandidates(userRepository.countByRole(Role.CANDIDATE))
                .totalRecruiters(userRepository.countByRole(Role.RECRUITER))
                .averageResumeScore(Math.round(avgScore * 10.0) / 10.0)
                .build();
    }
}
