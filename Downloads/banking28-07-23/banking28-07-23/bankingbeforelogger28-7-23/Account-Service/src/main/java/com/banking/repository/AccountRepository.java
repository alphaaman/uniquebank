package com.banking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

	Optional<Account> findByUserId(Long id);
	Optional<Account> findByAccountId(String accountId);
    Optional<Account> findByAccountType(String accountType);
	
}