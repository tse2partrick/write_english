# write_english

## 仿爱词霸背单词，练手项目.

## 项目思路
1. 项目目录搭建.
2. node服务代理转发请求，得到并格式化词霸关卡数据.
3. 数据渲染到页面.
4. 本地存储关卡数，挑战关卡逻辑.
5. 打包.

## 设计初衷是爱词霸没有手机版本，原生APP没有WEB版的默写功能，于是想到用vue做个类似的手机版本。整体有些简陋...，数据是代理金山爱词霸网页版的数据，用正则抓出单词、发音、释义，自己再写一些关卡逻辑。


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
