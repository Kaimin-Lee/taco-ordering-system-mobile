// src/store/cart.js
import { reactive } from 'vue'

// 必须用 reactive 包裹整个对象，才能让 Vue 监听到数据的变化
const cart = reactive({
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
})

export default cart