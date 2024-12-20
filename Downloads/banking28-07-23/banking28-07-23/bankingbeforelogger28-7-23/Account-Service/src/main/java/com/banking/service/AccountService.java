package com.banking.service;
import java.util.List;

import javax.security.auth.login.AccountNotFoundException;

import org.springframework.stereotype.Service;

import com.banking.dto.AccountDTO;
import com.banking.dto.TransactionDTO;
import com.banking.exceptions.InvalidAccessException;
import com.banking.exceptions.UserDoesNotExistsException;
import com.banking.model.Account;
import com.banking.model.AccountCreationStatus;
import com.banking.model.TransactionStatus;

@Service
public interface AccountService {

	AccountCreationStatus createAccount(String token, AccountDTO accountDTO) throws InvalidAccessException;

	List<Account> getAllAccounts(String token) throws InvalidAccessException;

	Account getAccountById(String token, String id) throws UserDoesNotExistsException, InvalidAccessException;

	Account getAccountByUserId(String token, Long id) throws UserDoesNotExistsException, InvalidAccessException;

	TransactionStatus withdraw(String token, TransactionDTO transactionDTO)
			throws UserDoesNotExistsException, InvalidAccessException;

	TransactionStatus deposit(String token, TransactionDTO transactionDTO)
			throws UserDoesNotExistsException, InvalidAccessException;

	Account getAccountByAccountType(String token, String accountType)
			throws UserDoesNotExistsException, InvalidAccessException;

}
