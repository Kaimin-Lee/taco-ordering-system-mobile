<template>
  <view class="container">
    <view class="header" @click="editNickname">
      <view class="avatar">
        <text>🌮</text>
      </view>
      <view class="info">
        <text class="nickname">{{ nickname }}</text>
      </view>
      <text class="edit-hint">点击编辑 ›</text>
    </view>

    <view class="menu-list">
      <button class="menu-btn" @click="showAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
        </view>
        <text class="menu-arrow">›</text>
      </button>
      <button class="menu-btn" @click="logout">
        <view class="menu-left">
          <text class="menu-icon">🚪</text>
          <text class="menu-text logout">退出登录</text>
        </view>
        <text class="menu-arrow">›</text>
      </button>
    </view>

    <view class="footer">
      <text>街头塔可 v1.0.0</text>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api/index.js'

export default {
  data() {
    return {
      nickname: '塔可食客'
    }
  },
  onShow() {
    const savedNickname = uni.getStorageSync('nickname')
    if (savedNickname) {
      this.nickname = savedNickname
    }
  },
  methods: {
    editNickname() {
      uni.showModal({
        title: '修改昵称',
        placeholderText: '请输入昵称',
        editable: true,
        defaultText: this.nickname,
        success: async (res) => {
          if (res.confirm && res.content && res.content.trim()) {
            const newNickname = res.content.trim()
            try {
              await userApi.update({ nickname: newNickname })
              this.nickname = newNickname
              uni.setStorageSync('nickname', newNickname)
              uni.showToast({ title: '修改成功', icon: 'success' })
            } catch (err) {
              console.error('修改昵称失败:', err)
              uni.showToast({ title: '修改失败', icon: 'none' })
            }
          }
        }
      })
    },
    showAbout() {
      uni.showModal({
        title: '关于我们',
        content: '街头塔可 - 美味的墨西哥塔可',
        showCancel: false
      })
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确认退出登录？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.removeStorageSync('nickname')
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
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
  padding: 60rpx 30rpx 80rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
}

.avatar text {
  font-size: 60rpx;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  flex: 1;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.edit-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
}

.menu-list {
  padding: 30rpx 30rpx 0;
}

.menu-btn {
  width: 100%;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 2rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx 30rpx;
  box-sizing: border-box;
}

.menu-btn::after {
  border: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 30rpx;
  color: #333;
}

.menu-text.logout {
  color: #ff4d4f;
}

.menu-arrow {
  font-size: 36rpx;
  color: #ccc;
}

.footer {
  text-align: center;
  padding: 60rpx 0;
}

.footer text {
  font-size: 24rpx;
  color: #c0c4cc;
}
</style>
