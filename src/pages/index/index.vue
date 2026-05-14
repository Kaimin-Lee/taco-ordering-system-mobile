<template>
  <view class="container">
    <view class="header">
      <text class="shop-name">🌮 街头塔可</text>
      <text class="status">营业中</text>
    </view>

    <view class="menu">
      <view class="category-nav">
        <view
          v-for="cat in menu"
          :key="cat.id"
          :class="['cat-item', activeTab === cat.id ? 'active' : '']"
          @click="switchTab(cat.id)">
          {{ cat.name }}
        </view>
      </view>

      <scroll-view class="product-scroll" scroll-y :scroll-into-view="scrollInto" scroll-with-animation @scroll="onScroll">
          <view v-for="cat in menu" :key="cat.id" :id="'cat-' + cat.id" :class="['category-section', highlightCatId === cat.id ? 'highlight' : '']">
          <view class="category-header">
            <text class="category-name">{{ cat.name }}</text>
          </view>
          <view class="product-list">
            <view v-for="p in cat.items" :key="p.id" class="product-card">
              <image
                :src="getImageUrl(p.imageUrl) || 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=taco%20food%20delicious%20on%20white%20background&image_size=square'"
                class="product-img"
                mode="aspectFill" />
              <view class="product-info">
                <text class="product-name">{{ p.name }}</text>
                <text class="product-desc">{{ p.description }}</text>
                <view class="product-bottom">
                  <text class="price">¥{{ p.price }}</text>
                  <view class="counter">
                    <view v-if="getCount(p.id) > 0" class="btn-counter btn-minus" @click="reduce(p.id)">-</view>
                    <text v-if="getCount(p.id) > 0" class="count">{{ getCount(p.id) }}</text>
                    <view class="btn-counter btn-plus" @click="add(p)">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="bottom-space"></view>
      </scroll-view>
    </view>

    <view class="cart-bar" @click="openCart">
      <view class="cart-icon">
        <text class="cart-icon-text">🛒</text>
        <text class="cart-badge" v-if="totalCount > 0">{{ totalCount }}</text>
      </view>
      <view class="cart-info">
        <text class="cart-amount">¥{{ totalAmount }}</text>
      </view>
      <view class="btn-submit" @click.stop="submit" :class="{ disabled: totalCount === 0 }">
        <text>去结算</text>
      </view>
    </view>

    <view v-if="showCart" class="cart-modal" @click="closeCart">
      <view class="cart-content" @click.stop="">
        <view class="cart-header">
          <text class="cart-title">购物车</text>
          <text class="cart-clear" @click="clearCart">清空</text>
        </view>
        <view class="cart-items">
          <view v-for="item in cartItems" :key="item.id" class="cart-item">
            <image :src="getImageUrl(item.imageUrl)" class="cart-item-img" mode="aspectFill" />
            <view class="cart-item-info">
              <text class="cart-item-name">{{ item.name }}</text>
              <text class="cart-item-price">¥{{ item.price }}</text>
            </view>
            <view class="cart-item-counter">
              <view class="btn-counter btn-minus" @click="reduce(item.id)">-</view>
              <text class="count">{{ item.quantity }}</text>
              <view class="btn-counter btn-plus" @click="add(item)">+</view>
            </view>
          </view>
          <view v-if="cartItems.length === 0" class="cart-empty">
            <text>购物车空空如也~</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { productApi } from '@/api/index.js'

export default {
  data() {
    return {
      menu: [],
      activeTab: null,
      showCart: false,
      cartItems: [],
      scrollInto: '',
      categoryTops: [],
      highlightCatId: null
    }
  },
  computed: {
    totalCount() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    }
  },
  onLoad() {
    this.loadMenu()
    this.loadCart()
  },
  onShow() {
    this.loadCart()
  },
  onReady() {
    this.updateCategoryTops()
  },
  methods: {
    loadCart() {
      const savedCart = uni.getStorageSync('cartItems')
      if (savedCart) {
        this.cartItems = savedCart
      }
    },
    getImageUrl(url) {
      if (!url) return ''
      return url.replace('http://localhost:8080', 'http://2610c67a.r21.cpolar.top')
                 .replace('http://127.0.0.1:8080', 'http://2610c67a.r21.cpolar.top')
    },
    switchTab(catId) {
      this.activeTab = catId
      this.highlightCatId = catId
      this.scrollInto = 'cat-' + catId
      setTimeout(() => {
        this.scrollInto = ''
      }, 500)
      setTimeout(() => {
        this.highlightCatId = null
      }, 600)
    },
    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      const tops = this.categoryTops

      for (let i = tops.length - 1; i >= 0; i--) {
        if (scrollTop >= tops[i] - 100) {
          this.activeTab = this.menu[i]?.id
          break
        }
      }
    },
    updateCategoryTops() {
      const query = uni.createSelectorQuery().in(this)
      query.selectAll('.category-section').boundingClientRect(rects => {
        if (rects) {
          this.categoryTops = rects.map(r => r.top)
        }
      }).exec()
    },
    async loadMenu() {
      uni.showLoading({ title: '加载中...', mask: true })
      try {
        const res = await productApi.getMenu()
        this.menu = res?.data || []
        if (this.menu.length > 0) {
          this.activeTab = this.menu[0].id
        }
        this.$nextTick(() => {
          this.updateCategoryTops()
        })
      } catch (err) {
        console.error('加载菜单失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    add(product) {
      const exist = this.cartItems.find(i => i.id === product.id)
      if (exist) {
        exist.quantity++
        this.cartItems = [...this.cartItems]
      } else {
        this.cartItems.push({ ...product, quantity: 1 })
      }
      uni.setStorageSync('cartItems', this.cartItems)
    },
    reduce(productId) {
      const idx = this.cartItems.findIndex(i => i.id === productId)
      if (idx === -1) return
      if (this.cartItems[idx].quantity > 1) {
        this.cartItems[idx].quantity--
        this.cartItems = [...this.cartItems]
      } else {
        this.cartItems.splice(idx, 1)
      }
      uni.setStorageSync('cartItems', this.cartItems)
    },
    getCount(productId) {
      return this.cartItems.find(i => i.id === productId)?.quantity || 0
    },
    openCart() {
      this.showCart = true
    },
    closeCart() {
      this.showCart = false
    },
    clearCart() {
      this.cartItems = []
      this.showCart = false
      uni.removeStorageSync('cartItems')
    },
    submit() {
      if (this.totalCount === 0) {
        return uni.showToast({ title: '请先选择商品', icon: 'none' })
      }
      const cartData = encodeURIComponent(JSON.stringify(this.cartItems))
      uni.navigateTo({ url: `/pages/order/submit?cart=${cartData}` })
    }
  }
}
</script>

<style>
.container { display: flex; flex-direction: column; height: 100vh; background: #f8f8f8; }
.header { padding: 40rpx 30rpx; background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%); color: #fff; }
.shop-name { font-size: 40rpx; font-weight: bold; }
.status { font-size: 24rpx; background: rgba(255,255,255,0.3); padding: 6rpx 20rpx; border-radius: 20rpx; margin-left: 20rpx; }

.menu { flex: 1; display: flex; overflow: hidden; }
.category-nav { width: 180rpx; background: #f0f0f0; padding: 20rpx 0; }
.cat-item { padding: 28rpx 16rpx; text-align: center; font-size: 26rpx; color: #666; }
.cat-item.active { background: #fff; color: #fa8c16; font-weight: bold; }
.product-scroll { flex: 1; }
.category-section { padding: 20rpx 24rpx 0; transition: background-color 0.3s; }
.category-section.highlight { background-color: #ffd4a8; border-radius: 16rpx; }
.category-header { padding: 16rpx 0; text-align: center; }
.category-name { font-size: 32rpx; font-weight: bold; color: #fa8c16; }

.product-list { display: flex; flex-direction: column; gap: 20rpx; padding-bottom: 20rpx; }
.product-card { display: flex; background: #fff; border-radius: 16rpx; padding: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06); }
.product-img { width: 180rpx; height: 180rpx; border-radius: 12rpx; margin-right: 20rpx; flex-shrink: 0; }
.product-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.product-name { font-size: 32rpx; font-weight: bold; color: #333; }
.product-desc { font-size: 24rpx; color: #999; margin-top: 8rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 16rpx; }
.price { font-size: 36rpx; font-weight: bold; color: #fa8c16; }
.counter { display: flex; align-items: center; }
.btn-counter { width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 32rpx; }
.btn-minus, .btn-plus { background: #fa8c16; color: #fff; }
.count { font-size: 28rpx; margin: 0 12rpx; color: #333; min-width: 40rpx; text-align: center; }

.bottom-space { height: 140rpx; }

.cart-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 120rpx; background: #fff; display: flex; align-items: center; padding: 0 30rpx; box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.1); z-index: 100; }
.cart-icon { position: relative; }
.cart-icon-text { font-size: 56rpx; }
.cart-badge { position: absolute; top: -10rpx; right: -20rpx; background: #fa8c16; color: #fff; font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 20rpx; }
.cart-info { flex: 1; margin-left: 20rpx; }
.cart-amount { font-size: 36rpx; font-weight: bold; color: #fa8c16; }
.btn-submit { background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%); color: #fff; padding: 24rpx 60rpx; border-radius: 50rpx; font-size: 30rpx; font-weight: bold; }
.btn-submit.disabled { background: #ccc; }

.cart-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 1000; }
.cart-content { background: #fff; width: 100%; max-height: 70vh; border-radius: 30rpx 30rpx 0 0; padding: 30rpx; }
.cart-header { display: flex; justify-content: space-between; padding-bottom: 20rpx; border-bottom: 1rpx solid #f0f0f0; }
.cart-title { font-size: 34rpx; font-weight: bold; color: #333; }
.cart-clear { font-size: 28rpx; color: #999; }
.cart-items { max-height: 50vh; overflow-y: auto; }
.cart-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.cart-item-img { width: 100rpx; height: 100rpx; border-radius: 10rpx; margin-right: 20rpx; }
.cart-item-info { flex: 1; }
.cart-item-name { font-size: 28rpx; color: #333; }
.cart-item-price { font-size: 24rpx; color: #fa8c16; }
.cart-item-counter { display: flex; align-items: center; }
.cart-empty { text-align: center; padding: 60rpx; color: #999; }
</style>