package com.mohan.stock_pilot.sip.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.security.CustomUserDetails;
import com.mohan.stock_pilot.sip.dto.CreateSipRequestDto;
import com.mohan.stock_pilot.sip.dto.SipResponseDto;
import com.mohan.stock_pilot.sip.dto.UpdateSipRequestDto;
import com.mohan.stock_pilot.sip.service.SipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sips")
@RequiredArgsConstructor
public class SipController {

    private final SipService sipService;

    @PostMapping
    public ResponseEntity<ApiResponse> createSip(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CreateSipRequestDto request
    ) {
        return ResponseEntity.ok(
                sipService.createSip(
                        user.getUserId(),
                        request
                )
        );
    }

    @GetMapping
    public ResponseEntity<SipResponseDto> getUserSips(
            @AuthenticationPrincipal CustomUserDetails user,
            @PageableDefault(
                    page = 0, size = 10, sort = "startDate",
                    direction = Sort.Direction.DESC) Pageable pageable
            ) {
        return ResponseEntity.ok(
                sipService.getUserSips(
                        pageable,
                        user.getUserId()
                )
        );
    }



    @PutMapping("/{sipId}")
    public ResponseEntity<ApiResponse> updateSip(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID sipId,
            @RequestBody UpdateSipRequestDto request
    ) {
        return ResponseEntity.ok(
                sipService.updateSip(
                        user.getUserId(),
                        sipId,
                        request
                )
        );
    }

    @PutMapping("/{sipId}/pause")
    public ResponseEntity<ApiResponse> pauseSip(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID sipId
    ) {
        return ResponseEntity.ok(
                sipService.pauseSip(
                        user.getUserId(),
                        sipId
                )
        );
    }

    @PutMapping("/{sipId}/resume")
    public ResponseEntity<ApiResponse> resumeSip(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID sipId
    ) {
        return ResponseEntity.ok(
                sipService.resumeSip(
                        user.getUserId(),
                        sipId
                )
        );
    }

    @PutMapping("/{sipId}/cancel")
    public ResponseEntity<ApiResponse> cancelSip(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID sipId
    ) {
        return ResponseEntity.ok(
                sipService.cancelSip(
                        user.getUserId(),
                        sipId
                )
        );
    }
}