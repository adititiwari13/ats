package com.ats.repository;

import com.ats.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Resume entity operations.
 */
@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    Optional<Resume> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
