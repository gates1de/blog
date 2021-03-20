import axios, { AxiosRequestConfig } from 'axios'

import Collection from 'models/collection'
import PageChunk from 'models/page-chunk'
import SignedFileUrl from 'models/signed-file-url'
import {
  GetSignedUrlsRequestParams,
  LoadPageChunkRequestParams,
  QueryCollectionRequestParams,
} from 'types'

export default class NotionRepository {
  private static _instance: NotionRepository

  constructor() {}

  public static shared(): NotionRepository {
    if (!this._instance) {
      this._instance = new NotionRepository()
    }
    return this._instance
  }

  getSingedFileUrls = async (
    blockId: string,
    url: string,
  ): Promise<SignedFileUrl[]> => {
    if (!process.env.NOTION_TOKEN) {
      throw new Error('Not set process.env.NOTION_TOKEN')
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Cookie: process.env.NOTION_TOKEN,
      },
    }
    const params: GetSignedUrlsRequestParams = {
      urls: [{ url: url, permissionRecord: { table: 'block', id: blockId } }],
    }
    const result = await axios.post(
      'https://www.notion.so/api/v3/getSignedFileUrls',
      params,
      config,
    )
    return SignedFileUrl.parseJSON(blockId, result.data)
  }

  loadPageChunk = async (
    pageId: string,
    limit = 50,
  ): Promise<{
    pageChunks: PageChunk[]
    collection: Collection
  }> => {
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
      !result.data.recordMap.block ||
      !result.data.recordMap.collection
    ) {
      throw new Error('Page data not found')
    }

    const pageChunks = PageChunk.parseJSON(result.data)
    const mainPageChunk = pageChunks.find((p) => p.id === pageId)
    if (!mainPageChunk || !mainPageChunk.parent_id) {
      return []
    }
    const collectionId = mainPageChunk.parent_id
    const collection = new Collection(
      result.data.recordMap.collection[collectionId]?.value,
    )
    try {
      collection.category =
        result.data.recordMap.collection[collectionId]?.value.name[0][0]
    } catch {}
    return {
      pageChunks: pageChunks,
      collection: collection,
    }
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

    return Collection.parseJSON(collectionId, result.data)
  }
}
