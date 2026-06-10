package com.mohan.stock_pilot.config;

import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.security.CustomUserDetailsService;
import com.mohan.stock_pilot.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );

            if (authHeader == null ||
                    !authHeader.startsWith("Bearer ")) {

                return message;
            }

            String jwt =
                    authHeader.substring(7);

            try {

                String email =
                        jwtUtil.extractEmail(jwt);

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(email);

                CustomUserDetails customUserDetails =
                        (CustomUserDetails) userDetails;


                if (jwtUtil.isTokenValid(
                        jwt,
                        userDetails
                )) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    customUserDetails.getUserId().toString(),
                                    null,
                                    userDetails.getAuthorities()
                            );

                    accessor.setUser(authentication);

                    log.info(
                            "WebSocket authenticated for user {}",
                            authentication.getName()
                    );
                }

            } catch (Exception ex) {

                log.error(
                        "WebSocket authentication failed",
                        ex
                );
            }
        }

        return message;
    }
}