import request from './request';
import { AxiosResponse } from 'axios';
const baseUrl = 'http://localhost:4000';

/**
 * 获取首页轮播图
 * @param {string} type [0:pc;1:android;2:iphone;3:ipad]
 */
function getBanner(type: number): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/banner?type=${type}`);
}

/**
 * 获取歌单分类
 */
function getCatlist(): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/playlist/catlist`);
}

/**
 * 获取歌单分类
 */
function getHotCatlist(): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/playlist/hot`);
}

// 歌单查询参数
interface AlbumArg {
  limit: number;
  cat: string;
  offset: number;
  order?: string;
}

/**
 * 获取歌单
 */
function getAlbumList({ limit, cat, offset = 0, order = 'hot' }: AlbumArg): Promise<AxiosResponse> {
  return request.get(
    `${baseUrl}/top/playlist/?limit=${limit}&order=${order}&offset=${offset}&cat=${cat}`,
  );
}

/**
 * 获取（歌单）专辑 详情
 * @param {string} id
 */
function getAlbumDetail(id: string): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/playlist/detail?id=${id}`);
}

/**
 * 获取歌曲列表
 * @param {string} id
 */
function getSongList(ids: string): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/song/detail?ids=${ids}`);
}

/**
 * 获取歌曲播放链接
 * @param {number} id
 */
function getSongUrl(id: number): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/song/url?id=${id}`);
}

/**
 * 获取歌曲歌词
 * @param {number} id
 */
function getSongLyric(id: number): Promise<AxiosResponse> {
  return request.get(`${baseUrl}/lyric?id=${id}`);
}

export {
  getBanner,
  getCatlist,
  getHotCatlist,
  getAlbumList,
  getAlbumDetail,
  getSongList,
  getSongUrl,
  getSongLyric,
};
