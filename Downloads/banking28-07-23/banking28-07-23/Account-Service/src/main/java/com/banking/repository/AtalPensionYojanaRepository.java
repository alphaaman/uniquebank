package com.banking.repository;

import com.banking.model.Account;
import com.banking.model.AtalPensionYojana;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AtalPensionYojanaRepository extends JpaRepository<AtalPensionYojana, Long> {
    // Add custom query methods if needed
	List<AtalPensionYojana> findByUserId(Long id);
}
