package com.mohan.stock_pilot.common.exception;

public class InsufficientBalanceEx extends RuntimeException {
    public InsufficientBalanceEx(String message) {
        super(message);
    }
}
