package com.banking.model;

import com.banking.dto.Account;

public class DeductGiftCardCharges {
	private String fromAccountId;
	private double amount;
	public String getFromAccountId() {
		return fromAccountId;
	}
	public void setFromAccountId(String fromAccountId) {
		this.fromAccountId = fromAccountId;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public DeductGiftCardCharges(String fromAccountId, double amount) {
		super();
		this.fromAccountId = fromAccountId;
		this.amount = amount;
	}
	public DeductGiftCardCharges() {
		super();
		// TODO Auto-generated constructor stub
	}
}
