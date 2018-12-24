import axios from 'axios'
// qs插件
import qs from 'qs'

// import serverParams from '../store/serverParams'

import CryptoJS from 'crypto-js'

// const studentUserId = serverParams.studentUserId
const studentUserId = 8999248

function post(url, data, time = 0) {
  if (!url.startsWith('http')) {
    // url = process.env.HOST + url
    url = `https://mobile.up360.com${url}`
  }
  return axios
    .post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(err => {
      // 返回数据
      return Promise.reject(err)
    })
}

function afterPost(url, data, time = 0) {
  return post(url, data, time).then(
    res => {
      res = res.data
      if (res.result === '1') {
        // 请求成功
        return Promise.resolve(res.data)
      } else {
        // 请示其它状态
        return Promise.reject(res)
      }
    },
    err => {
      // 请示其它状态
      let errData = {
        status: '404',
        msg: err
      }
      return Promise.reject(errData)
    }
  )
}

function postWithCommonArgs(url, data, time = 0) {
  let random = Math.random().toString()
  random = random.substring(random.length - 6, random.length - 1)
  let key = 'UP360_sysion'
  let imei = 'cp_h5_imei'
  let str = url + key + random

  // const hash = crypto.createHash('md5')
  // hash.update(str)
  // str = hash.digest('hex')
  str = CryptoJS.MD5(str).toString()

  let sessionKey = str + ';' + imei + ';' + studentUserId

  let postData = { random, sessionKey }
  postData.appId = 'cp_h5_app_id'
  postData.params = data

  let moJson = JSON.stringify(postData)
  let promise = afterPost(url, { moJson }, time)
  return promise
}

export default { post, afterPost, postWithCommonArgs }
