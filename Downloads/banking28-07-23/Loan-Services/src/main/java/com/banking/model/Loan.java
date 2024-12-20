package com.banking.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Loan_Detail")
public class Loan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	private LoanType loanType;
	private String loanNumber;

	

	private double amount;
	private double interestRate;
	private int termInMonths;

	@Enumerated(EnumType.STRING)
	private LoanStatus status;

	@Enumerated(EnumType.STRING)
	private EmploymentStatus empStatus;

	private double income;
	private String pancardNumber;

	private Integer cibilScore;

	private double emi;
	private int paidMonths;
	private int remainingMonths;
	private Long userId;
	private String disburseAccountNumber;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("d/M/yyyy HH:mm:ss");

	public Loan(Long id, LoanType loanType, double amount, double interestRate, int termInMonths, LoanStatus status,
			EmploymentStatus empStatus, double income, Integer creditScore, double emi, LocalDateTime createdAt,
			LocalDateTime updatedAt, String pancardNumber, int paidMonths, int remainingMonths, String loanNumber ,Long userId) {
		super();
		this.id = id;
		this.loanType = loanType;
		this.amount = amount;
		this.interestRate = interestRate;
		this.termInMonths = termInMonths;
		this.status = status;
		this.empStatus = empStatus;
		this.income = income;
		this.cibilScore = creditScore;
		this.emi = emi;
		this.createdAt = LocalDateTime.parse(DATE_TIME_FORMATTER.format(LocalDateTime.now()), DATE_TIME_FORMATTER);
		this.updatedAt = createdAt;
		this.pancardNumber = pancardNumber;
		this.paidMonths = paidMonths;
		this.remainingMonths = remainingMonths;
		this.loanNumber = loanNumber;
		this.userId=userId;
	}

	public Loan() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LoanType getLoanType() {
		return loanType;
	}

	public void setLoanType(LoanType loanType) {
		this.loanType = loanType;
	}

	public String getLoanNumber() {
		return loanNumber;
	}

	public void setLoanNumber(String loanNumber) {
		this.loanNumber = loanNumber;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public double getInterestRate() {
		return interestRate;
	}

	public void setInterestRate(double interestRate) {
		this.interestRate = interestRate;
	}

	public int getTermInMonths() {
		return termInMonths;
	}

	public void setTermInMonths(int termInMonths) {
		this.termInMonths = termInMonths;
	}

	public LoanStatus getStatus() {
		return status;
	}

	public void setStatus(LoanStatus status) {
		this.status = status;
	}

	public EmploymentStatus getEmpStatus() {
		return empStatus;
	}

	public void setEmpStatus(EmploymentStatus empStatus) {
		this.empStatus = empStatus;
	}

	public double getIncome() {
		return income;
	}

	public void setIncome(double income) {
		this.income = income;
	}

	public String getPancardNumber() {
		return pancardNumber;
	}

	public void setPancardNumber(String pancardNumber) {
		this.pancardNumber = pancardNumber;
	}

	public Integer getCibilScore() {
		return cibilScore;
	}

	public void setCibilScore(Integer cibilScore) {
		this.cibilScore = cibilScore;
	}

	public double getEmi() {
		return emi;
	}

	public void setEmi(double emi) {
		this.emi = emi;
	}

	public int getPaidMonths() {
		return paidMonths;
	}

	public void setPaidMonths(int paidMonths) {
		this.paidMonths = paidMonths;
	}

	public int getRemainingMonths() {
		return remainingMonths;
	}

	public void setRemainingMonths(int remainingMonths) {
		this.remainingMonths = remainingMonths;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public static DateTimeFormatter getDateTimeFormatter() {
		return DATE_TIME_FORMATTER;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getDisburseAccountNumber() {
		return disburseAccountNumber;
	}

	public void setDisburseAccountNumber(String disburseAccountNumber) {
		this.disburseAccountNumber = disburseAccountNumber;
	}

	public Loan(Long id, LoanType loanType, String loanNumber, double amount, double interestRate, int termInMonths,
			LoanStatus status, EmploymentStatus empStatus, double income, String pancardNumber, Integer cibilScore,
			double emi, int paidMonths, int remainingMonths, Long userId, String disburseAccountNumber,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.loanType = loanType;
		this.loanNumber = loanNumber;
		this.amount = amount;
		this.interestRate = interestRate;
		this.termInMonths = termInMonths;
		this.status = status;
		this.empStatus = empStatus;
		this.income = income;
		this.pancardNumber = pancardNumber;
		this.cibilScore = cibilScore;
		this.emi = emi;
		this.paidMonths = paidMonths;
		this.remainingMonths = remainingMonths;
		this.userId = userId;
		this.disburseAccountNumber = disburseAccountNumber;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

}
