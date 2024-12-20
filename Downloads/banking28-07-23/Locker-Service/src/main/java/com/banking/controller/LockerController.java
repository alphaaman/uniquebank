package com.banking.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.banking.model.DeductLockerChargesRequest;
import com.banking.model.InvalidAccessException;
import com.banking.model.Locker;
import com.banking.service.LockerService;

//LockerController.java
@RestController
@RequestMapping("/lockers")
public class LockerController {
 private final LockerService lockerService;

 @Autowired
 public LockerController(LockerService lockerService) {
     this.lockerService = lockerService;
 }

 @GetMapping
 public List<Locker> getAllLockers(@RequestHeader(name = "Authorization") String token) throws InvalidAccessException {
     return lockerService.getAllLockers(token);
 }
 @PostMapping
 public Locker createLocker(@RequestHeader(name = "Authorization") String token,@RequestBody Locker locker) throws InvalidAccessException {
     return lockerService.createLocker(token,locker);
 }
 @GetMapping("/user/{userId}")
 public List<Locker> getLockersByUserId(@RequestHeader(name = "Authorization") String token,@PathVariable Long userId) throws InvalidAccessException {
     return lockerService.getLockersByUserId(token,userId);
 }

 @GetMapping("/available")
 public List<Locker> getAvailableLockers(@RequestHeader(name = "Authorization") String token) throws InvalidAccessException {
     return lockerService.getAvailableLockers(token);
 }

 @PostMapping("/assign")
 public Locker assignLockerToUser(@RequestHeader(name = "Authorization") String token,@RequestBody DeductLockerChargesRequest deductLockerChargesRequest) throws InvalidAccessException {
     return lockerService.assignLockerToUser(token,deductLockerChargesRequest);
 }

 @PostMapping("/{lockerId}/release")
 public Locker releaseLocker(@RequestHeader(name = "Authorization") String token,@PathVariable Long lockerId) throws InvalidAccessException {
     return lockerService.releaseLocker(token,lockerId);
 }

 @PostMapping("/{lockerId}/status")
 public Locker updateLockerStatus(@RequestHeader(name = "Authorization") String token,@PathVariable Long lockerId, @RequestParam boolean occupied) throws InvalidAccessException {
     return lockerService.updateLockerStatus(token,lockerId, occupied);
 }
   
 @GetMapping("/locker/{lockerNumber}")
 public List<Locker> getLockersByLockerNumber(@RequestHeader(name = "Authorization") String token,@PathVariable String lockerNumber) throws InvalidAccessException {
     return lockerService.getLockersByLockerNumber(token,lockerNumber);

}

}
