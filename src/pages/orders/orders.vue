<template>
  <view class="container">
    <view class="header">
      <text class="title">我的订单</text>
    </view>

    <view class="content">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="orders.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无订单</text>
        <text class="empty-hint">快去下单吧～</text>
      </view>

      <view v-else class="order-list">
        <view v-for="order in orders" :key="order.id" class="order-card" :class="{ 'order-expired': order.status === 2 }" @click="goToDetail(order.orderNo)">
          <view class="order-header">
            <text class="order-no">#{{ order.orderNo.slice(-5) }}</text>
            <text :class="['status', 'status-' + order.status]">{{ statusMap[order.status] }}</text>
          </view>
          <view class="order-items">
            <view v-for="(item, idx) in order.items" :key="idx" class="order-item">
              <text class="item-name">{{ item.productName }}</text>
              <text class="item-qty">×{{ item.quantity }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-time">{{ formatTime(order.createTime) }}</text>
            <text class="total">¥{{ order.totalAmount }}</text>
          </view>
        </view>
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
      statusMap: { 0: '待处理', 1: '制作中', 2: '已完成', 3: '已取消' },
      loading: true
    }
  },
  onShow() {
    this.loadOrders()
  },
  onPullDownRefresh() {
    this.loadOrders().finally(() => uni.stopPullDownRefresh())
  },
  methods: {
    async loadOrders() {
      this.loading = true
      const token = uni.getStorageSync('token')
      console.log('当前token:', token)
      console.log('token长度:', token ? token.length : 0)
      try {
        const res = await orderApi.myOrders()
        console.log('订单响应:', res)
        this.orders = res?.data || []
      } catch (e) {
        console.error('加载订单失败:', e)
        uni.showToast({ title: '加载订单失败: ' + (e?.message || JSON.stringify(e)), icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    formatTime(time) {
      if (!time) return ''
      const t = time.replace('T', ' ').slice(0, 16)
      return t.replace(/-/g, '/')
    },
    goToDetail(orderNo) {
      uni.navigateTo({ url: `/pages/order/detail?orderNo=${orderNo}` })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%);
  padding: 40rpx 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.content {
  padding: 24rpx;
}

.loading {
  text-align: center;
  padding: 60rpx;
  color: #999;
}

.empty {
  text-align: center;
  padding: 100rpx 40rpx;
  background: #fff;
  border-radius: 16rpx;
}

.empty-icon {
  font-size: 100rpx;
  display: block;
  margin-bottom: 30rpx;
}

.empty-text {
  display: block;
  color: #909399;
  font-size: 32rpx;
  margin-bottom: 16rpx;
}

.empty-hint {
  color: #c0c4cc;
  font-size: 26rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.order-card.order-expired {
  opacity: 0.7;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-no {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
}

.order-items {
  margin-bottom: 16rpx;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  color: #606266;
  font-size: 26rpx;
}

.item-name {
  flex: 1;
  color: #303133;
}

.item-qty {
  color: #909399;
  margin-left: 20rpx;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.order-time {
  font-size: 24rpx;
  color: #909399;
}

.total {
  font-size: 32rpx;
  font-weight: bold;
  color: #fa8c16;
}

.status {
  font-size: 22rpx;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.status-0 {
  background: #fff7e6;
  color: #fa8c16;
}

.status-1 {
  background: #e6f7ff;
  color: #1890ff;
}

.status-2 {
  background: #f6ffed;
  color: #52c41a;
}

.status-3 {
  background: #f5f5f5;
  color: #999;
}
</style>