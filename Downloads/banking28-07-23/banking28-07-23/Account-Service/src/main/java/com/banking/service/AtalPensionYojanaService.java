package com.banking.service;

import java.util.List;

import com.banking.dto.AtalPensionYojanaDTO;
import com.banking.model.AtalPensionYojana;

public interface AtalPensionYojanaService {

	AtalPensionYojanaDTO createAtalPensionYojana(AtalPensionYojanaDTO atalPensionYojanaDTO);

	AtalPensionYojanaDTO approveAtalPensionYojana(Long id);

	AtalPensionYojanaDTO rejectAtalPensionYojana(Long id);

	List<AtalPensionYojana> getByUserId(long userId);

	List<AtalPensionYojana> getAll();

}
