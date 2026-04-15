import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Download, Home, ArrowRight } from "lucide-react";
import jsPDF from "jspdf";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.order || {
    id: "N/A",
    total: 0,
    phone: "N/A",
    address: "N/A",
  };

  // 🔥 GENERATE PDF
  const generateInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("ATHUKORALA TRADERS", 20, 20);

    doc.setFontSize(12);
    doc.text("Hardware Items Invoice", 20, 30);

    doc.line(20, 35, 190, 35);

    doc.text(`Order ID: ${orderData.id}`, 20, 50);
    doc.text(`Amount: LKR ${orderData.total}`, 20, 60);
    doc.text(`Phone: ${orderData.phone}`, 20, 70);
    doc.text(`Address: ${orderData.address}`, 20, 80);

    const now = new Date();
    doc.text(`Date: ${now.toLocaleDateString()}`, 20, 100);
    doc.text(`Time: ${now.toLocaleTimeString()}`, 20, 110);

    doc.text("Thank you for your purchase!", 20, 130);

    doc.save(`invoice_${orderData.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[140px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl"
      >
        <div className="text-center space-y-8">

          {/* ICON */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          >
            <CheckCircle2 size={48} className="text-black" />
          </motion.div>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">
              Payment Successful
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Your order has been confirmed
            </p>
          </div>

          {/* DETAILS */}
          <div className="bg-black/40 border border-white/10 p-6 rounded-xl space-y-4 text-left">
            <p><strong>Order ID:</strong> {orderData.id}</p>
            <p><strong>Amount:</strong> LKR {orderData.total}</p>
            <p><strong>Phone:</strong> {orderData.phone}</p>
            <p><strong>Address:</strong> {orderData.address}</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 justify-center">

            <button
              onClick={generateInvoice}
              className="bg-white text-black px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition"
            >
              <Download size={16} /> Invoice
            </button>

            <button
              onClick={() => navigate("/customer-dashboard")}
              className="bg-[#D4AF37] text-black px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition"
            >
              <Home size={16} /> OK
            </button>

          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;