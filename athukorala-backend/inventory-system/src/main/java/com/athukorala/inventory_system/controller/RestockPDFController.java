package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.service.RestockMLService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/admin/ml")
public class RestockPDFController {

    @Autowired
    private RestockMLService mlService;

    @GetMapping("/restock-pdf")
    public void generatePDF(HttpServletResponse response) {
        try {
            // 📄 Setup response
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=restock_report.pdf");

            // 📊 Get ML data
            String json = mlService.generateRestockPlan();

            JSONArray data = new JSONArray(json);

            // 📄 Create PDF
            Document document = new Document();
            PdfWriter.getInstance(document, response.getOutputStream());

            document.open();

            // 🧾 Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Restock Report\n\n", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // 📋 Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            // Header
            table.addCell("Product Name");
            table.addCell("Quantity");

            // Data
            for (int i = 0; i < data.length(); i++) {
                JSONObject obj = data.getJSONObject(i);

                if (obj.getInt("restock") == 1) {
                    String productName = obj.getString("product_name");
                    double quantity = obj.getDouble("quantity");

                    table.addCell(productName);
                    table.addCell(String.valueOf(Math.round(quantity)));
                }
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}