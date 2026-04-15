package com.ats.util;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Utility class for resume scoring - compares resume skills against job requirements.
 */
@Component
public class ResumeScorer {

    // Common technical skills for keyword extraction
    private static final Set<String> KNOWN_SKILLS = Set.of(
            "java", "python", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust", "swift", "kotlin",
            "react", "angular", "vue", "node.js", "nodejs", "express", "spring", "spring boot", "django", "flask",
            "html", "css", "sass", "tailwind", "bootstrap",
            "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "ci/cd", "terraform",
            "git", "github", "gitlab", "bitbucket",
            "rest", "restful", "graphql", "microservices", "api",
            "machine learning", "deep learning", "data science", "ai", "nlp",
            "agile", "scrum", "jira", "devops",
            "linux", "unix", "windows",
            "junit", "selenium", "testing", "tdd",
            "hibernate", "jpa", "jdbc",
            "maven", "gradle",
            "kafka", "rabbitmq", "message queue",
            "oauth", "jwt", "security",
            "figma", "photoshop", "ui/ux",
            "communication", "leadership", "teamwork", "problem solving"
    );

    /**
     * Extract skills from raw resume text.
     */
    public Set<String> extractSkills(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptySet();
        }

        String lowerText = text.toLowerCase();
        return KNOWN_SKILLS.stream()
                .filter(skill -> lowerText.contains(skill.toLowerCase()))
                .collect(Collectors.toSet());
    }

    /**
     * Calculate resume score by matching resume skills against job required skills.
     * Returns a percentage score (0-100).
     */
    public double calculateScore(String resumeSkills, String jobRequiredSkills) {
        if (resumeSkills == null || jobRequiredSkills == null ||
                resumeSkills.isBlank() || jobRequiredSkills.isBlank()) {
            return 0.0;
        }

        Set<String> resumeSkillSet = parseSkills(resumeSkills);
        Set<String> jobSkillSet = parseSkills(jobRequiredSkills);

        if (jobSkillSet.isEmpty()) {
            return 0.0;
        }

        long matchCount = jobSkillSet.stream()
                .filter(jobSkill -> resumeSkillSet.stream()
                        .anyMatch(resumeSkill -> resumeSkill.contains(jobSkill) || jobSkill.contains(resumeSkill)))
                .count();

        return Math.round((double) matchCount / jobSkillSet.size() * 100.0 * 10.0) / 10.0;
    }

    /**
     * Compare resume skills against job requirements and return matched and missing sets.
     */
    public Map<String, Set<String>> getComparison(String resumeSkills, String jobRequiredSkills) {
        Set<String> resumeSkillSet = parseSkills(resumeSkills);
        Set<String> jobSkillSet = parseSkills(jobRequiredSkills);

        Set<String> matched = jobSkillSet.stream()
                .filter(jobSkill -> resumeSkillSet.stream()
                        .anyMatch(resumeSkill -> resumeSkill.contains(jobSkill) || jobSkill.contains(resumeSkill)))
                .collect(Collectors.toSet());

        Set<String> missing = new HashSet<>(jobSkillSet);
        missing.removeAll(matched);

        Map<String, Set<String>> result = new HashMap<>();
        result.put("matched", matched);
        result.put("missing", missing);
        return result;
    }

    /**
     * Parse comma-separated skills string into a set of lowercase trimmed skills.
     */
    public Set<String> parseSkills(String skills) {
        if (skills == null || skills.isBlank()) return Collections.emptySet();
        return Arrays.stream(skills.toLowerCase().split("[,;|]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }
}
