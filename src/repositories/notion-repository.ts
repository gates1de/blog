import axios, { AxiosRequestConfig } from 'axios'

import Collection from 'models/collection'
import PageChunk from 'models/page-chunk'
import { LoadPageChunkRequestParams, QueryCollectionRequestParams } from 'types'

export default class NotionRepository {
  private static _instance: NotionRepository

  constructor() {}

  public static shared(): NotionRepository {
    if (!this._instance) {
      this._instance = new NotionRepository()
    }
    return this._instance
  }

  loadPageChunk = async (pageId: string, limit = 50): Promise<PageChunk[]> => {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('Not set process.env.NOTION_TOKEN')
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Cookie: process.env.NOTION_TOKEN,
      },
    }
    const params: LoadPageChunkRequestParams = {
      pageId: pageId,
      limit: limit,
      cursor: {
        stack: [
          [
            {
              table: 'block',
              id: pageId,
              index: 0,
            },
          ],
        ],
      },
      verticalColumns: false,
      chunkNumber: 0,
    }
    const result = await axios.post(
      'https://www.notion.so/api/v3/loadPageChunk',
      params,
      config,
    )
    if (
      !result.data ||
      !result.data.recordMap ||
      !result.data.recordMap.block
    ) {
      throw new Error('Page data not found')
    }

    return PageChunk.parseJSON(result.data)
  }

  queryCollection = async (
    collectionId: string,
    collectionViewId: string,
    limit?: number,
  ): Promise<Collection[]> => {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('Not set process.env.NOTION_TOKEN')
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Cookie: process.env.NOTION_TOKEN,
      },
    }
    const params: QueryCollectionRequestParams = {
      collectionId: collectionId,
      collectionViewId: collectionViewId,
      loader: {
        limit: limit,
        type: 'table',
        userTimeZone: 'Azia/Tokyo',
      },
    }
    const result = await axios.post(
      'https://www.notion.so/api/v3/queryCollection',
      params,
      config,
    )
    if (
      !result.data ||
      !result.data.recordMap ||
      !result.data.recordMap.block
    ) {
      throw new Error('Page data not found')
    }

    return Collection.parseJSON(result.data)
  }
}
