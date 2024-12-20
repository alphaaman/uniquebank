package com.banking.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banking.client.AccountClient;
import com.banking.client.TransactionClient;
import com.banking.client.UserClient;
import com.banking.model.Account;
import com.banking.model.DeductLockerChargesRequest;
import com.banking.model.Locker;
import com.banking.model.TransferDTO;
import com.banking.model.InvalidAccessException;
import com.banking.model.User;
import com.banking.repository.LockerRepository;
import com.banking.service.LockerService;

//LockerServiceImpl.java
@Service
public class LockerServiceImpl implements LockerService {
 private final LockerRepository lockerRepository;
 @Autowired
 UserClient userClient;

 @Autowired
 TransactionClient transactionClient;

 @Autowired
 AccountClient accountClient;

 

 @Autowired
 public LockerServiceImpl(LockerRepository lockerRepository) {
     this.lockerRepository = lockerRepository;
 }

 @Override
 public List<Locker> getAllLockers(String token) {
     return lockerRepository.findAll();
 }

 @Override
 public List<Locker> getLockersByUserId(String token,Long userId) {
     return lockerRepository.findByUserId(userId);
 }

 @Override
 public List<Locker> getAvailableLockers(String token) {
     return lockerRepository.findByOccupiedFalse();
 }

 @Override
 public Locker assignLockerToUser(String token,DeductLockerChargesRequest deductLockerChargesRequest)throws InvalidAccessException {
     // Check if there are any available lockers
	 String userRoles = userClient.validatingToken(token).getUserRole();
     if (userRoles.contains("ROLE_CUSTOMER")) {
     List<Locker> availableLockers = lockerRepository.findByOccupiedFalse();
     if (availableLockers.isEmpty()) {
         throw new RuntimeException("No available lockers");
     }

     // Get the first available locker
     Locker locker = availableLockers.get(0);
     Account fromAccount=accountClient.getAccounts(token,deductLockerChargesRequest.getFromAccountId());
     Long userId=fromAccount.getUserId();
     // Assign the locker to the user
     User user = userClient.getUser(userId);
     if (user == null) {
         throw new RuntimeException("User does not exist");
     }

     locker.setUserId(userId);
     locker.setOccupied(true);
         
     transactionClient.lockerCharge(token,deductLockerChargesRequest);
     return lockerRepository.save(locker);
     }        throw new InvalidAccessException();
 }
 @Override
 public Locker releaseLocker(String token,Long lockerId) throws InvalidAccessException{
	 String userRoles = userClient.validatingToken(token).getUserRole();
     if (userRoles.contains("ROLE_CUSTOMER")) {
     Locker locker = lockerRepository.findById(lockerId).orElseThrow(() -> new IllegalArgumentException("Locker not found"));
     locker.setUserId(null);
     locker.setOccupied(false);
     return lockerRepository.save(locker);
     }throw new InvalidAccessException();
 }

 @Override
 public Locker updateLockerStatus(String token,Long lockerId, boolean occupied) throws InvalidAccessException{
	 String userRoles = userClient.validatingToken(token).getUserRole();
     if (userRoles.contains("ROLE_CUSTOMER")) {
     Locker locker = lockerRepository.findById(lockerId).orElseThrow(() -> new IllegalArgumentException("Locker not found"));
     locker.setOccupied(occupied);
     return lockerRepository.save(locker);
     } throw new InvalidAccessException();
 }
 @Override
 public Locker createLocker(String token,Locker locker)throws InvalidAccessException {
	 String userRoles = userClient.validatingToken(token).getUserRole();
     if (userRoles.contains("ROLE_CUSTOMER")) {
     return lockerRepository.save(locker);
     }throw new InvalidAccessException();
 }
 
 @Override
 public List<Locker> getLockersByLockerNumber(String token,String lockerNumber)throws InvalidAccessException {
	 String userRoles = userClient.validatingToken(token).getUserRole();
     if (userRoles.contains("ROLE_CUSTOMER")) {
     return lockerRepository.findByLockerNumber(lockerNumber);
     }throw new InvalidAccessException();
 }


 // Add other service methods as needed
}
