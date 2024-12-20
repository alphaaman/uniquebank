package com.banking.service;

import org.springframework.stereotype.Service;

import com.banking.exception.InvalidAccessException;
import com.banking.model.RuleStatus;

@Service
public interface RulesService {
	
	double getServiceCharges(String accountType);

	RuleStatus evaluateMinBalance(String accountType, double balance) throws InvalidAccessException;
	
	double getLockerCharges(int durationMonths);

}