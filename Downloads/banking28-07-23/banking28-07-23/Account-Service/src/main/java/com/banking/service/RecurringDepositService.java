package com.banking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.banking.dto.RecurringDepositDTO;
import com.banking.model.RecurringDeposit;

@Service
public interface RecurringDepositService {

	RecurringDeposit applyRecurringDeposit(RecurringDepositDTO recurringDepositDTO);

	boolean breakRecurringDeposit(String token, Long recurringDepositId);

	void approveRecurringDeposit(String token, Long recurringDepositId);

	List<RecurringDeposit> getByUserId(long userId);

	List<RecurringDeposit> getAll();

	void payRecurringDeposit(String token, Long recurringDepositId);
	

}
