package com.banking.dto;

import java.util.Date;
public class RecurringDepositDTO {

    private String rdNumber;
    private String accountNumber;
    private long userId;
    private double monthlyDeposit;
    private double maturityAmount;
    private int period;
    private double interestRate;
    private Date createdDate;
    private Date dueDate;
    private Date lastPaymentDate;

    public RecurringDepositDTO() {
    }

    public RecurringDepositDTO(String rdNumber,Date lastPaymentDate, String accountNumber, long userId, double monthlyDeposit, double maturityAmount, int period, double interestRate, Date createdDate, Date dueDate) {
        this.rdNumber = rdNumber;
        this.accountNumber = accountNumber;
        this.userId = userId;
        this.monthlyDeposit = monthlyDeposit;
        this.maturityAmount = maturityAmount;
        this.period = period;
        this.interestRate = interestRate;
        this.createdDate = createdDate;
        this.dueDate = dueDate;
        this.lastPaymentDate=lastPaymentDate;

    }

    public String getRdNumber() {
        return rdNumber;
    }

    public void setRdNumber(String rdNumber) {
        this.rdNumber = rdNumber;
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

    public double getMonthlyDeposit() {
        return monthlyDeposit;
    }

    public void setMonthlyDeposit(double monthlyDeposit) {
        this.monthlyDeposit = monthlyDeposit;
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

	public Date getLastPaymentDate() {
		return lastPaymentDate;
	}

	public void setLastPaymentDate(Date lastPaymentDate) {
		this.lastPaymentDate = lastPaymentDate;
	}
}
