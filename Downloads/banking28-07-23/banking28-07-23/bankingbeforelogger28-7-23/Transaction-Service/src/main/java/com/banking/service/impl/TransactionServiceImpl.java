package com.banking.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banking.clients.AccountClient;
import com.banking.clients.MailClient;
import com.banking.clients.UserClient;
import com.banking.dto.Account;
import com.banking.dto.OneWayTransactionDTO;
import com.banking.model.DeductGiftCardCharges;
import com.banking.model.DeductLockerChargesRequest;
import com.banking.model.RuleStatus;
import com.banking.dto.TransactionDTO;
import com.banking.dto.TransactionStatus;
import com.banking.dto.TransferDTO;
import com.banking.dto.TransferSuccessMessage;
import com.banking.dto.UserDTO;
import com.banking.exception.InsufficientBalanceException;
import com.banking.exception.InvalidAccessException;
import com.banking.exception.InvalidAccountIdException;
import com.banking.model.TransactionHistory;
import com.banking.repository.TransactionHistoryRepository;
import com.banking.service.RulesService;
import com.banking.service.TransactionService;
import com.banking.dto.EmailRequest;
import java.util.logging.Logger;

@Service
public class TransactionServiceImpl implements TransactionService {

//	@Autowired
//	AuthClient authClient;

	@Autowired
	AccountClient accountClient;

	@Autowired
	MailClient mailClient;

	@Autowired
	UserClient userClient;

	@Autowired
	TransactionHistoryRepository repository;

	@Autowired
	RulesService rulesService;

	private boolean isTransactionValid(String accountType, double balance) throws InvalidAccessException {
		RuleStatus minBalance = rulesService.evaluateMinBalance(accountType, balance);
		if (minBalance.getStatus().equalsIgnoreCase("Allowed")) {
			return true;
		}
		return false;
	}

	@Override
	public TransactionStatus deposit(String token, OneWayTransactionDTO transactionDTO) throws InvalidAccessException {
	    if (userClient.validatingToken(token).isValidStatus()) {
	        String userRoles = userClient.validatingToken(token).getUserRole();
	        if (userRoles.contains("ROLE_CUSTOMER")) {
	            // Role contains ROLE_EMPLOYEE, proceed with the deposit logic
	            String id = "TRANSACT" + repository.count();
	            String narration = transactionDTO.getNarration();
	            if (narration.isBlank() || narration.isEmpty()) {
	                narration = "SELF_DEPOSIT";
	            }
	            TransactionStatus deposit = accountClient.deposit(
	                    token,new TransactionDTO(transactionDTO.getAccountId(), narration, transactionDTO.getAmount(), id));
	            repository.save(
	                    new TransactionHistory(id, transactionDTO.getAccountId(), transactionDTO.getAmount(), narration,
	                            transactionDTO.getTransactionType(), transactionDTO.getAccountId(), new Date(), "DEPOSIT"));
	            if (deposit != null) {
	                Account account = accountClient.getAccounts(token,transactionDTO.getAccountId());
	                return deposit;
	            }
	        }
	    }
	    throw new InvalidAccessException();
	}


	@Override
	public TransactionStatus withdraw(String token, OneWayTransactionDTO transactionDTO)
	        throws InvalidAccessException, InsufficientBalanceException {

	    Account account = accountClient.getAccounts(token,transactionDTO.getAccountId());

	    double amount = transactionDTO.getAmount();

	    if (isTransactionValid(account.getAccountType(), account.getBalance() - amount)) {
	        String userRoles = userClient.validatingToken(token).getUserRole();
	        if (userRoles.contains("ROLE_CUSTOMER")) {
	            String id = "TRANSACT" + repository.count();
	            String narration = transactionDTO.getNarration();
	            if (narration.isBlank() || narration.isEmpty()) {
	                narration = "SELF_WITHDRAW";
	            }

	            System.out.println(
	                    "Performing withdrawal for accountId: " + transactionDTO.getAccountId() + ", amount: " + amount);

	            TransactionStatus withdraw = accountClient
	                    .withdraw(token,new TransactionDTO(transactionDTO.getAccountId(), narration, amount, id));
	            repository.save(new TransactionHistory(id, transactionDTO.getAccountId(), Math.round(amount * 100) / 100.0,
	                    narration, transactionDTO.getTransactionType(), transactionDTO.getAccountId(), new Date(),
	                    "WITHDRAW"));
	            if (withdraw != null) {
	                System.out.println("Withdrawal successful for accountId: " + transactionDTO.getAccountId());
	                return withdraw;
	            } else {
	                System.out.println("Invalid access for accountId: " + transactionDTO.getAccountId());
	                throw new InvalidAccessException();
	            }
	        } else {
	            System.out.println("Invalid access for accountId: " + transactionDTO.getAccountId());
	            throw new InvalidAccessException();
	        }
	    }
	    System.out.println("Insufficient balance for accountId: " + transactionDTO.getAccountId());
	    throw new InsufficientBalanceException();
	}

	@Override
	public TransferSuccessMessage transfer(String token, TransferDTO transferDTO)
	        throws InvalidAccessException, InsufficientBalanceException {
	    Account fromAccount = accountClient.getAccounts(token,transferDTO.getFromAccountId());
	    Account toAccount = accountClient.getAccounts(token,transferDTO.getToAccountId());
	    double amount = transferDTO.getAmount();

	    if (isTransactionValid(fromAccount.getAccountType(), fromAccount.getBalance() - amount)) {
	        String userRoles = userClient.validatingToken(token).getUserRole();
	        if (userRoles.contains("ROLE_CUSTOMER")) {
	            String id = "TRANSACT" + repository.count();
	            String narration = transferDTO.getNarration();
	            if (narration.isBlank() || narration.isEmpty()) {
	                narration = "SELF_TRANSFER";
	            }

	            TransactionStatus withdraw = accountClient
	                    .withdraw(token,new TransactionDTO(transferDTO.getFromAccountId(), narration, amount, id));
	            TransactionStatus deposit = accountClient
	                    .deposit(token,new TransactionDTO(transferDTO.getToAccountId(), narration, transferDTO.getAmount(), id));

	            repository.save(new TransactionHistory(id, transferDTO.getFromAccountId(), transferDTO.getAmount(),
	                    narration, transferDTO.getTransactionType(), transferDTO.getToAccountId(), new Date(), "TRANSFER"));
	            System.out.println(withdraw+"witjdraw");
	            System.out.println(deposit+"deposit");
	            if (withdraw != null && deposit != null) {
	                return new TransferSuccessMessage(withdraw.getMessage(), deposit.getMessage(), withdraw.getBalance());
	            } else {
	                throw new InvalidAccessException();
	            }
	        } else {
	            throw new InvalidAccessException();
	        }
	    }
	    throw new InsufficientBalanceException();
	}


	@Override
	public TransferSuccessMessage deductLockerCharges(String token, DeductLockerChargesRequest deductLockerChargesRequest)
	        throws InvalidAccessException, InsufficientBalanceException {
	    Account fromAccount = accountClient.getAccounts(token,deductLockerChargesRequest.getFromAccountId());
	    Account toAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");
	    double amount = rulesService.getLockerCharges(deductLockerChargesRequest.getDurationMonths());

	    if (isTransactionValid(fromAccount.getAccountType(), fromAccount.getBalance() - amount)) {
	        String userRoles = userClient.validatingToken(token).getUserRole();
	        if (userRoles.contains("ROLE_EMPLOYEE")) {
	            String id = "TRANSACT" + repository.count();
	            String narration = "Deposit locker charges";

	            TransactionStatus withdraw = accountClient
	                    .withdraw(token,new TransactionDTO(deductLockerChargesRequest.getFromAccountId(), narration, amount, id));
	            TransactionStatus deposit = accountClient
	                    .deposit(token,new TransactionDTO(toAccount.getAccountId(), narration, amount, id));

	            repository.save(new TransactionHistory(id, deductLockerChargesRequest.getFromAccountId(), amount, narration,
	                    "Direct", toAccount.getAccountId(), new Date(), "LOCKER_CHARGE"));
	            if (withdraw != null && deposit != null) {
	                return new TransferSuccessMessage(withdraw.getMessage(), deposit.getMessage(), withdraw.getBalance());
	            } else {
	                throw new InvalidAccessException();
	            }
	        } else {
	            throw new InvalidAccessException();
	        }
	    } else {
	        throw new InsufficientBalanceException();
	    }
	}

	private static final Logger logger = Logger.getLogger(TransactionServiceImpl.class.getName());

	@Override
	public TransferSuccessMessage deductGiftCardCharges(String token, DeductGiftCardCharges deductGiftCardCharges)
	        throws InvalidAccessException, InsufficientBalanceException {
	    try {
	        String accountId = deductGiftCardCharges.getFromAccountId();
	        accountClient.getAccounts(token,accountId);
	        Account fromAccount = accountClient.getAccounts(token,accountId);
	        Account toAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");
	        double amount = deductGiftCardCharges.getAmount();

	        if (isTransactionValid(fromAccount.getAccountType(), fromAccount.getBalance() - amount)) {
	            String userRoles = userClient.validatingToken(token).getUserRole();
	            if (userRoles.contains("ROLE_CUSTOMER")) {
	                String id = "TRANSACT" + repository.count();
	                String narrationForBank = "Deposit GIFT CARD charges";
	                String narrationForAccount = "Debit Gift Card Balance";
	                TransactionStatus withdraw = accountClient
	                        .withdraw(token,new TransactionDTO(fromAccount.getAccountId(), narrationForAccount, amount, id));
	                TransactionStatus deposit = accountClient
	                        .deposit(token,new TransactionDTO(toAccount.getAccountId(), narrationForBank, amount, id));

	                repository.save(new TransactionHistory(id, fromAccount.getAccountId(), amount, narrationForAccount,
	                        "Direct", toAccount.getAccountId(), new Date(), "GIFT_CARD_CHARGE"));

	                if (withdraw != null && deposit != null) {
	                    return new TransferSuccessMessage(withdraw.getMessage(), deposit.getMessage(),
	                            withdraw.getBalance());
	                } else {
	                    throw new InvalidAccessException();
	                }
	            } else {
	                throw new InvalidAccessException();
	            }
	        } else {
	            throw new InsufficientBalanceException();
	        }
	    } catch (InvalidAccessException e) {
	        logger.severe("Error deducting gift card charges: InvalidAccessException - " + e.getMessage());
	        throw e;
	    } catch (InsufficientBalanceException e) {
	        logger.severe("Error deducting gift card charges: InsufficientBalanceException - " + e.getMessage());
	        throw e;
	    } catch (Exception e) {
	        logger.severe("Error deducting gift card charges: " + e.getMessage());
	        throw e;
	    }
	}


	@Override
	public List<TransactionHistory> transactionHistory(String token, String accountId)
	        throws InvalidAccessException, InvalidAccountIdException {
	    String userRoles = userClient.validatingToken(token).getUserRole();
	    if (userRoles.contains("ROLE_EMPLOYEE")) {
	        List<TransactionHistory> list = repository.findByAccountId(accountId);
	        if (list.isEmpty()) {
	            throw new InvalidAccountIdException();
	        }
	        return list;
	    } else {
	        throw new InvalidAccessException();
	    }
	}

	@Override
	public List<TransactionHistory> transactionHistoryByNarration(String token, String narration)
	        throws InvalidAccessException, InvalidAccountIdException {
	    String userRoles = userClient.validatingToken(token).getUserRole();
	    if (userRoles.contains("ROLE_CUSTOMER")) {
	        List<TransactionHistory> list = repository.findByNarration(narration);
	        if (list.isEmpty()) {
	            throw new InvalidAccountIdException();
	        }
	        return list;
	    } else {
	        throw new InvalidAccessException();
	    }
	}
	@Override
	public List<TransactionHistory> getAllTransactionHistory(String token)
	        throws InvalidAccessException, InvalidAccountIdException {
	    String userRoles = userClient.validatingToken(token).getUserRole();
	    if (userRoles.contains("ROLE_EMPLOYEE")) {
	        List<TransactionHistory> list = repository.findAll();
	        if (list.isEmpty()) {
	            throw new InvalidAccountIdException();
	        }
	        return list;
	    } else {
	        throw new InvalidAccessException();
	    }
	}
	
}