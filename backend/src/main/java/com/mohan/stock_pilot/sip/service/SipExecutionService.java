package com.mohan.stock_pilot.sip.service;

import com.mohan.stock_pilot.common.exception.InsufficientBalanceEx;
import com.mohan.stock_pilot.common.exception.ResourceNotFoundEx;
import com.mohan.stock_pilot.marketdata.entity.Instrument;
import com.mohan.stock_pilot.marketdata.repository.InstrumentRepository;
import com.mohan.stock_pilot.marketdata.service.MarketDataService;
import com.mohan.stock_pilot.orders.dto.BuyOrderRequestDto;
import com.mohan.stock_pilot.orders.service.OrderService;
import com.mohan.stock_pilot.sip.dto.SipExecutionDto;
import com.mohan.stock_pilot.sip.dto.SipExecutionHistoryResponse;
import com.mohan.stock_pilot.sip.entity.Sip;
import com.mohan.stock_pilot.sip.entity.SipExecution;
import com.mohan.stock_pilot.sip.repository.SipExecutionRepository;
import com.mohan.stock_pilot.sip.repository.SipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SipExecutionService {
    private final SipRepository sipRepo;
    private final SipExecutionRepository sipExecutionRepo;
    private final InstrumentRepository instrumentRepo;
    private final MarketDataService marketDataService;
    private final OrderService orderService;
    private final SipExecutionWriter sipExecutionWriter;


    private Sip getSip(UUID sipId) {
        return sipRepo.findById(sipId)
                .orElseThrow(() ->
                        new ResourceNotFoundEx(
                                "Sip not found with id " + sipId
                        ));
    }

    public SipExecutionHistoryResponse getSipHistory(UUID sipId, Pageable pageable){
        Page<SipExecution> sipExecutions=sipExecutionRepo.findBySipIdOrderByExecutionTimeDesc(sipId, pageable);

        List<SipExecutionDto> content=sipExecutions
                .getContent()
                .stream()
                .map(this::mapToExecutionDto)
                .toList();

        return new SipExecutionHistoryResponse(
                content,
                sipExecutions.getNumber(),
                sipExecutions.getSize(),
                sipExecutions.getTotalElements(),
                sipExecutions.getTotalPages(),
                sipExecutions.isLast()
        );
    }

    private SipExecutionDto mapToExecutionDto(SipExecution sipExecution){

        return new SipExecutionDto(
                sipExecution.getExecutionTime(),
                sipExecution.getStockPrice(),
                sipExecution.getQuantity(),
                sipExecution.getInvestedAmount(),
                sipExecution.getStatus(),
                sipExecution.getFailureReason()
        );

    }


    private Instrument getInstrument(Sip sip) {
        return instrumentRepo.findById(
                        sip.getInstrumentId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundEx(
                                "Instrument not found"
                        ));
    }

    private long calculateQuantity(
            long amountPerCycle,
            long stockPrice
    ) {
        return amountPerCycle / stockPrice;
    }


    public void executeSip(UUID sipId) {
        Sip sip = getSip(sipId);
        long stockPrice = 0;
        Instrument instrument= getInstrument(sip);


        try {
            stockPrice =
                    marketDataService.getPriceInCents(
                            instrument.getSymbol()
                    );

            if (stockPrice <= 0) {

                sipExecutionWriter.recordFailureAndAdvance(
                        sip.getUserId(),
                        instrument.getName(),
                        sip.getId(),
                        0,
                        "INVALID_STOCK_PRICE"
                );

                return;
            }

            long quantity =
                    calculateQuantity(
                            sip.getAmountPerCycle(),
                            stockPrice
                    );

            if (quantity <= 0) {

                sipExecutionWriter.recordFailureAndAdvance(
                        sip.getUserId(),
                        instrument.getName(),
                        sip.getId(),
                        stockPrice,
                        "AMOUNT_PER_CYCLE_TOO_LOW"
                );

                return;
            }

            orderService.placeBuyOrder(
                    sip.getUserId(),
                    new BuyOrderRequestDto(
                            instrument.getSymbol(),
                            quantity
                    )
            );

            sipExecutionWriter.recordSuccessAndAdvance(
                    sip.getUserId(),
                    instrument.getName(),
                    sip.getId(),
                    stockPrice,
                    quantity,
                    quantity * stockPrice
            );

        }
        catch (InsufficientBalanceEx ex) {

                sipExecutionWriter.recordFailureAndAdvance(
                        sip.getUserId(),
                        instrument.getName(),
                        sip.getId(),
                        0,
                        "INSUFFICIENT_FUNDS"
                );

        }
        catch (ResourceNotFoundEx ex) {

            log.warn(
                    "Required resource was unavailable while executing SIP {}: {}",
                    sip.getId(),
                    ex.getMessage()
            );

            sipExecutionWriter.recordFailureAndAdvance(
                    sip.getUserId(),
                    instrument.getName(),
                    sip.getId(),
                    stockPrice,
                    ex.getMessage() != null &&
                            ex.getMessage().contains("Price not available")
                            ? "PRICE_NOT_AVAILABLE"
                            : "RESOURCE_NOT_FOUND"
            );

        }
        catch (Exception ex) {

            log.error(
                    "Failed to execute SIP {}",
                    sip.getId(),
                    ex
            );

            sipExecutionWriter.recordFailureAndAdvance(
                    sip.getUserId(),
                    instrument.getName(),
                    sip.getId(),
                    stockPrice,
                    "ORDER_EXECUTION_FAILED"
            );
        }
    }

}
