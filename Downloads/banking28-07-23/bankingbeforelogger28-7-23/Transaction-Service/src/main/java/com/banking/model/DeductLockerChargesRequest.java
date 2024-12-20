package com.banking.model;

public class DeductLockerChargesRequest {
    private String fromAccountId;
    private int durationMonths;

    public DeductLockerChargesRequest() {
    }

    public DeductLockerChargesRequest(String fromAccountId, int durationMonths) {
        this.fromAccountId = fromAccountId;
        this.durationMonths = durationMonths;
    }

    public String getFromAccountId() {
        return fromAccountId;
    }

    public void setFromAccountId(String fromAccountId) {
        this.fromAccountId = fromAccountId;
    }

    public int getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(int durationMonths) {
        this.durationMonths = durationMonths;
    }
}
