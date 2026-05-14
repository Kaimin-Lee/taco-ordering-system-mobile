"use strict";
const utils_request = require("../utils/request.js");
const authApi = {
  login: (code, nickname, phone) => utils_request.request.post("/c/auth/login", { code, nickname, phone }),
  loginWithPhone: (code, encryptedData, iv) => utils_request.request.post("/c/auth/login", { code, encryptedData, iv })
};
const userApi = {
  info: () => utils_request.request.get("/c/user/info"),
  update: (data) => utils_request.request.put("/c/user/info", data)
};
const productApi = {
  getMenu: () => utils_request.request.get("/c/product/menu")
};
const orderApi = {
  submit: (data) => utils_request.request.post("/c/order/submit", data),
  myOrders: () => utils_request.request.get("/c/order/my"),
  getDetail: (orderNo) => utils_request.request.get(`/c/order/detail/${orderNo}`)
};
exports.authApi = authApi;
exports.orderApi = orderApi;
exports.productApi = productApi;
exports.userApi = userApi;
