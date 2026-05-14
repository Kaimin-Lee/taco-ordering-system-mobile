"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://2610c67a.r21.cpolar.top/api";
let isRedirecting = false;
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
        var _a;
        console.log("request success - statusCode:", res.statusCode, "data:", JSON.stringify(res.data));
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401 && !isRedirecting) {
          isRedirecting = true;
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
          setTimeout(() => {
            isRedirecting = false;
          }, 3e3);
          reject(new Error("未登录"));
        } else {
          common_vendor.index.showToast({ title: ((_a = res.data) == null ? void 0 : _a.message) || "请求失败", icon: "none" });
          reject(res.data);
        }
      },
      fail: (err) => {
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
