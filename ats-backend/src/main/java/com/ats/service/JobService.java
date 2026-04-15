package com.ats.service;

import com.ats.dto.JobRequest;
import com.ats.dto.JobResponse;
import com.ats.exception.ResourceNotFoundException;
import com.ats.model.Job;
import com.ats.model.User;
import com.ats.repository.ApplicationRepository;
import com.ats.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling job-related business logic.
 */
@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    /**
     * Create a new job posting.
     */
    public JobResponse createJob(JobRequest request, User postedBy) {
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(request.getCompany())
                .location(request.getLocation())
                .requiredSkills(request.getRequiredSkills())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .jobType(request.getJobType())
                .experienceLevel(request.getExperienceLevel())
                .active(true)
                .postedBy(postedBy)
                .build();

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    /**
     * Get all active jobs.
     */
    public List<JobResponse> getAllActiveJobs() {
        return jobRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all jobs (admin view).
     */
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get job by ID.
     */
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapToResponse(job);
    }

    /**
     * Get jobs posted by a specific user.
     */
    public List<JobResponse> getJobsByPostedBy(Long userId) {
        return jobRepository.findByPostedById(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search jobs by keyword.
     */
    public List<JobResponse> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filter jobs by location, type, and experience level.
     */
    public List<JobResponse> filterJobs(String location, String jobType, String experienceLevel) {
        return jobRepository.filterJobs(location, jobType, experienceLevel).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update an existing job.
     */
    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    /**
     * Toggle job active status.
     */
    public JobResponse toggleJobStatus(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        job.setActive(!job.getActive());
        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    /**
     * Delete a job.
     */
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    private JobResponse mapToResponse(Job job) {
        long appCount = applicationRepository.countByJobId(job.getId());
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .company(job.getCompany())
                .location(job.getLocation())
                .requiredSkills(job.getRequiredSkills())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .active(job.getActive())
                .postedByName(job.getPostedBy().getName())
                .postedById(job.getPostedBy().getId())
                .createdAt(job.getCreatedAt())
                .applicationCount((int) appCount)
                .build();
    }
}
