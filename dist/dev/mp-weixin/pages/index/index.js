"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  data() {
    return {
      menu: [],
      activeTab: null,
      showCart: false,
      cartItems: [],
      scrollInto: "",
      categoryTops: [],
      highlightCatId: null
    };
  },
  computed: {
    totalCount() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }
  },
  onLoad() {
    this.loadMenu();
    this.loadCart();
  },
  onShow() {
    this.loadCart();
  },
  onReady() {
    this.updateCategoryTops();
  },
  methods: {
    loadCart() {
      const savedCart = common_vendor.index.getStorageSync("cartItems");
      if (savedCart) {
        this.cartItems = savedCart;
      }
    },
    getImageUrl(url) {
      if (!url) return "";
      return url.replace("http://localhost:8080", "http://2610c67a.r21.cpolar.top").replace("http://127.0.0.1:8080", "http://2610c67a.r21.cpolar.top");
    },
    switchTab(catId) {
      this.activeTab = catId;
      this.highlightCatId = catId;
      this.scrollInto = "cat-" + catId;
      setTimeout(() => {
        this.scrollInto = "";
      }, 500);
      setTimeout(() => {
        this.highlightCatId = null;
      }, 600);
    },
    onScroll(e) {
      var _a;
      const scrollTop = e.detail.scrollTop;
      const tops = this.categoryTops;
      for (let i = tops.length - 1; i >= 0; i--) {
        if (scrollTop >= tops[i] - 100) {
          this.activeTab = (_a = this.menu[i]) == null ? void 0 : _a.id;
          break;
        }
      }
    },
    updateCategoryTops() {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.selectAll(".category-section").boundingClientRect((rects) => {
        if (rects) {
          this.categoryTops = rects.map((r) => r.top);
        }
      }).exec();
    },
    async loadMenu() {
      common_vendor.index.showLoading({ title: "加载中...", mask: true });
      try {
        const res = await api_index.productApi.getMenu();
        this.menu = (res == null ? void 0 : res.data) || [];
        if (this.menu.length > 0) {
          this.activeTab = this.menu[0].id;
        }
        this.$nextTick(() => {
          this.updateCategoryTops();
        });
      } catch (err) {
        console.error("加载菜单失败:", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    add(product) {
      const exist = this.cartItems.find((i) => i.id === product.id);
      if (exist) {
        exist.quantity++;
        this.cartItems = [...this.cartItems];
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
      common_vendor.index.setStorageSync("cartItems", this.cartItems);
    },
    reduce(productId) {
      const idx = this.cartItems.findIndex((i) => i.id === productId);
      if (idx === -1) return;
      if (this.cartItems[idx].quantity > 1) {
        this.cartItems[idx].quantity--;
        this.cartItems = [...this.cartItems];
      } else {
        this.cartItems.splice(idx, 1);
      }
      common_vendor.index.setStorageSync("cartItems", this.cartItems);
    },
    getCount(productId) {
      var _a;
      return ((_a = this.cartItems.find((i) => i.id === productId)) == null ? void 0 : _a.quantity) || 0;
    },
    openCart() {
      this.showCart = true;
    },
    closeCart() {
      this.showCart = false;
    },
    clearCart() {
      this.cartItems = [];
      this.showCart = false;
      common_vendor.index.removeStorageSync("cartItems");
    },
    submit() {
      if (this.totalCount === 0) {
        return common_vendor.index.showToast({ title: "请先选择商品", icon: "none" });
      }
      const cartData = encodeURIComponent(JSON.stringify(this.cartItems));
      common_vendor.index.navigateTo({ url: `/pages/order/submit?cart=${cartData}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.menu, (cat, k0, i0) => {
      return {
        a: common_vendor.t(cat.name),
        b: cat.id,
        c: common_vendor.n($data.activeTab === cat.id ? "active" : ""),
        d: common_vendor.o(($event) => $options.switchTab(cat.id), cat.id)
      };
    }),
    b: common_vendor.f($data.menu, (cat, k0, i0) => {
      return {
        a: common_vendor.t(cat.name),
        b: common_vendor.f(cat.items, (p, k1, i1) => {
          return common_vendor.e({
            a: $options.getImageUrl(p.imageUrl) || "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=taco%20food%20delicious%20on%20white%20background&image_size=square",
            b: common_vendor.t(p.name),
            c: common_vendor.t(p.description),
            d: common_vendor.t(p.price),
            e: $options.getCount(p.id) > 0
          }, $options.getCount(p.id) > 0 ? {
            f: common_vendor.o(($event) => $options.reduce(p.id), p.id)
          } : {}, {
            g: $options.getCount(p.id) > 0
          }, $options.getCount(p.id) > 0 ? {
            h: common_vendor.t($options.getCount(p.id))
          } : {}, {
            i: common_vendor.o(($event) => $options.add(p), p.id),
            j: p.id
          });
        }),
        c: cat.id,
        d: "cat-" + cat.id,
        e: common_vendor.n($data.highlightCatId === cat.id ? "highlight" : "")
      };
    }),
    c: $data.scrollInto,
    d: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    e: $options.totalCount > 0
  }, $options.totalCount > 0 ? {
    f: common_vendor.t($options.totalCount)
  } : {}, {
    g: common_vendor.t($options.totalAmount),
    h: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    i: $options.totalCount === 0 ? 1 : "",
    j: common_vendor.o((...args) => $options.openCart && $options.openCart(...args)),
    k: $data.showCart
  }, $data.showCart ? common_vendor.e({
    l: common_vendor.o((...args) => $options.clearCart && $options.clearCart(...args)),
    m: common_vendor.f($data.cartItems, (item, k0, i0) => {
      return {
        a: $options.getImageUrl(item.imageUrl),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.o(($event) => $options.reduce(item.id), item.id),
        e: common_vendor.t(item.quantity),
        f: common_vendor.o(($event) => $options.add(item), item.id),
        g: item.id
      };
    }),
    n: $data.cartItems.length === 0
  }, $data.cartItems.length === 0 ? {} : {}, {
    o: common_vendor.o(() => {
    }),
    p: common_vendor.o((...args) => $options.closeCart && $options.closeCart(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
