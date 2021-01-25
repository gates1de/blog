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
