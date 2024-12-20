package com.banking.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.banking.dto.OneWayTransactionDTO;
import com.banking.dto.TransferDTO;

@FeignClient(name = "TRANSACTION-SERVICE")
public interface TransactionClient {

	@PostMapping("transaction/deposit")
	public ResponseEntity<?> deposit(@RequestHeader(name="Authorization")String token,@RequestBody OneWayTransactionDTO transactionDTO);

	@PostMapping("transaction/transfer")
	public ResponseEntity<?> transfer(@RequestHeader(name = "Authorization") String token,@RequestBody TransferDTO transferDTO);
	

}