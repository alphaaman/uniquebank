package com.banking.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.model.RecurringDeposit;
@Repository
public interface RecurringDepositRepository extends JpaRepository<RecurringDeposit, Long> {
    // You can add custom query methods or use the default methods provided by JpaRepository
    // Example:
     List<RecurringDeposit> findByUserId(long userId);
}