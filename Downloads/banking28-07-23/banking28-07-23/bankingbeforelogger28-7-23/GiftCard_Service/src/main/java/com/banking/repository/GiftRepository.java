package com.banking.repository;

import com.banking.model.GiftCard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftRepository extends JpaRepository<GiftCard, Long> {

	List<GiftCard> findByUserId(Long userId);

	GiftCard findByCardNumber(String cardNumber);
   
}
