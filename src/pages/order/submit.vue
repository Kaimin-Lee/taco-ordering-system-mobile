<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">桌号/取餐号</text>
        <input v-model="form.tableNo" placeholder="请输入桌号" />
      </view>
      <view class="form-item">
        <text class="label">备注</text>
        <textarea v-model="form.remark" placeholder="忌口、辣度等" />
      </view>
    </view>

    <view class="order-list">
      <view v-for="item in cart.items" :key="item.id" class="order-item">
        <text>{{ item.name }}</text>
        <text>x{{ item.quantity }}</text>
        <text>¥{{ (item.price * item.quantity).toFixed(2) }}</text>
      </view>
    </view>

    <view class="total">
      <text>总计：</text>
      <text class="amount">¥{{ cart.totalAmount }}</text>
    </view>

    <button class="btn-submit" @click="submit">提交订单</button>
  </view>
</template>

<script>
import { orderApi } from '@/api/index.js'
import cart from '@/store/cart.js'

export default {
  data() {
    return {
      cart,
      form: { tableNo: '', remark: '' }
    }
  },
  methods: {
    async submit() {
      if (!this.form.tableNo) return uni.showToast({ title: '请输入桌号', icon: 'none' })
      const items = cart.items.map(i => ({ productId: i.id, quantity: i.quantity }))
      const res = await orderApi.submit({ ...this.form, items })
      uni.showToast({ title: '下单成功', icon: 'success' })
      cart.clear()
      setTimeout(() => {
        uni.switchTab({ url: '/pages/order/order' })
      }, 1500)
    }
  }
}
</script>

<style>
.container { padding: 30rpx; }
.form { background: #fff; padding: 30rpx; border-radius: 8rpx; margin-bottom: 20rpx; }
.form-item { margin-bottom: 30rpx; }
.label { display: block; font-size: 28rpx; margin-bottom: 10rpx; }
input, textarea { width: 100%; padding: 20rpx; border: 1rpx solid #ddd; border-radius: 8rpx; font-size: 28rpx; }
textarea { height: 150rpx; }
.order-list { background: #fff; padding: 30rpx; border-radius: 8rpx; margin-bottom: 20rpx; }
.order-item { display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid #eee; }
.total { background: #fff; padding: 30rpx; border-radius: 8rpx; display: flex; justify-content: space-between; font-size: 32rpx; font-weight: bold; }
.amount { color: #ff4d4f; }
.btn-submit { background: #409eff; color: #fff; padding: 30rpx; border-radius: 8rpx; font-size: 32rpx; margin-top: 30rpx; border: none; }
</style>
