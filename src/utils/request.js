import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

axios.defaults.timeout =  10000;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 7000 ,// request timeout
  retry:4,
  retryDelay: 1000
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //config.headers['X-Token'] = getToken()
      if(config.params){
          config.params.token=store.getters.token;
          config.params.username=store.getters.name;
          if(!store.getters.isAdmin)config.params.userid=store.getters.userid;
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
   
    if (res.code!=0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === -50008 || res.code === -50012 || res.code === -50014) {
        // to re-login
        if(res.code === -50012 ){
            MessageBox.confirm(res.msg, '错误', {
              confirmButtonText: '重新登陆',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload()
              })
            })
        }
        if(res.code === -50008 ){
          Message({
            message: res.msg,
            type: 'info',
            duration: 4 * 1000
          })
          location.reload()
        }
 
      }else if(res.code === -301){
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 4 * 1000
        })
      }else{
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: "有点慢,可以再次点击按钮",
      type: 'warning',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
