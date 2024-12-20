package com.banking.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banking.exception.InvalidAccessException;
import com.banking.model.RuleStatus;
import com.banking.service.RulesService;

@Service
public class RulesServiceImpl implements RulesService {
	
//	@Autowired
//	AuthClient authClient;

	@Override
	public RuleStatus evaluateMinBalance(String accountType, double balance) throws InvalidAccessException {
	    if (accountType.equalsIgnoreCase("SAVINGS") && balance >= 400) {
	        return new RuleStatus("Allowed");
	    } else if (accountType.equalsIgnoreCase("CURRENT") && balance >= 1000) {
	        return new RuleStatus("Allowed");
	    } else if (accountType.equalsIgnoreCase("ZERO BALANCE") && balance >= 0) {
	        return new RuleStatus("Allowed");
	    }
	    else if (accountType.equalsIgnoreCase("BANK_ACCOUNT") && balance >= 0) {
	        return new RuleStatus("Allowed");
	    }else {
	        throw new InvalidAccessException();
	    }
	}

	
	@Override
	public double getServiceCharges(String accountType){
			if(accountType.equalsIgnoreCase("SAVINGS")) {			
				return 0.1;
			} else if(accountType.equalsIgnoreCase("CURRENT")) {			
				return 0.05;
			} else if(accountType.equalsIgnoreCase("ZERO BALANCE")) {			
				return 0.2;
			}
			return 0;
	}
	
	
	public double getLockerCharges(int durationMonths) {
		double chargesPerMonth = 1000.0; 
		return chargesPerMonth * durationMonths;
	}
	

}