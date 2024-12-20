package com.banking.dto;

import java.time.LocalDate;

public class AtalPensionYojanaDTO {
	private long id;
    private String schemeId;
    private long userId;
    private String userType;
    private String accountNumber;
    private String name;
    private int age;
    private String occupation;
    private String employerName;
    private double monthlyIncome;
    private double monthlyPension;
    private int contributionPeriod;
    private LocalDate createdDate;
    private LocalDate maturityDate;
    private String status;

    // Constructors, getters, and setters

    public AtalPensionYojanaDTO() {
    }

    public AtalPensionYojanaDTO(Long id,String schemeId, long userId, String userType, String accountNumber, String name, int age, String occupation, String employerName, double monthlyIncome, double monthlyPension, int contributionPeriod, LocalDate createdDate, LocalDate maturityDate, String status) {
        this.id=id;
    	this.schemeId = schemeId;
        this.userId = userId;
        this.userType = userType;
        this.accountNumber = accountNumber;
        this.name = name;
        this.age = age;
        this.occupation = occupation;
        this.employerName = employerName;
        this.monthlyIncome = monthlyIncome;
        this.monthlyPension = monthlyPension;
        this.contributionPeriod = contributionPeriod;
        this.createdDate = createdDate;
        this.maturityDate = maturityDate;
        this.status = status;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(String schemeId) {
        this.schemeId = schemeId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(String employerName) {
        this.employerName = employerName;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public double getMonthlyPension() {
        return monthlyPension;
    }

    public void setMonthlyPension(double monthlyPension) {
        this.monthlyPension = monthlyPension;
    }

    public int getContributionPeriod() {
        return contributionPeriod;
    }

    public void setContributionPeriod(int contributionPeriod) {
        this.contributionPeriod = contributionPeriod;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDate maturityDate) {
        this.maturityDate = maturityDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
