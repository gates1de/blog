export default class PageChunk {
  id: string
  version: string
  type: string
  properties: { title: any[] }
  contents: {
    text?: string
    link?: {
      text: string
      url: string
      hash?: string
    }
  }[]
  created_time?: number
  last_edited_time?: number

  constructor(init?: Partial<PageChunk>) {
    this.id = init?.id || ''
    this.version = init?.version || ''
    this.type = init?.type || ''
    this.properties = init?.properties || { title: [] }
    this.contents = []
    this.created_time = init?.created_time
    this.last_edited_time = init?.last_edited_time

    const title = this.properties.title
    if (title && title.length > 0) {
      title.forEach((p) => {
        if (!Array.isArray(p) || p.length === 0) {
          return
        }

        // parse plane text
        if (p.length === 1 && typeof p[0] === 'string') {
          this.contents.push({ text: p[0] })
          return
        }

        // parse link
        if (
          p.length !== 2 ||
          (typeof p[0] !== 'string' && !Array.isArray(p[1])) ||
          p[1][0].length !== 2
        ) {
          return
        }

        const linkValues = p[1][0]
        if (linkValues[0] === 'a' && typeof linkValues[1] === 'string') {
          const url = linkValues[1]
          let hash: string | undefined
          if (url.startsWith('/') && url.includes('#')) {
            hash = url.split('#')[1]
          }
          this.contents.push({
            link: { text: p[0] || '', url: linkValues[1], hash: hash },
          })
        }
      })
    }
  }

  static parseJSON = (json: any): PageChunk[] => {
    if (!json) {
      return []
    }
    const block = json.recordMap.block
    const pageChunks: PageChunk[] = []
    Object.keys(block).forEach((key) => {
      const pageChunkData = block[key]
      if (!pageChunkData.value) {
        return
      }
      pageChunks.push(new PageChunk(pageChunkData.value))
    })
    return pageChunks
  }

  get createdTime(): number | undefined {
    return this.created_time
  }

  get createdTimeString(): string | undefined {
    if (!this.createdTime) {
      return undefined
    }
    const date = new Date(this.createdTime)
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  get lastEditedTime(): number | undefined {
    return this.last_edited_time
  }

  get lastEditedTimeString(): string | undefined {
    if (!this.lastEditedTime) {
      return undefined
    }
    const date = new Date(this.lastEditedTime)
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}
