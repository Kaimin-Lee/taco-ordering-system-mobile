<template>
  <view class="container">
    <view class="profile">
      <text class="title">个人中心</text>
    </view>
    <view class="menu">
      <view class="menu-item" @click="logout">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    logout() {
      uni.showModal({
        title: '提示',
        content: '确认退出登录？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.reLaunch({ url: '/pages/index/index' })
          }
        }
      })
    }
  }
}
</script>

<style>
.container { background: #f5f5f5; min-height: 100vh; }
.profile { background: #409eff; color: #fff; padding: 80rpx 30rpx; }
.title { font-size: 40rpx; font-weight: bold; }
.menu { margin-top: 20rpx; }
.menu-item { background: #fff; padding: 30rpx; margin-bottom: 2rpx; font-size: 28rpx; }
</style>
