import request from './request';
const baseUrl = 'https://api.kulolox.cn';

/**
 * 获取首页轮播图
 * @param {string} type [0:pc;1:android;2:iphone;3:ipad]
 */
function getBanner(type: number) {
  return request.get(`${baseUrl}/banner?type=${type}`);
}

/**
 * 获取歌单分类
 */
function getCatlist() {
  return request.get(`${baseUrl}/playlist/catlist`);
}

/**
 * 获取歌单分类
 */
function getHotCatlist() {
  return request.get(`${baseUrl}/playlist/hot`);
}

// 歌单查询参数
interface IAlbum {
  limit: number;
  cat: string;
  offset: number;
  order?: string;
}

/**
 * 获取歌单
 */
function getAlbumList({ limit, cat, offset = 0, order = 'hot' }: IAlbum) {
  return request.get(`${baseUrl}/top/playlist/?limit=${limit}&order=${order}&offset=${offset}&cat=${cat}`);
}

/**
 * 获取（歌单）专辑 详情
 * @param {string} id
 */
function getAlbumDetail(id: string) {
  return request.get(`${baseUrl}/playlist/detail?id=${id}`);
}

/**
 * 获取歌曲列表
 * @param {string} id
 */
function getSongList(ids: string) {
  return request.get(`${baseUrl}/song/url?id=${ids}`);
}

export { getBanner, getCatlist, getHotCatlist, getAlbumList, getAlbumDetail, getSongList };
