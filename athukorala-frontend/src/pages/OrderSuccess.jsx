import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Download, Home, MapPin, Phone } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderSuccess = () => {
  const navigate = useNavigate();

  // ✅ GET DATA FROM LOCALSTORAGE
  const storedData = localStorage.getItem("orderData");
  const orderData = storedData
    ? JSON.parse(storedData)
    : {
        id: "ORD-UNKNOWN",
        total: 0,
        phone: "N/A",
        address: "N/A",
        items: [], 
      };

  // 🔥 PREMIUM PDF GENERATOR
  const generateInvoice = () => {
    try {
      const doc = new jsPDF();
      const goldColor = [212, 175, 55]; // #D4AF37
      const darkBg = [10, 10, 10]; 

      // 1. Header Section (Dark Theme matching Inventory Style)
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, 210, 50, "F");

      doc.setTextColor(...goldColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("ATHUKORALA TRADERS", 105, 22, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.text("New Town, Pitigala, Sri Lanka", 105, 32, { align: "center" });
      doc.text("Hotline: 0912 291 126", 105, 38, { align: "center" });

      // 2. Invoice Meta Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 20, 65);

      doc.setFontSize(10);
      doc.text("BILL TO:", 20, 80);
      doc.setFont("helvetica", "normal");
      doc.text(`Phone: ${orderData.phone}`, 20, 86);
      doc.text(`Address: ${orderData.address}`, 20, 92);

      doc.setFont("helvetica", "bold");
      doc.text("INVOICE DETAILS:", 140, 80);
      doc.setFont("helvetica", "normal");
      doc.text(`Order ID: #${orderData.id}`, 140, 86);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 92);

      // 3. Item Table Logic - LISTING PRODUCTS ONE BY ONE
      const items = orderData.items || [];
      
      // If items exist, map them. If not, show the total placeholder.
      const tableRows = items.length > 0 
        ? items.map((item) => [
            item.name || item.title || "Hardware Item",
            item.quantity || 1,
            `LKR ${Number(item.price || 0).toLocaleString()}`,
            `LKR ${(Number(item.quantity || 1) * Number(item.price || 0)).toLocaleString()}`
          ])
        : [["Order Total Premium Goods", "1", `LKR ${Number(orderData.total).toLocaleString()}`, `LKR ${Number(orderData.total).toLocaleString()}`]];

      // ✅ AUTO-TABLE CALL
      autoTable(doc, {
        startY: 105,
        head: [["Description", "Qty", "Unit Price", "Total"]],
        body: tableRows,
        headStyles: {
          fillColor: goldColor,
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { halign: 'center' },
          2: { halign: 'left' },
          3: { halign: 'left' }
        },
        styles: { fontSize: 10, cellPadding: 5 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      // 4. Totals Calculation
      const finalY = doc.lastAutoTable.finalY + 15;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Grand Total: LKR ${Number(orderData.total).toLocaleString()}`, 190, finalY, { align: "right" });

      // 5. Footer Decor
      doc.setDrawColor(...goldColor);
      doc.setLineWidth(0.8);
      doc.line(20, 270, 190, 270);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("Thank you for choosing Athukorala Traders!", 105, 278, { align: "center" });

      // 6. SAVE
      doc.save(`Invoice_Athukorala_${orderData.id}.pdf`);
      
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Error generating PDF. Check if items are saved correctly in checkout.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full bg-neutral-900/50 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
          >
            <CheckCircle2 size={42} className="text-black" />
          </motion.div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">Order Confirmed</h1>
          <p className="text-neutral-400 text-sm mb-8">
            Your transaction was successful. A copy of your invoice is ready for download.
          </p>

          <div className="w-full bg-black/40 rounded-3xl p-6 mb-8 border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Order Reference</span>
              <span className="font-mono font-medium">#{orderData.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 text-sm">Amount Paid</span>
              <span className="text-[#D4AF37] font-bold text-lg">
                LKR {Number(orderData.total).toLocaleString()}
              </span>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Phone size={14} className="text-[#D4AF37]" />
                {orderData.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <MapPin size={14} className="text-[#D4AF37]" />
                <span className="truncate">{orderData.address}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#fff" }}
              whileTap={{ scale: 0.97 }}
              onClick={generateInvoice}
              className="flex items-center justify-center gap-2 bg-neutral-100 text-black py-4 rounded-2xl font-bold text-sm transition-colors"
            >
              <Download size={18} /> Invoice
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, brightness: 1.1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/customer-dashboard")}
              className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black py-4 rounded-2xl font-bold text-sm"
            >
              <Home size={18} /> Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;