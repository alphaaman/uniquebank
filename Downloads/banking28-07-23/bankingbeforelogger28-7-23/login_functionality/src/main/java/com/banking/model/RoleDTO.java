package com.banking.model;

import java.util.Set;
import java.util.HashSet;

public class RoleDTO {
    private long id;
    private String name;
    private String description;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
//    public static Set<Role> getRolesFromDto(Set<RoleDTO> roleDTOs) {
//        Set<Role> roles = new HashSet<>();
//
//        for (RoleDTO roleDTO : roleDTOs) {
//            Role role = new Role();
//            role.setId(roleDTO.getId());
//            role.setName(roleDTO.getName());
//            role.setDescription(roleDTO.getDescription());
//            roles.add(role);
//        }
//
//        return roles;
//    }
}
