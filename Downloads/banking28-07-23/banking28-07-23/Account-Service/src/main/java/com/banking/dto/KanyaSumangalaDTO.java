package com.banking.dto;

import java.time.LocalDate;

public class KanyaSumangalaDTO {
    private Long id;
    private String name;
    private String address;
    private String daughterName;
    private int age;
    private String schemeId;
    private LocalDate maturityDate;
    private String fatherName;
    private String motherName;
    private String contactNumber;
    private long userId;
    private LocalDate createdDate;
    private String status;

    public KanyaSumangalaDTO() {
    }

    public KanyaSumangalaDTO(Long id, String name, String address, String daughterName, int age,
                             String schemeId, LocalDate maturityDate, String fatherName,
                             String motherName, String contactNumber, long userId,
                             LocalDate createdDate, String status) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.daughterName = daughterName;
        this.age = age;
        this.schemeId = schemeId;
        this.maturityDate = maturityDate;
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.contactNumber = contactNumber;
        this.userId = userId;
        this.createdDate = createdDate;
        this.status = status;
    }

    // Getters and Setters (omitted for brevity)

    // Add getters and setters for each field

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDaughterName() {
        return daughterName;
    }

    public void setDaughterName(String daughterName) {
        this.daughterName = daughterName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(String schemeId) {
        this.schemeId = schemeId;
    }

    public LocalDate getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDate maturityDate) {
        this.maturityDate = maturityDate;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
