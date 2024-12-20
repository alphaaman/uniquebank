package com.banking.repository;

import com.banking.model.KanyaSumangala;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KanyaSumangalaRepository extends JpaRepository<KanyaSumangala, Long> {
	List<KanyaSumangala> findByUserId(Long id);
}
