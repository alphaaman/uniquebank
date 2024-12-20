package com.credit.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.credit.model.EmailRequest;

@FeignClient(name="MAIL-SERVICE")
public interface MailClient {
	
	@RequestMapping(value="/sendemail",method=RequestMethod.POST)
	public boolean sendEmail(@RequestBody EmailRequest request);

}
