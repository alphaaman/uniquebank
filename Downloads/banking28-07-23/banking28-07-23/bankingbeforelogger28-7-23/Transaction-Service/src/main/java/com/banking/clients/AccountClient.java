package com.banking.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.banking.dto.Account;
import com.banking.dto.TransactionDTO;
import com.banking.dto.TransactionStatus;

@FeignClient(name="ACCOUNT-SERVICE")
public interface AccountClient {
	
	@PostMapping("account/deposit")
	public TransactionStatus deposit(@RequestHeader(name="Authorization")String token,@RequestBody TransactionDTO transactionDTO);
	
	@PostMapping("account/withdraw")
	public TransactionStatus withdraw(@RequestHeader(name="Authorization")String token,@RequestBody TransactionDTO transactionDTO);
	
	@GetMapping("account/get-accounts-id/{accountId}")
	public Account getAccounts(@RequestHeader(name="Authorization")String token,@PathVariable String accountId);

	@GetMapping("account/get-accounts/{accountType}")
	public Account getAccountBytype(@RequestHeader(name="Authorization")String token,@PathVariable String accountType);


}