package com.banking.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.banking.dto.FixedDepositDTO;
import com.banking.model.Account;
import com.banking.model.AtalPensionYojana;
import com.banking.model.FixedDeposit;
import com.banking.model.Status;
import com.banking.dto.TransferDTO;
import com.banking.repository.AccountRepository;
import com.banking.repository.FixedDepositRepository;
import com.banking.clients.TransactionClient;
import com.banking.dto.AccountDTO;
import com.banking.service.FixedDepositService;

@Service
public class FixedDepositServiceImpl implements FixedDepositService {

	private double interestRate7Days = 3.5;
	private double interestRate45Days = 4.75;
	private double interestRate6Months = 4.75;
	private double interestRate9Months = 5.75;
	private double interestRate1Year = 6.0;
	private double interestRate3Years = 7.10;
	private double interestRate10Years = 6.8;

	@Autowired
	AccountRepository accountRepository;
	@Autowired
	private FixedDepositRepository fixedDepositRepository;

	@Autowired
	TransactionClient transactionClient;

	@Override
	public FixedDeposit applyFixedDeposit(FixedDepositDTO fixedDepositDTO) {
		// Convert DTO to entity
		FixedDeposit fixedDeposit = new FixedDeposit();
		fixedDeposit.setFdNumber(generateUniqueFDNumber());
		Optional<Account> account = accountRepository.findByUserId(fixedDepositDTO.getUserId());
		fixedDeposit.setAccountNumber(account.get().getAccountId());
		fixedDeposit.setUserId(fixedDepositDTO.getUserId());
		fixedDeposit.setDeposit(fixedDepositDTO.getDeposit());
		fixedDeposit.setPeriod(fixedDepositDTO.getPeriod());
		fixedDeposit.setInterestRate(getInterestRateForPeriod(fixedDepositDTO.getPeriod()));
		fixedDeposit.setCreatedDate(new Date());
		fixedDeposit.setStatus(Status.PENDING);

		System.out.println("Fixed Deposit Application Details:");
		System.out.println("FD Number: " + fixedDeposit.getFdNumber());
		System.out.println("Account Number: " + fixedDeposit.getAccountNumber());
		System.out.println("User ID: " + fixedDeposit.getUserId());
		System.out.println("Deposit Amount: " + fixedDeposit.getDeposit());
		System.out.println("Period: " + fixedDeposit.getPeriod());
		System.out.println("Interest Rate: " + fixedDeposit.getInterestRate());
		System.out.println("Created Date: " + fixedDeposit.getCreatedDate());

		// Calculate maturity amount
		double maturityAmount = calculateMaturityAmount(fixedDepositDTO.getDeposit(), fixedDepositDTO.getPeriod());
		fixedDeposit.setMaturityAmount(maturityAmount);

		// Set due date
		Calendar dueDateCalendar = Calendar.getInstance();
		dueDateCalendar.setTime(fixedDeposit.getCreatedDate());
		dueDateCalendar.add(Calendar.DATE, fixedDepositDTO.getPeriod());
		fixedDeposit.setDueDate(dueDateCalendar.getTime());

		System.out.println("Maturity Amount: " + fixedDeposit.getMaturityAmount());
		System.out.println("Due Date: " + fixedDeposit.getDueDate());

		// Save the fixed deposit
		return fixedDepositRepository.save(fixedDeposit);
	}

	private String generateUniqueFDNumber() {
		String randomUUID = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
		// Add a prefix or suffix to the generated FD number if needed
		String fdNumber = "FD" + randomUUID;
		return fdNumber;
	}

	public double calculateMaturityAmount(double deposit, int period) {
		double interestRate = getInterestRateForPeriod(period);
		double maturityAmount = deposit + (deposit * interestRate * period) / (365 * 100);
		return maturityAmount;
	}

	private double getInterestRateForPeriod(int period) {
		if (period <= 45)
			return interestRate7Days;
		else if (period <= 6 * 30)
			return interestRate6Months;
		else if (period <= 9 * 30)
			return interestRate9Months;
		else if (period <= 12 * 30)
			return interestRate1Year;
		else if (period <= 3 * 365)
			return interestRate3Years;
		else
			return interestRate10Years;
	}

	public FixedDeposit getFixedDepositById(Long fixedDepositId) {
		Optional<FixedDeposit> fixedDeposit = fixedDepositRepository.findById(fixedDepositId);
		return fixedDeposit.orElse(null);
	}

	public double calculateBreakageAmount(double monthlyDeposit, int period, int remainingPeriod) {
		double interestRate = getInterestRateForPeriod(period);
		double maturityAmount = calculateMaturityAmount(monthlyDeposit, period);
		double breakageAmount = (interestRate / 100) * maturityAmount * remainingPeriod / period;
		return breakageAmount;
	}

	@Override
	public boolean breakFixedDeposit(String token, Long fixedDepositId) {
		Optional<FixedDeposit> optionalFixedDeposit = fixedDepositRepository.findById(fixedDepositId);
		if (optionalFixedDeposit.isPresent()) {
			FixedDeposit fixedDeposit = optionalFixedDeposit.get();
			Date currentDate = new Date();

			if (currentDate.before(fixedDeposit.getDueDate())) {
				// Calculate the remaining period from the due date to the current date
				long remainingDays = TimeUnit.DAYS.convert(fixedDeposit.getDueDate().getTime() - currentDate.getTime(),
						TimeUnit.MILLISECONDS);
				int remainingPeriod = Math.toIntExact(remainingDays);

				// Calculate the breakage amount
				double breakageAmount = calculateBreakageAmount(fixedDeposit.getDeposit(), fixedDeposit.getPeriod(),
						remainingPeriod);

				// Update the FD details
				fixedDeposit.setMaturityAmount(fixedDeposit.getDeposit() - breakageAmount);
				fixedDeposit.setPeriod(remainingPeriod);
				fixedDeposit.setDueDate(currentDate);
				String toAccountNumber = fixedDeposit.getAccountNumber();
				Optional<Account> fromAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
				if (fromAccount.isPresent()) {
					Account fromBankAccount = fromAccount.get();
					double totalAmount = fixedDeposit.getDeposit() - breakageAmount;

					TransferDTO transferDetails = new TransferDTO(fromBankAccount.getAccountId(), toAccountNumber,
							"Fixed Deposit", "DIGITAL", totalAmount);
					transactionClient.transfer(token, transferDetails);
					fixedDeposit.setStatus(Status.CLOSED);
					fixedDepositRepository.save(fixedDeposit);

					System.out.println("Fixed Deposit Breakage Details:");
					System.out.println("Fixed Deposit ID: " + fixedDeposit.getId());
					System.out.println("Remaining Period: " + fixedDeposit.getPeriod());
					System.out.println("Breakage Amount: " + breakageAmount);
					System.out.println("Total Amount Transferred: " + totalAmount);

					return true; // Successful breakage of FD
				} else {
					System.out.println("Error: From account not found.");
				}
			} else if (currentDate.after(fixedDeposit.getDueDate())) {
				double maturedAmount = fixedDeposit.getMaturityAmount();
				String toAccountNumber = fixedDeposit.getAccountNumber();
				Optional<Account> fromAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
				if (fromAccount.isPresent()) {
					Account fromBankAccount = fromAccount.get();
					TransferDTO transferDetails = new TransferDTO(fromBankAccount.getAccountId(), toAccountNumber,
							"Fixed Deposit", "DIGITAL", maturedAmount);
					transactionClient.transfer(token, transferDetails);
					fixedDeposit.setStatus(Status.CLOSED);
					fixedDepositRepository.save(fixedDeposit);

					System.out.println("Fixed Deposit Closure Details:");
					System.out.println("Fixed Deposit ID: " + fixedDeposit.getId());
					System.out.println("Matured Amount: " + maturedAmount);

					return true; // Successful closure of matured FD
				} else {
					System.out.println("Error: From account not found.");
				}
			}
		} else {
			System.out.println("Error: Fixed Deposit not found.");
		}

		return false; // FD not found or already matured
	}

	@Override
	public void approveFixedDeposit(String token, Long fixedDepositId) {
		Optional<FixedDeposit> optionalFixedDeposit = fixedDepositRepository.findById(fixedDepositId);
		if (optionalFixedDeposit.isPresent()) {
			FixedDeposit fixedDeposit = optionalFixedDeposit.get();
			String accountNumber = fixedDeposit.getAccountNumber();
			Optional<Account> toAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
			Account toBankAccount = toAccount.get();
			TransferDTO transferDetails = new TransferDTO(accountNumber, toBankAccount.getAccountId(), "Fixed Deposit",
					"DIGITAL", fixedDeposit.getDeposit());
			transactionClient.transfer(token, transferDetails);
			fixedDeposit.setStatus(Status.ACTIVE);
			fixedDepositRepository.save(fixedDeposit);

			System.out.println("Fixed Deposit Approval Details:");
			System.out.println("Fixed Deposit ID: " + fixedDeposit.getId());
			System.out.println("Account Number: " + accountNumber);
			System.out.println("Amount Transferred: " + fixedDeposit.getDeposit());
		}
	}

	@Override
	public List<FixedDeposit> getByUserId(long userId) {
		return fixedDepositRepository.findByUserId(userId);

	}

	@Override
	public List<FixedDeposit> getAll() {
		return fixedDepositRepository.findAll();

	}
}
