"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const store_cart = require("../../store/cart.js");
const _sfc_main = {
  data() {
    return {
      cart: store_cart.cart,
      form: { tableNo: "", remark: "" }
    };
  },
  methods: {
    async submit() {
      if (!this.form.tableNo) return common_vendor.index.showToast({ title: "请输入桌号", icon: "none" });
      const items = store_cart.cart.items.map((i) => ({ productId: i.id, quantity: i.quantity }));
      await api_index.orderApi.submit({ ...this.form, items });
      common_vendor.index.showToast({ title: "下单成功", icon: "success" });
      store_cart.cart.clear();
      setTimeout(() => {
        common_vendor.index.switchTab({ url: "/pages/order/order" });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.tableNo,
    b: common_vendor.o(($event) => $data.form.tableNo = $event.detail.value),
    c: $data.form.remark,
    d: common_vendor.o(($event) => $data.form.remark = $event.detail.value),
    e: common_vendor.f($data.cart.items, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.quantity),
        c: common_vendor.t((item.price * item.quantity).toFixed(2)),
        d: item.id
      };
    }),
    f: common_vendor.t($data.cart.totalAmount),
    g: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
