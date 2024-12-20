package com.banking.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.banking.dto.OneWayTransactionDTO;
import com.banking.dto.TransactionStatus;
import com.banking.dto.TransferDTO;
import com.banking.dto.TransferSuccessMessage;
import com.banking.exception.InsufficientBalanceException;
import com.banking.exception.InvalidAccessException;
import com.banking.exception.InvalidAccountIdException;
import com.banking.model.DeductGiftCardCharges;
import com.banking.model.DeductLockerChargesRequest;
import com.banking.model.TransactionHistory;

@Service
public interface TransactionService {

	TransactionStatus deposit(String token, OneWayTransactionDTO transactionDTO) throws InvalidAccessException;

	TransactionStatus withdraw(String token, OneWayTransactionDTO transactionDTO)
			throws InvalidAccessException, InsufficientBalanceException;

	List<TransactionHistory> transactionHistoryByNarration(String token, String narration)
			throws InvalidAccessException, InvalidAccountIdException;

	List<TransactionHistory> transactionHistory(String token, String accountId)
			throws InvalidAccessException, InvalidAccountIdException;

	TransferSuccessMessage deductGiftCardCharges(String token, DeductGiftCardCharges deductGiftCardCharges)
			throws InvalidAccessException, InsufficientBalanceException;

	TransferSuccessMessage deductLockerCharges(String token, DeductLockerChargesRequest deductLockerChargesRequest)
			throws InvalidAccessException, InsufficientBalanceException;

	TransferSuccessMessage transfer(String token, TransferDTO transferDTO)
			throws InvalidAccessException, InsufficientBalanceException;

	List<TransactionHistory> getAllTransactionHistory(String token)
			throws InvalidAccessException, InvalidAccountIdException;
	
}