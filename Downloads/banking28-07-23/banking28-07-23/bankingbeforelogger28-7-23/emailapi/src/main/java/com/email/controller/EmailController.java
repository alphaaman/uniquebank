package com.email.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.email.model.EmailRequest;
import com.email.service.EmailService;

@RestController
public class EmailController {
	@Autowired
	private EmailService emailService;
	
	@RequestMapping("/welcome")
	public String welcome()
	{
		return "hiii email api created";
	}
	
	@RequestMapping(value="/sendemail",method=RequestMethod.POST)
	public boolean sendEmail(@RequestBody EmailRequest request)
	{
	boolean result = this.emailService.sendEmail(request.getSubject(),request.getMessage(),request.getTo());
	
		return result;
	}
	
	

}
