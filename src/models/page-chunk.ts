export default class PageChunk {
  id: string
  contents: {
    text?: string
    isBold?: boolean
    isCodeBlock?: boolean
    language?: string // for type === 'code'
    link?: {
      text: string
      url: string
      hash?: string
    }
  }[]
  created_time?: number
  format?: {
    block_aspect_ratio?: number
    block_width: number
    display_source: string
    page_icon?: string
  }
  last_edited_time?: number
  properties: { title: any[]; language?: string }
  type: string
  version: string

  constructor(init?: Partial<PageChunk>) {
    this.id = init?.id || ''
    this.contents = []
    this.created_time = init?.created_time
    this.format = init?.format
    this.last_edited_time = init?.last_edited_time
    this.type = init?.type || ''
    this.properties = init?.properties || { title: [] }
    this.version = init?.version || ''

    const title = this.properties.title
    if (title && title.length > 0) {
      title.forEach((p) => {
        if (!Array.isArray(p) || p.length === 0) {
          return
        }

        if (p.length > 0 && typeof p[0] === 'string') {
          // parse plane text
          if (p.length === 1) {
            this.contents.push({ text: p[0] })
            return
          }

          // parse [bold, code block] text
          if (
            p.length === 2 &&
            Array.isArray(p[1]) &&
            p[1].length > 0 &&
            Array.isArray(p[1][0]) &&
            p[1][0].length === 1
          ) {
            if (p[1][0][0] === 'b') {
              this.contents.push({ text: p[0], isBold: true })
            } else if (p[1][0][0] === 'c') {
              this.contents.push({ text: p[0], isCodeBlock: true })
            }
            return
          }

          // parse link
          if (
            p.length === 2 &&
            typeof p[0] === 'string' &&
            Array.isArray(p[1]) &&
            p[1][0].length === 2 &&
            p[1][0][0] === 'a' &&
            typeof p[1][0][1] === 'string'
          ) {
            const linkValues = p[1][0]
            const url = linkValues[1]
            let hash: string | undefined
            if (url.startsWith('/') && url.includes('#')) {
              hash = url.split('#')[1]
            }
            this.contents.push({
              link: { text: p[0] || '', url: linkValues[1], hash: hash },
            })
            return
          }
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

  get imageSource(): string | undefined {
    if (this.type !== 'image' || !this.format) {
      return undefined
    }
    return this.format.display_source
  }

  get imageWidth(): number | undefined {
    if (this.type !== 'image' || !this.format) {
      return undefined
    }
    return this.format.block_width
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
