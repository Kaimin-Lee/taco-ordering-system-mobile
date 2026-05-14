"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      nickname: "塔可食客"
    };
  },
  onShow() {
    const savedNickname = common_vendor.index.getStorageSync("nickname");
    if (savedNickname) {
      this.nickname = savedNickname;
    }
  },
  methods: {
    editNickname() {
      common_vendor.index.showModal({
        title: "修改昵称",
        placeholderText: "请输入昵称",
        editable: true,
        defaultText: this.nickname,
        success: async (res) => {
          if (res.confirm && res.content && res.content.trim()) {
            const newNickname = res.content.trim();
            try {
              await api_index.userApi.update({ nickname: newNickname });
              this.nickname = newNickname;
              common_vendor.index.setStorageSync("nickname", newNickname);
              common_vendor.index.showToast({ title: "修改成功", icon: "success" });
            } catch (err) {
              console.error("修改昵称失败:", err);
              common_vendor.index.showToast({ title: "修改失败", icon: "none" });
            }
          }
        }
      });
    },
    showAbout() {
      common_vendor.index.showModal({
        title: "关于我们",
        content: "街头塔可 - 美味的墨西哥塔可",
        showCancel: false
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认退出登录？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("nickname");
            common_vendor.index.reLaunch({ url: "/pages/login/login" });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.nickname),
    b: common_vendor.o((...args) => $options.editNickname && $options.editNickname(...args)),
    c: common_vendor.o((...args) => $options.showAbout && $options.showAbout(...args)),
    d: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
