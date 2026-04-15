package com.ats.repository;

import com.ats.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Job entity operations.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByActiveTrue();

    List<Job> findByPostedById(Long userId);

    long countByActiveTrue();

    @Query("SELECT j FROM Job j WHERE j.active = true AND " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchJobs(@Param("keyword") String keyword);

    @Query("SELECT j FROM Job j WHERE j.active = true AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel)")
    List<Job> filterJobs(@Param("location") String location,
                         @Param("jobType") String jobType,
                         @Param("experienceLevel") String experienceLevel);
}
