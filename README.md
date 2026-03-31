# ⚡ ATHUKORALA INDUSTRIAL OS (v2.0)
> **An Advanced, ML-Enhanced Enterprise Resource Planning (ERP) System for Modern Hardware Commerce.**

<p align="center">
  <img src="https://capsule-render.vercel.app/render?type=soft&color=D4AF37&height=200&section=header&text=ATHUKORALA%20OS&fontSize=70&fontColor=000000&animation=fadeIn" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-green?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Security-JWT%20%2B%20BCrypt-red?style=for-the-badge" />
</p>

---

## 🚀 PROJECT OVERVIEW
[cite_start]The **Athukorala Industrial OS** is a sophisticated, dark-themed management ecosystem engineered for the hardware industry[cite: 1, 2]. [cite_start]It provides a seamless, real-time interface for **Administrators**, **Operational Staff**, and **Market Clients** to manage high-volume inventory and smart fiscal protocols[cite: 6, 9].

---

## 🧠 INTELLIGENCE LAYER: AI/ML DEMAND PREDICTION
[cite_start]We have integrated a Python-based AI microservice to transform static data into predictive intelligence[cite: 3, 42].
* [cite_start]**📈 Demand Forecasting:** Uses past sales data to predict required stock for the upcoming month[cite: 4].
* [cite_start]**⚖️ Classification Model:** Automatically decides if a product requires restocking (YES/NO)[cite: 880].
* [cite_start]**🎯 Regression Model:** Predicts the exact number of units to order based on projected demand[cite: 882].
* [cite_start]**💰 Discount Optimization:** ML identifies overstock items and suggests discount strategies to clear slow-moving inventory[cite: 522, 675].

---

## 🛠️ CORE OPERATIONAL MODULES (6-CRUD ARCHITECTURE)

### 1. User Accounts & Identity Registry
* [cite_start]**Secure Auth:** Implements JWT-based authentication with BCrypt password encryption[cite: 85, 129, 150].
* [cite_start]**Role-Based Dashboards:** Distinct interfaces for Admin, Staff, and Customer identities[cite: 9, 190].
* [cite_start]**Profile Config:** Full CRUD for managing personal credentials, addresses, and secure sessions[cite: 10, 123].

### 2. Product Catalog & Asset Registry
* [cite_start]**Asset CRUD:** Comprehensive management of product names, descriptions, and high-res visuals[cite: 240].
* [cite_start]**Categorization:** Advanced organizational logic for Electrical, Plumbing, Painting, and Power Tools[cite: 263].
* [cite_start]**Premium Browsing:** High-performance filtering by brand, category, and real-time price ranges[cite: 287].

### 3. Inventory & Stock Management
* [cite_start]**Delta Sync:** Specialized "+ / -" increment protocol for rapid physical stock adjustments[cite: 16, 113].
* [cite_start]**Low-Stock Intelligence:** Automated visual alerts triggered when stock hits reorder thresholds[cite: 17, 566].
* [cite_start]**Audit Trail:** Every movement (In/Out/Adjust) is logged with a timestamp and staff signature[cite: 547, 611].

### 4. Discount & Promotion Management
* [cite_start]**Smart Valuation:** CRUD for percentage and fixed-amount discounts across products or categories[cite: 19, 20].
* [cite_start]**Temporal Control:** Set automated start and end dates for promotion visibility[cite: 21, 504].
* [cite_start]**Live Price Sync:** Discounts reflect instantly in the Market Registry and Curated Lists[cite: 23, 423].

### 5. Orders & Payments Management
* [cite_start]**Transaction Flow:** End-to-end purchasing registry from Cart management to Checkout[cite: 26, 30].
* [cite_start]**Payment Simulation:** Secure recording of payment status (Paid, Pending, Failed)[cite: 28, 777].
* [cite_start]**Curated Archives:** "Wishlist" feature allowing customers to track assets and price drops[cite: 118, 121].

### 6. Admin Command & Monitoring
* [cite_start]**Fiscal Intelligence:** Executive dashboard showing Total Sales, Revenue Trends, and KPI cards[cite: 34, 869].
* [cite_start]**Broadcast Hub:** Dual communication system for Staff internal notices and Customer alerts[cite: 36, 949].
* [cite_start]**Audit Registry:** A permanent, live feed of all administrative system integrity logs[cite: 539, 631].

---

## 🎬 SYSTEM INITIALIZATION

### Backend (Java Engine)
```bash
cd athukorala-backend
mvn spring-boot:run
