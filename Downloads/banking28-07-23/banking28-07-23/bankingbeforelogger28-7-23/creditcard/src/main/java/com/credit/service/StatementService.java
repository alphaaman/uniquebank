package com.credit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.credit.exception.InvalidAccessException;
import com.credit.model.CreditCard;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class StatementService {
    private final CreditCardService creditCardService;

    @Autowired
    public StatementService(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    public void sendMonthlyStatements(String token) throws InvalidAccessException {
        List<CreditCard> creditCards = creditCardService.getAllCreditCards(token);
        Date statementDate = new Date();
        Date paymentDueDate = calculatePaymentDueDate(statementDate);

        for (CreditCard creditCard : creditCards) {
            double outstandingBalance = calculateOutstandingBalance(creditCard);
            double interestRate = creditCard.getInterestRate();

            double paymentAmount = calculatePaymentAmount(outstandingBalance, paymentDueDate, interestRate);
            double interestAmount = calculateInterestAmount(outstandingBalance, paymentAmount, interestRate);

            String statementContent = generateStatementContent(creditCard, statementDate, paymentDueDate, outstandingBalance, paymentAmount, interestAmount);

            // Perform actions with the generated statement content
            System.out.println(statementContent);
        }
    }

    private Date calculatePaymentDueDate(Date statementDate) {
        // Perform the necessary calculations to determine the payment due date
        // For example, add a fixed number of days to the statement date
        return statementDate; // Return the calculated payment due date
    }

    private double calculateOutstandingBalance(CreditCard creditCard) {
        // Retrieve and calculate the outstanding balance for the credit card
        return creditCard.getBalance(); // Return the calculated outstanding balance
    }

    private double calculatePaymentAmount(double outstandingBalance, Date paymentDueDate, double interestRate) {
        double paymentAmount = outstandingBalance;

        // Check if payment is made on or before the due date
        if (isPaymentOnTime(paymentDueDate)) {
            // No interest is charged if payment is made on time
            return paymentAmount;
        }

        // Calculate the interest amount based on the outstanding balance and interest rate
        double interestAmount = outstandingBalance * (interestRate / 100);
        paymentAmount += interestAmount;

        return paymentAmount;
    }

    private double calculateInterestAmount(double outstandingBalance, double paymentAmount, double interestRate) {
        // Calculate the interest amount based on the outstanding balance, payment amount, and interest rate
        double interestAmount = (outstandingBalance - paymentAmount) * (interestRate / 100);
        return interestAmount;
    }

    private String generateStatementContent(CreditCard creditCard, Date statementDate, Date paymentDueDate, double outstandingBalance, double paymentAmount, double interestAmount) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        DecimalFormat decimalFormatter = new DecimalFormat("#0.00");

        StringBuilder sb = new StringBuilder();

        // Add statement header
        sb.append("Monthly Statement\n");
        sb.append("=================\n");
        sb.append("Statement Date: ").append(dateFormatter.format(statementDate)).append("\n");
        sb.append("Payment Due Date: ").append(dateFormatter.format(paymentDueDate)).append("\n\n");

        // Add credit card details
        sb.append("Credit Card Details\n");
        sb.append("------------------\n");
        sb.append("Card Name: ").append(creditCard.getCardHolderName()).append("\n");
        sb.append("Card Number: ").append(creditCard.getCardNumber()).append("\n");
        sb.append("Expiry Date: ").append(creditCard.getExpiryDate()).append("\n");
        sb.append("Card Type: ").append(creditCard.getCardType()).append("\n\n");

        // Add payment details
        sb.append("Payment Details\n");
        sb.append("---------------\n");
        sb.append("Outstanding Balance: $").append(decimalFormatter.format(outstandingBalance)).append("\n");
        sb.append("Payment Amount: $").append(decimalFormatter.format(paymentAmount)).append("\n");
        sb.append("Interest Amount: $").append(decimalFormatter.format(interestAmount)).append("\n");

        return sb.toString();
    }

    private boolean isPaymentOnTime(Date paymentDueDate) {
        Date currentDate = new Date();
        return currentDate.before(paymentDueDate) || currentDate.equals(paymentDueDate);
    }
}
