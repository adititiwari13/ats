package com.ats.controller;

import com.ats.dto.*;
import com.ats.model.User;
import com.ats.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for job management endpoints.
 */
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * Create a new job posting.
     * POST /api/jobs
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> createJob(@Valid @RequestBody JobRequest request,
                                                  @AuthenticationPrincipal User currentUser) {
        JobResponse job = jobService.createJob(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Job created successfully", job));
    }

    /**
     * Get all active jobs.
     * GET /api/jobs
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllJobs() {
        List<JobResponse> jobs = jobService.getAllActiveJobs();
        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved", jobs));
    }

    /**
     * Get all jobs including inactive (admin/recruiter view).
     * GET /api/jobs/all
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> getAllJobsAdmin() {
        List<JobResponse> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(ApiResponse.success("All jobs retrieved", jobs));
    }

    /**
     * Get job by ID.
     * GET /api/jobs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved", job));
    }

    /**
     * Get jobs posted by current user.
     * GET /api/jobs/my-jobs
     */
    @GetMapping("/my-jobs")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> getMyJobs(@AuthenticationPrincipal User currentUser) {
        List<JobResponse> jobs = jobService.getJobsByPostedBy(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Your jobs retrieved", jobs));
    }

    /**
     * Search jobs by keyword.
     * GET /api/jobs/search?keyword=...
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchJobs(@RequestParam String keyword) {
        List<JobResponse> jobs = jobService.searchJobs(keyword);
        return ResponseEntity.ok(ApiResponse.success("Search results", jobs));
    }

    /**
     * Filter jobs.
     * GET /api/jobs/filter?location=...&jobType=...&experienceLevel=...
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse> filterJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experienceLevel) {
        List<JobResponse> jobs = jobService.filterJobs(location, jobType, experienceLevel);
        return ResponseEntity.ok(ApiResponse.success("Filtered results", jobs));
    }

    /**
     * Update a job.
     * PUT /api/jobs/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> updateJob(@PathVariable Long id,
                                                  @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", job));
    }

    /**
     * Toggle job active status.
     * PATCH /api/jobs/{id}/toggle
     */
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> toggleJob(@PathVariable Long id) {
        JobResponse job = jobService.toggleJobStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Job status toggled", job));
    }

    /**
     * Delete a job.
     * DELETE /api/jobs/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully"));
    }
}
