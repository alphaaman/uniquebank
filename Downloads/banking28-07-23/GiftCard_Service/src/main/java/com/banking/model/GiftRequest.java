package com.banking.model;

public class GiftRequest {
    private String recipientName;
    private double giftAmount;
    private boolean deliverAtRegisteredAddress;
    private Long userId;

    public GiftRequest() {
        // Default constructor
    }

    public GiftRequest(String recipientName, double giftAmount, boolean deliverAtRegisteredAddress, Long userId) {
        this.recipientName = recipientName;
        this.giftAmount = giftAmount;
        this.deliverAtRegisteredAddress = deliverAtRegisteredAddress;
        this.userId = userId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public double getGiftAmount() {
        return giftAmount;
    }

    public void setGiftAmount(double giftAmount) {
        this.giftAmount = giftAmount;
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
