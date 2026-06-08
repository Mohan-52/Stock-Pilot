package com.mohan.stock_pilot.sip.controller;

import com.mohan.stock_pilot.common.dto.ApiResponse;
import com.mohan.stock_pilot.sip.dto.SipExecutionHistoryResponse;
import com.mohan.stock_pilot.sip.service.SipExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sips")
public class SipExecutionController {
    private final SipExecutionService sipExecutionService;

    @GetMapping("/{sipId}/executions")
    public SipExecutionHistoryResponse getSipExecutions(@PathVariable UUID sipId, @PageableDefault(
                sort = "executionTime",
                direction = Sort.Direction.DESC)Pageable pageable){
        return sipExecutionService.getSipHistory(sipId, pageable);
    }


}
