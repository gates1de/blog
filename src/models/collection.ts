export default class Collection {
  id: string
  parent_id: string
  title: string
  version: string
  type: string
  properties: { [key: string]: any }
  content: string[]
  category?: string
  created_time?: number
  last_edited_time?: number

  constructor(init?: Partial<Collection>) {
    this.id = init?.id || ''
    this.parent_id = init?.parent_id || ''
    this.version = init?.version || ''
    this.type = init?.type || ''
    this.properties = init?.properties || {}
    this.content = init?.content || []
    this.created_time = init?.created_time
    this.last_edited_time = init?.last_edited_time
    this.title = this.properties.title || 'Untitled'
    this.category = init?.category
  }

  static parseJSON = (id: string, json: any): Collection[] => {
    if (!json) {
      return []
    }
    let category = ''
    try {
      category = json.recordMap.collection[id]?.value.name[0][0]
    } catch {}
    const block = json.recordMap.block
    const collections: Collection[] = []
    Object.keys(block).forEach((key) => {
      const collectionData = block[key]
      if (!collectionData.value) {
        return
      }
      collections.push(new Collection({
        category: category,
        ...collectionData.value,
      }))
    })
    return collections
  }

  get parentId(): string {
    return this.parent_id
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
