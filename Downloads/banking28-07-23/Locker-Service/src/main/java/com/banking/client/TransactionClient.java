package com.banking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.banking.model.DeductLockerChargesRequest;
import com.banking.model.OneWayTransactionDTO;
import com.banking.model.TransferDTO;

@FeignClient(name = "TRANSACTION-SERVICE")
public interface TransactionClient {

	@PostMapping("transaction/deposit")
	public ResponseEntity<?> deposit(@RequestHeader(name = "Authorization") String token,@RequestBody OneWayTransactionDTO transactionDTO);
	
		
	@PostMapping("transaction/locker-charge")
	public ResponseEntity<?> lockerCharge(@RequestHeader(name = "Authorization") String token,@RequestBody DeductLockerChargesRequest deductLockerChargesRequest);


}