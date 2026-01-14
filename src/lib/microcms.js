// src/lib/microcms.js

import { createClient } from "microcms-js-sdk";

// APIクライアントの初期化
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.MICROCMS_API_KEY || "",
});

/**
 * ブログ一覧を取得する関数
 * @param {import("microcms-js-sdk").MicroCMSQueries} [queries] 
 */
export const getList = async (queries) => {
  const listData = await client.getList({
    endpoint: "blogs",
    queries,
    customRequestInit: { cache: 'no-store' },
  });
  return listData;
};

/**
 * ブログ詳細を取得する関数
 * @param {string} contentId 
 * @param {import("microcms-js-sdk").MicroCMSQueries} [queries] 
 */
export const getDetail = async (contentId, queries) => {
  const detailData = await client.getListDetail({
    endpoint: "blogs",
    contentId,
    queries,
  });
  return detailData;
};