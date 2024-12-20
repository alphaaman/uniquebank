package com.banking.dto;

public class TransactionDTO {

    private String accountId;
    private String narration;
    private double amount;
    private String refNo;

    public TransactionDTO() {
    }

    public TransactionDTO(String accountId, String narration, double amount, String refNo) {
        this.accountId = accountId;
        this.narration = narration;
        this.amount = amount;
        this.refNo = refNo;
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getRefNo() {
        return refNo;
    }

    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }
}

