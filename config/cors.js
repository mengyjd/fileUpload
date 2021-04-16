import cors from 'koa2-cors'

const corsConfig = cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    const origin = ctx.request.header.origin
    return 'http://localhost:111';
  },
  maxAge: 10, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
})



export default corsConfig
