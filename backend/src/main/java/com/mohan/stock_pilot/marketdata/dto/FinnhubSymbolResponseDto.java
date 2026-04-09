package com.mohan.stock_pilot.marketdata.dto;

import lombok.Data;

@Data
public class FinnhubSymbolResponseDto {
    private String currency;
    private String description;
    private String displaySymbol;
    private String figi;
    private String figiComposite;
    private String isin;
    private String mic;
    private String shareClassFIGI;
    private String symbol;
    private String symbol2;
    private String type;
}
