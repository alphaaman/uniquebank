package com.banking.dto;

public class ValidatingDTO {

    private boolean validStatus;
    private String userRole;
    private String customerId;

    public ValidatingDTO() {
    }

    public ValidatingDTO(boolean validStatus, String userRole, String customerId) {
        this.validStatus = validStatus;
        this.userRole = userRole;
        this.customerId = customerId;
    }

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

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
}
