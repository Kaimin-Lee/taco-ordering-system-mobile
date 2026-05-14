<template>
  <view class="container">
    <view class="nav-bar">
      <button class="nav-back" @click="goBack">← 返回</button>
      <text class="nav-title">确认订单</text>
      <view class="nav-placeholder"></view>
    </view>

    <view class="content">
      <view class="section">
        <view class="section-title">📝 备注信息</view>
        <view class="form">
          <textarea v-model="form.remark" placeholder="如：忌口、辣度、取餐方式等" maxlength="100" />
          <text class="char-count">{{ form.remark.length }}/100</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">🛒 订单明细</view>
        <view class="order-list">
          <view v-for="item in cartItems" :key="item.id" class="order-item">
            <image :src="getImageUrl(item.imageUrl)" class="item-img" mode="aspectFill" />
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-price">¥{{ item.price }}</text>
            </view>
            <view class="item-right">
              <text class="item-qty">x{{ item.quantity }}</text>
              <text class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section total-section">
        <view class="total-row">
          <text>商品总价</text>
          <text class="total-amount">¥{{ totalAmount }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-label">合计</text>
        <text class="total-price">¥{{ totalAmount }}</text>
      </view>
      <button class="btn-submit" :disabled="submitting || cartItems.length === 0" @click="submit">
        <text v-if="!submitting">提交订单</text>
        <text v-else>提交中...</text>
      </button>
    </view>

    <view v-if="showSuccess" class="success-modal">
      <view class="success-content">
        <text class="success-icon">✓</text>
        <text class="success-title">下单成功</text>
        <text class="success-order">订单号：{{ orderNo }}</text>
        <text class="success-tip">请留意订单制作进度</text>
        <button class="btn-confirm" @click="goOrder">查看订单</button>
      </view>
    </view>
  </view>
</template>

<script>
import { orderApi } from '@/api/index.js'

export default {
  data() {
    return {
      cartItems: [],
      form: { remark: '' },
      submitting: false,
      orderNo: '',
      showSuccess: false
    }
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    }
  },
  onLoad(options) {
    if (options.cart) {
      try {
        this.cartItems = JSON.parse(decodeURIComponent(options.cart))
      } catch (e) {
        console.error('解析购物车数据失败:', e)
      }
    }
  },
  methods: {
    getImageUrl(url) {
      if (!url) return ''
      return url.replace('http://localhost:8080', 'http://2610c67a.r21.cpolar.top')
                .replace('http://127.0.0.1:8080', 'http://2610c67a.r21.cpolar.top')
    },
    goBack() {
      uni.navigateBack()
    },
    async submit() {
      if (this.submitting || this.cartItems.length === 0) return
      
      this.submitting = true
      uni.showLoading({ title: '提交中...', mask: true })
      
      try {
        const items = this.cartItems.map(i => ({ productId: i.id, quantity: i.quantity }))
        const res = await orderApi.submit({ remark: this.form.remark, items })
        
        if (res && res.data) {
          this.orderNo = res.data
          this.showSuccess = true
          this.cartItems = []
          uni.removeStorageSync('cartItems')
        } else {
          uni.showToast({ title: '下单失败', icon: 'none' })
        }
      } catch (e) {
        console.error('下单失败:', e)
        uni.showToast({ title: e.message || '下单失败，请重试', icon: 'none' })
      } finally {
        this.submitting = false
        uni.hideLoading()
      }
    },
    goOrder() {
      this.showSuccess = false
      uni.redirectTo({ url: `/pages/order/detail?orderNo=${this.orderNo}` })
    }
  }
}
</script>

<style>
.container { min-height: 100vh; background: #f8f8f8; display: flex; flex-direction: column; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 30rpx 40rpx; background: #fff; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06); }
.nav-back { background: none; border: none; color: #fa8c16; font-size: 28rpx; padding: 0; margin: 0; }
.nav-back::after { border: none; }
.nav-title { font-size: 32rpx; font-weight: 600; color: #303133; }
.nav-placeholder { width: 80rpx; }

.content { flex: 1; padding: 24rpx; padding-bottom: 160rpx; }
.section { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 24rpx; }
.section-title { font-size: 28rpx; font-weight: 600; color: #303133; margin-bottom: 24rpx; }

.form { position: relative; }
textarea { width: 100%; padding: 24rpx; border: 1rpx solid #e4e7ed; border-radius: 12rpx; font-size: 28rpx; height: 160rpx; box-sizing: border-box; background: #fafafa; }
.char-count { position: absolute; right: 20rpx; bottom: 16rpx; font-size: 22rpx; color: #c0c4cc; }

.order-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.order-item:last-child { border-bottom: none; }
.item-img { width: 120rpx; height: 120rpx; border-radius: 12rpx; margin-right: 20rpx; }
.item-info { flex: 1; display: flex; flex-direction: column; gap: 8rpx; }
.item-name { font-size: 28rpx; color: #303133; font-weight: 500; }
.item-price { font-size: 24rpx; color: #909399; }
.item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8rpx; }
.item-qty { font-size: 26rpx; color: #909399; }
.item-subtotal { font-size: 28rpx; color: #fa8c16; font-weight: 600; }

.total-section { background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%); }
.total-row { display: flex; justify-content: space-between; align-items: center; color: #fff; font-size: 28rpx; }
.total-amount { font-size: 40rpx; font-weight: bold; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 120rpx; background: #fff; display: flex; align-items: center; padding: 0 40rpx; box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.08); }
.total-info { flex: 1; }
.total-label { font-size: 26rpx; color: #909399; }
.total-price { font-size: 44rpx; font-weight: bold; color: #fa8c16; margin-left: 10rpx; }
.btn-submit { background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%); color: #fff; padding: 24rpx 60rpx; border-radius: 50rpx; font-size: 30rpx; font-weight: bold; border: none; }
.btn-submit::after { border: none; }
.btn-submit[disabled] { background: #ccc; }

.success-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.success-content { background: #fff; width: 560rpx; padding: 60rpx 40rpx; border-radius: 24rpx; text-align: center; }
.success-icon { display: block; width: 120rpx; height: 120rpx; line-height: 120rpx; background: #f6ffed; color: #52c41a; border-radius: 50%; font-size: 60rpx; margin: 0 auto 30rpx; }
.success-title { display: block; font-size: 36rpx; font-weight: bold; color: #303133; margin-bottom: 20rpx; }
.success-order { display: block; font-size: 28rpx; color: #fa8c16; margin-bottom: 16rpx; }
.success-tip { display: block; font-size: 26rpx; color: #909399; margin-bottom: 40rpx; }
.btn-confirm { background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%); color: #fff; padding: 24rpx 80rpx; border-radius: 50rpx; font-size: 30rpx; font-weight: bold; border: none; display: inline-block; }
.btn-confirm::after { border: none; }
</style>
