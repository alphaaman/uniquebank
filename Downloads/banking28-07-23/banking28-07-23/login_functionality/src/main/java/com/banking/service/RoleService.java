package com.banking.service;

import com.banking.model.Role;

public interface RoleService {
    Role findByName(String name);
}
