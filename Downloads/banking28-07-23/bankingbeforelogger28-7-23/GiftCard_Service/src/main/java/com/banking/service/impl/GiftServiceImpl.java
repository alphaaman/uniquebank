package com.banking.service.impl;

import com.banking.client.AccountClient;
import com.banking.client.TransactionClient;
import com.banking.client.UserClient;
import com.banking.dto.GiftCardDTO;
import com.banking.model.OneWayTransactionDTO;
import com.banking.model.Account;
import com.banking.model.DeductGiftCardCharges;
import com.banking.model.GiftCard;
import com.banking.model.GiftRequest;
import com.banking.model.InvalidAccessException;
import com.banking.repository.GiftRepository;
import com.banking.service.GiftService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class GiftServiceImpl implements GiftService {

    private final GiftRepository giftRepository;
    private final TransactionClient transactionClient;
    private final AccountClient accountClient;
    private final UserClient userClient;

    @Autowired
    public GiftServiceImpl(GiftRepository giftRepository, TransactionClient transactionClient, AccountClient accountClient,UserClient userClient) {
        this.giftRepository = giftRepository;
        this.transactionClient = transactionClient;
        this.accountClient = accountClient;
        this.userClient =userClient;
    }

    @Override
    public List<GiftCard> getAllGiftCards(String token)throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        return giftRepository.findAll();
        }
        throw new InvalidAccessException();
    }

    @Override
    public List<GiftCard> getGiftCardByUserId(String token,Long userId) throws InvalidAccessException{
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_CUSTOMER")) {
        return giftRepository.findByUserId(userId);
        }
        throw new InvalidAccessException();
    }

    @Override
    public GiftCardDTO createGiftCard(String token,GiftRequest giftRequest)throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        double issuanceFee = calculateIssuanceFee(giftRequest.getGiftAmount());
        String pinNumber = generatePinNumber();
        String cardNumber = generateUniqueCardNumber();
        LocalDate expirationDate = LocalDate.now().plusYears(1);
        GiftCard giftCard = new GiftCard(cardNumber, giftRequest.getGiftAmount(), expirationDate,
                giftRequest.getRecipientName(), pinNumber, issuanceFee, giftRequest.isDeliverAtRegisteredAddress(),
                giftRequest.getUserId());
        GiftCard savedGiftCard = giftRepository.save(giftCard);
        System.out.println(savedGiftCard+"savedgift");
        assignGiftCard(token,giftRequest.getUserId(), giftRequest.getGiftAmount(), issuanceFee);
        System.out.println("assigngift succesful");
        GiftCardDTO dto=mapToGiftCardDTO(savedGiftCard);
        System.out.println("mapToGiftCardDTO(savedGiftCard)"+dto);
        return dto;
    
        }
        throw new InvalidAccessException();
    }

    private double calculateIssuanceFee(double giftAmount) {
        double issuanceFee = 118.0;

        if (giftAmount > 4000.0) {
            issuanceFee = 0.0;
        }

        return issuanceFee;
    }

    private String generatePinNumber() {
        Random random = new Random();
        int pin = 100000 + random.nextInt(900000);
        return String.valueOf(pin);
    }

    private String generateUniqueCardNumber() {
        String cardNumber = "";
        Random random = new Random();

        for (int i = 0; i < 16; i++) {
            int digit = random.nextInt(10);
            cardNumber += String.valueOf(digit);
        }

        return cardNumber;
    }

    private GiftCardDTO mapToGiftCardDTO(GiftCard giftCard) {
        GiftCardDTO giftCardDTO = new GiftCardDTO();
        giftCardDTO.setId(giftCard.getId());
        giftCardDTO.setCardNumber(giftCard.getCardNumber());
        giftCardDTO.setGiftAmount(giftCard.getGiftAmount());
        giftCardDTO.setExpirationDate(giftCard.getExpirationDate());
        giftCardDTO.setRecipientName(giftCard.getRecipientName());
        giftCardDTO.setPinNumber(giftCard.getPinNumber());
        giftCardDTO.setUserId(giftCard.getUserId());
        giftCardDTO.setIssuanceFee(giftCard.getIssuanceFee());

        return giftCardDTO;
    }

    @Override
    public GiftCard getGiftCardsByGiftCardNumber(String token,String cardNumber) throws InvalidAccessException{
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        return giftRepository.findByCardNumber(cardNumber);
        }
        throw new InvalidAccessException();
    }

    @Override
    public GiftCardDTO addBalanceToGiftCard(String token,String cardNumber, double amount)throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        GiftCard giftCard = giftRepository.findByCardNumber(cardNumber);

        if (giftCard != null) {
        	Account account=accountClient.getCustomerAccounts(token,giftCard.getUserId());
        	transactionClient.withdraw(token,new OneWayTransactionDTO(account.getAccountId(),"ADDED BALANCE TO GIFTCARD", "CASH", amount));
            double currentBalance = giftCard.getGiftAmount();
            double updatedBalance = currentBalance + amount;
            giftCard.setGiftAmount(updatedBalance);
            GiftCard savedGiftCard = giftRepository.save(giftCard);
            return mapToGiftCardDTO(savedGiftCard);
        }

        return null;
        }
        throw new InvalidAccessException();
    }

    public void assignGiftCard(String token ,Long userId, double giftAmount, double issuanceFee) throws InvalidAccessException {
    	String userRoles = userClient.validatingToken(token).getUserRole();
        if (userRoles.contains("ROLE_EMPLOYEE")) {
        Account fromAccount = accountClient.getCustomerAccounts(token,userId);
        double finalAmount = giftAmount;

        if (giftAmount <= 4000.0) {
            finalAmount += issuanceFee;
        }

        DeductGiftCardCharges deductGiftCardCharges = new DeductGiftCardCharges(fromAccount.getAccountId(), finalAmount);
        System.out.println("transaction gift charge sartesd ");

        transactionClient.giftCharge(token,deductGiftCardCharges);
        System.out.println("transaction gift charge deducted ");
    }
 
    }
}
