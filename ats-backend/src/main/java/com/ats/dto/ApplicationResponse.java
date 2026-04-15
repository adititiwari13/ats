package com.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for application response data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String status;
    private Double resumeScore;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private Boolean hasResume;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}
