# 酷音乐

音乐网站，RE:从零开始的 TYPESCRIPT 程序猿生活【括弧ヾ(≧▽≦\*)o】。

## 前端技术栈：

- typescript 本项目的重点，学习及练习 ts，完全新手，大佬可以忽略
- react 主要使用 react hooks 复习下 hooks 用法
- redux 状态管理使用了 redux，并使用了@reduxjs/toolkit 工具包
- ant-design UI 框架使用了 ant-design
- less ant-design 使用的为 less 预处理语言，为了统一我使用的也是 less

## 后端技术栈

数据源来自网易云音乐，接口服务来自[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi)

具体使用方式请参展官方文档，写的挺详细的。

- docker
- docker-compose

docker 镜像 steveltn/https-portal，使用 docker-componse 可以通过简单的配置完成证书申请与配置、nginx 端口转发，让我们专注前端开发，而不用花费太多时间在接口数据上面。

## 实现功能

1. 轮播图，由于不知道轮播图跳转的逻辑，暂时为纯展示
2. 歌单列表，选择歌单分类、页码选择
3. 歌单详情页
4. 播放器，上一曲、下一曲、播放、暂停、音量调节、自动播放下一曲、歌曲列表、歌词

## 本地预览

```
git clone https://github.com/kulolox/k_music.git

npm i

npm start
```

## 已知问题

目前已知的问题多来自于数据接口，毕竟不是自己的数据，不可控因素太多，音频链接有时效、高频次接口请求可能被网易封 ip、服务器是否在国内，等等。不过练手的项目这些问题都可以忽略啦。

- 歌单的播放链接有很多无法获取到（可以和我服务器不在国内有关【等国内有便宜的云主机再迁移过来】）
- 相同的音频文件请求次数过多，可能触发 403 错误
- 播放过程中音频文件可能突然触发 403 错误，一般是因为歌曲链接有缓存，而我是一开始就获取到所有的歌曲链接（判断歌曲是否可以播放），并作了本地缓存（防止高频次接口请求，导致 ip 被封）
