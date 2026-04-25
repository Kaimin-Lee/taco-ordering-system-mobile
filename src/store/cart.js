// 全局购物车状态
import { reactive } from 'vue'
const cart = {
  items: [],

  add(product) {
    const exist = this.items.find(i => i.id === product.id)
    if (exist) {
      exist.quantity++
    } else {
      this.items.push({ ...product, quantity: 1 })
    }
  },

  reduce(productId) {
    const idx = this.items.findIndex(i => i.id === productId)
    if (idx === -1) return
    if (this.items[idx].quantity > 1) {
      this.items[idx].quantity--
    } else {
      this.items.splice(idx, 1)
    }
  },

  getCount(productId) {
    return this.items.find(i => i.id === productId)?.quantity || 0
  },

  get totalCount() {
    return this.items.reduce((s, i) => s + i.quantity, 0)
  },

  get totalAmount() {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)
  },

  clear() {
    this.items = []
  }
}

export default cart
