import request from '@/utils/request.js'

export const authApi = {
  login: (code, nickname, phone) => request.post('/c/auth/login', { code, nickname, phone }),
  loginWithPhone: (code, encryptedData, iv) => request.post('/c/auth/login', { code, encryptedData, iv })
}

export const userApi = {
  info: () => request.get('/c/user/info'),
  update: (data) => request.put('/c/user/info', data)
}

export const productApi = {
  getMenu: () => request.get('/c/product/menu')
}

export const orderApi = {
  submit: (data) => request.post('/c/order/submit', data),
  myOrders: () => request.get('/c/order/my'),
  getDetail: (orderNo) => request.get(`/c/order/detail/${orderNo}`)
}
