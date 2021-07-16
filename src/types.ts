export type GetSignedUrlsRequestParams = {
  urls: {
    url: string
    permissionRecord: {
      id: string
      table: 'block'
    }
  }[]
}

export type LoadPageChunkRequestParams = {
  pageId: string
  limit: number
  cursor: {
    stack: [
      [
        {
          table: 'block'
          id: string
          index: number
        },
      ],
    ]
  }
  verticalColumns: boolean
  chunkNumber: number
}

export type QueryCollectionRequestParams = {
  collectionId: string
  collectionViewId: string
  loader: {
    reducers: {
      collection_group_results: {
        limit?: number
        type: 'results'
      }
    }
    loadContentCover?: boolean
    searchQuery?: string
    type: 'reducer'
    userTimeZone?: string
  }
  query?: { [key: string]: any }
}

export type NavigationItem = {
  title: string
  link: string
}
