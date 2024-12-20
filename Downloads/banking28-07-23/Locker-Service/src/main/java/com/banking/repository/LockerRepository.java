package com.banking.repository;


import com.banking.model.Locker;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LockerRepository extends JpaRepository<Locker, Long> {

	List<Locker> findByUserId(Long userId);
	
	List<Locker> findByLockerNumber(String lockerNumber);

	List<Locker> findByOccupiedFalse();
	

}
