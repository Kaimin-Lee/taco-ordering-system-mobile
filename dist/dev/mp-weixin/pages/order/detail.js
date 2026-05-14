"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      order: null,
      loading: true
    };
  },
  computed: {
    statusText() {
      const map = {
        0: "待处理",
        1: "制作中",
        2: "已完成",
        3: "已取消"
      };
      return this.order ? map[this.order.status] || "" : "";
    }
  },
  onLoad(options) {
    console.log("detail onLoad options:", options);
    if (options && options.orderNo) {
      this.loadDetail(options.orderNo);
    } else if (options && options.id) {
      this.loadDetail(options.id);
    } else {
      console.log("没有订单号参数");
      common_vendor.index.showToast({ title: "参数错误", icon: "none" });
    }
  },
  methods: {
    async loadDetail(orderNo) {
      this.loading = true;
      try {
        const res = await api_index.orderApi.getDetail(orderNo);
        this.order = res.data;
      } catch (err) {
        console.error("加载失败:", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    formatTime(time) {
      if (!time) return "";
      const t = time.replace("T", " ").slice(0, 16);
      return t.replace(/-/g, "/");
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.loading
  }, $data.loading ? {} : $data.order ? common_vendor.e({
    d: common_vendor.t($data.order.orderNo),
    e: common_vendor.t($options.statusText),
    f: common_vendor.n("status-" + $data.order.status),
    g: common_vendor.f($data.order.items, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.price),
        c: common_vendor.t(item.quantity),
        d: item.productName
      };
    }),
    h: $data.order.remark
  }, $data.order.remark ? {
    i: common_vendor.t($data.order.remark)
  } : {}, {
    j: common_vendor.t($data.order.totalAmount),
    k: common_vendor.t($options.formatTime($data.order.createTime))
  }) : {}, {
    c: $data.order
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
