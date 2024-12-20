package com.banking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.banking.dto.FixedDepositDTO;
import com.banking.model.FixedDeposit;

@Service
public interface FixedDepositService {

	FixedDeposit applyFixedDeposit(FixedDepositDTO fixedDepositDTO);

	boolean breakFixedDeposit(String token, Long fixedDepositId);

	void approveFixedDeposit(String token, Long fixedDepositId);

	List<FixedDeposit> getByUserId(long userId);

	List<FixedDeposit> getAll();

}
