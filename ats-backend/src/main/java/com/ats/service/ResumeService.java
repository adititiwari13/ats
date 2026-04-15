package com.ats.service;

import com.ats.exception.BadRequestException;
import com.ats.model.Resume;
import com.ats.model.User;
import com.ats.repository.ResumeRepository;
import com.ats.util.ResumeParser;
import com.ats.util.ResumeScorer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

/**
 * Service handling resume upload, parsing, and skill extraction.
 */
@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeParser resumeParser;
    private final ResumeScorer resumeScorer;
    private final Path uploadDir;

    public ResumeService(ResumeRepository resumeRepository,
                         ResumeParser resumeParser,
                         ResumeScorer resumeScorer,
                         @Value("${app.upload.dir}") String uploadDir) {
        this.resumeRepository = resumeRepository;
        this.resumeParser = resumeParser;
        this.resumeScorer = resumeScorer;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    /**
     * Upload and parse a resume file.
     */
    public Resume uploadResume(MultipartFile file, User user) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BadRequestException("File name is null");
        }

        // Generate unique file name
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID() + extension;
        Path targetPath = uploadDir.resolve(uniqueFileName);

        // Save file
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text from resume
        String rawText = resumeParser.extractText(file);

        // Extract skills
        Set<String> skills = resumeScorer.extractSkills(rawText);
        String extractedSkills = String.join(", ", skills);

        // Get file type
        String fileType = extension.substring(1).toUpperCase();

        // Check if resume already exists for user, update if so
        Resume resume = resumeRepository.findByUserId(user.getId()).orElse(new Resume());
        resume.setUser(user);
        resume.setFileName(originalFilename);
        resume.setFilePath(targetPath.toString());
        resume.setFileType(fileType);
        resume.setExtractedSkills(extractedSkills);
        resume.setRawText(rawText);

        return resumeRepository.save(resume);
    }

    /**
     * Get resume by user ID.
     */
    public Resume getResumeByUserId(Long userId) {
        return resumeRepository.findByUserId(userId).orElse(null);
    }

    /**
     * Get resume file path for download.
     */
    public Path getResumeFile(Long userId) {
        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("No resume found for this user"));
        return Paths.get(resume.getFilePath());
    }
}
