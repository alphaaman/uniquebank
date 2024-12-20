package com.banking.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.banking.model.User;
import com.banking.model.UserDTO;

public interface UserService {
    ResponseEntity<?> save(UserDTO user);

    User createManager(UserDTO user);

    User getManagerById(long managerId);

    User updateManager(UserDTO user);

    String deleteManagerById(Long managerId);

    User createEmployee(UserDTO user);

    User getEmployeeById(long user);

    User updateEmployee(UserDTO user);

    String deleteEmployeeById(Long employeeId);

    // User createCustomer(UserDTO user);
    User getCustomerById(long user);

    User updateCustomer(UserDTO user);

    String deleteCustomerById(Long employeeId);

    User getAdminById(long user);

    User updateAdmin(UserDTO user);

    String deleteAdminById(Long adminId);

    List<User> findAll();

    User findOne(String username);
    
    public UserDetails loadUserByUsername(String username);

	boolean markAccountCreated(Long id);

	List<User> getNotAdmins();

	List<User> getNotAdminManager();

	List<User> getOnlyCustomer();

	User getUserByUsername(String username) throws UsernameNotFoundException;

	User getUserByEmail(String email) throws UsernameNotFoundException;

	User updateUserPassword(UserDTO user);

    
}
