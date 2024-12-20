package com.banking.dto;


import java.time.LocalDate;
public class GiftCardDTO {
    private Long id;
    private String cardNumber;
    private double giftAmount;
    private LocalDate expirationDate;
    private String recipientName;
    private String pinNumber;
    private double issuanceFee;
    private boolean deliverAtRegisteredAddress;
    private Long userId;

    public GiftCardDTO() {
        // Default constructor
    }

    public GiftCardDTO(Long id, String cardNumber, double giftAmount, LocalDate expirationDate, String recipientName, String pinNumber,  double issuanceFee, boolean deliverAtRegisteredAddress, Long userId) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.giftAmount = giftAmount;
        this.expirationDate = expirationDate;
        this.recipientName = recipientName;
        this.pinNumber = pinNumber;
        this.issuanceFee = issuanceFee;
        this.deliverAtRegisteredAddress = deliverAtRegisteredAddress;
        this.userId = userId;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public double getGiftAmount() {
        return giftAmount;
    }

    public void setGiftAmount(double giftAmount) {
        this.giftAmount = giftAmount;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getPinNumber() {
        return pinNumber;
    }

    public void setPinNumber(String pinNumber) {
        this.pinNumber = pinNumber;
    }

    public double getIssuanceFee() {
        return issuanceFee;
    }

    public void setIssuanceFee(double issuanceFee) {
        this.issuanceFee = issuanceFee;
    }

    public boolean isDeliverAtRegisteredAddress() {
        return deliverAtRegisteredAddress;
    }

    public void setDeliverAtRegisteredAddress(boolean deliverAtRegisteredAddress) {
        this.deliverAtRegisteredAddress = deliverAtRegisteredAddress;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
