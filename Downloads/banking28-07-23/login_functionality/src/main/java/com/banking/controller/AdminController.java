package com.banking.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.banking.config.TokenProvider;
import com.banking.model.AuthToken;
import com.banking.model.LoginUser;
import com.banking.model.User;
import com.banking.model.UserDTO;
import com.banking.model.ValidatingDTO;
import com.banking.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;
    @Autowired
    private UserService userService;
    private ValidatingDTO dto = new ValidatingDTO();


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

    @RequestMapping(value = "/add/manager", method = RequestMethod.POST)
    public User addManager(@RequestBody UserDTO user) {
        return userService.createManager(user);
    }

    @RequestMapping(value = "/update/manager", method = RequestMethod.POST)
    public User updateManager(@RequestBody UserDTO user) {
        return userService.updateManager(user);
    }

    @GetMapping("/get/manager/{managerId}")
    public User getManagerById(@PathVariable Long managerId) {
        return userService.getManagerById(managerId);
    }
    @GetMapping("/get/user/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @DeleteMapping("delete/manager/{managerId}")
    public void deleteManager(@PathVariable Long managerId) {
        userService.deleteManagerById(managerId);
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

    @DeleteMapping("/delete/employee/{employeeId}")
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

    @RequestMapping(value = "/update/admin", method = RequestMethod.POST)
    public User updateAdmin(@RequestBody UserDTO user) {
        return userService.updateAdmin(user);
    }

    @GetMapping("/get/admin/{adminId}")
    public User getAdminById(@PathVariable Long adminId) {
        return userService.getAdminById(adminId);
    }

    @DeleteMapping("/delete/admin/{adminId}")
    public void deleteAdmin(@PathVariable Long adminId) {
        userService.deleteAdminById(adminId);
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userService.getCustomerById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validatingToken(@RequestHeader(name = "Authorization") String token) {
        String tokenDup = token.substring(7);
        try {
            UserDetails user = userService.loadUserByUsername(jwtTokenUtil.getUsernameFromToken(tokenDup));
//            Set<String> roles = user.getAuthorities().stream()
//                    .map(GrantedAuthority::getAuthority)
//                    .collect(Collectors.toSet());
			String role = user.getAuthorities().stream().map(Object::toString).collect(Collectors.joining(","));

            if (jwtTokenUtil.validateToken(tokenDup, user)) {
//                userDTO.setUserRole(roles);
            	dto.setValidStatus(true);
				dto.setUserRole(role);
				dto.setCustomerId(userService.findOne(user.getUsername()).getId());
                return new ResponseEntity<>(dto, HttpStatus.OK);
            }
            
            return new ResponseEntity<>("TOKEN_INVALID_OR_EXPIRED", HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("INVALID_TOKEN", HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> userList = userService.findAll();
        return ResponseEntity.ok(userList);
    }
    
    @GetMapping("/not/Admin")
    public ResponseEntity<List<User>> getNotAdmin() {
        List<User> userList = userService.getNotAdmins();
        return ResponseEntity.ok(userList);
    }
}
