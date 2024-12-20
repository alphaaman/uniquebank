package com.credit.model;



import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Random;

@Entity
public class CreditCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
    private String cardType;
    private double interestRate;
    private double creditLimit;
    private double balance;
    private double income;
    private double dueAmount;
    private Date lastPaymentDate;
    private int age;

    public CreditCard() {
        generateCardNumber();
        generateExpiryDate();
        generateCVV();
        this.balance = 0.0;
    }

    public CreditCard(String cardHolderName, String cardType, double creditLimit, double income, int age) {
        this.cardHolderName = cardHolderName;
        this.cardType = cardType;
        this.creditLimit = creditLimit;
        this.income = income;
        this.age = age;

        generateCardNumber();
        generateExpiryDate();
        generateCVV();
        setInterestRateBasedOnCardType();
        this.balance = 0.0;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
        setInterestRateBasedOnCardType();
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public double getCreditLimit() {
        return creditLimit;
    }

    public void setCreditLimit(double creditLimit) {
        this.creditLimit = creditLimit;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    private void generateCardNumber() {
        // Generate a random 16-digit card number
        Random random = new Random();
        StringBuilder cardNumberBuilder = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            int digit = random.nextInt(10);
            cardNumberBuilder.append(digit);
        }
        this.cardNumber = cardNumberBuilder.toString();
    }

    private void generateExpiryDate() {
        // Generate expiry date 3 years from the current date
        LocalDate currentDate = LocalDate.now();
        LocalDate expiryDate = currentDate.plusYears(3);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
        this.expiryDate = expiryDate.format(formatter);
    }

    private void generateCVV() {
        // Generate a random 3-digit CVV
        Random random = new Random();
        int cvvNumber = random.nextInt(900) + 100;
        this.cvv = String.valueOf(cvvNumber);
    }

    private void setInterestRateBasedOnCardType() {
        // Set the interest rate based on the card type
        if (cardType.equalsIgnoreCase("Visa")) {
            this.interestRate = 15.0;
        } else if (cardType.equalsIgnoreCase("MasterCard")) {
            this.interestRate = 12.0;
        } else if (cardType.equalsIgnoreCase("American Express")) {
            this.interestRate = 10.0;
        } else {
            this.interestRate = 0.0;
        }
    }

	public double getDueAmount() {
		return dueAmount;
	}

	public void setDueAmount(double dueAmount) {
		this.dueAmount = dueAmount;
	}

	public Date getLastPaymentDate() {
		return lastPaymentDate;
	}

	public void setLastPaymentDate(Date lastPaymentDate) {
		this.lastPaymentDate = lastPaymentDate;
	}
}

