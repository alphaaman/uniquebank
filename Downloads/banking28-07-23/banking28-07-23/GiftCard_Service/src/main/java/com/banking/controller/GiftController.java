package com.banking.controller;

import com.banking.dto.GiftCardDTO;
import com.banking.model.GiftCard;
import com.banking.model.GiftRequest;
import com.banking.model.InvalidAccessException;
import com.banking.service.GiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gift")
public class GiftController {

	@Autowired
	GiftService giftService;

	@GetMapping
	public ResponseEntity<?> getAllGiftCards(@RequestHeader(name = "Authorization") String token)
			throws InvalidAccessException {

		try {
			List<GiftCard> giftCards = giftService.getAllGiftCards(token);

			return new ResponseEntity<>(giftCards, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> getGiftCardsByUserId(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long userId) throws InvalidAccessException {
		try {
			List<GiftCard> giftCards = giftService.getGiftCardByUserId(token, userId);
			return new ResponseEntity<>(giftCards, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@GetMapping("/{cardNumber}")
	public ResponseEntity<?> getGiftCardByCardNumber(@RequestHeader(name = "Authorization") String token,
			@PathVariable String cardNumber) throws InvalidAccessException {
		try {
			GiftCard giftCard = giftService.getGiftCardsByGiftCardNumber(token, cardNumber);
			if (giftCard != null) {
				return new ResponseEntity<>(giftCard, HttpStatus.OK);
			}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping
	public ResponseEntity<?> createGiftCard(@RequestHeader(name = "Authorization") String token,
			@RequestBody GiftRequest giftRequest) throws InvalidAccessException {

		try {
			GiftCardDTO createdGiftCard = giftService.createGiftCard(token, giftRequest);

			return new ResponseEntity<>(createdGiftCard, HttpStatus.CREATED);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/{cardNumber}/balance")
	public ResponseEntity<?> addBalanceToGiftCard(@RequestHeader(name = "Authorization") String token,
			@PathVariable String cardNumber, @RequestParam double amount) throws InvalidAccessException {
		try {
			GiftCardDTO updatedGiftCard = giftService.addBalanceToGiftCard(token, cardNumber, amount);
			if (updatedGiftCard != null) {
				return new ResponseEntity<>(updatedGiftCard, HttpStatus.OK);
			}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}
}
