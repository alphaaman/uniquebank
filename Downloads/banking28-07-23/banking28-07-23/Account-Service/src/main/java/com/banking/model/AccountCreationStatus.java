package com.banking.model;

public class AccountCreationStatus {

    private String message;
    private String accountId;

    public AccountCreationStatus() {
    }

    public AccountCreationStatus(String message, String accountId) {
        this.message = message;
        this.accountId = accountId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
}
