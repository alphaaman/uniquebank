package com.banking.service;

import java.util.Date;
import java.util.List;

import com.banking.model.Insurance;

public interface InsuranceService {

	String payDueAmount(String token, Long id, double amount);

	Insurance rejectInsurance(Long id);

	Insurance approveInsurance(String token, Long id);

	void deleteInsurance(Long id);

	Insurance updateInsurance(Long id, Insurance updatedInsurance);

	List<Insurance> getAllInsurances();

	Insurance getInsuranceById(Long id);

	Insurance createInsurance(Insurance insurance);

	List<Insurance> getByUserId(long userId);

	void claimInsurance(String token, Long id);

	
}
