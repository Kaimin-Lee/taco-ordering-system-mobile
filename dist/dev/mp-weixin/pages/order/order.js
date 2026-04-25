"use strict";
const api_index = require("../../api/index.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orders: [],
      statusMap: { 0: "待处理", 1: "制作中", 2: "已完成", 3: "已取消" }
    };
  },
  onShow() {
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      const res = await api_index.orderApi.myOrders();
      this.orders = res.data || [];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.orders.length === 0
  }, $data.orders.length === 0 ? {} : {}, {
    b: common_vendor.f($data.orders, (order, k0, i0) => {
      return {
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($data.statusMap[order.status]),
        c: common_vendor.n(`status-${order.status}`),
        d: common_vendor.f(order.items, (item, k1, i1) => {
          return {
            a: common_vendor.t(item.productName),
            b: common_vendor.t(item.quantity),
            c: common_vendor.t(item.price),
            d: item.productName
          };
        }),
        e: common_vendor.t(order.tableNo),
        f: common_vendor.t(order.totalAmount),
        g: order.id
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
