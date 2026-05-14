"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      logging: false
    };
  },
  onLoad() {
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
    }
  },
  methods: {
    async handleLogin() {
      if (this.logging) return;
      this.logging = true;
      try {
        console.log("开始微信登录...");
        const loginRes = await common_vendor.index.login({ provider: "weixin" });
        console.log("uni.login result:", loginRes);
        if (!loginRes.code) {
          throw new Error("获取code失败");
        }
        let nickname = "塔可食客";
        try {
          const profileRes = await new Promise((resolve, reject) => {
            common_vendor.index.getUserProfile({
              provider: "weixin",
              desc: "用于获取您的昵称",
              success: resolve,
              fail: reject
            });
          });
          console.log("getUserProfile result:", profileRes);
          if (profileRes.userInfo && profileRes.userInfo.nickName) {
            nickname = profileRes.userInfo.nickName;
          }
        } catch (profileErr) {
          console.log("获取微信昵称失败，使用默认昵称:", profileErr);
        }
        console.log("最终昵称:", nickname);
        const res = await api_index.authApi.login(loginRes.code, nickname, "");
        console.log("登录响应完整结构:", JSON.stringify(res, null, 2));
        console.log("res类型:", typeof res);
        console.log("res.data:", res == null ? void 0 : res.data);
        const token = res == null ? void 0 : res.data;
        if (!token) {
          throw new Error("登录失败：未获取到token");
        }
        common_vendor.index.setStorageSync("token", token);
        common_vendor.index.setStorageSync("nickname", nickname);
        common_vendor.index.setStorageSync("phone", "");
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
        }, 500);
      } catch (err) {
        console.error("登录失败:", err);
        common_vendor.index.showToast({ title: "登录失败: " + (err.message || "请重试"), icon: "none" });
        this.logging = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.logging
  }, !$data.logging ? {} : {}, {
    b: $data.logging,
    c: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
