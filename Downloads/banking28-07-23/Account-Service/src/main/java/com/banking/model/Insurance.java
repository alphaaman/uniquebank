package com.banking.model;

import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Insurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String type;
    private Long userId;
    private double amount;
    private double dueAmount;
    private Date dueDate;
    private double claimAmount;
    private String claimReason;
    private Date claimDate;
    private String status;
    private double maturityAmount;
    private Date maturityDate;
    private Date createdDate;
    private Date lastPaymentDate;
    private int tenureInYears;
    // Constructors, getters, and setters
    
    public Insurance() {
        // Default constructor
    }
    
    public Insurance(String type, Long userId,Date lastPaymentDate, double amount,int tenureInYears, double dueAmount, Date dueDate,
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
        this.maturityAmount = maturityAmount;
        this.maturityDate = maturityDate;
        this.createdDate = createdDate;
        this.tenureInYears= tenureInYears;
        this.lastPaymentDate=lastPaymentDate;
    }
    
    // Getters and setters for each variable
    
    // ID
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Type
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    // User ID
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Amount
    public double getAmount() {
        return amount;
    }
    public int getTenureInYears() {
        return tenureInYears;
    }

    public void setTenureInYears(int tenureInYears) {
        this.tenureInYears = tenureInYears;
    }
   
    public void setAmount(double amount) {
        this.amount = amount;
    }

    // Due Amount
    public double getDueAmount() {
        return dueAmount;
    }

    public void setDueAmount(double dueAmount) {
        this.dueAmount = dueAmount;
    }

    // Due Date
    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    // Claim Amount
    public double getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(double claimAmount) {
        this.claimAmount = claimAmount;
    }

    // Claim Reason
    public String getClaimReason() {
        return claimReason;
    }

    public void setClaimReason(String claimReason) {
        this.claimReason = claimReason;
    }

    // Claim Date
    public Date getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(Date claimDate) {
        this.claimDate = claimDate;
    }

    // Status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    // Maturity Amount
    public double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    // Maturity Date
    public Date getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(Date maturityDate) {
        this.maturityDate = maturityDate;
    }

    // Created Date
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
