package com.banking.model;

public class ValidatingDTO {
	
	private boolean validStatus;
	private String userRole;
	private Long customerId;
	public boolean isValidStatus() {
		return validStatus;
	}
	public void setValidStatus(boolean validStatus) {
		this.validStatus = validStatus;
	}
	public String getUserRole() {
		return userRole;
	}
	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}
	public Long getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}
	public ValidatingDTO(boolean validStatus, String userRole, Long customerId) {
		super();
		this.validStatus = validStatus;
		this.userRole = userRole;
		this.customerId = customerId;
	}
	public ValidatingDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

}
