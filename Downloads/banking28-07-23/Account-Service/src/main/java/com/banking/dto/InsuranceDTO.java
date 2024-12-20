package com.banking.dto;

import java.util.Date;

public class InsuranceDTO {

    private String type;
    private Long userId;
    private double amount;
    private double dueAmount;
    private Date dueDate;
    private int tenureInYears;
    private double claimAmount;
    private String claimReason;
    private Date claimDate;
    private String status;
    private double maturityAmount;
    private Date maturityDate;
    private Date createdDate;
    private Date lastPaymentDate;

    
    // Constructors, getters, and setters
    
    public InsuranceDTO() {
        // Default constructor
    }
    
    public InsuranceDTO(String type, Long userId,Date lastPaymentDate,int tenureInYears, double amount, double dueAmount, Date dueDate,
            double claimAmount, String claimReason, Date claimDate, String status,
            double maturityAmount, Date maturityDate, Date createdDate) {
        this.type = type;
        this.userId = userId;
        this.amount = amount;
        this.dueAmount = dueAmount;
        this.dueDate = dueDate;
        this.claimAmount = claimAmount;
        this.claimReason = claimReason;
        this.claimDate = claimDate;
        this.status = status;
        this.tenureInYears=tenureInYears;
        this.maturityAmount = maturityAmount;
        this.maturityDate = maturityDate;
        this.createdDate = createdDate;
        this.lastPaymentDate=lastPaymentDate;
    }
    
    // Getters and setters for each variable

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getDueAmount() {
        return dueAmount;
    }

    public void setDueAmount(double dueAmount) {
        this.dueAmount = dueAmount;
    }

    public Date getDueDate() {
        return dueDate;
    }
    public int getTenureInYears() {
        return tenureInYears;
    }

    public void setTenureInYears(int tenureInYears) {
        this.tenureInYears = tenureInYears;
    }
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public double getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(double claimAmount) {
        this.claimAmount = claimAmount;
    }

    public String getClaimReason() {
        return claimReason;
    }

    public void setClaimReason(String claimReason) {
        this.claimReason = claimReason;
    }

    public Date getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(Date claimDate) {
        this.claimDate = claimDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    public double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public Date getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(Date maturityDate) {
        this.maturityDate = maturityDate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }
    public Date getLastPaymentDate() {
		return lastPaymentDate;
	}

	public void setLastPaymentDate(Date lastPaymentDate) {
		this.lastPaymentDate = lastPaymentDate;
	}
    // Additional methods, if needed
}
