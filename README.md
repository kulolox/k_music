# 酷音乐

音乐网站，RE:从零开始的 TYPESCRIPT 程序猿生活【括弧ヾ(≧▽≦\*)o】。

## 前端技术栈：

- typescript 本项目的重点，学习及练习 ts，完全新手，大佬可以忽略
- react 主要使用 react hooks
- redux 状态管理使用了 redux，并使用了@reduxjs/toolkit 工具包
- antd design UI 框架使用了 antd design
- less antd design 使用的为 less 预处理语言，为了统一我使用的也是 less

## 后端技术栈

数据源来自网易云音乐，接口服务来自[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi)

具体使用方式请参展官方文档，写的挺详细的。

- docker
- docker-compose

特别说明下一个镜像 steveltn/https-portal，使用 docker-componse 可以通过简单的配置完成证书申请与配置、nginx 端口转发，让我们专注前端开发，而不用花费太多时间在接口数据上面。

## 本地预览

```
git clone https://github.com/kulolox/k_music.git

npm i

npm start
```
