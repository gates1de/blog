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
    limit?: number
    loadContentCover?: boolean
    searchQuery?: string
    type: 'table'
    userTimeZone?: string
  }
  query?: {[key: string]: any}
}

export type NavigationItem = {
  title: string
  link: string
}
