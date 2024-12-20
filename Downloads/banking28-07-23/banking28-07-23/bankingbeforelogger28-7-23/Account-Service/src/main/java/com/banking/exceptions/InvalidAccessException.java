package com.banking.exceptions;

public class InvalidAccessException extends Exception {
    private static final long serialVersionUID = -2863393708464979152L;

    public InvalidAccessException() {
        super();
    }

    public InvalidAccessException(String message) {
        super(message);
    }
}
