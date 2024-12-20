package com.banking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableFeignClients
@EnableEurekaClient
@SpringBootApplication
public class LoanServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoanServicesApplication.class, args);
	}

}
