<template>
  <view class="container">
    <view class="header">
      <text class="shop-name">街头塔可</text>
      <text class="status">营业中</text>
    </view>

    <view class="menu">
      <view class="category-nav">
        <view v-for="cat in menu" :key="cat.categoryId"
          :class="['cat-item', currentCat === cat.categoryId ? 'active' : '']"
          @click="currentCat = cat.categoryId">
          {{ cat.categoryName }}
        </view>
      </view>

      <scroll-view class="product-list" scroll-y>
        <view v-for="cat in menu" :key="cat.categoryId" v-show="currentCat === cat.categoryId">
          <view v-for="p in cat.products" :key="p.id" class="product-item">
            <image :src="p.imageUrl" class="product-img" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ p.name }}</text>
              <text class="product-desc">{{ p.description }}</text>
              <view class="product-bottom">
                <text class="price">¥{{ p.price }}</text>
                <view class="counter">
                  <button v-if="cart.getCount(p.id) > 0" class="btn-minus" @click="cart.reduce(p.id)">-</button>
                  <text v-if="cart.getCount(p.id) > 0" class="count">{{ cart.getCount(p.id) }}</text>
                  <button class="btn-plus" @click="cart.add(p)">+</button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="cart-bar" @click="showCart = true">
      <view class="cart-info">
        <text class="cart-count">{{ cart.totalCount }}</text>
        <text class="cart-amount">¥{{ cart.totalAmount }}</text>
      </view>
      <button class="btn-submit" @click.stop="submit">去结算</button>
    </view>

    <view v-if="showCart" class="cart-modal" @click="showCart = false">
      <view class="cart-content" @click.stop>
        <view class="cart-header">
          <text>购物车</text>
          <text @click="cart.clear(); showCart = false">清空</text>
        </view>
        <view v-for="item in cart.items" :key="item.id" class="cart-item">
          <text>{{ item.name }}</text>
          <view class="counter">
            <button class="btn-minus" @click="cart.reduce(item.id)">-</button>
            <text class="count">{{ item.quantity }}</text>
            <button class="btn-plus" @click="cart.add(item)">+</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { authApi, productApi } from '@/api/index.js'
import cart from '@/store/cart.js'

export default {
  data() {
    return {
      menu: [],
      currentCat: null,
      cart,
      showCart: false
    }
  },
  onLoad() {
    this.login()
  },
  methods: {
    async login() {
      const token = uni.getStorageSync('token')
      if (!token) {
        const { code } = await uni.login({ provider: 'weixin' })
        const res = await authApi.login(code)
        uni.setStorageSync('token', res.data)
      }
      this.loadMenu()
    },
    async loadMenu() {
      const res = await productApi.getMenu()
      this.menu = res.data
      if (this.menu.length) this.currentCat = this.menu[0].categoryId
    },
    submit() {
      if (!cart.totalCount) return uni.showToast({ title: '请先选择商品', icon: 'none' })
      uni.navigateTo({ url: '/pages/order/submit' })
    }
  }
}
</script>

<style>
.container { display: flex; flex-direction: column; height: 100vh; }
.header { padding: 20rpx; background: #409eff; color: #fff; display: flex; justify-content: space-between; }
.menu { flex: 1; display: flex; overflow: hidden; }
.category-nav { width: 160rpx; background: #f5f5f5; }
.cat-item { padding: 30rpx 20rpx; text-align: center; font-size: 28rpx; }
.cat-item.active { background: #fff; color: #409eff; font-weight: bold; }
.product-list { flex: 1; padding: 20rpx; }
.product-item { display: flex; margin-bottom: 20rpx; background: #fff; padding: 20rpx; border-radius: 8rpx; }
.product-img { width: 160rpx; height: 160rpx; border-radius: 8rpx; margin-right: 20rpx; }
.product-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.product-name { font-size: 32rpx; font-weight: bold; }
.product-desc { font-size: 24rpx; color: #999; margin-top: 10rpx; }
.product-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { color: #ff4d4f; font-size: 32rpx; font-weight: bold; }
.counter { display: flex; align-items: center; gap: 10rpx; }
.btn-minus, .btn-plus { width: 50rpx; height: 50rpx; border-radius: 50%; background: #409eff; color: #fff; font-size: 32rpx; line-height: 50rpx; text-align: center; border: none; }
.count { font-size: 28rpx; min-width: 40rpx; text-align: center; }
.cart-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 100rpx; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 0 30rpx; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1); }
.cart-info { display: flex; gap: 20rpx; align-items: center; }
.cart-count { background: #ff4d4f; color: #fff; padding: 4rpx 12rpx; border-radius: 20rpx; font-size: 24rpx; }
.cart-amount { font-size: 36rpx; font-weight: bold; color: #ff4d4f; }
.btn-submit { background: #409eff; color: #fff; padding: 20rpx 60rpx; border-radius: 50rpx; font-size: 28rpx; border: none; }
.cart-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; }
.cart-content { background: #fff; width: 100%; max-height: 60vh; border-radius: 20rpx 20rpx 0 0; padding: 30rpx; }
.cart-header { display: flex; justify-content: space-between; font-size: 32rpx; font-weight: bold; margin-bottom: 20rpx; }
.cart-item { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #eee; }
</style>
