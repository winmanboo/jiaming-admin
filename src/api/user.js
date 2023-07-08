import request from '@/utils/request'
import { Base64 } from 'js-base64'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function captchaLogin(data) {
  return request({
    url: '/uaa/oauth2/token',
    method: 'post',
    headers: {
      'Authorization': `Basic ${Base64.encode('default:default_secret')}`,
      'key': data.key,
      'code': data.code,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      username: data.username,
      password: data.password,
      grant_type: data.grant_type,
      scope: data.scope
    }),
  })
}

export function captcha() {
  return request({
    url: '/uaa/auth/captcha',
    method: 'get'
  })
}
