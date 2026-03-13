package com.mohan.stock_pilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef= "auditorAwareImpl")
@EnableAsync
public class StockPilotApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockPilotApplication.class, args);
	}

}
