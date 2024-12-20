package com.banking.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.banking.clients.TransactionClient;
import com.banking.dto.RecurringDepositDTO;
import com.banking.dto.TransferDTO;
import com.banking.model.Account;
import com.banking.model.AtalPensionYojana;
import com.banking.model.FixedDeposit;
import com.banking.model.RecurringDeposit;
import com.banking.model.Status;
import com.banking.repository.AccountRepository;
import com.banking.repository.RecurringDepositRepository;
import com.banking.service.RecurringDepositService;

@Service
public class RecurringDepositServiceImpl implements RecurringDepositService {

	private double interestRate6Months = 4.75;
	private double interestRate9Months = 5.75;
	private double interestRate1Year = 6.0;
	private double interestRate3Years = 7.10;
	private double interestRate10Years = 6.8;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private RecurringDepositRepository recurringDepositRepository;

	@Autowired
	TransactionClient transactionClient;

	@Override
	public RecurringDeposit applyRecurringDeposit(RecurringDepositDTO recurringDepositDTO) {
		RecurringDeposit recurringDeposit = new RecurringDeposit();
		recurringDeposit.setRdNumber(generateUniqueRDNumber());
		Optional<Account> account = accountRepository.findByUserId(recurringDepositDTO.getUserId());
		recurringDeposit.setAccountNumber(account.get().getAccountId());
		recurringDeposit.setUserId(recurringDepositDTO.getUserId());
		recurringDeposit.setMonthlyDeposit(recurringDepositDTO.getMonthlyDeposit());
		recurringDeposit.setPeriod(recurringDepositDTO.getPeriod());
		recurringDeposit.setInterestRate(getInterestRateForPeriod(recurringDepositDTO.getPeriod()));
		recurringDeposit.setCreatedDate(new Date());
		recurringDeposit.setStatus(Status.PENDING);
		recurringDeposit.setLastPaymentDate(null);
		double maturityAmount = calculateMaturityAmount(recurringDepositDTO.getMonthlyDeposit(),
				recurringDepositDTO.getPeriod());
		recurringDeposit.setMaturityAmount(maturityAmount);

		Calendar dueDateCalendar = Calendar.getInstance();
		dueDateCalendar.setTime(recurringDeposit.getCreatedDate());
		dueDateCalendar.add(Calendar.MONTH, recurringDepositDTO.getPeriod());
		recurringDeposit.setDueDate(dueDateCalendar.getTime());

		System.out.println("Recurring Deposit Application Details:");
		System.out.println("RD Number: " + recurringDeposit.getRdNumber());
		System.out.println("Account Number: " + recurringDeposit.getAccountNumber());
		System.out.println("User ID: " + recurringDeposit.getUserId());
		System.out.println("Monthly Deposit: " + recurringDeposit.getMonthlyDeposit());
		System.out.println("Period: " + recurringDeposit.getPeriod());
		System.out.println("Interest Rate: " + recurringDeposit.getInterestRate());
		System.out.println("Created Date: " + recurringDeposit.getCreatedDate());
		System.out.println("Maturity Amount: " + recurringDeposit.getMaturityAmount());
		System.out.println("Due Date: " + recurringDeposit.getDueDate());

		return recurringDepositRepository.save(recurringDeposit);
	}

	private String generateUniqueRDNumber() {
		String randomUUID = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
		// Add a prefix or suffix to the generated RD number if needed
		String rdNumber = "RD" + randomUUID;
		return rdNumber;
	}

	public double calculateMaturityAmount(double monthlyDeposit, int period) {
		double maturityAmount = 0.0;
		int compoundFrequency = 11;
		double interestRate = getInterestRateForPeriod(period);// Convert interest rate to decimal

		double rate = interestRate / 100;
		double monthlyRate = rate / compoundFrequency;
		int totalMonths = period;

		for (int i = 0; i < totalMonths; i++) {
			maturityAmount += monthlyDeposit * Math.pow(1 + monthlyRate, (totalMonths - i - 1));
		}

		System.out.println("Monthly Deposit: " + monthlyDeposit);
		System.out.println("Period (in months): " + period);
		System.out.println("Interest Rate: " + interestRate);
		System.out.println("Maturity Amount: " + maturityAmount);

		return maturityAmount;

	}

	private double getInterestRateForPeriod(int period) {
		if (period <= 6)
			return interestRate6Months;
		else if (period <= 9)
			return interestRate9Months;
		else if (period <= 12)
			return interestRate1Year;
		else if (period <= 3 * 12)
			return interestRate3Years;
		else
			return interestRate10Years;
	}

	public RecurringDeposit getRecurringDepositById(Long recurringDepositId) {
		Optional<RecurringDeposit> recurringDeposit = recurringDepositRepository.findById(recurringDepositId);
		return recurringDeposit.orElse(null);
	}

	@Override
	public void approveRecurringDeposit(String token, Long recurringDepositId) {
		Optional<RecurringDeposit> optionalRecurringDeposit = recurringDepositRepository.findById(recurringDepositId);
		if (optionalRecurringDeposit.isPresent()) {
			RecurringDeposit recurringDeposit = optionalRecurringDeposit.get();
			recurringDeposit.setStatus(Status.ACTIVE);
			String accountNumber = recurringDeposit.getAccountNumber();
			
			Optional<Account> toAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
			Account toBankAccount = toAccount.get();
			
			TransferDTO transferDetails = new TransferDTO(accountNumber, toBankAccount.getAccountId(),
					"Recurring Deposit", "DIGITAL", recurringDeposit.getMonthlyDeposit());
			transactionClient.transfer(token, transferDetails);
			recurringDeposit.setLastPaymentDate(new Date());
			recurringDepositRepository.save(recurringDeposit);
			
			System.out.println("Recurring Deposit Approval Details:");
			System.out.println("Recurring Deposit ID: " + recurringDeposit.getId());
			System.out.println("Account Number: " + accountNumber);
			System.out.println("Amount Transferred: " + recurringDeposit.getMonthlyDeposit());
		}
	}

	@Override
	public boolean breakRecurringDeposit(String token, Long recurringDepositId) {
		Optional<RecurringDeposit> optionalRecurringDeposit = recurringDepositRepository.findById(recurringDepositId);
		if (optionalRecurringDeposit.isPresent()) {
			RecurringDeposit recurringDeposit = optionalRecurringDeposit.get();
			Date currentDate = new Date();

			double maturityAmount = recurringDeposit.getMaturityAmount();
			String toAccountNumber = recurringDeposit.getAccountNumber();
			Optional<Account> fromAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
			if (fromAccount.isPresent()) {
				Account fromBankAccount = fromAccount.get();
				double totalAmount;
				System.out.println("current date: " + currentDate);
				System.out.println("Due Date: " + recurringDeposit.getDueDate());

				// Check if currentDate is before or equal to the due date

				// RD is broken before or on the due date
				long daysDiff = TimeUnit.DAYS.convert(
						currentDate.getTime() - recurringDeposit.getCreatedDate().getTime(), TimeUnit.MILLISECONDS);
				double maturityAmountTillDate = maturityAmount * (daysDiff / (recurringDeposit.getPeriod() * 30.0)); // Assuming
																														// a
																														// month
																														// has
																														// 30
																														// days
				totalAmount = maturityAmountTillDate;

				System.out.println("RD is broken before or on the due date");
				System.out.println("Days Difference: " + daysDiff);
				System.out.println("Maturity Amount Till Date: " + maturityAmountTillDate);

				TransferDTO transferDetails = new TransferDTO(fromBankAccount.getAccountId(), toAccountNumber,
						"Fixed Deposit", "DIGITAL", totalAmount);
				transactionClient.transfer(token, transferDetails);
				recurringDeposit.setStatus(Status.CLOSED);
				recurringDepositRepository.save(recurringDeposit);

				System.out.println("Recurring Deposit is successfully broken");
				System.out.println("Amount Transferred: " + totalAmount);
				return true;
			}
		}
		System.out.println("Unable to break the recurring deposit");
		return false;
	}

	@Override
	public List<RecurringDeposit> getByUserId(long userId) {
		return recurringDepositRepository.findByUserId(userId);

	}

	@Override
	public void payRecurringDeposit(String token, Long recurringDepositId) {
		Optional<RecurringDeposit> optionalRecurringDeposit = recurringDepositRepository.findById(recurringDepositId);
		if (optionalRecurringDeposit.isPresent()) {
			RecurringDeposit recurringDeposit = optionalRecurringDeposit.get();
//			recurringDeposit.setStatus(Status.ACTIVE);
			String accountNumber = recurringDeposit.getAccountNumber();
			Optional<Account> toAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
			Account toBankAccount = toAccount.get();
			TransferDTO transferDetails = new TransferDTO(accountNumber, toBankAccount.getAccountId(),
					"Recurring Deposit", "DIGITAL", recurringDeposit.getMonthlyDeposit());
			transactionClient.transfer(token, transferDetails);
			recurringDeposit.setLastPaymentDate(new Date());
			recurringDepositRepository.save(recurringDeposit);

			System.out.println("Recurring Deposit Approval Details:");
			System.out.println("Recurring Deposit ID: " + recurringDeposit.getId());
			System.out.println("Account Number: " + accountNumber);
			System.out.println("Amount Transferred: " + recurringDeposit.getMonthlyDeposit());
		}
	}

	
	@Override
	public List<RecurringDeposit> getAll() {
		return recurringDepositRepository.findAll();

	}

}
