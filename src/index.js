//引入express中间件
var express = require('express');
const http = require('http')
var router = express.Router()
var app = express();

//ip 的插件
const ip = require('ip')
const IP = ip.address();

http.createServer(app).listen(3000);

app.get('/',(req,res) => {
  res.send(`Hello Word!!!`); // 响应数据的方法之一
})
app.get('/123',(req,res) => {
  res.send(`Hello Word111111!!!`); // 响应数据的方法之一
})
