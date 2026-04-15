package com.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for dashboard statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long pendingApplications;
    private long shortlistedApplications;
    private long rejectedApplications;
    private long acceptedApplications;
    private long totalCandidates;
    private long totalRecruiters;
    private double averageResumeScore;
}
