package com.ats.controller;

import com.ats.dto.ApiResponse;
import com.ats.model.Resume;
import com.ats.model.User;
import com.ats.service.ResumeService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for resume management endpoints.
 */
@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Upload a resume file.
     * POST /api/resumes/upload
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse> uploadResume(@RequestParam("file") MultipartFile file,
                                                     @AuthenticationPrincipal User currentUser) throws IOException {
        Resume resume = resumeService.uploadResume(file, currentUser);

        Map<String, Object> data = new HashMap<>();
        data.put("id", resume.getId());
        data.put("fileName", resume.getFileName());
        data.put("fileType", resume.getFileType());
        data.put("extractedSkills", resume.getExtractedSkills());
        data.put("uploadedAt", resume.getUploadedAt());

        return ResponseEntity.ok(ApiResponse.success("Resume uploaded and parsed successfully", data));
    }

    /**
     * Get current user's resume info.
     * GET /api/resumes/my-resume
     */
    @GetMapping("/my-resume")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse> getMyResume(@AuthenticationPrincipal User currentUser) {
        Resume resume = resumeService.getResumeByUserId(currentUser.getId());
        if (resume == null) {
            return ResponseEntity.ok(ApiResponse.success("No resume uploaded yet", null));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", resume.getId());
        data.put("fileName", resume.getFileName());
        data.put("fileType", resume.getFileType());
        data.put("extractedSkills", resume.getExtractedSkills());
        data.put("uploadedAt", resume.getUploadedAt());

        return ResponseEntity.ok(ApiResponse.success("Resume retrieved", data));
    }

    /**
     * Download a resume by user ID.
     * GET /api/resumes/download/{candidateId}
     */
    @GetMapping("/download/{candidateId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long candidateId) throws IOException {
        Path filePath = resumeService.getResumeFile(candidateId);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        Resume resume = resumeService.getResumeByUserId(candidateId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                .body(resource);
    }
}
