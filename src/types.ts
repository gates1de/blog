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

export type NavigationItem = {
  title: string
  link: string
}
