<template>
  <view class="container">
    <view class="header">
      <text class="shop-name">街头塔可</text>
      <text class="status">营业中</text>
    </view>

    <view class="menu">
      <view class="category-nav">
        <view v-for="cat in menu" :key="cat.id"
          :class="['cat-item', currentCat === cat.id ? 'active' : '']"
          @click="currentCat = cat.id">
          {{ cat.name }}
        </view>
      </view>

      <scroll-view class="product-list" scroll-y>
        <view v-for="cat in menu" :key="cat.id" v-show="currentCat === cat.id">
          <view v-for="p in cat.items" :key="p.id" class="product-item">
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
        <text class="cart-count">{{ totalCount }}</text>
        <text class="cart-amount">¥{{ totalAmount }}</text>
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
  // ✅ 1. 使用 setup() 把 cart 暴露给模板，避开 data() 的深度序列化
  setup() {
    return {
      cart
    }
  },
  data() {
    return {
      menu: [],
      currentCat: null,
      // ❌ 2. 从这里把 cart 删掉
      showCart: false
    }
  },
  computed: {
    totalCount() {
      // 因为 setup() 里的返回值会自动挂载到 this 上，所以这里 this.cart 依然完美生效
      return this.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalAmount() {
      return this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    }
  },
  onLoad() {
    this.login()
  },
  methods: {
    async login() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          const { code } = await uni.login({ provider: 'weixin' })
          const res = await authApi.login(code)
          uni.setStorageSync('token', res.data || res)
        }
        this.loadMenu() 
      } catch (err) {
        console.error('微信登录失败，请检查后端是否启动:', err)
        uni.showToast({ title: '登录失败，请重试', icon: 'none' })
        this.loadMenu() 
      }
    },
    async loadMenu() {
      uni.showLoading({ title: '加载菜单中...', mask: true })
      try {
        const res = await productApi.getMenu()
        let data = res.data || res
        if (!Array.isArray(data)) {
          console.error('⚠️ 后端返回的不是分类数组，请检查后端接口:', data)
          data = [] 
        }
        
        this.menu = data
        if (this.menu && this.menu.length > 0) {
          this.currentCat = this.menu[0].id
        }
      } catch (err) {
        console.error('加载菜单异常:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    submit() {
      if (this.totalCount === 0) {
        return uni.showToast({ title: '请先选择商品', icon: 'none' })
      }
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