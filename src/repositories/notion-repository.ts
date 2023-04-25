import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import PageBlock from 'models/page-block'

export default class NotionRepository {
  private static _instance: NotionRepository

  readonly notionClient = new Client({ auth: process.env.NOTION_KEY })

  constructor() {}

  public static shared(): NotionRepository {
    if (!this._instance) {
      this._instance = new NotionRepository()
    }
    return this._instance
  }

  fetchPosts = async (databaseId: string) => {
    const response = await this.notionClient.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'published_at',
          direction: 'descending',
        },
      ],
    })
    return response.results.filter((page): page is PageObjectResponse => !!page)
  }

  fetchPage = async (pageId: string) => {
    return await this.notionClient.pages.retrieve({ page_id: pageId })
  }

  fetchPageBlocks = async (pageId: string) => {
    const response = await this.notionClient.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    })

    const tasks = response.results.map(
      async (result): Promise<PageBlock | undefined> => {
        // TODO: Fetch children recursively & Support other types
        if (
          'type' in result &&
          result.type === 'bulleted_list_item' &&
          result.has_children
        ) {
          const children = await this.fetchPageBlocks(result.id)
          return PageBlock.parseJSON(result, children)
        }

        return PageBlock.parseJSON(result)
      },
    )

    const results = await Promise.all(tasks)
    return results.filter((pb): pb is PageBlock => !!pb)
  }
}
