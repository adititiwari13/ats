package com.ats.controller;

import com.ats.dto.ApiResponse;
import com.ats.dto.DashboardStats;
import com.ats.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for dashboard analytics endpoints.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Get dashboard statistics.
     * GET /api/dashboard/stats
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<ApiResponse> getStats() {
        DashboardStats stats = dashboardService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}
