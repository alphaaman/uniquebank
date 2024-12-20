package com.banking.service;



import java.util.List;

import com.banking.dto.KanyaSumangalaDTO;
import com.banking.model.KanyaSumangala;

public interface KanyaSumangalaService {
   

	KanyaSumangala rejectKanyaSumangala(Long id);

	KanyaSumangala approveKanyaSumangala(Long id);

	KanyaSumangala applyKanyaSumangala(KanyaSumangalaDTO kanyaSumangalaDTO);

	List<KanyaSumangala> getByUserId(long userId);

	List<KanyaSumangala> getAll();
}