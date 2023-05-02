import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

type BulletedListItemObject = {
  color?: string
  children?: BulletedListItemObject[]
}

type CalloutObject = {
  color?: string
  icon?: { emoji?: string; type: 'emoji' }
}

type CodeObject = {
  caption: RichTextItemResponse[]
  language: string
}

type ImageObject = {
  caption: RichTextItemResponse[]
  file?: { expiryTime: string; url: string }
}

type VideoObject = {
  caption: RichTextItemResponse[]
  external?: { url: string; embedUrl: string }
}

type PageBlockType =
  | 'audio'
  | 'bookmark'
  | 'breadcrumb'
  | 'bulleted_list_item'
  | 'callout'
  | 'child_database'
  | 'child_page'
  | 'code'
  | 'column'
  | 'column_list'
  | 'divider'
  | 'embed'
  | 'equation'
  | 'file'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'image'
  | 'link_preview'
  | 'link_to_page'
  | 'none'
  | 'numbered_list_item'
  | 'paragraph'
  | 'pdf'
  | 'quote'
  | 'synced_block'
  | 'table'
  | 'table_of_contents'
  | 'table_row'
  | 'template'
  | 'to_do'
  | 'toggle'
  | 'unsupported'
  | 'video'

export default class PageBlock {
  readonly id: string
  readonly archived: boolean
  readonly createdTime: string
  readonly lastEditedTime: string
  readonly parent: { type: 'page_id'; page_id: string }
  readonly type: PageBlockType

  readonly bulletedListItem?: BulletedListItemObject
  readonly bulletedListItemChildren?: PageBlock[]
  readonly callout?: CalloutObject
  readonly code?: CodeObject
  readonly hasChildren?: boolean
  readonly image?: ImageObject
  readonly richTexts?: RichTextItemResponse[]
  readonly video?: VideoObject

  constructor(params: Partial<PageBlock>) {
    this.id = params.id || ''
    this.archived = params.archived || false
    this.createdTime = params.createdTime || ''
    this.lastEditedTime = params.lastEditedTime || ''
    this.parent = params.parent || { type: 'page_id', page_id: '' }
    this.type = params.type || 'none'

    this.bulletedListItem = params.bulletedListItem
    this.bulletedListItemChildren = params.bulletedListItemChildren
    this.callout = params.callout
    this.code = params.code
    this.hasChildren = params.hasChildren
    this.image = params.image
    this.richTexts = params.richTexts
    this.video = params.video
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

  get lastEditedTimeString(): string | undefined {
    if (!this.lastEditedTime) {
      return undefined
    }
    const date = new Date(this.lastEditedTime)
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  get imageType(): 'icon' | 'none' {
    if (this.image && this.image.caption.some((c) => c.plain_text === 'icon')) {
      return 'icon'
    }
    return 'none'
  }

  static parseJSON = (
    json: PartialBlockObjectResponse | BlockObjectResponse,
    bulletedListItemChildren?: PageBlock[],
  ): PageBlock | undefined => {
    if (!json || !json.id || !('type' in json)) {
      return
    }

    let bulletedListItem: BulletedListItemObject | undefined
    if ('bulleted_list_item' in json) {
      bulletedListItem = {
        color: json.bulleted_list_item.color,
      }
    }

    let callout: CalloutObject | undefined
    if ('callout' in json) {
      callout = {
        color: json.callout.color,
        icon:
          json.callout.icon?.type === 'emoji' ? json.callout.icon : undefined,
      }
    }

    let code: CodeObject | undefined
    if ('code' in json) {
      code = { caption: json.code.caption, language: json.code.language }
    }

    let image: ImageObject | undefined
    if ('image' in json) {
      image = {
        caption: json.image.caption,
        file:
          json.image.type === 'file'
            ? {
                expiryTime: json.image.file.expiry_time,
                url: json.image.file.url,
              }
            : undefined,
      }
    }

    let richTexts: RichTextItemResponse[] = []
    switch (json.type) {
      case 'bulleted_list_item':
        richTexts = json.bulleted_list_item.rich_text
        break
      case 'callout':
        richTexts = json.callout.rich_text
        break
      case 'code':
        richTexts = json.code.rich_text
        break
      case 'divider':
        break
      case 'heading_1':
        richTexts = json.heading_1.rich_text
        break
      case 'heading_2':
        richTexts = json.heading_2.rich_text
        break
      case 'heading_3':
        richTexts = json.heading_3.rich_text
        break
      case 'image':
        break
      case 'paragraph':
        richTexts = json.paragraph.rich_text
        break
      default:
        break
    }

    let video: VideoObject | undefined
    if ('video' in json && 'external' in json.video) {
      video = {
        caption: json.video.caption,
        external: {
          url: json.video.external.url,
          embedUrl: json.video.external.url.replace(
            'youtu.be',
            'www.youtube.com/embed',
          ),
        },
      }
    }

    return new PageBlock({
      id: json.id,
      archived: json.archived,
      createdTime: json.created_time,
      lastEditedTime: json.last_edited_time,
      parent: {
        type: 'page_id',
        page_id: 'page_id' in json.parent ? json.parent.page_id || '' : '',
      },
      type: 'type' in json ? json.type : 'none',
      bulletedListItem: bulletedListItem,
      bulletedListItemChildren: bulletedListItemChildren,
      callout: callout,
      code: code,
      hasChildren: json.has_children,
      image: image,
      richTexts: richTexts,
      video: video,
    })
  }
}
