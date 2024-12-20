package com.banking.dto;

import java.util.Date;
public class FixedDepositDTO {

    private String fdNumber;
    private String accountNumber;
    private long userId;
    private double deposit;
    private double maturityAmount;
    private int period;
    private double interestRate;
    private Date createdDate;
    private Date dueDate;

    public FixedDepositDTO() {
    }

    public FixedDepositDTO(String fdNumber, String accountNumber, long userId, double deposit, double maturityAmount, int period, double interestRate, Date createdDate, Date dueDate) {
        this.fdNumber = fdNumber;
        this.accountNumber = accountNumber;
        this.userId = userId;
        this.deposit = deposit;
        this.maturityAmount = maturityAmount;
        this.period = period;
        this.interestRate = interestRate;
        this.createdDate = createdDate;
        this.dueDate = dueDate;
    }

    public String getFdNumber() {
        return fdNumber;
    }

    public void setFdNumber(String fdNumber) {
        this.fdNumber = fdNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    public double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
}
