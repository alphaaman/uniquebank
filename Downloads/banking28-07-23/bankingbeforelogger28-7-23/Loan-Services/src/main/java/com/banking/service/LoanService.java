package com.banking.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.banking.model.InvalidAccessException;
import com.banking.model.Loan;
@Service
public interface LoanService {
	
	String applyLoan(String token,Loan loan)throws InvalidAccessException;
	String verifyLoan(String token,Long id)throws InvalidAccessException;//Bank authorize person take care of this
	String approveLoan(String token,Long id)throws InvalidAccessException;
	String disburseMoney(String token,Long id ,  Loan loan)throws InvalidAccessException;
	String completedLoanInstallment(String token,Long id)throws InvalidAccessException;
	
	String rejectLoan(String token,Long id)throws InvalidAccessException;
	
	int calculateEmi(String token,Loan loan)throws InvalidAccessException;//User can calculate this
	double pendingAmount(String token,Long id)throws InvalidAccessException;
	Loan ChangeTenure(String token,Long id ,int months)throws InvalidAccessException; // user can request
	int pendingEmi(String token,Long id)throws InvalidAccessException;
	
	double overDue(String token, Long id) throws InvalidAccessException;
	List<Loan> getAllLoans(String token) throws InvalidAccessException;
	List<Loan> getLoanByUserId(String token, Long UserId) throws InvalidAccessException;
	String payMonthlyEmi(String token, Long id) throws InvalidAccessException;
	
}
