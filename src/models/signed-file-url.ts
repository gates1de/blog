export default class SignedFileUrl {
  id: string
  url: string

  constructor(init?: Partial<SignedFileUrl>) {
    this.id = init?.id || ''
    this.url = init?.url || ''
  }

  static parseJSON = (blockId: string, json: any): SignedFileUrl[] => {
    if (!json || !json.signedUrls) {
      return []
    }
    const urls: any[] = json.signedUrls || []
    if (!urls) {
      return []
    }
    const signedFileUrls: SignedFileUrl[] = []
    urls.forEach((url) => {
      if (!url) {
        return
      }
      signedFileUrls.push(new SignedFileUrl({ id: blockId, url: url }))
    })
    return signedFileUrls
  }
}
