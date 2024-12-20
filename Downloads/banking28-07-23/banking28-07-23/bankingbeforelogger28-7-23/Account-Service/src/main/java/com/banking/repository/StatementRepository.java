package com.banking.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.model.Statement;

@Repository
public interface StatementRepository extends JpaRepository<Statement, String>{

	List<Statement> findByStatementDateBetween(Date fromDate, Date toDate);
	List<Statement> findByAccountId(String accountId);
}