package com.banking.dto;
public class ValidatingDTO {
    private boolean validStatus;
    private String userRole;
    private Long userId;

    public ValidatingDTO() {
        // Default constructor
    }

    public ValidatingDTO(boolean validStatus, String userRole, Long userId) {
        this.validStatus = validStatus;
        this.userRole = userRole;
        this.userId = userId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
