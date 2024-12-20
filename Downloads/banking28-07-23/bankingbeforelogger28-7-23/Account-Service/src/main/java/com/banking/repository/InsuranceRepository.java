package com.banking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banking.model.Insurance;
import java.util.List;
public interface InsuranceRepository extends JpaRepository<Insurance, Long> {

    // Add custom query methods if needed
	List<Insurance> findByUserId(Long id);
    
}