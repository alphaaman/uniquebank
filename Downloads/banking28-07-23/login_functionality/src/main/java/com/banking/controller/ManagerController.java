package com.banking.controller;

import java.util.List;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.banking.config.TokenProvider;
import com.banking.model.AuthToken;
import com.banking.model.LoginUser;
import com.banking.model.User;
import com.banking.model.UserDTO;
import com.banking.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/manager")
public class ManagerController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> generateToken(@RequestBody LoginUser loginUser) throws AuthenticationException {

        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUser.getUsername(),
                        loginUser.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtTokenUtil.generateToken(authentication);
        return ResponseEntity.ok(new AuthToken(token));
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> saveUser(@RequestBody UserDTO user) {
        return userService.save(user);
    }
    
    @RequestMapping(value = "/add/employee", method = RequestMethod.POST)
    public User addEmployee(@RequestBody UserDTO user) {
        return userService.createEmployee(user);
    }

    @RequestMapping(value = "/update/employee", method = RequestMethod.POST)
    public User updateEmployee(@RequestBody UserDTO user) {
        return userService.updateEmployee(user);
    }

    @GetMapping("/get/employee/{employeeId}")
    public User getEmployeeById(@PathVariable Long employeeId) {
        return userService.getEmployeeById(employeeId);
    }

    @DeleteMapping("delete/employee/{employeeId}")
    public void deleteEmployee(@PathVariable Long employeeId) {
        userService.deleteEmployeeById(employeeId);
    }

    @RequestMapping(value = "/add/customer", method = RequestMethod.POST)
    public ResponseEntity<?> addCustomer(@RequestBody UserDTO user) {
        return userService.save(user);
    }

    @RequestMapping(value = "/update/customer", method = RequestMethod.POST)
    public User updateCustomer(@RequestBody UserDTO user) {
        return userService.updateCustomer(user);
    }

    @GetMapping("/get/customer/{customerId}")
    public User getCustomerById(@PathVariable Long customerId) {
        return userService.getCustomerById(customerId);
    }

    @DeleteMapping("delete/customer/{customerId}")
    public void deleteCustomer(@PathVariable Long customerId) {
        userService.deleteCustomerById(customerId);
    }
    @GetMapping("/not/Manager")
    public ResponseEntity<List<User>> getNotAdminAndManager() {
        List<User> userList = userService.getNotAdminManager();
        return ResponseEntity.ok(userList);
    }
}
