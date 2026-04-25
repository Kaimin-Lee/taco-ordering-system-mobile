"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8080/api";
const request = (url, options = {}) => {
  const token = common_vendor.index.getStorageSync("token");
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + url,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve({ data: res.data });
        } else {
          common_vendor.index.showToast({ title: res.data.message || "请求失败", icon: "none" });
          reject(res.data);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        reject(err);
      }
    });
  });
};
const request$1 = {
  get: (url, data) => request(url, { method: "GET", data }),
  post: (url, data) => request(url, { method: "POST", data }),
  put: (url, data) => request(url, { method: "PUT", data }),
  delete: (url, data) => request(url, { method: "DELETE", data })
};
exports.request = request$1;
