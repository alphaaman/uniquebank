package com.credit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.credit.model.*;


@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    // Custom query methods, if needed
	List<CreditCard> findByCardHolderName(String name);
}

