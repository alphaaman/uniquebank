package com.banking.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;


import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//import com.banking.clients.AuthClient;
import com.banking.clients.UserClient;
import com.banking.clients.MailClient;
import com.banking.clients.TransactionClient;
import com.banking.dto.AccountDTO;
import com.banking.dto.EmailRequest;
import com.banking.dto.UserDTO;
import com.banking.dto.ValidatingDTO;
import com.banking.dto.OneWayTransactionDTO;
import com.banking.dto.StatementDTO;
import com.banking.dto.TransactionDTO;
import com.banking.exceptions.InvalidAccessException;
import com.banking.exceptions.UserDoesNotExistsException;
import com.banking.model.Account;
import com.banking.model.AccountCreationStatus;
import com.banking.model.TransactionStatus;
import com.banking.repository.AccountRepository;
import com.banking.service.AccountService;
import com.banking.service.StatementService;

@Service
public class AccountServiceImpl implements AccountService {
	
	@Autowired
	AccountRepository accountRepository;

//	@Autowired
//	AuthClient authClient;

	@Autowired
	MailClient mailClient;
	
	@Autowired
	StatementService statementService;
	
	@Autowired
	TransactionClient transactionClient;

	@Autowired
	UserClient userClient;

	@Override
	public AccountCreationStatus createAccount(String token, AccountDTO accountDTO) throws InvalidAccessException {
	    UserDTO user = userClient.getUser(accountDTO.getUserId());
	    String id = "ACC" + accountRepository.count();

	    ValidatingDTO tokenResponse = userClient.validatingToken(token);
	    if (tokenResponse.isValidStatus() && tokenResponse.getUserRole().contains("ROLE_EMPLOYEE")) {
	        if (accountDTO.getAccountType().equalsIgnoreCase("SAVINGS") && accountDTO.getDeposit() >= 400) {
	            accountRepository.save(new Account(id, accountDTO.getAccountType(), user.getId(), 0));
	            userClient.markAccountAsCreated(accountDTO.getUserId());
	            transactionClient.deposit(token, new OneWayTransactionDTO(id, "NEW_ACCOUNT_OPEN", "CASH", accountDTO.getDeposit()));
	            return new AccountCreationStatus(accountDTO.getAccountType() + "_ACCOUNT_CREATED", id);
	        } else if (accountDTO.getAccountType().equalsIgnoreCase("CURRENT") && accountDTO.getDeposit() >= 1000) {
	            accountRepository.save(new Account(id, accountDTO.getAccountType(), user.getId(), 0));
	            userClient.markAccountAsCreated(accountDTO.getUserId());
	            transactionClient.deposit(token, new OneWayTransactionDTO(id, "NEW_ACCOUNT_OPEN", "CASH", accountDTO.getDeposit()));
	            return new AccountCreationStatus(accountDTO.getAccountType() + "_ACCOUNT_CREATED", id);
	        } else if (accountDTO.getAccountType().equalsIgnoreCase("ZERO BALANCE")) {
	            accountRepository.save(new Account(id, accountDTO.getAccountType(), user.getId(), 0));
	            userClient.markAccountAsCreated(accountDTO.getUserId());
	            if (accountDTO.getDeposit() > 0) {
	                transactionClient.deposit(token, new OneWayTransactionDTO(id, "NEW_ACCOUNT_OPEN", "CASH", accountDTO.getDeposit()));
	            }
	            return new AccountCreationStatus(accountDTO.getAccountType() + "_ACCOUNT_CREATED", id);
	        } else if (accountDTO.getAccountType().equalsIgnoreCase("BANK_ACCOUNT")) {
	            accountRepository.save(new Account(id, accountDTO.getAccountType(), user.getId(), 0));
	            userClient.markAccountAsCreated(accountDTO.getUserId());
	            if (accountDTO.getDeposit() > 0) {
	                transactionClient.deposit(token, new OneWayTransactionDTO(id, "BANK_ACCOUNT_OPEN", "CASH", accountDTO.getDeposit()));
	            }
	            return new AccountCreationStatus(accountDTO.getAccountType() + "BANK_ACCOUNT_CREATED", id);
	        } else {
	            throw new InvalidAccessException("INVALID_REQUEST");
	        }
	    } else {
	        throw new InvalidAccessException("UNAUTHORIZED_ACCESS");
	    }
	}


	@Override
	public List<Account> getAllAccounts(String token) throws InvalidAccessException {
	    ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
	    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_EMPLOYEE")) {
	        return accountRepository.findAll();
	    }
	    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
	}


	@Override
	public Account getAccountById(String token,String id) throws UserDoesNotExistsException,InvalidAccessException {
		 ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
		Optional<Account> account = accountRepository.findById(id);
	    if (account.isPresent()) {
	        return account.get();
	    }
	    throw new UserDoesNotExistsException();
		    }
		    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
	}


	@Override
	public Account getAccountByUserId(String token,Long id) throws UserDoesNotExistsException ,InvalidAccessException{
		 ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
	    Optional<Account> account = accountRepository.findByUserId(id);
	    if (account.isPresent()) {
	        return account.get();
	    }
	    throw new UserDoesNotExistsException();
		    }
		    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
	}


	@Override
	public TransactionStatus withdraw(String token,TransactionDTO transactionDTO) throws UserDoesNotExistsException,InvalidAccessException {
		 ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
	    Optional<Account> account = accountRepository.findById(transactionDTO.getAccountId());
	    LocalDateTime currentTime = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String formattedTime = currentTime.format(formatter);
	    if (account.isPresent()) {
	        Account customerAccount = account.get();
	        double balance = customerAccount.getBalance() - transactionDTO.getAmount();
	        customerAccount.setBalance(balance);
	        accountRepository.save(customerAccount);
	        statementService.writeStatement(
	                token, new StatementDTO(new Date(), transactionDTO.getAccountId(), transactionDTO.getNarration(),
	                        transactionDTO.getRefNo(), transactionDTO.getAmount(), 0, balance));
	        Long userId = customerAccount.getUserId();
         	UserDTO user = userClient.getUser(userId);
         	String supportContact="+91 9876543210";
	        String message = "Dear " + user.getName() + "," + "\n\n"
	                + "We would like to inform you that an amount of " + transactionDTO.getAmount() + " has been Debited from your account. " + "\n"
	                + "Account ID: " + transactionDTO.getAccountId() + "\n"
	                + "Transaction ID: " + transactionDTO.getRefNo() + "\n"
	                + "Current balance: " + balance + "\n"
	                + "Date: " + formattedTime + "\n"
	                + "Narration: " + transactionDTO.getNarration() + "\n\n"
	                + "For any concerns regarding this transaction, please contact our customer support at " + supportContact + ".\n"
	                + "Thank you for choosing UNIQUE BANK. We are here to assist you.\n\n"
	                + "Regards,\n"
	                + "UNIQUE BANK";
	        
	    	EmailRequest emailRequest= new EmailRequest(user.getEmail(),"Debit Notification From UNIQUE BANK",message);
	    	mailClient.sendEmail(emailRequest);
	        return new TransactionStatus("WITHDRAW_SUCCESSFULL_FROM_" + transactionDTO.getAccountId(), balance);
	    }
	    throw new UserDoesNotExistsException();
		    }
		    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
	}


//	@Override
//	public TransactionStatus deposit(String token,TransactionDTO transactionDTO) throws UserDoesNotExistsException,InvalidAccessException{
//		 ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
//		 System.out.println("validation"+validatingTokenResponse);
//		    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_EMPLOYEE")) {
//		    	System.out.println(" validatingTokenResponse.getUserRole()0"+ validatingTokenResponse.getUserRole());
//	    Optional<Account> account = accountRepository.findById(transactionDTO.getAccountId());
//	    System.out.println("");
//	    LocalDateTime currentTime = LocalDateTime.now();
//		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//		String formattedTime = currentTime.format(formatter);
//	    if (account.isPresent()) {
//	        Account customerAccount = account.get();
//	        double balance = customerAccount.getBalance() + transactionDTO.getAmount();
//	        customerAccount.setBalance(balance);
//	        accountRepository.save(customerAccount);
//	        statementService.writeStatement(
//	               token, new StatementDTO(new Date(), transactionDTO.getAccountId(), transactionDTO.getNarration(),
//	                        transactionDTO.getRefNo(), 0, transactionDTO.getAmount(), balance));
//	        Long userId = customerAccount.getUserId();
//         	UserDTO user = userClient.getUser(userId);
//         	String supportContact="+91 9935737136";
//	        String message = "Dear " + user.getName() + "," + "\n\n"
//	                + "We would like to inform you that an amount of " + transactionDTO.getAmount() + " has been credited from your account. " + "\n"
//	                + "Account ID: " + transactionDTO.getAccountId() + "\n"
//	                + "Transaction ID: " + transactionDTO.getRefNo() + "\n"
//	                + "Current balance: " + balance + "\n"
//	                + "Date: " + formattedTime + "\n"
//	                + "Narration: " + transactionDTO.getNarration() + "\n\n"
//	                + "For any concerns regarding this transaction, please contact our customer support at " + supportContact + ".\n"
//	                + "Thank you for choosing ABC BANK. We are here to assist you.\n\n"
//	                + "Regards,\n"
//	                + "ABC BANK";
//	        
//	    	EmailRequest emailRequest= new EmailRequest(user.getEmail(),"Credit Notification From ABC BANK",message);
//	    	mailClient.sendEmail(emailRequest);
//	        return new TransactionStatus("DEPOSIT_SUCCESSFULL_INTO_" + transactionDTO.getAccountId(), balance);
//	    }
//	    throw new UserDoesNotExistsException();
//		    }
//		    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
//	}
	
	@Override
	public TransactionStatus deposit(String token, TransactionDTO transactionDTO) throws UserDoesNotExistsException, InvalidAccessException {
	    ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
	    System.out.println("validation: " + validatingTokenResponse);
	    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
	        System.out.println("Validating user role: " + validatingTokenResponse.getUserRole());
	        Optional<Account> account = accountRepository.findById(transactionDTO.getAccountId());
	        System.out.println("Account: " + account);
	        LocalDateTime currentTime = LocalDateTime.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	        String formattedTime = currentTime.format(formatter);
	        if (account.isPresent()) {
	            Account customerAccount = account.get();
	            double balance = customerAccount.getBalance() + transactionDTO.getAmount();
	            customerAccount.setBalance(balance);
	            accountRepository.save(customerAccount);
	            System.out.println("customer acc"+customerAccount);
	            statementService.writeStatement(
	                    token, new StatementDTO(new Date(), transactionDTO.getAccountId(), transactionDTO.getNarration(),
	                            transactionDTO.getRefNo(), 0, transactionDTO.getAmount(), balance));
	            System.out.println("statement service ke aage");
	            Long userId = customerAccount.getUserId();
	            UserDTO user = userClient.getUser(userId);
	            String supportContact = "+91 9876543210";
	            String message = "Dear " + user.getName() + "," + "\n\n"
	                    + "We would like to inform you that an amount of " + transactionDTO.getAmount() + " has been credited in your account. " + "\n"
	                    + "Account ID: " + transactionDTO.getAccountId() + "\n"
	                    + "Transaction ID: " + transactionDTO.getRefNo() + "\n"
	                    + "Current balance: " + balance + "\n"
	                    + "Date: " + formattedTime + "\n"
	                    + "Narration: " + transactionDTO.getNarration() + "\n\n"
	                    + "For any concerns regarding this transaction, please contact our customer support at " + supportContact + ".\n"
	                    + "Thank you for choosing UNIQUE BANK. We are here to assist you.\n\n"
	                    + "Regards,\n"
	                    + "UNIQUE BANK";

	            EmailRequest emailRequest = new EmailRequest(user.getEmail(), "Credit Notification From UNIQUE BANK", message);
	            mailClient.sendEmail(emailRequest);
	            return new TransactionStatus("DEPOSIT_SUCCESSFULL_INTO_" + transactionDTO.getAccountId(), balance);
	        }
	        throw new UserDoesNotExistsException();
	    }
	    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
	}


	@Override
	public Account getAccountByAccountType(String token,String accountType) throws UserDoesNotExistsException ,InvalidAccessException{
		 ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		    if (validatingTokenResponse.isValidStatus() && validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
		Optional<Account> account = accountRepository.findByAccountType(accountType);
		if (account.isPresent()) {
			return account.get();
		}
		throw new UserDoesNotExistsException();
		    }
		    throw new InvalidAccessException("INSUFFICIENT_PERMISSIONS");
	}
		

}