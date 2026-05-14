"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      cartItems: [],
      form: { remark: "" },
      submitting: false,
      orderNo: "",
      showSuccess: false
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }
  },
  onLoad(options) {
    if (options.cart) {
      try {
        this.cartItems = JSON.parse(decodeURIComponent(options.cart));
      } catch (e) {
        console.error("解析购物车数据失败:", e);
      }
    }
  },
  methods: {
    getImageUrl(url) {
      if (!url) return "";
      return url.replace("http://localhost:8080", "http://2610c67a.r21.cpolar.top").replace("http://127.0.0.1:8080", "http://2610c67a.r21.cpolar.top");
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    async submit() {
      if (this.submitting || this.cartItems.length === 0) return;
      this.submitting = true;
      common_vendor.index.showLoading({ title: "提交中...", mask: true });
      try {
        const items = this.cartItems.map((i) => ({ productId: i.id, quantity: i.quantity }));
        const res = await api_index.orderApi.submit({ remark: this.form.remark, items });
        if (res && res.data) {
          this.orderNo = res.data;
          this.showSuccess = true;
          this.cartItems = [];
          common_vendor.index.removeStorageSync("cartItems");
        } else {
          common_vendor.index.showToast({ title: "下单失败", icon: "none" });
        }
      } catch (e) {
        console.error("下单失败:", e);
        common_vendor.index.showToast({ title: e.message || "下单失败，请重试", icon: "none" });
      } finally {
        this.submitting = false;
        common_vendor.index.hideLoading();
      }
    },
    goOrder() {
      this.showSuccess = false;
      common_vendor.index.redirectTo({ url: `/pages/order/detail?orderNo=${this.orderNo}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.form.remark,
    c: common_vendor.o(($event) => $data.form.remark = $event.detail.value),
    d: common_vendor.t($data.form.remark.length),
    e: common_vendor.f($data.cartItems, (item, k0, i0) => {
      return {
        a: $options.getImageUrl(item.imageUrl),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.quantity),
        e: common_vendor.t((item.price * item.quantity).toFixed(2)),
        f: item.id
      };
    }),
    f: common_vendor.t($options.totalAmount),
    g: common_vendor.t($options.totalAmount),
    h: !$data.submitting
  }, !$data.submitting ? {} : {}, {
    i: $data.submitting || $data.cartItems.length === 0,
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    k: $data.showSuccess
  }, $data.showSuccess ? {
    l: common_vendor.t($data.orderNo),
    m: common_vendor.o((...args) => $options.goOrder && $options.goOrder(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
