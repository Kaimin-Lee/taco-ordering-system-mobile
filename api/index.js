import request from '@/utils/request.js'

export const authApi = {
  login: (code) => request.post('/c/auth/login', { code })
}

export const productApi = {
  getMenu: () => request.get('/c/product/menu')
}

export const orderApi = {
  submit: (data) => request.post('/c/order/submit', data),
  myOrders: () => request.get('/c/order/my')
}
