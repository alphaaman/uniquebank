package com.banking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class LoginFunctionalityApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoginFunctionalityApplication.class, args);
	}

}
