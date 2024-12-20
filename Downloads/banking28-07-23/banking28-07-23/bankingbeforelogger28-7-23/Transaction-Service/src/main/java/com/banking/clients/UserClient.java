package com.banking.clients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.banking.dto.UserDTO;
import com.banking.dto.ValidatingDTO;

@FeignClient(name="LOGIN-FUNCTIONALITY")
public interface UserClient {
	
	@GetMapping("/employee/{Id}")
	UserDTO getUser(@PathVariable("Id") Long userID);

	
	@GetMapping("/employee/mark-account-created/{userId}")
	public boolean markAccountAsCreated(@PathVariable("userId") Long userId);


	@GetMapping("employee/validate")
	public ValidatingDTO validatingToken(@RequestHeader(name = "Authorization") String token);

}

//	@RequestMapping(value="/employee/mark-account-created/{customerId}",method = {RequestMethod.GET})
//	public boolean markAccountAsCreated(@PathVariable Long userId);


