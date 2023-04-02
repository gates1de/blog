import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { formatDate } from 'utils/date'

export default class Page {
  readonly id: string
  readonly title: string
  readonly archived: boolean
  readonly createdTime: Date
  readonly tags: string[]
  readonly lastEditedTime?: Date
  readonly publishedAt?: Date

  constructor(params: Partial<Page>) {
    this.id = params.id || ''
    this.archived = params.archived || false
    this.title = params.title || ''
    this.createdTime = params.createdTime || new Date()
    this.tags = params.tags || []
    this.lastEditedTime = params.createdTime
    this.publishedAt = params.publishedAt
  }

  get createdTimeText() {
    return formatDate(this.createdTime, 'yyyy-MM-dd')
  }

  static createFromDatabaseResponse = (
    res: PageObjectResponse,
  ): Page | undefined => {
    const createdTimeMilliSeconds = Date.parse(res.created_time)
    if (!res.id || isNaN(createdTimeMilliSeconds) || !res.properties.Name) {
      return
    }

    let title = ''
    if (
      res.properties.Name.type === 'title' &&
      res.properties.Name.title.length > 0
    ) {
      title = res.properties.Name.title[0].plain_text
    }

    const createdTime = new Date(createdTimeMilliSeconds)

    let tags: string[] = []
    if (res.properties.Tags.type === 'multi_select') {
      tags = res.properties.Tags.multi_select.map((val) => val.name)
    }

    const lastEditedTimeMilliSeconds = Date.parse(res.last_edited_time)
    const lastEditedTime = !isNaN(lastEditedTimeMilliSeconds)
      ? new Date(lastEditedTimeMilliSeconds)
      : undefined

    let publishedAtMilliSeconds = NaN
    if (res.properties.published_at.type === 'date') {
      publishedAtMilliSeconds = Date.parse(
        res.properties.published_at.date?.start || '',
      )
    }
    const publishedAt = !isNaN(publishedAtMilliSeconds)
      ? new Date(publishedAtMilliSeconds)
      : undefined

    return new Page({
      id: res.id,
      title: title,
      archived: res.archived,
      createdTime: createdTime,
      tags: tags,
      lastEditedTime: lastEditedTime,
      publishedAt: publishedAt,
    })
  }
}
