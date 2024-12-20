package com.banking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.banking.model.DeductGiftCardCharges;
import com.banking.model.OneWayTransactionDTO;
import com.banking.model.TransferDTO;

@FeignClient(name = "TRANSACTION-SERVICE")
public interface TransactionClient {

	@PostMapping("transaction/deposit")
	public ResponseEntity<?> deposit(@RequestHeader(name = "Authorization") String token,@RequestBody OneWayTransactionDTO transactionDTO);
	
	@PostMapping("transaction/withdraw")
	public ResponseEntity<?> withdraw(@RequestHeader(name = "Authorization") String token,@RequestBody OneWayTransactionDTO transactionDTO);

	
	@PostMapping("transaction/gift-charge")
	public ResponseEntity<?> giftCharge(@RequestHeader(name = "Authorization") String token,@RequestBody DeductGiftCardCharges deductGiftCardCharges);

}