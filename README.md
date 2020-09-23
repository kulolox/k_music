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

## 已知 bug

- 相同的音频文件请求次数过多，可能触发 403 错误
