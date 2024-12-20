package com.banking.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "gift_cards")
public class GiftCard {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "card_number")
	private String cardNumber;

	@Column(name = "gift_amount")
	private double giftAmount;

	@Column(name = "expiration_date")
	private LocalDate expirationDate;

	@Column(name = "recipient_name")
	private String recipientName;

	@Column(name = "pin_number")
	private String pinNumber;

	@Column(name = "issuance_fee")
	private double issuanceFee;

	@Column(name = "deliver_at_registered_address")
	private boolean deliverAtRegisteredAddress;

	@Column(name = "user_id")
	private Long userId;

	public GiftCard() {
		// Default constructor
	}

	public GiftCard(String cardNumber, double giftAmount, LocalDate expirationDate, String recipientName,
			String pinNumber, double issuanceFee, boolean deliverAtRegisteredAddress, Long userId) {
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
