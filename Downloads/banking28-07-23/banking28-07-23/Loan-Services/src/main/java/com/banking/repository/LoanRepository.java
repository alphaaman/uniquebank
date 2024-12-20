package com.banking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.model.EmploymentStatus;
import com.banking.model.Loan;
import com.banking.model.LoanStatus;
import com.banking.model.LoanType;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

	List<Loan>findByUserId(Long userId);
    
}
