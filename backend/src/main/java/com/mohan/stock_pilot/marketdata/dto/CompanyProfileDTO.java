package com.mohan.stock_pilot.marketdata.dto;

import lombok.Data;

@Data
public class CompanyProfileDTO {

    private String country;
    private String currency;
    private String exchange;
    private String finnhubIndustry;

    private String ipo;
    private String logo;
    private Double marketCapitalization;

    private String name;
    private String phone;
    private Double shareOutstanding;

    private String ticker;
    private String weburl;
}