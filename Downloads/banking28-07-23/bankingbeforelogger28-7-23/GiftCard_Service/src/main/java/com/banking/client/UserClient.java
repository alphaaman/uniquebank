package com.banking.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.banking.model.ValidatingDTO;
import com.banking.model.User;

@FeignClient(name="LOGIN-FUNCTIONALITY")
public interface UserClient {
	
	@GetMapping("/employee/{Id}")
	User getUser(@PathVariable("Id") Long userID);
	
	@GetMapping("employee/validate")
	public ValidatingDTO validatingToken(@RequestHeader(name = "Authorization") String token);


}