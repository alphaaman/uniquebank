package com.credit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.credit.exception.InsufficientBalanceException;
import com.credit.exception.InvalidAccessException;
import com.credit.model.CreditCard;
import com.credit.model.PurchaseRequest;
import com.credit.service.CreditCardService;

import java.util.List;

@RestController
@RequestMapping("/api/credit-cards")
public class CreditCardController {
	@Autowired
	private final CreditCardService creditCardService;

	@Autowired
	public CreditCardController(CreditCardService creditCardService) {
		this.creditCardService = creditCardService;
	}

	@PostMapping("/apply")
	public ResponseEntity<?> applyCreditCard(@RequestHeader(name = "Authorization") String token,
			@RequestBody CreditCard creditCard) throws InvalidAccessException {
		try {
			if (!isEligibleForCreditCard(creditCard)) {
				return new ResponseEntity<>("Not eligible for a credit card", HttpStatus.BAD_REQUEST);
			}

			CreditCard createdCreditCard = creditCardService.saveCreditCard(token, creditCard);
			return new ResponseEntity<>(createdCreditCard, HttpStatus.CREATED);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/purchase")
	public ResponseEntity<?> purchaseFromCreditCard(@RequestHeader(name = "Authorization") String token,
			@RequestBody PurchaseRequest purchaseRequest) throws InsufficientBalanceException, InvalidAccessException {
		try {
			CreditCard createdCreditCard = creditCardService.purchase(token, purchaseRequest);
			return new ResponseEntity<>(createdCreditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}

	}

	@PostMapping("/payment")
	public ResponseEntity<?> paymentOfCreditCard(@RequestHeader(name = "Authorization") String token,
			@RequestBody PurchaseRequest purchaseRequest) throws InsufficientBalanceException, InvalidAccessException {
		try {
			CreditCard createdCreditCard = creditCardService.payment(token, purchaseRequest);
			return new ResponseEntity<>(createdCreditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}

	}

	private boolean isEligibleForCreditCard(CreditCard creditCard) {

		if (creditCard.getAge() < 18 || creditCard.getAge() > 70) {
			return false;
		}
		if (creditCard.getIncome() < 20000) {
			return false;
		}

		return true;
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getCreditCardById(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long id) throws InvalidAccessException {
		try {
			CreditCard creditCard = creditCardService.getCreditCardById(token, id);
			return new ResponseEntity<>(creditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}
	@GetMapping("/cardholdername/{name}")
	public ResponseEntity<?> getCreditCardBYCardHolderName(@RequestHeader(name = "Authorization") String token,
			@PathVariable String name) throws InvalidAccessException {
		try {
			List<CreditCard> creditCard = creditCardService.getCreditCardByCardHolderName(token, name);
			return new ResponseEntity<>(creditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@GetMapping
	public ResponseEntity<List<CreditCard>> getAllCreditCards(@RequestHeader(name = "Authorization") String token) throws InvalidAccessException {
		List<CreditCard> creditCards = creditCardService.getAllCreditCards(token);
		return new ResponseEntity<>(creditCards, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateCreditCard(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long id, @RequestBody CreditCard creditCard) throws InvalidAccessException {
		try {
			CreditCard existingCreditCard = creditCardService.getCreditCardById(token, id);
			existingCreditCard.setCardNumber(creditCard.getCardNumber());
			existingCreditCard.setCardHolderName(creditCard.getCardHolderName());
			existingCreditCard.setExpiryDate(creditCard.getExpiryDate());
			existingCreditCard.setCvv(creditCard.getCvv());

			CreditCard updatedCreditCard = creditCardService.saveCreditCard(token, existingCreditCard);
			return new ResponseEntity<>(updatedCreditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCreditCard(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long id) throws InvalidAccessException {

		creditCardService.deleteCreditCardById(token, id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);

	}

	@PostMapping("/{id}/limit")
	public ResponseEntity<?> setCreditCardLimit(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long id, @RequestParam double limit) throws InvalidAccessException {
		try {
			CreditCard creditCard = creditCardService.setCreditCardLimit(token, id, limit);
			return new ResponseEntity<>(creditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping("/{id}/type")
	public ResponseEntity<?> setCreditCardType(@RequestHeader(name = "Authorization") String token,
			@PathVariable Long id, @RequestParam String cardType) throws InvalidAccessException {
		CreditCard creditCard;
		try {
			creditCard = creditCardService.setCreditCardType(token, id, cardType);
			return new ResponseEntity<>(creditCard, HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}

	}
	
	

//    @PostMapping("/{id}/payment")
//    public ResponseEntity<String> makePayment(@RequestHeader(name = "Authorization") String token,@PathVariable Long id, @RequestParam double amount, @RequestParam String paymentType) {
//        CreditCard creditCard = creditCardService.getCreditCardById(id);
//
//        if (creditCard == null) {
//            return new ResponseEntity<>("Credit card not found", HttpStatus.NOT_FOUND);
//        }
//
//        creditCard.setBalance(creditCard.getBalance() + amount);
//        creditCardService.saveCreditCard(creditCard);
//
//        return new ResponseEntity<>("Payment successful. Amount debited: " + amount, HttpStatus.OK);
//    }

//    @PostMapping("/{id}/monthly-payment")
//    public ResponseEntity<String> makeMonthlyPayment(@PathVariable Long id) {
//        CreditCard creditCard = creditCardService.getCreditCardById(id);
//
//        if (creditCard == null) {
//            return new ResponseEntity<>("Credit card not found", HttpStatus.NOT_FOUND);
//        }
//
//        double interestRate = creditCard.getInterestRate();
//        double paymentAmount = calculatePaymentAmount(creditCard.getBalance(), interestRate);
//
//        creditCard.setBalance(0.0);
//        creditCardService.saveCreditCard(creditCard);
//
//        return new ResponseEntity<>("Monthly payment successful. Amount paid: " + paymentAmount, HttpStatus.OK);
//    }
//
//    private double calculatePaymentAmount(double balance, double interestRate) {
//        double paymentAmount = balance;
//        if (balance > 0) {
//            double interestAmount = balance * (interestRate / 100);
//            paymentAmount += interestAmount;
//        }
//        return paymentAmount;
//    }
}
