"use strict";
require("../common/vendor.js");
const cart = {
  items: [],
  add(product) {
    const exist = this.items.find((i) => i.id === product.id);
    if (exist) {
      exist.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  },
  reduce(productId) {
    const idx = this.items.findIndex((i) => i.id === productId);
    if (idx === -1) return;
    if (this.items[idx].quantity > 1) {
      this.items[idx].quantity--;
    } else {
      this.items.splice(idx, 1);
    }
  },
  getCount(productId) {
    var _a;
    return ((_a = this.items.find((i) => i.id === productId)) == null ? void 0 : _a.quantity) || 0;
  },
  get totalCount() {
    return this.items.reduce((s, i) => s + i.quantity, 0);
  },
  get totalAmount() {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);
  },
  clear() {
    this.items = [];
  }
};
exports.cart = cart;
