package com.ats.repository;

import com.ats.model.Application;
import com.ats.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Application entity operations.
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByJobId(Long jobId);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    long countByStatus(ApplicationStatus status);

    long countByJobId(Long jobId);

    @Query("SELECT COALESCE(AVG(a.resumeScore), 0) FROM Application a WHERE a.resumeScore IS NOT NULL")
    double averageResumeScore();

    @Query("SELECT a FROM Application a WHERE a.job.postedBy.id = :recruiterId")
    List<Application> findByRecruiterId(Long recruiterId);
}
