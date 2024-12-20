package com.banking.service;

import com.banking.model.Account;
import com.banking.model.DeductGiftCardCharges;
import com.banking.model.GiftCard;
import com.banking.model.GiftRequest;
import com.banking.model.InvalidAccessException;
import com.banking.client.AccountClient;
import com.banking.client.TransactionClient;
import com.banking.dto.GiftCardDTO;
import com.banking.repository.GiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public interface GiftService {

    List<GiftCard> getAllGiftCards(String token)throws InvalidAccessException;

    List<GiftCard> getGiftCardByUserId(String token,Long userId)throws InvalidAccessException;

    GiftCardDTO createGiftCard(String token,GiftRequest giftRequest)throws InvalidAccessException;

    GiftCard getGiftCardsByGiftCardNumber(String token,String cardNumber)throws InvalidAccessException;

	GiftCardDTO addBalanceToGiftCard(String token, String cardNumber, double amount) throws InvalidAccessException;

	
}
