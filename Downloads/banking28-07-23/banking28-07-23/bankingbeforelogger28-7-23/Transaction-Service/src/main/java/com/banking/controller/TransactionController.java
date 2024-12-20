package com.banking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
import com.banking.service.TransactionService;

import feign.FeignException.FeignClientException;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
	
	@Autowired
	TransactionService service;
	
	@PostMapping("/deposit")
	public ResponseEntity<?> deposit(@RequestHeader(name="Authorization")String token, @RequestBody OneWayTransactionDTO transactionDTO) {
		try {
			TransactionStatus deposit = service.deposit(token, transactionDTO);
			return new ResponseEntity<>(deposit, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}
	
	@PostMapping("/withdraw")
	public ResponseEntity<?> withdraw(@RequestHeader(name="Authorization")String token, @RequestBody OneWayTransactionDTO transactionDTO) {
		try {
			TransactionStatus withdraw = service.withdraw(token, transactionDTO);
			return new ResponseEntity<>(withdraw, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InsufficientBalanceException e) {
			return new ResponseEntity<>("INSUFFICIENT_BALANCE", HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/transfer")
	public ResponseEntity<?> transfer(@RequestHeader(name="Authorization")String token, @RequestBody TransferDTO transferDTO) {
		try {
			TransferSuccessMessage transfer = service.transfer(token, transferDTO);
			return new ResponseEntity<>(transfer, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InsufficientBalanceException e) {
			return new ResponseEntity<>("INSUFFICIENT_BALANCE", HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/get-transactions/{accountId}")
	public ResponseEntity<?> getTransactions(@RequestHeader(name="Authorization")String token, @PathVariable String accountId) {
		try {
			List<TransactionHistory> transactionHistory = service.transactionHistory(token, accountId);
			return new ResponseEntity<>(transactionHistory, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InvalidAccountIdException e) {
			return new ResponseEntity<>("INVALID_ACCOUNT_ID", HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/get/all/transactions")
	public ResponseEntity<?> getAllTransactions(@RequestHeader(name="Authorization")String token) {
		try {
			List<TransactionHistory> transactionHistory = service.getAllTransactionHistory(token);
			return new ResponseEntity<>(transactionHistory, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InvalidAccountIdException e) {
			return new ResponseEntity<>("INVALID_ACCOUNT_ID", HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/get-transactions-narration/{narration}")
	public ResponseEntity<?> getTransactionsByNarration(@RequestHeader(name="Authorization")String token, @PathVariable String narration) {
		try {
			List<TransactionHistory> transactionHistory = service.transactionHistoryByNarration(token, narration);
			return new ResponseEntity<>(transactionHistory, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InvalidAccountIdException e) {
			return new ResponseEntity<>("NOT FOUND", HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/locker-charge")
	public ResponseEntity<?> lockerCharge(@RequestHeader(name="Authorization")String token,@RequestBody DeductLockerChargesRequest deductLockerCharges) {
		try {
			TransferSuccessMessage deductLockerCharge = service.deductLockerCharges(token,deductLockerCharges);
			return new ResponseEntity<>(deductLockerCharge, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InsufficientBalanceException e) {
			return new ResponseEntity<>("INSUFFICIENT_BALANCE", HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/gift-charge")
	public ResponseEntity<?> giftCharge(@RequestHeader(name="Authorization")String token,@RequestBody DeductGiftCardCharges deductGiftCardCharges) {
		try {
			TransferSuccessMessage deductGiftCardCharge = service.deductGiftCardCharges(token,deductGiftCardCharges);
			return new ResponseEntity<>(deductGiftCardCharge, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (InsufficientBalanceException e) {
			return new ResponseEntity<>("INSUFFICIENT_BALANCE", HttpStatus.BAD_REQUEST);
		}
	}

}
