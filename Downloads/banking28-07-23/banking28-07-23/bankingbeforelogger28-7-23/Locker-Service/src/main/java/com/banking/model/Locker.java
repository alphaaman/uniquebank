package com.banking.model;

import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

@Entity
@Table(name = "locker")
public class Locker {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String lockerNumber;
 private boolean occupied;
private Long userId; // Reference to User microservice's user ID or username
public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
public String getLockerNumber() {
	return lockerNumber;
}
public void setLockerNumber(String lockerNumber) {
	this.lockerNumber = lockerNumber;
}
public boolean isOccupied() {
	return occupied;
}
public void setOccupied(boolean occupied) {
	this.occupied = occupied;
}
public Long getUserId() {
	return userId;
}
public void setUserId(Long userId) {
	this.userId = userId;
}
public Locker(Long id, String lockerNumber, boolean occupied, Long userId) {
	super();
	this.id = id;
	this.lockerNumber = lockerNumber;
	this.occupied = occupied;
	this.userId = userId;
}
 // Constructors, getters, and setters
public Locker() {
	super();
	// TODO Auto-generated constructor stub
}

@PrePersist
private void generateLockerNumber() {
    // Generate the locker number based on your logic
    // Example: Generate a unique alphanumeric locker number
    String generatedLockerNumber = "LKR" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6);
    this.lockerNumber = generatedLockerNumber;
}
}
