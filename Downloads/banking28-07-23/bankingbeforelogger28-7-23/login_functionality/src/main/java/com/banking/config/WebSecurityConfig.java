package com.banking.config;
import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Resource(name = "userService")
    private UserDetailsService userDetailsService;

    @Autowired
    private UnauthorizedEntryPoint unauthorizedEntryPoint;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers("/admin/get/manager/{managerId}", "/admin/add/manager", "/admin/update/manager",
                        "/admin/delete/manager/{managerId}",
                        "/admin/add/employee", "/admin/update/employee", "/admin/get/employee/{employeeId}",
                        "/admin/delete/employee/{employeeId}",
                        "/admin/add/customer", "/admin/update/customer", "/admin/get/customer/{customerId}",
                        "/admin/delete/customer/{customerId}",
                        "/admin/update/admin", "/admin/get/admin/{adminId}", "/admin/delete/admin/{adminId}")
                .hasRole("ADMIN")
                .antMatchers("/manager/update/employee", "/manager/get/employee/{employeeId}",
                        "/manager/delete/employee/{employeeId}",
                        "/manager/add/customer", "/manager/update/customer", "/manager/get/customer/{customerId}",
                        "/manager/delete/customer/{customerId}").hasRole("MANAGER")
                .antMatchers("/employee/add/customer", "/employee/update/customer", "/employee/get/customer/{customerId}",
                        "/employee/delete/customer/{customerId}")
                .hasRole("EMPLOYEE")
                .antMatchers("/customer/update/customer","/users/all","/users/{id}").hasRole("CUSTOMER")
                .anyRequest().permitAll()
                .and()
                .exceptionHandling().authenticationEntryPoint(unauthorizedEntryPoint).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public JwtAuthenticationFilter authenticationTokenFilterBean() {
        return new JwtAuthenticationFilter();
    }
}
