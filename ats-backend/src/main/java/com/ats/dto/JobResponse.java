package com.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for job response data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String requiredSkills;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String jobType;
    private String experienceLevel;
    private Boolean active;
    private String postedByName;
    private Long postedById;
    private LocalDateTime createdAt;
    private int applicationCount;
}
