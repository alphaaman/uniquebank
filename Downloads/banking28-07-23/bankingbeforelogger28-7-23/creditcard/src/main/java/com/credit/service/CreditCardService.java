package com.credit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.credit.model.Account;
import com.credit.model.OneWayTransactionDTO;
import com.credit.model.PurchaseRequest;
import com.credit.model.TransactionHistory;
import com.credit.model.UserDTO;
import com.credit.clients.TransactionClient;
import com.credit.clients.UserClient;
import com.credit.exception.InsufficientBalanceException;
import com.credit.exception.InvalidAccessException;
import com.credit.model.TransferDTO;
import com.credit.clients.AccountClient;

import com.credit.model.CreditCard;
import com.credit.repository.CreditCardRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Date;

@Service
public class CreditCardService {
  

    @Autowired 
    CreditCardRepository creditCardRepository;
    
    @Autowired 
    TransactionClient transactionClient;
    
    @Autowired 
    UserClient userClient;
    @Autowired
    AccountClient accountClient;

    public List<CreditCard> getAllCreditCards(String token)  throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        return creditCardRepository.findAll();
        } throw new InvalidAccessException();
    }

    public CreditCard saveCreditCard(String token,CreditCard creditCard) throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
    	creditCard.setBalance(creditCard.getCreditLimit());
    	creditCard.setLastPaymentDate(null);
    	CreditCard credit=creditCardRepository.save(creditCard);
    	Account toAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");
//        transactionClient.deposit(token,new OneWayTransactionDTO(toAccount.getAccountId(), creditCard.getCardNumber(), "CASH", 500.0));

        return credit;
        }
        throw new InvalidAccessException();
    }
    
    public CreditCard purchase(String token,PurchaseRequest purchaseRequest) throws InvalidAccessException {
        CreditCard creditCard = getCreditCardById(token,purchaseRequest.getId());
        String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
        if (creditCard.getBalance() >= purchaseRequest.getAmount()) {
            Account fromAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");
            transactionClient.withdraw(token,new OneWayTransactionDTO(fromAccount.getAccountId(), creditCard.getCardNumber(), "CASH", purchaseRequest.getAmount()));
            creditCard.setBalance(creditCard.getBalance() - purchaseRequest.getAmount());
            creditCard.setDueAmount(creditCard.getDueAmount() + purchaseRequest.getAmount());
            creditCardRepository.save(creditCard);
        }
        return creditCard;
        }
        throw new InvalidAccessException();
    }

    
    public CreditCard payment(String token, PurchaseRequest purchaseRequest) throws InvalidAccessException {
        String userRoles = userClient.validatingToken(token).getUserRole();
        System.out.println("User Roles: " + userRoles);

        if (userRoles.contains("ROLE_CUSTOMER")) {
            CreditCard creditCard = getCreditCardById(token, purchaseRequest.getId());
            System.out.println("Credit Card: " + creditCard);

            LocalDate currentDate = LocalDate.now();
            System.out.println("Current Date: " + currentDate);

            Date lastPaymentDate = creditCard.getLastPaymentDate();
            System.out.println("Last Payment Date: " + lastPaymentDate);

            if (lastPaymentDate == null) {
                // Set lastPaymentDate to currentDate as it's the first purchase/payment
                creditCard.setLastPaymentDate(new Date());
                System.out.println("Setting Last Payment Date to Current Date: " + creditCard.getLastPaymentDate());
                 creditCardRepository.save(creditCard);
            }

            LocalDate date = creditCard.getLastPaymentDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            System.out.println("Date: " + date);

            // Calculate the number of months overdue
            long monthsOverdue = ChronoUnit.MONTHS.between(date, currentDate);
            System.out.println("Months Overdue: " + monthsOverdue);

            // Calculate the interest amount based on the total amount of purchases
            double totalPurchaseAmount = creditCard.getDueAmount();
            System.out.println("Total Purchase Amount: " + totalPurchaseAmount);

            double interestAmount = totalPurchaseAmount * 0.15 * monthsOverdue;
            System.out.println("Interest Amount: " + interestAmount);

            // Make the payment by deducting the interest amount from the balance
            double payingAmount = purchaseRequest.getAmount();
            System.out.println("Paying Amount: " + payingAmount);
            UserDTO user= userClient.getUserByUsername(creditCard.getCardHolderName());
            Account fromAccount = accountClient.getCustomerAccounts(token, user.getId());
            System.out.println("From Account: " + fromAccount);

//            transactionClient.deposit(token, new OneWayTransactionDTO(fromAccount.getAccountId(), creditCard.getCardNumber(), "PAID CREDIT OUSTANDING AMOUNT", payingAmount));
            Account toAccount = accountClient.getAccountBytype(token,"BANK_ACCOUNT");
            TransferDTO transferDetails=new TransferDTO(fromAccount.getAccountId(),toAccount.getAccountId(),"PAID CREDIT OUSTANDING AMOUNT","DIGITAL",payingAmount);
            transactionClient.transfer(token,transferDetails);
            double dueAmount = creditCard.getDueAmount()  - payingAmount;
            System.out.println("Due Amount: " + dueAmount);

            creditCard.setDueAmount(dueAmount);
            creditCard.setLastPaymentDate(new Date());
            System.out.println("Setting Due Amount and Last Payment Date: " + creditCard.getDueAmount() + ", " + creditCard.getLastPaymentDate());

            return creditCardRepository.save(creditCard);
        }

        throw new InvalidAccessException();
    }


    
    private double calculateTotalWithdrawalAmount(String token,CreditCard creditCard) {
        Date lastPaymentDate = creditCard.getLastPaymentDate();
        Date currentDateTime = new Date();

        System.out.println("Last Payment Date/Time: " + lastPaymentDate);
        System.out.println("Current Date/Time: " + currentDateTime);

        double totalWithdrawalAmount = 0.0;

        // Get all transactions for the credit card
        List<TransactionHistory> transactions = transactionClient.getTransactionsByNarration(token,creditCard.getCardNumber());
        // Print the list of transactions
        System.out.println("Transactions:");
        for (TransactionHistory transaction : transactions) {
            System.out.println(transaction);
            LocalDateTime transactionDateTime = transaction.getTransactionDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            Date transactionDate = Date.from(transactionDateTime.atZone(ZoneId.systemDefault()).toInstant());

            // Compare the transaction date/time with the last payment date/time and current date/time
            if (transaction.getTransactionType().equals("WITHDRAW") && 
                (transactionDate.after(lastPaymentDate) || transactionDate.equals(lastPaymentDate)) &&
                (transactionDate.before(currentDateTime) || transactionDate.equals(currentDateTime))) {
                
                totalWithdrawalAmount += transaction.getAmount();
            }
        }

        System.out.println("Total Withdrawal Amount: " + totalWithdrawalAmount);
        return totalWithdrawalAmount;
    }




    private boolean isWithinRange(LocalDate date, LocalDate startDate, LocalDate endDate) {
        return !date.isBefore(startDate) && !date.isAfter(endDate) && !date.isBefore(startDate) && !date.isAfter(endDate);
    }



    public CreditCard getCreditCardById(String token,Long id) throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
        return creditCardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Credit card not found with id: " + id));
        }
        throw new InvalidAccessException();
    }
    public List<CreditCard> getCreditCardByCardHolderName(String token,String name) throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
        return creditCardRepository.findByCardHolderName(name);
        }
        throw new InvalidAccessException();
    }

    public void deleteCreditCardById(String token,Long id) {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        creditCardRepository.deleteById(id);
        }
       
    }

    public CreditCard setCreditCardLimit(String token,Long id, double limit) throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        CreditCard creditCard = getCreditCardById(token,id);
        creditCard.setCreditLimit(limit);
        return creditCardRepository.save(creditCard);
        }
        throw new InvalidAccessException();
    }

    public CreditCard setCreditCardType(String token,Long id, String cardType) throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        CreditCard creditCard = getCreditCardById(token,id);
        creditCard.setCardType(cardType);
        return creditCardRepository.save(creditCard);
    }
        throw new InvalidAccessException();
    }
}
