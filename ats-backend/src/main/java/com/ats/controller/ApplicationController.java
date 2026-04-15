package com.ats.controller;

import com.ats.dto.*;
import com.ats.model.User;
import com.ats.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for job application endpoints.
 */
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Apply for a job.
     * POST /api/applications/apply/{jobId}
     */
    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse> applyForJob(@PathVariable Long jobId,
                                                    @RequestBody(required = false) Map<String, String> body,
                                                    @AuthenticationPrincipal User currentUser) {
        String coverLetter = body != null ? body.get("coverLetter") : null;
        ApplicationResponse application = applicationService.applyForJob(jobId, currentUser, coverLetter);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", application));
    }

    /**
     * Get my applications (candidate view).
     * GET /api/applications/my-applications
     */
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse> getMyApplications(@AuthenticationPrincipal User currentUser) {
        List<ApplicationResponse> applications = applicationService.getApplicationsByCandidate(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    /**
     * Get all applications (admin view).
     * GET /api/applications
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> getAllApplications(@AuthenticationPrincipal User currentUser) {
        List<ApplicationResponse> applications;
        if (currentUser.getRole().name().equals("ADMIN")) {
            applications = applicationService.getAllApplications();
        } else {
            applications = applicationService.getApplicationsByRecruiter(currentUser.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    /**
     * Get applications for a specific job.
     * GET /api/applications/job/{jobId}
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> getApplicationsByJob(@PathVariable Long jobId) {
        List<ApplicationResponse> applications = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    /**
     * Update application status.
     * PATCH /api/applications/{id}/status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        String status = body.get("status");
        ApplicationResponse application = applicationService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", application));
    }
}
