export default class PageChunk {
  id: string
  version: string
  type: string
  properties: { title: any[] }
  contents: { text?: string; link?: { text: string; url: string } }[]

  constructor(init?: Partial<PageChunk>) {
    this.id = init?.id || ''
    this.version = init?.version || ''
    this.type = init?.type || ''
    this.properties = init?.properties || { title: [] }
    this.contents = []

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
          this.contents.push({ link: { text: p[0] || '', url: linkValues[1] } })
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
}
