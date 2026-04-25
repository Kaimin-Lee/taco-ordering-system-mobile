"use strict";
const utils_request = require("../utils/request.js");
const authApi = {
  login: (code) => utils_request.request.post("/c/auth/login", { code })
};
const productApi = {
  getMenu: () => utils_request.request.get("/c/product/menu")
};
const orderApi = {
  submit: (data) => utils_request.request.post("/c/order/submit", data),
  myOrders: () => utils_request.request.get("/c/order/my")
};
exports.authApi = authApi;
exports.orderApi = orderApi;
exports.productApi = productApi;
