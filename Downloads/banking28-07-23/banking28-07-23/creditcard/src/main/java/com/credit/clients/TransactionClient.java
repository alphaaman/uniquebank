package com.credit.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.credit.model.TransferDTO;
import com.credit.model.OneWayTransactionDTO;
import com.credit.model.TransactionHistory;

@FeignClient(name = "TRANSACTION-SERVICE")
public interface TransactionClient {

	@PostMapping("transaction/deposit")
	public ResponseEntity<?> deposit(@RequestHeader(name="Authorization")String token,@RequestBody OneWayTransactionDTO transactionDTO);
	
	@PostMapping("transaction/withdraw")
	public ResponseEntity<?> withdraw(@RequestHeader(name="Authorization")String token,@RequestBody OneWayTransactionDTO transactionDTO);
	@PostMapping("transaction/transfer")
	public ResponseEntity<?> transfer(@RequestHeader(name = "Authorization") String token,@RequestBody TransferDTO transferDTO);
	
	@GetMapping("transaction/get-transactions-narration/{narration}")
	public List<TransactionHistory> getTransactionsByNarration(@RequestHeader(name="Authorization")String token,@PathVariable String narration);
}