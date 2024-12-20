package com.banking.service.impl;
import com.banking.clients.UserClient;
import com.banking.dto.AtalPensionYojanaDTO;
import com.banking.dto.UserDTO;
import com.banking.model.Account;
import com.banking.model.AtalPensionYojana;
import com.banking.repository.AccountRepository;
import com.banking.repository.AtalPensionYojanaRepository;
import com.banking.service.AtalPensionYojanaService;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class AtalPensionYojanaServiceImpl implements AtalPensionYojanaService {
	@Autowired
	 AtalPensionYojanaRepository atalPensionYojanaRepository;
	
	@Autowired
    AccountRepository accountRepository;
	   
	@Autowired
	UserClient userClient;
	
	

	@Override
	public AtalPensionYojanaDTO createAtalPensionYojana(AtalPensionYojanaDTO atalPensionYojanaDTO) {
		System.out.println("hadajsa"+atalPensionYojanaDTO.getName());
	    AtalPensionYojana atalPensionYojana = new AtalPensionYojana();
	    BeanUtils.copyProperties(atalPensionYojanaDTO, atalPensionYojana);
	    atalPensionYojana.setStatus("PENDING"); // Set the status to "Pending"

	    Long userId = atalPensionYojana.getUserId();
	    UserDTO user = userClient.getUser(userId);
	    Optional<Account> fromAccount = accountRepository.findByUserId(userId);
	    Account fromBankAccount = fromAccount.get();
	    atalPensionYojana.setAccountNumber(fromBankAccount.getAccountId());

	    Date dateOfBirth = user.getDateOfBirth();
	    System.out.println("dateOf Birth"+dateOfBirth);
	    
	    LocalDate localDateOfBirth = dateOfBirth.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	    System.out.println("localdate"+localDateOfBirth);
	    int age = calculateAge(localDateOfBirth);
	    atalPensionYojana.setAge(age);

	    double monthlyIncome = atalPensionYojana.getMonthlyIncome();
	    int contributionPeriod = atalPensionYojana.getContributionPeriod();
	    double monthlyPensionPercentage = 0.3; // Assuming a fixed pension percentage of 30%

	    double monthlyPension = monthlyIncome * monthlyPensionPercentage;
//	    double totalPension = monthlyPension * contributionPeriod;

	    atalPensionYojana.setMonthlyPension(monthlyPension);
//	    atalPensionYojana.setMonthlyPension(totalPension);
	    LocalDate createdDate = LocalDate.now(); 
	    LocalDate maturityDate = createdDate.plusYears(contributionPeriod);
	    atalPensionYojana.setMaturityDate(maturityDate);
	    atalPensionYojana.setCreatedDate(createdDate);
	    AtalPensionYojana savedAtalPensionYojana = atalPensionYojanaRepository.save(atalPensionYojana);
	    AtalPensionYojanaDTO savedDTO = new AtalPensionYojanaDTO();
	    BeanUtils.copyProperties(savedAtalPensionYojana, savedDTO);
	    return savedDTO;
	}



	private int calculateAge(LocalDate dateOfBirth) {
	    LocalDate currentDate = LocalDate.now();
	    return Period.between(dateOfBirth, currentDate).getYears();
	}

		@Override
	    public AtalPensionYojanaDTO approveAtalPensionYojana(Long id) {
	        AtalPensionYojana atalPensionYojana = atalPensionYojanaRepository.findById(id)
	                .orElseThrow(() -> new IllegalArgumentException("Invalid AtalPensionYojana ID: " + id));

	        // Perform approval logic
	        atalPensionYojana.setStatus("ACTIVE");

	        AtalPensionYojana updatedAtalPensionYojana = atalPensionYojanaRepository.save(atalPensionYojana);
	        AtalPensionYojanaDTO updatedDTO = new AtalPensionYojanaDTO();
	        BeanUtils.copyProperties(updatedAtalPensionYojana, updatedDTO);
	        return updatedDTO;
	    }
		@Override
	    public AtalPensionYojanaDTO rejectAtalPensionYojana(Long id) {
	        AtalPensionYojana atalPensionYojana = atalPensionYojanaRepository.findById(id)
	                .orElseThrow(() -> new IllegalArgumentException("Invalid AtalPensionYojana ID: " + id));

	        // Perform rejection logic
	        atalPensionYojana.setStatus("REJECTED");

	        AtalPensionYojana updatedAtalPensionYojana = atalPensionYojanaRepository.save(atalPensionYojana);
	        AtalPensionYojanaDTO updatedDTO = new AtalPensionYojanaDTO();
	        BeanUtils.copyProperties(updatedAtalPensionYojana, updatedDTO);
	        return updatedDTO;
	    }
		@Override
		public List<AtalPensionYojana> getByUserId(long userId) {
return atalPensionYojanaRepository.findByUserId(userId);

		}
		
		@Override
		public List<AtalPensionYojana> getAll() {
return atalPensionYojanaRepository.findAll();

		}
		
}
