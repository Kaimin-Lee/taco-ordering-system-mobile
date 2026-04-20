<template>
  <view class="container">
    <view v-if="orders.length === 0" class="empty">
      <text>暂无订单</text>
    </view>
    <view v-for="order in orders" :key="order.id" class="order-card">
      <view class="order-header">
        <text>订单号：{{ order.orderNo }}</text>
        <text :class="['status', `status-${order.status}`]">{{ statusMap[order.status] }}</text>
      </view>
      <view v-for="item in order.items" :key="item.productName" class="order-item">
        <text>{{ item.productName }}</text>
        <text>x{{ item.quantity }}</text>
        <text>¥{{ item.price }}</text>
      </view>
      <view class="order-footer">
        <text>桌号：{{ order.tableNo }}</text>
        <text class="total">合计：¥{{ order.totalAmount }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { orderApi } from '@/api/index.js'

export default {
  data() {
    return {
      orders: [],
      statusMap: { 0: '待处理', 1: '制作中', 2: '已完成', 3: '已取消' }
    }
  },
  onShow() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      const res = await orderApi.myOrders()
      this.orders = res.data || []
    }
  }
}
</script>

<style>
.container { padding: 20rpx; background: #f5f5f5; min-height: 100vh; }
.empty { text-align: center; padding: 200rpx; color: #999; }
.order-card { background: #fff; border-radius: 8rpx; padding: 30rpx; margin-bottom: 20rpx; }
.order-header { display: flex; justify-content: space-between; margin-bottom: 20rpx; }
.order-item { display: flex; justify-content: space-between; padding: 15rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.order-footer { display: flex; justify-content: space-between; margin-top: 20rpx; font-size: 28rpx; }
.total { color: #ff4d4f; font-weight: bold; }
.status { font-size: 24rpx; padding: 6rpx 16rpx; border-radius: 20rpx; }
.status-0 { background: #fff7e6; color: #fa8c16; }
.status-1 { background: #e6f7ff; color: #1890ff; }
.status-2 { background: #f6ffed; color: #52c41a; }
.status-3 { background: #f5f5f5; color: #999; }
</style>
