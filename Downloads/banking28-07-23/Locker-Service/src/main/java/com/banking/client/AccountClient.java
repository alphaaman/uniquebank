package com.banking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.banking.model.Account;


@FeignClient(name="ACCOUNT-SERVICE")
public interface AccountClient {
	
	@GetMapping("account/get-accounts/{accountType}")
	public Account getAccountBytype(@RequestHeader(name = "Authorization") String token,@PathVariable String accountType);

	@GetMapping("account/get-customer-accounts/{userId}")
	public Account getCustomerAccounts(@RequestHeader(name = "Authorization") String token,@PathVariable Long userId);

	@GetMapping("account/get-accounts-id/{accountId}")
	public Account getAccounts(@RequestHeader(name = "Authorization") String token,@PathVariable String accountId);
}