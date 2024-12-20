package com.banking.service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.banking.dto.StatementDTO;
import com.banking.exceptions.InvalidAccessException;
import com.banking.model.Statement;

@Service
public interface StatementService {


	void writeStatement(String token,StatementDTO statement) throws InvalidAccessException;

	List<Statement> getAllStatements(String token, Date fromDate, Date toDate, String accountId) throws ParseException, InvalidAccessException;

	List<Statement> getAllStatements(String token, String fromDate, String toDate, String accountId)
			throws ParseException, InvalidAccessException;

	List<Statement> getAllStatementsOfAccount(String token, String accountId)
			throws ParseException, InvalidAccessException;

	

}