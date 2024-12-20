package com.banking.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.banking.clients.UserClient;
import com.banking.dto.StatementDTO;
import com.banking.dto.ValidatingDTO;
import com.banking.exceptions.InvalidAccessException;
import com.banking.model.Statement;
import com.banking.repository.StatementRepository;
import com.banking.service.StatementService;

@Service
public class StatementServiceImpl implements StatementService {

	@Autowired
	StatementRepository statementRepository;
	@Autowired
	UserClient userClient;

	@Override
	@Transactional
	public void writeStatement(String token, StatementDTO statement) throws InvalidAccessException {
		ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		if (validatingTokenResponse.isValidStatus()
				&& validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
			System.out.println("stament keander");
			String id = "STATEMENT" + statementRepository.count();
			statementRepository.save(new Statement(id, statement.getAccountId(), statement.getStatementDate(),
					statement.getNarration(), statement.getRefNo(), statement.getWithdrawal(), statement.getDeposit(),
					statement.getClosingBalance()));
			System.out.println("statement success");
		}

	}

	@Override
	@Transactional
	public List<Statement> getAllStatements(String token, String fromDate, String toDate, String accountId)
			throws ParseException, InvalidAccessException {
		ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		if (validatingTokenResponse.isValidStatus()
				&& validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			List<Statement> statementDateBetween = statementRepository
					.findByStatementDateBetween(dateFormat.parse(fromDate), dateFormat.parse(toDate));
			List<Statement> result = new ArrayList<>();
			for (Statement statement : statementDateBetween) {
				if (statement.getAccountId().equalsIgnoreCase(accountId)) {
					result.add(statement);
				}
			}
			return result;
		}
		throw new InvalidAccessException("Invalid Access");
	}

	@Override
	public List<Statement> getAllStatements(String token, Date fromDate, Date toDate, String accountId)
			throws ParseException, InvalidAccessException {
		ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		if (validatingTokenResponse.isValidStatus()
				&& validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
			List<Statement> statementDateBetween = statementRepository.findByStatementDateBetween(fromDate, toDate);
			List<Statement> result = new ArrayList<>();
			for (Statement statement : statementDateBetween) {
				if (statement.getAccountId().equalsIgnoreCase(accountId)) {
					result.add(statement);
				}
			}
			return result;
		}
		throw new InvalidAccessException("Invalid Access");
	}
	
	@Override
	public List<Statement> getAllStatementsOfAccount(String token,String accountId)
			throws ParseException, InvalidAccessException {
		ValidatingDTO validatingTokenResponse = userClient.validatingToken(token);
		if (validatingTokenResponse.isValidStatus()
				&& validatingTokenResponse.getUserRole().contains("ROLE_CUSTOMER")) {
			List<Statement> statement = statementRepository.findByAccountId(accountId);
			
			return statement;
		}
		throw new InvalidAccessException("Invalid Access");
	}

}