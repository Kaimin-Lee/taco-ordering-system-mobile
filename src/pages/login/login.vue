<template>
  <view class="container">
    <view class="logo-section">
      <text class="logo">🌮</text>
      <text class="title">街头塔可</text>
      <text class="subtitle">欢迎您的光临</text>
    </view>

    <view class="login-section">
      <button class="login-btn" :loading="logging" @click="handleLogin">
        <text v-if="!logging">微信一键登录</text>
        <text v-else>登录中...</text>
      </button>
      <text class="hint">登录即表示同意《用户协议》和《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import { authApi } from '@/api/index.js'

export default {
  data() {
    return {
      logging: false
    }
  },
  onLoad() {
    const token = uni.getStorageSync('token')
    if (token) {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  },
  methods: {
    async handleLogin() {
      if (this.logging) return

      this.logging = true

      try {
        console.log('开始微信登录...')

        const loginRes = await uni.login({ provider: 'weixin' })
        console.log('uni.login result:', loginRes)

        if (!loginRes.code) {
          throw new Error('获取code失败')
        }

        let nickname = '塔可食客'

        try {
          const profileRes = await new Promise((resolve, reject) => {
            uni.getUserProfile({
              provider: 'weixin',
              desc: '用于获取您的昵称',
              success: resolve,
              fail: reject
            })
          })
          console.log('getUserProfile result:', profileRes)
          if (profileRes.userInfo && profileRes.userInfo.nickName) {
            nickname = profileRes.userInfo.nickName
          }
        } catch (profileErr) {
          console.log('获取微信昵称失败，使用默认昵称:', profileErr)
        }

        console.log('最终昵称:', nickname)

        const res = await authApi.login(loginRes.code, nickname, '')
        console.log('登录响应完整结构:', JSON.stringify(res, null, 2))
        console.log('res类型:', typeof res)
        console.log('res.data:', res?.data)

        const token = res?.data
        if (!token) {
          throw new Error('登录失败：未获取到token')
        }

        uni.setStorageSync('token', token)
        uni.setStorageSync('nickname', nickname)
        uni.setStorageSync('phone', '')

        uni.showToast({ title: '登录成功', icon: 'success' })

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 500)

      } catch (err) {
        console.error('登录失败:', err)
        uni.showToast({ title: '登录失败: ' + (err.message || '请重试'), icon: 'none' })
        this.logging = false
      }
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
  background: linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%);
  display: flex;
  flex-direction: column;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15vh;
  flex-shrink: 0;
}

.logo {
  font-size: 160rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 56rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
}

.login-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15vh;
}

.login-btn {
  width: 480rpx;
  height: 88rpx;
  background: #fff;
  color: #fa8c16;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
}

.login-btn::after {
  border: none;
}

.login-btn[loading] {
  opacity: 0.7;
}

.hint {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 30rpx;
  text-align: center;
}
</style>