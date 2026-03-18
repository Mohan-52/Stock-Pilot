package com.mohan.stock_pilot.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/api/test")
    public String testAuthFilter(){
        return "Auth filters are working";
    }
}
