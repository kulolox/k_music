# 酷音乐

音乐网站，RE:从零开始的 TYPESCRIPT 程序猿生活【括弧ヾ(≧▽≦\*)o】。

## 前端技术栈：

- typescript 本项目的重点，学习及练习 ts，完全新手，大佬可以忽略

- react 主要使用 react hooks 复习下 hooks 用法

- redux 状态管理使用了 redux，并使用了@reduxjs/toolkit 工具包

- ant-design UI 框架使用了 ant-design

- less ant-design 使用的是 less 预处理语言，为了统一我使用的也是 less

## 后端技术栈

数据源来自网易云音乐，接口服务来自[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi)

具体使用方式请参展官方文档，写的挺详细的。

- docker
- docker-compose

docker 镜像 steveltn/https-portal，使用 docker-componse 可以通过简单的配置完成证书申请与配置、nginx 端口转发，让我们专注前端开发，而不用花费太多时间在接口数据上面。

## 实现功能

- 轮播图，由于不知道轮播图跳转的逻辑，暂时为纯展示
- 歌单分类选择器
- 歌单列表，分页查询功能
- 歌单详情页，一键导入歌曲至播放器，歌曲列表
- 音乐播放器
  1. 播放/暂停
  2. 上一曲/下一曲
  3. 播放进度拖拽
  4. 音量调节
  5. 歌曲列表，滚动歌词功能

## 本地预览

```
git clone https://github.com/kulolox/k_music.git

npm install

npm run dev
```

## 线上地址

[https://music.xujianfeng.club](https://music.xujianfeng.club)

## 已知问题

目前已知的问题多来自于数据接口，毕竟不是自己的数据，不可控因素太多，音频链接有时效、高频次接口请求可能被网易封 ip、服务器是否在国内，等等。不过练手的项目这些问题都可以忽略啦。

- 未添加 loading 状态组件

- 歌单的播放链接有很多无法获取到（和我服务器不在国内有关）

- 歌单详情页如果歌曲数量较多可能要加载较长时间，不过我加了本地缓存，第二次进来就好很多了

## 感悟和心得

- typescript 使用熟练度不够，还需要强化学习

- redux 写小项目太痛苦了，虽然@reduxjs/toolkit 精简了很多代码，但是异步 action 部分，网上教程也太少了吧，自己摸索着写了一个，但总感觉不对劲。以后个人项目还是用 mobx 来写吧。

- 服务器在国外，请求有点慢，而且可以播放的歌曲可能无法获取 url，导致不得不先全量请求一次 url，再根据 url 是否存在来判断歌曲是否播放，播放链接有时效，又需要在每次播放前重新获取一次 url /(ㄒ o ㄒ)/~~

- hooks 理解不够透彻，开始没有开启'react-hooks/exhaustive-deps': 'warn',导致很多 useEffect、useCallback 的依赖没有写，出现了一些很难定位的 bug，使用 hooks 请一定打开该规则。

- nginx 问题，这个应该所有单页面应用都会有。对于 hash 模式的路由无需配置 nginx，但对于 browser 模式的路由，二级页面刷新时会出现 404 问题，网上已经有很多教程了。但我想说的是，steveltn/https-portal 这个镜像的 nignx 配置文件是/ect/nginx/conf.d/[yourProjectName].ssl.conf,而不是/ect/nginx/conf.d/[yourProjectName].conf。这个东西找了特别久，因为该容器为我们配置了 ssl 证书，它走的端口是 443，而不是 80。

## 项目截图

- 首页

  ![首页](/IMAGE/home.png)

- 详情页

  ![详情页](/IMAGE/album.png)

- 播放器

  ![播放器](/IMAGE/player.png)
