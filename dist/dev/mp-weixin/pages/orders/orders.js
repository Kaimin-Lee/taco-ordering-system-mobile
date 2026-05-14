"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      orders: [],
      statusMap: { 0: "待处理", 1: "制作中", 2: "已完成", 3: "已取消" },
      loading: true
    };
  },
  onShow() {
    this.loadOrders();
  },
  onPullDownRefresh() {
    this.loadOrders().finally(() => common_vendor.index.stopPullDownRefresh());
  },
  methods: {
    async loadOrders() {
      this.loading = true;
      const token = common_vendor.index.getStorageSync("token");
      console.log("当前token:", token);
      console.log("token长度:", token ? token.length : 0);
      try {
        const res = await api_index.orderApi.myOrders();
        console.log("订单响应:", res);
        this.orders = (res == null ? void 0 : res.data) || [];
      } catch (e) {
        console.error("加载订单失败:", e);
        common_vendor.index.showToast({ title: "加载订单失败: " + ((e == null ? void 0 : e.message) || JSON.stringify(e)), icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    formatTime(time) {
      if (!time) return "";
      const t = time.replace("T", " ").slice(0, 16);
      return t.replace(/-/g, "/");
    },
    goToDetail(orderNo) {
      common_vendor.index.navigateTo({ url: `/pages/order/detail?orderNo=${orderNo}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : $data.orders.length === 0 ? {} : {
    c: common_vendor.f($data.orders, (order, k0, i0) => {
      return {
        a: common_vendor.t(order.orderNo.slice(-5)),
        b: common_vendor.t($data.statusMap[order.status]),
        c: common_vendor.n("status-" + order.status),
        d: common_vendor.f(order.items, (item, idx, i1) => {
          return {
            a: common_vendor.t(item.productName),
            b: common_vendor.t(item.quantity),
            c: idx
          };
        }),
        e: common_vendor.t($options.formatTime(order.createTime)),
        f: common_vendor.t(order.totalAmount),
        g: order.id,
        h: order.status === 2 ? 1 : "",
        i: common_vendor.o(($event) => $options.goToDetail(order.orderNo), order.id)
      };
    })
  }, {
    b: $data.orders.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
