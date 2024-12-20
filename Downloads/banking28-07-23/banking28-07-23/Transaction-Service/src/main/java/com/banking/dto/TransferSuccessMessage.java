package com.banking.dto;

public class TransferSuccessMessage {
    private String fromAccount;
    private String toAccount;
    private double sourceBalance;

    public TransferSuccessMessage() {
        // Default constructor
    }

    public TransferSuccessMessage(String fromAccount, String toAccount, double sourceBalance) {
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.sourceBalance = sourceBalance;
    }

    public String getFromAccount() {
        return fromAccount;
    }

    public void setFromAccount(String fromAccount) {
        this.fromAccount = fromAccount;
    }

    public String getToAccount() {
        return toAccount;
    }

    public void setToAccount(String toAccount) {
        this.toAccount = toAccount;
    }

    public double getSourceBalance() {
        return sourceBalance;
    }

    public void setSourceBalance(double sourceBalance) {
        this.sourceBalance = sourceBalance;
    }
}
