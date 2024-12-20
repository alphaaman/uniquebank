package com.banking.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "statements")
public class Statement {

    @Id
    private String statementId;

    @Column
    private String accountId;

    @Column
    private Date statementDate;

    @Column
    private String narration;

    @Column
    private String refNo;

    @Column
    private double withdrawal;

    @Column
    private double deposit;

    @Column
    private double closingBalance;

    public Statement() {
    }

    public Statement(String statementId, String accountId, Date statementDate, String narration, String refNo,
            double withdrawal, double deposit, double closingBalance) {
        this.statementId = statementId;
        this.accountId = accountId;
        this.statementDate = statementDate;
        this.narration = narration;
        this.refNo = refNo;
        this.withdrawal = withdrawal;
        this.deposit = deposit;
        this.closingBalance = closingBalance;
    }

    public String getStatementId() {
        return statementId;
    }

    public void setStatementId(String statementId) {
        this.statementId = statementId;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public Date getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(Date statementDate) {
        this.statementDate = statementDate;
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
