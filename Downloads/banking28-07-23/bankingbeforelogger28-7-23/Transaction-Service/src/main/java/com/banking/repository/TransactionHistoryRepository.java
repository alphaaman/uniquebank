package com.banking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.model.TransactionHistory;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, String> {
	
	List<TransactionHistory> findByAccountId(String accountId);
	
	List<TransactionHistory> findByNarration(String accountId);

	
	
}