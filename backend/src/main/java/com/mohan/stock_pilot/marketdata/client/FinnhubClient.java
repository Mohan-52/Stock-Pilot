package com.mohan.stock_pilot.marketdata.client;

import com.mohan.stock_pilot.marketdata.dto.FinnhubSymbolResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FinnhubClient {
    private final RestTemplate restTemplate;

    @Value("${finnhub.base-url}")
    private String baseUrl;

    @Value("${finnhub.api-key}")
    private String apiKey;

    public List<FinnhubSymbolResponseDto> getAllSymbols(String exchange){
        URI uri= UriComponentsBuilder
                .fromUriString(baseUrl)
                .path("/stock/symbol")
                .queryParam("exchange", exchange)
                .queryParam("token", apiKey)
                .build()
                .toUri();

        RequestEntity<Void> request=new RequestEntity<>(HttpMethod.GET, uri);

        return restTemplate.exchange(
                request,
                new ParameterizedTypeReference<List<FinnhubSymbolResponseDto>>() {
                }
        ).getBody();
    }
}
