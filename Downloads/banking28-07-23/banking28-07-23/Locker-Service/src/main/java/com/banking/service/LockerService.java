package com.banking.service;

import java.util.List;
import java.util.Optional;

import com.banking.model.DeductLockerChargesRequest;
import com.banking.model.InvalidAccessException;
import com.banking.model.Locker;

/// LockerService.java
public interface LockerService {
    List<Locker> getAllLockers(String token) throws InvalidAccessException;

    List<Locker> getLockersByUserId(String token,Long userId) throws InvalidAccessException;

    List<Locker> getAvailableLockers(String token) throws InvalidAccessException;

    Locker assignLockerToUser(String token,DeductLockerChargesRequest deductLockerChargesRequest) throws InvalidAccessException;

    Locker releaseLocker(String token,Long lockerId) throws InvalidAccessException;

    Locker updateLockerStatus(String token,Long lockerId, boolean occupied) throws InvalidAccessException;

	Locker createLocker(String token,Locker locker) throws InvalidAccessException;
	
	 List<Locker> getLockersByLockerNumber(String token,String lockerNumber) throws InvalidAccessException;
	 

    // Add other service methods as needed
}
