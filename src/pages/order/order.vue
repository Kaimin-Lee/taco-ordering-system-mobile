<template>
  <view class="container">
    <view class="nav-bar">
      <text class="nav-title">我的订单</text>
    </view>

    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <view v-else-if="orders.length === 0" class="empty">
      <text class="empty-icon">📋</text>
      <text>暂无订单</text>
      <text class="empty-hint">快去下单吧～</text>
      <view class="btn-go-order" @tap="goOrder">去下单</view>
    </view>

    <scroll-view v-else class="order-list" scroll-y @scrolltolower="loadMore">
      <view v-for="order in orders" :key="order.id" class="order-card" :class="{ 'order-expired': order.status === 2 }">
        <view class="order-header">
          <text class="order-no">#{{ order.orderNo.slice(-5) }}</text>
          <text :class="['status', `status-${order.status}`]">{{ statusMap[order.status] }}</text>
        </view>
        <view class="order-items">
          <view v-for="(item, idx) in order.items" :key="idx" class="order-item">
            <text class="item-name">{{ item.productName }}</text>
            <text class="item-qty">x{{ item.quantity }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-time">{{ formatTime(order.createTime) }}</text>
          <text class="total">¥{{ order.totalAmount }}</text>
        </view>
      </view>

      <view v-if="hasMore" class="load-more">
        <text>加载更多...</text>
      </view>
      <view v-if="!hasMore && orders.length > 0" class="no-more">
        <text>— 已加载全部订单 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { orderApi } from '@/api/index.js'

export default {
  data() {
    return {
      orders: [],
      statusMap: { 0: '待处理', 1: '制作中', 2: '已完成', 3: '已取消' },
      loading: true,
      hasMore: false,
      page: 1,
      pageSize: 20
    }
  },
  onShow() {
    this.page = 1
    this.orders = []
    this.hasMore = false
    this.loadOrders()
  },
  onPullDownRefresh() {
    this.page = 1
    this.orders = []
    this.hasMore = false
    this.loadOrders().finally(() => uni.stopPullDownRefresh())
  },
  methods: {
    async loadOrders() {
      if (this.loading) return
      this.loading = true
      try {
        const res = await orderApi.myOrders()
        const data = res?.data || []
        this.orders = data
        this.hasMore = data.length >= this.pageSize
      } catch (e) {
        console.error('加载订单失败:', e)
        if (this.orders.length === 0) {
        } else {
          uni.showToast({ title: '加载失败，请重试', icon: 'none' })
        }
      } finally {
        this.loading = false
      }
    },
    loadMore() {
    },
    formatTime(time) {
      if (!time) return ''
      const t = time.replace('T', ' ').slice(0, 16)
      return t.replace(/-/g, '/')
    },
    goOrder() {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style>
.container { min-height: 100vh; background: #f8f8f8; }
.nav-bar { padding: 40rpx 30rpx; background: #fff; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06); }
.nav-title { font-size: 36rpx; font-weight: bold; color: #333; }

.loading { text-align: center; padding: 100rpx; color: #999; }

.empty { text-align: center; padding: 150rpx 40rpx; }
.empty-icon { font-size: 100rpx; display: block; margin-bottom: 30rpx; }
.empty text { display: block; color: #909399; font-size: 28rpx; }
.empty .empty-hint { margin-top: 20rpx; color: #c0c4cc; }
.btn-go-order { background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%); color: #fff; padding: 24rpx 60rpx; border-radius: 50rpx; font-size: 30rpx; font-weight: bold; display: inline-block; margin-top: 40rpx; }

.order-list { padding: 20rpx; padding-bottom: 40rpx; }
.order-card { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06); transition: all 0.3s; }
.order-card.order-expired { opacity: 0.7; }

.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #f0f0f0; }
.order-no { font-size: 28rpx; font-weight: 600; color: #303133; }

.order-items { margin-bottom: 20rpx; }
.order-item { display: flex; justify-content: space-between; padding: 12rpx 0; color: #606266; font-size: 26rpx; }
.item-name { flex: 1; color: #303133; }
.item-qty { color: #909399; margin: 0 20rpx; }
.item-price { color: #606266; }

.order-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20rpx; border-top: 1rpx solid #f0f0f0; }
.order-time { font-size: 24rpx; color: #909399; }
.total { font-size: 32rpx; font-weight: bold; color: #fa8c16; }

.status { font-size: 22rpx; padding: 6rpx 20rpx; border-radius: 20rpx; }
.status-0 { background: #fff7e6; color: #fa8c16; }
.status-1 { background: #e6f7ff; color: #1890ff; }
.status-2 { background: #f6ffed; color: #52c41a; }
.status-3 { background: #f5f5f5; color: #999; }

.load-more, .no-more { text-align: center; padding: 30rpx; color: #999; font-size: 26rpx; }
</style>
