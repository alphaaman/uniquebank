package com.banking.controller;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.model.InvalidAccessException;
import com.banking.model.Loan;
import com.banking.pdfGenerator.PDFGenerator;
import com.banking.service.LoanServiceImpl;
import com.lowagie.text.DocumentException;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/loan")
public class LoanController {
	
	
	@Autowired
	LoanServiceImpl service;
	
	@PostMapping("/apply")
	public ResponseEntity<String>applyLoan(@RequestHeader(name = "Authorization") String token,@RequestBody Loan loan ) throws InvalidAccessException{
		System.out.println("loan:"+loan.getInterestRate());
		String status = service.applyLoan(token,loan);
		
		return new ResponseEntity<String>(status , HttpStatus.CREATED);
	}
	
	@PutMapping("/verify/{id}")
	public ResponseEntity<String> verifyLoan(@RequestHeader(name = "Authorization") String token, @PathVariable ("id") Long id ) throws InvalidAccessException{
		
		String status = service.verifyLoan(token,id);
		
		return new ResponseEntity<String>(status ,HttpStatus.OK);
		
	}
	
	@PutMapping("/approve/{id}")
	public ResponseEntity<String> approveLoan(@RequestHeader(name = "Authorization") String token, @PathVariable ("id") Long id ) throws InvalidAccessException{
		
		String status = service.approveLoan(token,id);
		
		return new ResponseEntity<String>(status ,HttpStatus.OK);
		
	}
	@PutMapping("/close/{id}")
	public ResponseEntity<String> closeLoan(@RequestHeader(name = "Authorization") String token, @PathVariable ("id") Long id ) throws InvalidAccessException{
		
		String status = service.completedLoanInstallment(token,id);
		
		return new ResponseEntity<String>(status ,HttpStatus.OK);
		
	}
	@PutMapping("/disburse/{id}")
	public ResponseEntity<String> disburseMoney( @RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id , @RequestBody Loan loan) throws InvalidAccessException{
		
		String status = service.disburseMoney(token,id,loan);
		
		return new ResponseEntity<String>(status ,HttpStatus.OK);
		
	}
	@GetMapping ("/pendingAmount/{id}")
	public ResponseEntity<String>pendingAmount(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id) throws InvalidAccessException{
		double pendingAmount = service.pendingAmount(token,id);
		return new ResponseEntity<String>("Your pending amount is " + pendingAmount , HttpStatus.OK);
	}
	
	@PutMapping("/updateMonths/{id}")
	public ResponseEntity<String>updateTenure(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id , int months) throws InvalidAccessException{
		Loan loan = service.ChangeTenure(token,id, months);
		return new ResponseEntity<String>("Your loan tenure has been updated to " + loan.getTermInMonths() + " and emi has been updated to "+ loan.getEmi() , HttpStatus.OK);
	}
	
	@PutMapping("/payEmi/{id}")
	public ResponseEntity<String>payMonthlyEmi(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id) throws InvalidAccessException{
		String message = service.payMonthlyEmi(token,id);
		return new ResponseEntity<String>(message, HttpStatus.ACCEPTED);
		
		
	}
	
	@PutMapping("/reject/{id}")
	public ResponseEntity<String> rejectLoan(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id) throws InvalidAccessException{
		
		String message = service.rejectLoan(token,id);
		
		return new ResponseEntity<String>(message,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/pendingEMI/{id}")
	public ResponseEntity<String> pendingEMI(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id) throws InvalidAccessException{
		
		int numberOfMonths = service.pendingEmi(token,id);
		
		return new ResponseEntity<String>("Still You have to pay " +  numberOfMonths + " dues." , HttpStatus.OK);
		
	}
	@GetMapping("/getLoanById/{id}")
	public ResponseEntity<Loan> getLoanById(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id) throws InvalidAccessException{
		
		return new ResponseEntity<Loan>(service.getLoanByID(token,id), HttpStatus.OK);
	}
	@GetMapping("/getLoanByUserId/{id}")
	public ResponseEntity<?> getLoanByUserId(@RequestHeader(name = "Authorization") String token,@PathVariable ("id") Long id) throws InvalidAccessException{
		
		return new ResponseEntity<>(service.getLoanByUserId(token,id), HttpStatus.OK);
	}
	@GetMapping("/get/all/loans")
	public ResponseEntity<?> getAccounts(@RequestHeader(name = "Authorization") String token
			) throws  InvalidAccessException {
		try {
			return new ResponseEntity<>(service.getAllLoans(token), HttpStatus.OK);
		} catch (InvalidAccessException e) {
			return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
		}
	}
	@PutMapping("/emiCalculator")
	public ResponseEntity<Integer> calculateEMI(@RequestHeader(name = "Authorization") String token,@RequestBody Loan loan) throws InvalidAccessException{
		int emi = service.calculateEmi(token,loan);
		
		return new ResponseEntity<Integer>(emi , HttpStatus.OK);
	}
	 @GetMapping("/pdf/loans")
		public void generatePdf(@RequestHeader(name = "Authorization") String token,HttpServletResponse response) throws DocumentException, IOException, java.io.IOException, InvalidAccessException {
			
			response.setContentType("application/pdf");
			DateFormat dateFormat = new SimpleDateFormat("YYYY-MM-DD:HH:MM:SS");
			String currentDateTime = dateFormat.format(new Date(00, 00, 00));
			String headerkey = "Content-Disposition";
			String headervalue = "attachment; filename=pdf_Loan_List" + currentDateTime + ".pdf";
			response.setHeader(headerkey, headervalue);
			
			List<Loan> loanList = service.getAllLoans(token);
			
			PDFGenerator generator = new PDFGenerator();
			 generator.setLoanList(loanList);
			generator.generate(response);

}
}
