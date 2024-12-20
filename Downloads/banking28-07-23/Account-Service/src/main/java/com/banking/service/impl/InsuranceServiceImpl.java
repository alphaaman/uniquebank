package com.banking.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banking.clients.TransactionClient;
import com.banking.dto.InsuranceDTO;
import com.banking.dto.TransferDTO;
import com.banking.model.Account;
import com.banking.model.AtalPensionYojana;
import com.banking.model.Insurance;
import com.banking.repository.AccountRepository;
import com.banking.repository.InsuranceRepository;
import com.banking.service.InsuranceService;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class InsuranceServiceImpl implements InsuranceService {
	@Autowired
   InsuranceRepository insuranceRepository;
	@Autowired
    AccountRepository accountRepository;
	@Autowired
    TransactionClient transactionClient;
	@Override
	public Insurance createInsurance(Insurance insurance) {
	    System.out.println("Start createInsurance method");

	    LocalDate startDate = LocalDate.now();
	    System.out.println("Start Date: " + startDate);

	    LocalDate endDate = startDate.plusYears(insurance.getTenureInYears());
	    System.out.println("End Date: " + endDate);

	    long months = ChronoUnit.MONTHS.between(startDate, endDate);
	    System.out.println("Months: " + months);

	    double monthlyDueAmount = insurance.getAmount() / months;
	    System.out.println("Monthly Due Amount: " + monthlyDueAmount);

	    insurance.setMaturityAmount(insurance.getAmount() * 1.1);
//	    insurance.setClaimAmount(insurance.getAmount() * 1.1);// Add 10 percent to the maturity amount
	    System.out.println("Maturity Amount: " + insurance.getMaturityAmount());

	    insurance.setMaturityDate(java.sql.Date.valueOf(endDate));
	    System.out.println("Maturity Date: " + insurance.getMaturityDate());

	    Date currentDate = new Date();
	    insurance.setLastPaymentDate(null);
	    System.out.println("Last Payment Date: " + insurance.getLastPaymentDate());

	    insurance.setCreatedDate(currentDate);
	    System.out.println("Created Date: " + insurance.getCreatedDate());

	    insurance.setDueAmount(monthlyDueAmount);
	    insurance.setStatus("PENDING");
	    System.out.println("Due Amount: " + insurance.getDueAmount());

	    System.out.println("Before saving insurance: " + insurance);

	    Insurance savedInsurance = insuranceRepository.save(insurance);
	    System.out.println("After saving insurance: " + savedInsurance);

	    System.out.println("End createInsurance method");
	    return savedInsurance;
	}

	@Override
    public Insurance getInsuranceById(Long id) {
        return insuranceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Insurance not found with ID: " + id));
    }
	@Override
	public List<Insurance> getAllInsurances() {
	    List<Insurance> insurances = insuranceRepository.findAll();
	    LocalDate currentDate = LocalDate.now();

	    for (Insurance insurance : insurances) {
	        Date lastPaymentDate = insurance.getLastPaymentDate();

	        if (lastPaymentDate == null) {
	            insurance.setDueAmount(insurance.getDueAmount());
	        } else {
	            LocalDate localLastPaymentDate = lastPaymentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	            if (currentDate.getMonth() != localLastPaymentDate.getMonth()&& currentDate.getYear() == lastPaymentDate.getYear()) {
	                LocalDate startDate = LocalDate.now();
	                LocalDate endDate = startDate.plusYears(insurance.getTenureInYears());
	                long months = ChronoUnit.MONTHS.between(startDate, endDate);
	                double monthlyDueAmount = insurance.getAmount() / months;

	                insurance.setDueAmount(monthlyDueAmount);
	                insuranceRepository.save(insurance);
	            }
	        }
	    }

	    return insurances;
	}



	@Override
    public Insurance updateInsurance(Long id, Insurance updatedInsurance) {
        Insurance existingInsurance = getInsuranceById(id);
        // Update the existing insurance with the properties from the updatedInsurance object
        existingInsurance.setType(updatedInsurance.getType());
        existingInsurance.setUserId(updatedInsurance.getUserId());
        existingInsurance.setAmount(updatedInsurance.getAmount());
        existingInsurance.setDueAmount(updatedInsurance.getDueAmount());
        existingInsurance.setDueDate(updatedInsurance.getDueDate());
        existingInsurance.setClaimAmount(updatedInsurance.getClaimAmount());
        existingInsurance.setClaimReason(updatedInsurance.getClaimReason());
        existingInsurance.setClaimDate(updatedInsurance.getClaimDate());
        existingInsurance.setStatus(updatedInsurance.getStatus());
        existingInsurance.setMaturityAmount(updatedInsurance.getMaturityAmount());
        existingInsurance.setMaturityDate(updatedInsurance.getMaturityDate());
        existingInsurance.setCreatedDate(updatedInsurance.getCreatedDate());

        // Additional business logic, if needed

        return insuranceRepository.save(existingInsurance);
    }
	@Override
    public void deleteInsurance(Long id) {
        Insurance existingInsurance = getInsuranceById(id);
        insuranceRepository.delete(existingInsurance);
    }
	@Override
    public Insurance approveInsurance(String token,Long id) {
        Insurance insurance = getInsuranceById(id);
        
        Optional<Account> fromAccount = accountRepository.findByUserId(insurance.getUserId());
        Account fromBankAccount = fromAccount.get();
        Optional<Account> toAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
        Account toBankAccount = toAccount.get();
        TransferDTO transferDetails = new TransferDTO(fromBankAccount.getAccountId(), toBankAccount.getAccountId(), "PAID INSURANCE DUE AMOUNT", "DIGITAL", insurance.getDueAmount());
        transactionClient.transfer(token, transferDetails);
        insurance.setDueAmount(0);
        insurance.setLastPaymentDate(new Date());
        
        insurance.setStatus("ACTIVE");
        // Additional business logic for approval, if needed
        return insuranceRepository.save(insurance);
    }
	@Override
    public Insurance rejectInsurance(Long id) {
        Insurance insurance = getInsuranceById(id);
        insurance.setStatus("Rejected");
        // Additional business logic for rejection, if needed
        return insuranceRepository.save(insurance);
    }
	@Override
    public void claimInsurance(String token,Long id) {
        Insurance insurance = getInsuranceById(id);
       
//        insurance.setClaimReason(claimReason);
        insurance.setClaimDate(new Date());
        Optional<Account> toAccount = accountRepository.findByUserId(insurance.getUserId());
        Account toBankAccount = toAccount.get();
        Optional<Account> fromAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
        Account fromBankAccount = fromAccount.get();
        TransferDTO transferDetails = new TransferDTO(fromBankAccount.getAccountId(), toBankAccount.getAccountId(), "CLAIMED INSURANCE", "DIGITAL", insurance.getMaturityAmount());
        transactionClient.transfer(token, transferDetails);
        insurance.setClaimAmount(insurance.getMaturityAmount());
        insurance.setStatus("CLAIMED");
        // Additional business logic for claiming, if needed
        insuranceRepository.save(insurance);
    }
	@Override
	public String payDueAmount(String token, Long id, double amount) {
	    Insurance insurance = getInsuranceById(id);
	    
	    LocalDate currentDate = LocalDate.now();
	    LocalDate lastPaymentDate = insurance.getLastPaymentDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	    
	    if (currentDate.getMonth() == lastPaymentDate.getMonth() && currentDate.getYear() == lastPaymentDate.getYear()) {
	        System.out.println("No payment due for the current month.");
	        return "No payment due for the current month.";
	    } else if(insurance.getDueAmount() > 0) {
	        double newDueAmount = insurance.getDueAmount() - amount;
	        Optional<Account> fromAccount = accountRepository.findByUserId(insurance.getUserId());
	        Account fromBankAccount = fromAccount.get();
	        Optional<Account> toAccount = accountRepository.findByAccountType("BANK_ACCOUNT");
	        Account toBankAccount = toAccount.get();
	        TransferDTO transferDetails = new TransferDTO(fromBankAccount.getAccountId(), toBankAccount.getAccountId(), "PAID INSURANCE DUE AMOUNT", "DIGITAL", amount);
	        transactionClient.transfer(token, transferDetails);
	        insurance.setDueAmount(newDueAmount);
	        insurance.setLastPaymentDate(new Date());
	        insuranceRepository.save(insurance);
	        return "Due Amount Paid Succefully";
	    }
	    return "Something went wrong ";
	}
	@Override
	public List<Insurance> getByUserId(long userId) {
	    List<Insurance> insurances = insuranceRepository.findByUserId(userId);
	    LocalDate currentDate = LocalDate.now();

	    for (Insurance insurance : insurances) {
	        Date lastPaymentDate = insurance.getLastPaymentDate();

	        System.out.println("Insurance ID: " + insurance.getId());
	        System.out.println("Last Payment Date: " + lastPaymentDate);

	        if (lastPaymentDate == null) {
	            insurance.setDueAmount(insurance.getDueAmount());
	        } else {
	            LocalDate localLastPaymentDate = lastPaymentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	            System.out.println("Local Last Payment Date: " + localLastPaymentDate);

	            if (currentDate.getMonthValue() != localLastPaymentDate.getMonthValue() && currentDate.getYear() == localLastPaymentDate.getYear()) {
	                LocalDate startDate = LocalDate.now();
	                LocalDate endDate = startDate.plusYears(insurance.getTenureInYears());
	                long months = ChronoUnit.MONTHS.between(startDate, endDate);
	                double monthlyDueAmount = insurance.getAmount() / months;

	                System.out.println("Monthly Due Amount: " + monthlyDueAmount);

	                insurance.setDueAmount(monthlyDueAmount);
	                insuranceRepository.save(insurance);
	            }
	        }

	        System.out.println("Due Amount: " + insurance.getDueAmount());
	    }

	    return insurances;
	}



}
