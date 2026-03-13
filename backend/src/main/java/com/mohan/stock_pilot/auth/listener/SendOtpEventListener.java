package com.mohan.stock_pilot.auth.listener;

import com.mohan.stock_pilot.auth.event.SendOtpEvent;
import com.mohan.stock_pilot.common.notifications.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SendOtpEventListener {
    private final EmailService emailService;

    @Async("emailExecutor")
    @EventListener
    public void handleSendOtpEvent(SendOtpEvent event){
        emailService.sendOtpEmail(event.getEmail(),event.getOtp() );
    }
}
