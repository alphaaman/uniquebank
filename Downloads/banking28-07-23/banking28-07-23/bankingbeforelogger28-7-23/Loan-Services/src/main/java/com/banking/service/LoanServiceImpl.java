package com.banking.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banking.repository.LoanRepository;
import com.banking.model.Account;
import com.banking.model.OneWayTransactionDTO;
import com.banking.model.TransferDTO;

import javax.transaction.Transaction;

import com.banking.client.AccountClient;
import com.banking.client.TransactionClient;
import com.banking.client.UserClient;
import com.banking.model.EmploymentStatus;
import com.banking.model.InvalidAccessException;
import com.banking.model.Loan;
import com.banking.model.LoanStatus;
import com.banking.model.LoanType;
import com.banking.model.User;

import lombok.RequiredArgsConstructor;
@Service
public class LoanServiceImpl implements LoanService {
	
	
//	private final LoanRepository repo;
//	
//	 public LoanServiceImpl(LoanRepository loanRepository) {
//	     this.repo = loanRepository;
//	 }
//	
	@Autowired
	LoanRepository repo;
	
	@Autowired
	UserClient userClient;
	
	@Autowired
	TransactionClient transactionClient;
	
	@Autowired
	AccountClient accountClient;

	@Override
	public String applyLoan(String token, Loan loan) throws InvalidAccessException {
	    String userRoles = userClient.validatingToken(token).getUserRole();
	    if (userRoles.contains("ROLE_CUSTOMER")) {
	        
	                if (loan.getCibilScore() < 700) {
	                    loan.setStatus(LoanStatus.REJECTED);
	                    loan.setCreatedAt(LocalDateTime.now());
//	                    loan.setUpdatedAt(LocalDateTime.now());
	                    repo.save(loan);
	                    return "Sorry, we cannot process the loan for you.";
	                }
	       
	        loan.setLoanType(loan.getLoanType());
	        String prefix = "";
	        int interestRate = 0;
	        double monthlyInterestRate = 0;

	        if (loan.getLoanType() == LoanType.STUDENT) {
	            prefix = "EL";
	            interestRate = 13;
	        } else if (loan.getLoanType() == LoanType.PERSONAL) {
	            prefix = "PL";
	            interestRate = 15;
	        } else if (loan.getLoanType() == LoanType.AGRICULTURAL) {
	            prefix = "AL";
	            interestRate = 10;
	        } else if (loan.getLoanType() == LoanType.LIVESTOCK) {
	            prefix = "LL";
	            interestRate = 11;
	        } else if (loan.getLoanType() == LoanType.MICROFINANCE) {
	            prefix = "ML";
	            interestRate = 14;
	        } else if (loan.getLoanType() == LoanType.RURAL_HOUSING) {
	            prefix = "RHL";
	            interestRate = 12;
	        } else if (loan.getLoanType() == LoanType.MARRIAGE) {
	            prefix = "MRL";
	            interestRate = 16;
	        } else {
	            prefix = "HL";  // Home Loan as default
	            interestRate = 12;
	        }

	        loan.setInterestRate(interestRate);
	        monthlyInterestRate = (interestRate / 100.0) / 12.0;
	        double denominator = Math.pow(1 + monthlyInterestRate, loan.getTermInMonths()) - 1;
	        int emi = (int) (((loan.getAmount() * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loan.getTermInMonths()))) / denominator);
	        loan.setEmi(emi);
	       
	        System.out.println("EMI: " + emi);

	        String loanNumber = prefix + generateUniqueLoanNumber();
	        loan.setLoanNumber(loanNumber);
	        loan.setAmount(loan.getAmount());
	        loan.setTermInMonths(loan.getTermInMonths());
	        loan.setStatus(LoanStatus.PENDING);
	        loan.setEmpStatus(loan.getEmpStatus());
	        loan.setIncome(loan.getIncome());
	        loan.setCibilScore(loan.getCibilScore());
	        loan.setCreatedAt(LocalDateTime.now());
//	        loan.setUpdatedAt(LocalDateTime.now());
	        loan.setRemainingMonths(loan.getTermInMonths());
	        loan.setPaidMonths(0);
	        repo.save(loan);
	        return "Loan applied successfully.";
	    }
	    throw new InvalidAccessException();
	}

	 private String generateUniqueLoanNumber() {
	        ThreadLocalRandom random = ThreadLocalRandom.current();
	        int loanNumber;
	       
	            loanNumber = random.nextInt(1_000_00_000);
	           
	        return String.format("%08d", loanNumber);
	    }

	@Override
	public String verifyLoan(String token,Long id)throws InvalidAccessException {
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		loan.setStatus(LoanStatus.ONPROCESS);
//		loan.setUpdatedAt(LocalDateTime.now());
		 repo.save(loan);
		 return "Verification Completed";
        }throw new InvalidAccessException();
	}

	@Override
	public String approveLoan(String token,Long id)throws InvalidAccessException {
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
		// TODO Auto-generated method stub
		Loan loan = repo.findById(id).get();
//		loan.setUpdatedAt(LocalDateTime.now());

		loan.setStatus(LoanStatus.APPROVED);
		repo.save(loan);
		return "Loan has been approved";
        }
        throw new InvalidAccessException();
	}

	@Override
	public String disburseMoney(String token,Long id, Loan disbursedloan)throws InvalidAccessException {
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
		// TODO Auto-generated method stub
		  Loan loan = repo.findById(id).get();
		  	User user =userClient.getUser(loan.getUserId());
            Account fromAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");
            Account toAccount=accountClient.getAccounts(token,loan.getDisburseAccountNumber());
            String narration="Amount disbusered into account number :"+loan.getDisburseAccountNumber();
            String transactionType="LOAN_AMOUNT_DISBURSED";
            double amount=disbursedloan.getAmount();
            TransferDTO transferDetails=new TransferDTO(fromAccount.getAccountId(),toAccount.getAccountId(),narration,transactionType,amount);
            transactionClient.transfer(token,transferDetails);
		    loan.setAmount(disbursedloan.getAmount());
		    loan.setInterestRate(disbursedloan.getInterestRate());
		    loan.setTermInMonths(disbursedloan.getTermInMonths());
		    loan.setStatus(LoanStatus.ACTIVE);
		    loan.setEmi(calculateEmi(token,disbursedloan));
//		    loan.setUpdatedAt(LocalDateTime.now());
		    loan.setPaidMonths(0); 
		    loan.setRemainingMonths(disbursedloan.getTermInMonths());
		    
		    repo.save(loan);  // Update the existing loan row in the data table
		return "Loan amount has been disbursed";
        }        throw new InvalidAccessException();
	}
	

	@Override
	public String completedLoanInstallment(String token,Long id )throws InvalidAccessException {
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan  loan = repo.findById(id).get();

		if( loan.getRemainingMonths() == 0) {
			loan.setUpdatedAt(LocalDateTime.now());

			loan.setStatus(LoanStatus.CLOSED);
		}
		repo.save(loan);
		return "You have sucessfully paid , all your loan money ! Feel free to apply loan again 😊😊";
        }        throw new InvalidAccessException();
	}

	@Override
	public int calculateEmi(String token,Loan loan) throws InvalidAccessException {
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
//		int loanTenureMonths, double loanAmount , double annualInterestRate 
		int loanTenureMonths = loan.getTermInMonths(); 
		double loanAmount = loan.getAmount();
		double annualInterestRate = loan.getInterestRate();
		double monthlyInterestRate = (annualInterestRate / 100) / 12;
        double denominator = Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1;
        int emi = (int) (((loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureMonths))) / denominator);
		
        return  emi;
        }        throw new InvalidAccessException();
	}

	@Override
	public double pendingAmount(String token,Long id)throws InvalidAccessException {
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		double emi = calculateEmi(token,loan);
		
		double pendingAmount = emi * loan.getRemainingMonths();
		
		

		return pendingAmount;
        }
        throw new InvalidAccessException();
	}


	@Override
	public Loan ChangeTenure(String token,Long id , int months)throws InvalidAccessException {
		
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		loan.setTermInMonths(months);
		loan.setEmi(calculateEmi(token,loan));
//		loan.setUpdatedAt(LocalDateTime.now());

		repo.save(loan);
		
		
		return loan;}
        throw new InvalidAccessException();
	}

	@Override
	public String payMonthlyEmi(String token,Long id )throws InvalidAccessException {
		// TODO Auto-generated method stubString userRoles = userClient.validatingToken(token).getUserRole();
        
		String userRoles = userClient.validatingToken(token).getUserRole();if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		
	
		    Account bankAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");

			transactionClient.deposit(token,new OneWayTransactionDTO(bankAccount.getAccountId(),"GET Monthly EMI of loan id : "+id,"EMI",loan.getEmi()));
			loan.setPaidMonths(loan.getPaidMonths() +1 );
			loan.setRemainingMonths(loan.getRemainingMonths() -1 );
//			 over due date
//			LocalDateTime lastduedate =  loan.getUpdatedAt() ;
//			LocalDateTime currentDate = lastduedate.plusMonths(1).plusDays(1);
//			ChronoUnit - it is used to calculate the difference between last month date and previous month date
//	        long daysDifference = ChronoUnit.DAYS.between(lastduedate, currentDate);
			
			loan.setUpdatedAt(LocalDateTime.now());
			repo.save(loan);

			if(loan.getRemainingMonths() == 0)
			{
				return completedLoanInstallment(token,id);
			}
			return " You have paid ur monthly emi";
		}        throw new InvalidAccessException();
		
	}

	@Override
	public String rejectLoan(String token,Long id)throws InvalidAccessException {
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		loan.setStatus(LoanStatus.REJECTED);
		repo.save(loan);
		return "Sorry , We cannot process the loan for you ";
        }        throw new InvalidAccessException();
	}

	@Override
	public int pendingEmi(String token,Long id) throws InvalidAccessException {
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		return loan.getRemainingMonths();
        }
        throw new InvalidAccessException();
	}

	@Override
	public double overDue(String token,Long id)throws InvalidAccessException {
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		Loan loan = repo.findById(id).get();
		
		double emi = loan.getEmi();
		 
		emi = emi + (emi * 1.5/100);
		
		return emi;}
        throw new InvalidAccessException();
		
	}

	public Loan getLoanByID(String token,Long id)throws InvalidAccessException {
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		return repo.findById(id).get();
        }
        throw new InvalidAccessException();
	}
	@Override
	public List<Loan> getLoanByUserId(String token,Long UserId)throws InvalidAccessException {
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		return repo.findByUserId(UserId);
        }
        throw new InvalidAccessException();
	}
	@Override
	public List<Loan> getAllLoans(String token) throws InvalidAccessException{
		// TODO Auto-generated method stub
		String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
		return repo.findAll();
        }         throw new InvalidAccessException();
	}
	
}
