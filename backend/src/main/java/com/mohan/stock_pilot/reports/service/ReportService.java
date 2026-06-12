package com.mohan.stock_pilot.reports.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mohan.stock_pilot.portfolio.dto.PortfolioPositionDto;
import com.mohan.stock_pilot.portfolio.dto.PortfolioResponseDto;
import com.mohan.stock_pilot.portfolio.service.PortfolioService;
import com.mohan.stock_pilot.wallet.entity.WalletTransaction;
import com.mohan.stock_pilot.wallet.service.impl.WalletServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;


import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final PortfolioService portfolioService;
    private final WalletServiceImpl walletService;

    public byte[] generatePortfolioPdf(UUID userId){
        PortfolioResponseDto portfolio=portfolioService.getPortfolio(userId);

        try(ByteArrayOutputStream boas= new ByteArrayOutputStream()){
            Document document=new Document(PageSize.A4);
            PdfWriter.getInstance(document, boas);
            document.open();

            addHeader(document);
            addPortfolioSummary(document, portfolio);
            addHoldingsTable(document, portfolio);

            document.close();

            return boas.toByteArray();
        }catch (Exception e){
            throw new RuntimeException(
                    "Failed to generate portfolio PDF", e);

        }
    }


    public void addHeader(Document document) throws DocumentException {
        com.lowagie.text.Font titleFont= FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                18
        );

        Paragraph title=new Paragraph("Stock Pilot Portfolio Statement",
                titleFont);

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph("Generated On: "+ LocalDateTime.now()));

        document.add(new Paragraph(" "));
    }

    public void addPortfolioSummary(Document document, PortfolioResponseDto portfolio) throws DocumentException{

        document.add(new Paragraph(
                "Invested Value: $ "+portfolio.totalInvested()/100.0
        ));

        document.add(new Paragraph(
                "Current Value: $ "+portfolio.totalCurrentValue()/100.0
        ));

        document.add(new Paragraph(
                "Total Profit and Loss : $ "+portfolio.totalPnl()/100.0
        ));

        document.add(new Paragraph(" "));

    }

    public void addHoldingsTable(
            Document document,
            PortfolioResponseDto portfolio
    ) throws DocumentException{
        PdfPTable table=new PdfPTable(7);

        table.setWidthPercentage(100);

        table.addCell("Symbol");
        table.addCell("Qty");
        table.addCell("Avg Price");
        table.addCell("Current");
        table.addCell("Invested");
        table.addCell("Value");
        table.addCell("P&L");

        for(PortfolioPositionDto holding:portfolio.positions()){
            table.addCell(holding.symbol());
            table.addCell(String.valueOf(holding.quantity()));
            table.addCell(String.valueOf(holding.avgPriceInCents()/100.0));
            table.addCell(String.valueOf(holding.currentPriceInCents()/100.0));
            table.addCell(String.valueOf(holding.invested()/100.0));
            table.addCell(String.valueOf(holding.currentValue()/100.0));
            table.addCell(String.valueOf(holding.pnlPercentage()));
        }

        document.add(table);



    }

    public byte[] generateWalletTransactionsExcel(
            UUID userId,
            LocalDate from,
            LocalDate to) {

        Instant start = from.atStartOfDay(ZoneOffset.UTC)
                .toInstant();

        Instant end = to.plusDays(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();

        List<WalletTransaction> trans =
                walletService.getWalletTxnCustom(
                        userId,
                        start,
                        end);

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet =
                    workbook.createSheet("Wallet Transactions");

            createHeader(workbook, sheet);

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern(
                                    "dd-MMM-yyyy HH:mm")
                            .withZone(ZoneId.systemDefault());

            int rowNum = 1;

            for (WalletTransaction tx : trans) {

                Row row = sheet.createRow(rowNum++);

                row.createCell(0)
                        .setCellValue(
                                formatter.format(
                                        tx.getCreatedAt()));

                row.createCell(1)
                        .setCellValue(
                                tx.getType().name());

                row.createCell(2)
                        .setCellValue(
                                tx.getAmount() / 100.0);

                row.createCell(3)
                        .setCellValue(
                                tx.getStatus().name());

                row.createCell(4)
                        .setCellValue(
                                tx.getReferenceId() == null
                                        ? ""
                                        : tx.getReferenceId());

                row.createCell(5)
                        .setCellValue(
                                tx.getDescription() == null
                                        ? ""
                                        : tx.getDescription());
            }

            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);

            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to generate excel report",
                    e);
        }
    }

    private void createHeader(
            Workbook workbook,
            Sheet sheet) {

        CellStyle style =
                workbook.createCellStyle();

        org.apache.poi.ss.usermodel.Font font =
                workbook.createFont();

        font.setBold(true);

        style.setFont(font);

        Row header = sheet.createRow(0);

        String[] columns = {
                "Date",
                "Type",
                "Amount ($)",
                "Status",
                "Reference ID",
                "Description"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell =
                    header.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(style);
        }
    }

}
