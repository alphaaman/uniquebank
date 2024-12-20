package com.banking.dto;

public class OneWayTransactionDTO {

    private String accountId;
    private String narration;
    private String transactionType;
    private double amount;

    public OneWayTransactionDTO() {
    }

    public OneWayTransactionDTO(String accountId, String narration, String transactionType, double amount) {
        this.accountId = accountId;
        this.narration = narration;
        this.transactionType = transactionType;
        this.amount = amount;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(String narration) {
        this.narration = narration;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
