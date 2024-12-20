package com.banking.dto;

public class TransactionStatus {
    private String message;
    private double balance;

    public TransactionStatus() {
        // Default constructor
    }

    public TransactionStatus(String message, double balance) {
        this.message = message;
        this.balance = balance;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
