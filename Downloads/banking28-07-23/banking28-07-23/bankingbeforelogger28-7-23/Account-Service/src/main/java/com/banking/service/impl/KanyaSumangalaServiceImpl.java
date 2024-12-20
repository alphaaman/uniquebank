package com.banking.service.impl;

import com.banking.dto.KanyaSumangalaDTO;
import com.banking.model.AtalPensionYojana;
import com.banking.model.FixedDeposit;
import com.banking.model.KanyaSumangala;
import com.banking.repository.KanyaSumangalaRepository;
import com.banking.service.KanyaSumangalaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class KanyaSumangalaServiceImpl implements KanyaSumangalaService {

	@Autowired
	KanyaSumangalaRepository kanyaSumangalaRepository;

	@Override
	public KanyaSumangala applyKanyaSumangala(KanyaSumangalaDTO kanyaSumangalaDTO) {
		KanyaSumangala kanyaSumangala = new KanyaSumangala();
		kanyaSumangala.setName(kanyaSumangalaDTO.getName());
		kanyaSumangala.setAddress(kanyaSumangalaDTO.getAddress());
		kanyaSumangala.setDaughterName(kanyaSumangalaDTO.getDaughterName());
		kanyaSumangala.setAge(kanyaSumangalaDTO.getAge());
		kanyaSumangala.setSchemeId(kanyaSumangalaDTO.getSchemeId());
		
//		kanyaSumangala.setMaturityDate(kanyaSumangalaDTO.getMaturityDate());
		 LocalDate maturityDate = LocalDate.now().plusYears(21 - kanyaSumangalaDTO.getAge());
		    kanyaSumangala.setMaturityDate(maturityDate);
		kanyaSumangala.setFatherName(kanyaSumangalaDTO.getFatherName());
		kanyaSumangala.setMotherName(kanyaSumangalaDTO.getMotherName());
		kanyaSumangala.setContactNumber(kanyaSumangalaDTO.getContactNumber());
		kanyaSumangala.setUserId(kanyaSumangalaDTO.getUserId());
		kanyaSumangala.setCreatedDate(LocalDate.now());
		kanyaSumangala.setStatus("PENDING");

		return kanyaSumangalaRepository.save(kanyaSumangala);
	}

	@Override
	public KanyaSumangala approveKanyaSumangala(Long id) {
		KanyaSumangala kanyaSumangala = kanyaSumangalaRepository.findById(id).orElse(null);
		if (kanyaSumangala != null) {
			kanyaSumangala.setStatus("ACTIVE");
			return kanyaSumangalaRepository.save(kanyaSumangala);
		}
		return null;
	}

	@Override
	public KanyaSumangala rejectKanyaSumangala(Long id) {
		KanyaSumangala kanyaSumangala = kanyaSumangalaRepository.findById(id).orElse(null);
		if (kanyaSumangala != null) {
			kanyaSumangala.setStatus("REJECTED");
			return kanyaSumangalaRepository.save(kanyaSumangala);
		}
		return null;
	}

	@Override
	public List<KanyaSumangala> getByUserId(long userId) {
		return kanyaSumangalaRepository.findByUserId(userId);

	}

	@Override
	public List<KanyaSumangala> getAll() {
		return kanyaSumangalaRepository.findAll();

	}
}
