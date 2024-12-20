package com.banking.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.security.auth.login.AccountNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.banking.clients.UserClient;
import com.banking.dto.AccountDTO;
import com.banking.dto.AtalPensionYojanaDTO;
import com.banking.dto.FixedDepositDTO;
import com.banking.dto.KanyaSumangalaDTO;
import com.banking.dto.RecurringDepositDTO;
import com.banking.dto.TransactionDTO;
import com.banking.exceptions.InvalidAccessException;
import com.banking.exceptions.UserDoesNotExistsException;
import com.banking.model.Account;
import com.banking.model.AccountCreationStatus;
import com.banking.model.FixedDeposit;
import com.banking.model.Insurance;
import com.banking.model.KanyaSumangala;
import com.banking.model.RecurringDeposit;
import com.banking.model.TransactionStatus;
import com.banking.service.AccountService;
import com.banking.service.AtalPensionYojanaService;
import com.banking.service.FixedDepositService;
import com.banking.service.InsuranceService;
import com.banking.service.KanyaSumangalaService;
import com.banking.service.RecurringDepositService;
import com.banking.service.StatementService;
import com.banking.service.impl.FixedDepositServiceImpl;
import com.banking.service.impl.RecurringDepositServiceImpl;

import feign.FeignException.FeignClientException;

@RestController
@RequestMapping("/account")
public class AccountController {

	@Autowired
	AccountService accountService;

	@Autowired
	KanyaSumangalaService kanyaSumangalaService;
	@Autowired
	AtalPensionYojanaService atalPensionYojanaService;
	@Autowired
	InsuranceService insuranceService;
	@Autowired
	StatementService statementService;

	@Autowired
	UserClient userClient;

	@Autowired
	private FixedDepositService fixedDepositService;

	@Autowired
	private RecurringDepositService recurringDepositService;

	@PostMapping("/create-account")
	public ResponseEntity<?> createAccount(@RequestHeader(name = "Authorization") String token,
			@RequestBody AccountDTO accountDTO) throws InvalidAccessException {
		try {
			AccountCreationStatus creationStatus = accountService.createAccount(token, accountDTO);
			if (creationStatus.getMessage().equalsIgnoreCase("INVALID_REQUEST")) {
				return new ResponseEntity<>(creationStatus, HttpStatus.BAD_REQUEST);
			}

			return new ResponseEntity<>(creationStatus, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}

	}

	@GetMapping("/get-accounts-id/{accountId}")
	public ResponseEntity<?> getAccounts(@RequestHeader(name = "Authorization") String token,
			@PathVariable String accountId) throws UserDoesNotExistsException, InvalidAccessException {

		try {
			return new ResponseEntity<>(accountService.getAccountById(token, accountId), HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (UserDoesNotExistsException e) {
			return new ResponseEntity<>("ACCOUNT_DOES_NOT_EXISTS", HttpStatus.BAD_REQUEST);
		}

	}

	@GetMapping("/get-accounts/{accountType}")
	public ResponseEntity<?> getAccountBytype(@RequestHeader(name = "Authorization") String token,
			@PathVariable String accountType) throws UserDoesNotExistsException, InvalidAccessException {
		try {
			return new ResponseEntity<>(accountService.getAccountByAccountType(token, accountType), HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (UserDoesNotExistsException e) {
			return new ResponseEntity<>("ACCOUNT_DOES_NOT_EXISTS", HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/get/all/accounts")
	public ResponseEntity<?> getAccounts(@RequestHeader(name = "Authorization") String token)
			throws InvalidAccessException {
		try {
			return new ResponseEntity<>(accountService.getAllAccounts(token), HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@GetMapping("/get-customer-accounts/{userId}")
	public ResponseEntity<?> getCustomerAccounts(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long userId) throws UserDoesNotExistsException, InvalidAccessException {
		try {
			return new ResponseEntity<>(accountService.getAccountByUserId(token, userId), HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		} catch (UserDoesNotExistsException e) {
			return new ResponseEntity<>("ACCOUNT_DOES_NOT_EXISTS", HttpStatus.BAD_REQUEST);
		}
	}

//	@GetMapping("/get-my-account")
//	public ResponseEntity<?> getMyAccount(@RequestHeader(name = "Authorization")String token){
//		try {
//			Account account = accountService.getMyAccount(token);
//			return new ResponseEntity<>(account,HttpStatus.OK);
//		} catch (InvalidAccessException e) {
//			return new ResponseEntity<>("UNAUTHORIZED_ACCESS",HttpStatus.UNAUTHORIZED);
//		} catch(FeignClientException e) {
//			String[] message = e.getMessage().split(" ");
//			int errCode = Integer.parseInt(message[0].split("")[1]+message[0].split("")[2]+message[0].split("")[3]);
//			return new ResponseEntity<>(message[5],HttpStatus.valueOf(errCode));
//		}
//	}

	@GetMapping("/getAccountStatement/{accountId}/{fromDate}/{toDate}")
	public ResponseEntity<?> getAccountStatement(@RequestHeader(name = "Authorization") String token,
			@PathVariable String fromDate, @PathVariable String toDate, @PathVariable String accountId) {
		try {
			return new ResponseEntity<>(statementService.getAllStatements(token, fromDate, toDate, accountId),
					HttpStatus.OK);
		} catch (ParseException e) {
			return new ResponseEntity<>("DATE_MUST_BE_OF_PATTERN_YYYY-MM-DD", HttpStatus.BAD_REQUEST);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@GetMapping("/getAccountStatement/{accountId}")
	public ResponseEntity<?> getAccountStatement(@RequestHeader(name = "Authorization") String token,
			@PathVariable String accountId) {

		try {

			return new ResponseEntity<>(statementService.getAllStatementsOfAccount(token, accountId), HttpStatus.OK);

		} catch (ParseException e) {
			return new ResponseEntity<>("OOPS_SOMETHING_WENT_WRONG", HttpStatus.METHOD_NOT_ALLOWED);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/deposit")
	public ResponseEntity<?> deposit(@RequestHeader(name = "Authorization") String token,
			@RequestBody TransactionDTO transactionDTO) throws UserDoesNotExistsException {
		try {

			TransactionStatus transactionStatus = accountService.deposit(token, transactionDTO);
			return new ResponseEntity<>(transactionStatus, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/withdraw")
	public ResponseEntity<?> withdraw(@RequestHeader(name = "Authorization") String token,
			@RequestBody TransactionDTO transactionDTO) throws UserDoesNotExistsException {
		try {
			TransactionStatus transactionStatus = accountService.withdraw(token, transactionDTO);
			return new ResponseEntity<>(transactionStatus, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}

	}

	@PostMapping("/fixed")
	public ResponseEntity<FixedDeposit> applyFixedDeposit(@RequestBody FixedDepositDTO fixedDepositDTO) {
		FixedDeposit fixedDeposit = fixedDepositService.applyFixedDeposit(fixedDepositDTO);
		return ResponseEntity.ok(fixedDeposit);
	}

	@PostMapping("/recurring")
	public ResponseEntity<RecurringDeposit> applyRecurringDeposit(
			@RequestBody RecurringDepositDTO recurringDepositDTO) {
		RecurringDeposit recurringDeposit = recurringDepositService.applyRecurringDeposit(recurringDepositDTO);
		return ResponseEntity.ok(recurringDeposit);
	}

	@PostMapping("/fixed/{fixedDepositId}/break")
	public ResponseEntity<String> breakFixedDeposit(@PathVariable Long fixedDepositId,
			@RequestHeader("Authorization") String token) {
		boolean success = fixedDepositService.breakFixedDeposit(token, fixedDepositId);
		if (success) {
			return ResponseEntity.ok("Fixed Deposit successfully broken.");
		} else {
			return ResponseEntity.badRequest().body("Unable to break Fixed Deposit.");
		}
	}

	@PostMapping("/recurring/{recurringDepositId}/break")
	public ResponseEntity<String> breakRecurringDeposit(@PathVariable Long recurringDepositId,
			@RequestHeader("Authorization") String token) {
		boolean success = recurringDepositService.breakRecurringDeposit(token, recurringDepositId);
		if (success) {
			return ResponseEntity.ok("Recurring Deposit successfully broken.");
		} else {
			return ResponseEntity.badRequest().body("Unable to break Recurring Deposit.");
		}
	}

	@GetMapping("/fixed/userId/{userId}")
	public ResponseEntity<?> getFixedByUserId(@PathVariable Long userId) {
		return new ResponseEntity<>(fixedDepositService.getByUserId(userId), HttpStatus.OK);

	}

	@GetMapping("/recurring/userId/{userId}")
	public ResponseEntity<?> getRecurringByUserId(@PathVariable Long userId) {
		return new ResponseEntity<>(recurringDepositService.getByUserId(userId), HttpStatus.OK);

	}

	@PostMapping("/fixed/{fixedDepositId}/approve")
	public ResponseEntity<String> approveFixedDeposit(@PathVariable Long fixedDepositId,
			@RequestHeader("Authorization") String token) {
		fixedDepositService.approveFixedDeposit(token, fixedDepositId);
		return ResponseEntity.ok("Fixed Deposit successfully approved.");
	}

	@PostMapping("/recurring/{recurringDepositId}/approve")
	public ResponseEntity<String> approveRecurringDeposit(@PathVariable Long recurringDepositId,
			@RequestHeader("Authorization") String token) {
		recurringDepositService.approveRecurringDeposit(token, recurringDepositId);
		return ResponseEntity.ok("Recurring Deposit successfully approved.");
	}

	@PostMapping("/recurring/{recurringDepositId}/pay")
	public ResponseEntity<String> payRecurringDeposit(@PathVariable Long recurringDepositId,
			@RequestHeader("Authorization") String token) {
		recurringDepositService.payRecurringDeposit(token, recurringDepositId);
		return ResponseEntity.ok("Recurring Deposit successfully paid.");
	}

	@GetMapping("/fixed/get/all")
	public ResponseEntity<?> getAllFixed(){

		return new ResponseEntity<>(fixedDepositService.getAll(), HttpStatus.OK);

	}

	@GetMapping("/recurring/get/all")
	public ResponseEntity<?> getAllRecurring() {

		return new ResponseEntity<>(recurringDepositService.getAll(), HttpStatus.OK);

	}

	@PostMapping("/kanyasumangala/apply")
	public ResponseEntity<KanyaSumangala> applyKanyaSumangala(@RequestBody KanyaSumangalaDTO kanyaSumangalaDTO) {
		KanyaSumangala kanyaSumangala = kanyaSumangalaService.applyKanyaSumangala(kanyaSumangalaDTO);
		return new ResponseEntity<>(kanyaSumangala, HttpStatus.CREATED);
	}

	@PostMapping("/kanyasumangala/approve/{id}")
	public ResponseEntity<KanyaSumangala> approveKanyaSumangala(@PathVariable("id") Long id) {
		KanyaSumangala kanyaSumangala = kanyaSumangalaService.approveKanyaSumangala(id);
		if (kanyaSumangala != null) {
			return new ResponseEntity<>(kanyaSumangala, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/kanyasumangala/reject/{id}")
	public ResponseEntity<KanyaSumangala> rejectKanyaSumangala(@PathVariable("id") Long id) {
		KanyaSumangala kanyaSumangala = kanyaSumangalaService.rejectKanyaSumangala(id);
		if (kanyaSumangala != null) {
			return new ResponseEntity<>(kanyaSumangala, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/kanyasumangala/userId/{userId}")
	public ResponseEntity<?> getKanyaSumangalaByUserId(@PathVariable Long userId) {
		return new ResponseEntity<>(kanyaSumangalaService.getByUserId(userId), HttpStatus.OK);

	}

	@GetMapping("/kanyasumangala/get/all")
	public ResponseEntity<?> getAllkanyasumangala() {

		return new ResponseEntity<>(kanyaSumangalaService.getAll(), HttpStatus.OK);

	}

	@PostMapping("/apy/create")
	public ResponseEntity<AtalPensionYojanaDTO> createAtalPensionYojana(
			@RequestBody AtalPensionYojanaDTO atalPensionYojanaDTO) {
		AtalPensionYojanaDTO createdAtalPensionYojana = atalPensionYojanaService
				.createAtalPensionYojana(atalPensionYojanaDTO);
		return new ResponseEntity<>(createdAtalPensionYojana, HttpStatus.CREATED);
	}

	@PostMapping("/apy/approve/{id}")
	public ResponseEntity<AtalPensionYojanaDTO> approveAtalPensionYojana(@PathVariable Long id) {
		AtalPensionYojanaDTO approvedAtalPensionYojana = atalPensionYojanaService.approveAtalPensionYojana(id);
		return ResponseEntity.ok(approvedAtalPensionYojana);
	}

	@PostMapping("/apy/reject/{id}")
	public ResponseEntity<AtalPensionYojanaDTO> rejectAtalPensionYojana(@PathVariable Long id) {
		AtalPensionYojanaDTO rejectedAtalPensionYojana = atalPensionYojanaService.rejectAtalPensionYojana(id);
		return ResponseEntity.ok(rejectedAtalPensionYojana);
	}

	@GetMapping("/apy/userId/{userId}")
	public ResponseEntity<?> getApyByUserId(@PathVariable Long userId) {
		return new ResponseEntity<>(atalPensionYojanaService.getByUserId(userId), HttpStatus.OK);

	}

	@GetMapping("/apy/get/all")
	public ResponseEntity<?> getAllapy() {

		return new ResponseEntity<>(atalPensionYojanaService.getAll(), HttpStatus.OK);

	}

	@PostMapping("/insurance")
	public ResponseEntity<Insurance> createInsurance(@RequestBody Insurance insurance) {
		Insurance createdInsurance = insuranceService.createInsurance(insurance);
		return new ResponseEntity<>(createdInsurance, HttpStatus.CREATED);
	}

	@GetMapping("/insurance/{id}")
	public ResponseEntity<Insurance> getInsuranceById(@PathVariable Long id) {
		Insurance insurance = insuranceService.getInsuranceById(id);
		return new ResponseEntity<>(insurance, HttpStatus.OK);
	}

	@GetMapping("/insurance/get/all")
	public ResponseEntity<List<Insurance>> getAllInsurances() {
		List<Insurance> insurances = insuranceService.getAllInsurances();
		return new ResponseEntity<>(insurances, HttpStatus.OK);
	}

	@PutMapping("/insurance/{id}")
	public ResponseEntity<Insurance> updateInsurance(@PathVariable Long id, @RequestBody Insurance updatedInsurance) {
		Insurance insurance = insuranceService.updateInsurance(id, updatedInsurance);
		return new ResponseEntity<>(insurance, HttpStatus.OK);
	}

	@DeleteMapping("/insurance/{id}")
	public ResponseEntity<Void> deleteInsurance(@PathVariable Long id) {
		insuranceService.deleteInsurance(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/insurance/{id}/approve")
	public ResponseEntity<Insurance> approveInsurance(@RequestHeader("Authorization") String token,
			@PathVariable Long id) {
		Insurance insurance = insuranceService.approveInsurance(token, id);
		return new ResponseEntity<>(insurance, HttpStatus.OK);
	}

	@PostMapping("/insurance/{id}/reject")
	public ResponseEntity<Insurance> rejectInsurance(@PathVariable Long id) {
		Insurance insurance = insuranceService.rejectInsurance(id);
		return new ResponseEntity<>(insurance, HttpStatus.OK);
	}

	@PostMapping("/insurance/{id}/claim")
	public ResponseEntity<Void> claimInsurance(@RequestHeader("Authorization") String token, @PathVariable Long id
			) {
		insuranceService.claimInsurance(token, id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/insurance/{id}/pay")
	public ResponseEntity<String> payDueAmount(@RequestHeader("Authorization") String token, @PathVariable Long id,
			@RequestParam double amount) {
		insuranceService.payDueAmount(token, id, amount);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/insurance/userId/{userId}")
	public ResponseEntity<?> getInsuranceByUserId(@PathVariable Long userId) {
		return new ResponseEntity<>(insuranceService.getByUserId(userId), HttpStatus.OK);

	}

}