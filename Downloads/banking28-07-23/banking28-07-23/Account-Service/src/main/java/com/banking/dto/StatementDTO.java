package com.banking.dto;
import java.util.Date;

public class StatementDTO {

    private Date statementDate;
    private String accountId;
    private String narration;
    private String refNo;
    private double withdrawal;
    private double deposit;
    private double closingBalance;

    public StatementDTO() {
    }

    public StatementDTO(Date statementDate, String accountId, String narration, String refNo, double withdrawal, double deposit, double closingBalance) {
        this.statementDate = statementDate;
        this.accountId = accountId;
        this.narration = narration;
        this.refNo = refNo;
        this.withdrawal = withdrawal;
        this.deposit = deposit;
        this.closingBalance = closingBalance;
    }

    public Date getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(Date statementDate) {
        this.statementDate = statementDate;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(String narration) {
        this.narration = narration;
    }

    public String getRefNo() {
        return refNo;
    }

    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }

    public double getWithdrawal() {
        return withdrawal;
    }

    public void setWithdrawal(double withdrawal) {
        this.withdrawal = withdrawal;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    public double getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(double closingBalance) {
        this.closingBalance = closingBalance;
    }
}
