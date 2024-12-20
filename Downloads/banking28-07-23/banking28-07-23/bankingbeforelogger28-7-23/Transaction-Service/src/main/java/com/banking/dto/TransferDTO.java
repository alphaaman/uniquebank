package com.banking.dto;

public class TransferDTO {
    private String fromAccountId;
    private String toAccountId;
    private String narration;
    private String transactionType;
    private double amount;

    public TransferDTO() {
        // Default constructor
    }

    public TransferDTO(String fromAccountId, String toAccountId, String narration, String transactionType, double amount) {
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.narration = narration;
        this.transactionType = transactionType;
        this.amount = amount;
    }

    public String getFromAccountId() {
        return fromAccountId;
    }

    public void setFromAccountId(String fromAccountId) {
        this.fromAccountId = fromAccountId;
    }

    public String getToAccountId() {
        return toAccountId;
    }

    public void setToAccountId(String toAccountId) {
        this.toAccountId = toAccountId;
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
