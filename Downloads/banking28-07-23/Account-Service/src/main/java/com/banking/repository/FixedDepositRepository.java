package com.banking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.model.FixedDeposit;
@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    // You can add custom query methods or use the default methods provided by JpaRepository
    // Example:
     List<FixedDeposit> findByUserId(long userId);
	
}