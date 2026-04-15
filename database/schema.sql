-- ================================================================
-- ATS (Applicant Tracking System) - Database Schema
-- Database: MySQL
-- ================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS ats_db;
USE ats_db;

-- ================================================================
-- Users Table
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'RECRUITER', 'CANDIDATE') NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- Jobs Table
-- ================================================================
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    required_skills TEXT,
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    job_type VARCHAR(50),
    experience_level VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    posted_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_active (active),
    INDEX idx_posted_by (posted_by),
    FULLTEXT INDEX idx_search (title, description, company, location, required_skills)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- Resumes Table
-- ================================================================
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20),
    extracted_skills TEXT,
    raw_text LONGTEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- Applications Table
-- ================================================================
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    status ENUM('PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED') NOT NULL DEFAULT 'PENDING',
    resume_score DOUBLE,
    cover_letter TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_job_candidate (job_id, candidate_id),
    INDEX idx_candidate (candidate_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- Sample Data (Optional - for testing)
-- ================================================================

-- Insert admin user (password: admin123 - BCrypt encoded)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@ats.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Note: The above password hash is for 'admin123'
-- For real usage, register users through the API which will properly encode passwords
