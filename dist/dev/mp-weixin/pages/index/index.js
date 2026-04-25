"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const store_cart = require("../../store/cart.js");
const _sfc_main = {
  data() {
    return {
      menu: [],
      currentCat: null,
      cart: store_cart.cart,
      showCart: false
    };
  },
  computed: {
    // 修复响应式丢失：在 Vue 组件内部通过 computed 监听 cart.items 变化来计算总数和总价
    totalCount() {
      return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalAmount() {
      return this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }
  },
  onLoad() {
    this.login();
  },
  methods: {
    async login() {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          const { code } = await common_vendor.index.login({ provider: "weixin" });
          const res = await api_index.authApi.login(code);
          common_vendor.index.setStorageSync("token", res.data || res);
        }
        this.loadMenu();
      } catch (err) {
        console.error("微信登录失败，请检查后端是否启动:", err);
        common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
        this.loadMenu();
      }
    },
    async loadMenu() {
      common_vendor.index.showLoading({ title: "加载菜单中...", mask: true });
      try {
        const res = await api_index.productApi.getMenu();
        let data = res.data || res;
        if (!Array.isArray(data)) {
          console.error("⚠️ 后端返回的不是分类数组，请检查后端接口:", data);
          data = [];
          common_vendor.index.showToast({ title: "接口数据异常", icon: "none" });
        }
        this.menu = data;
        if (this.menu && this.menu.length > 0) {
          this.currentCat = this.menu[0].id;
        }
      } catch (err) {
        console.error("加载菜单异常:", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    submit() {
      if (this.totalCount === 0) {
        return common_vendor.index.showToast({ title: "请先选择商品", icon: "none" });
      }
      common_vendor.index.navigateTo({ url: "/pages/order/submit" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.menu, (cat, k0, i0) => {
      return {
        a: common_vendor.t(cat.name),
        b: cat.id,
        c: common_vendor.n($data.currentCat === cat.id ? "active" : ""),
        d: common_vendor.o(($event) => $data.currentCat = cat.id, cat.id)
      };
    }),
    b: common_vendor.f($data.menu, (cat, k0, i0) => {
      return {
        a: common_vendor.f(cat.items, (p, k1, i1) => {
          return common_vendor.e({
            a: p.imageUrl,
            b: common_vendor.t(p.name),
            c: common_vendor.t(p.description),
            d: common_vendor.t(p.price),
            e: $data.cart.getCount(p.id) > 0
          }, $data.cart.getCount(p.id) > 0 ? {
            f: common_vendor.o(($event) => $data.cart.reduce(p.id), p.id)
          } : {}, {
            g: $data.cart.getCount(p.id) > 0
          }, $data.cart.getCount(p.id) > 0 ? {
            h: common_vendor.t($data.cart.getCount(p.id))
          } : {}, {
            i: common_vendor.o(($event) => $data.cart.add(p), p.id),
            j: p.id
          });
        }),
        b: cat.id,
        c: $data.currentCat === cat.id
      };
    }),
    c: common_vendor.t($options.totalCount),
    d: common_vendor.t($options.totalAmount),
    e: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    f: common_vendor.o(($event) => $data.showCart = true),
    g: $data.showCart
  }, $data.showCart ? {
    h: common_vendor.o(($event) => {
      $data.cart.clear();
      $data.showCart = false;
    }),
    i: common_vendor.f($data.cart.items, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.o(($event) => $data.cart.reduce(item.id), item.id),
        c: common_vendor.t(item.quantity),
        d: common_vendor.o(($event) => $data.cart.add(item), item.id),
        e: item.id
      };
    }),
    j: common_vendor.o(() => {
    }),
    k: common_vendor.o(($event) => $data.showCart = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
