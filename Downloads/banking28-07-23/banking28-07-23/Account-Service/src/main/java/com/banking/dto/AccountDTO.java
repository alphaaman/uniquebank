package com.banking.dto;

public class AccountDTO {

    private String accountId;
    private String accountType;
    private Long userId;
    private double deposit;

    public AccountDTO() {
    }

    public AccountDTO(String accountId, String accountType, Long userId, double deposit) {
        this.accountId = accountId;
        this.accountType = accountType;
        this.userId = userId;
        this.deposit = deposit;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }
}
