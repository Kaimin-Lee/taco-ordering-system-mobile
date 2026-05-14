const BASE_URL = 'http://2610c67a.r21.cpolar.top/api'

let isRedirecting = false

const request = (url, options = {}) => {
  const token = uni.getStorageSync('token')
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        console.log('request success - statusCode:', res.statusCode, 'data:', JSON.stringify(res.data))
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401 && !isRedirecting) {
          isRedirecting = true
          uni.removeStorageSync('token')
          uni.reLaunch({ url: '/pages/index/index' })
          setTimeout(() => { isRedirecting = false }, 3000)
          reject(new Error('未登录'))
        } else {
          uni.showToast({ title: res.data?.message || '请求失败', icon: 'none' })
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export default {
  get: (url, data) => request(url, { method: 'GET', data }),
  post: (url, data) => request(url, { method: 'POST', data }),
  put: (url, data) => request(url, { method: 'PUT', data }),
  delete: (url, data) => request(url, { method: 'DELETE', data })
}
