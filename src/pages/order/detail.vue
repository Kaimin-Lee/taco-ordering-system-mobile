<template>
  <view class="container">
    <view class="nav-bar">
      <button class="nav-back" @click="goBack">
        <text>返回</text>
      </button>
      <text class="nav-title">订单详情</text>
      <view class="nav-placeholder"></view>
    </view>

    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <view v-else-if="order" class="content">
      <view class="order-header">
        <view class="order-no">
          <text>订单号：</text>
          <text>{{ order.orderNo }}</text>
        </view>
        <view :class="['status', 'status-' + order.status]">
          {{ statusText }}
        </view>
      </view>

      <view class="order-items">
        <view class="section-title">
          <text>商品详情</text>
        </view>
        <view v-for="item in order.items" :key="item.productName" class="order-item">
          <view class="item-name">
            <text>{{ item.productName }}</text>
          </view>
          <view class="item-info">
            <text>¥{{ item.price }}</text>
            <text>×{{ item.quantity }}</text>
          </view>
        </view>
      </view>

      <view v-if="order.remark" class="remark-section">
        <view class="section-title">
          <text>备注</text>
        </view>
        <text class="remark">{{ order.remark }}</text>
      </view>

      <view class="price-section">
        <text>实付金额</text>
        <text class="total">¥{{ order.totalAmount }}</text>
      </view>

      <view class="time-section">
        <text>下单时间</text>
        <text>{{ formatTime(order.createTime) }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { orderApi } from '@/api/index.js'

export default {
  data() {
    return {
      order: null,
      loading: true
    }
  },
  computed: {
    statusText() {
      const map = {
        0: '待处理',
        1: '制作中',
        2: '已完成',
        3: '已取消'
      }
      return this.order ? map[this.order.status] || '' : ''
    }
  },
  onLoad(options) {
    console.log('detail onLoad options:', options)
    if (options && options.orderNo) {
      this.loadDetail(options.orderNo)
    } else if (options && options.id) {
      this.loadDetail(options.id)
    } else {
      console.log('没有订单号参数')
      uni.showToast({ title: '参数错误', icon: 'none' })
    }
  },
  methods: {
    async loadDetail(orderNo) {
      this.loading = true
      try {
        const res = await orderApi.getDetail(orderNo)
        this.order = res.data
      } catch (err) {
        console.error('加载失败:', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    formatTime(time) {
      if (!time) return ''
      const t = time.replace('T', ' ').slice(0, 16)
      return t.replace(/-/g, '/')
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.nav-back {
  background: none;
  border: none;
  color: #fa8c16;
  font-size: 28rpx;
  padding: 0;
  margin: 0;
}

.nav-back::after {
  border: none;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.nav-placeholder {
  width: 80rpx;
}

.loading {
  padding: 100rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

.content {
  padding: 20rpx;
}

.order-header {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-no {
  font-size: 28rpx;
  color: #333;
}

.status {
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
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

.order-items,
.remark-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.item-info {
  font-size: 26rpx;
  color: #999;
  display: flex;
  gap: 16rpx;
}

.remark {
  font-size: 26rpx;
  color: #666;
}

.price-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section text:first-child {
  font-size: 28rpx;
  color: #666;
}

.total {
  font-size: 36rpx;
  font-weight: bold;
  color: #fa8c16;
}

.time-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-section text:first-child {
  font-size: 28rpx;
  color: #666;
}

.time-section text:last-child {
  font-size: 26rpx;
  color: #999;
}
</style>