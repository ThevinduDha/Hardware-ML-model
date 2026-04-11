import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ---------- INVENTORY ----------

export const getInventory = () => API.get("/inventory");

export const getProductInventory = (id) =>
  API.get(`/inventory/${id}`);

export const getMovements = (id) =>
  API.get(`/inventory/${id}/movements`);

export const stockIn = (data) =>
  API.post("/inventory/stock-in", data);

export const stockOut = (data) =>
  API.post("/inventory/stock-out", data);

export const adjustStock = (data) =>
  API.post("/inventory/adjust", data);

export const getLowStock = () =>
  API.get("/inventory/low-stock");

export const getReorderList = () =>
  API.get("/inventory/reorder-list");

export const updateReorder = (id, data) =>
  API.put(`/inventory/${id}/reorder`, data);

export const deleteMovement = (id) =>
  API.delete(`/inventory/movements/${id}`);


// ---------- SUPPLIERS ----------

export const getSuppliers = () =>
  API.get("/suppliers");

export const addSupplier = (data) =>
  API.post("/suppliers", data);

export const updateSupplier = (id, data) =>
  API.put(`/suppliers/${id}`, data);

export const deleteSupplier = (id) =>
  API.delete(`/suppliers/${id}`);

export const linkSupplier = (data) =>
  API.post("/suppliers/link", data);

export const getSuppliersByProduct = (id) =>
  API.get(`/suppliers/by-product/${id}`);

export const unlinkSupplier = (productId, supplierId) =>
  API.delete(`/suppliers/unlink?productId=${productId}&supplierId=${supplierId}`);