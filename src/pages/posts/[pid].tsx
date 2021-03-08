import { GetStaticPropsResult, NextPage } from 'next'

import { BlogContent } from 'components/BlogContent'
import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'
import Collection from 'models/collection'
import PageChunk from 'models/page-chunk'
import NotionRepository from 'repositories/notion-repository'
import SignedFileUrl from 'models/signed-file-url'
import { ogpImages } from 'constants/image-path'

type Props = {
  data?: any
  description: string
  ogpImageURL: string
  path: string
  pid: string
}

type StaticProps = {
  params: { pid: string }
}

const Post: NextPage<Props> = ({ data, description, ogpImageURL, path, pid }) => {
  const pageChunks = (JSON.parse(data) as any[]).map(d => new PageChunk(d))
  const titleChunkContents = pageChunks.find(c => c.type === 'page')?.contents || [{ text: 'Untitled' }]
  return (
    <Layout title={titleChunkContents[0].text} url={path} imageURL={ogpImageURL} description={description}>
      <PageContent>
        <BlogContent
          pageChunks={pageChunks}
          pageId={pid}
        />
      </PageContent>
    </Layout>
  )
}

export const getStaticProps = async ({ params }: StaticProps): Promise<
  GetStaticPropsResult<Props>
> => {
  try {
    let pageChunks = await NotionRepository.shared().loadPageChunk(
      params.pid,
    )
    const getSignedFileUrlsTasks = pageChunks
      .filter(c => c.type === 'image' && c.imageSource)
      .map(c => {
        return NotionRepository.shared().getSingedFileUrls(c.id, c.imageSource!)
      })
    const signedFileUrls = await Promise.all(getSignedFileUrlsTasks)
    const flattenSignedFileUrls = ([] as SignedFileUrl[]).concat(...signedFileUrls)
    pageChunks = pageChunks
      .map(c => {
        if (c.type !== 'image') {
          return c
        }
        const signedFileUrl = flattenSignedFileUrls.find(s => c.id === s.id)
        if (!signedFileUrl || !c.format) {
          return c
        }
        c.format.display_source = signedFileUrl.url
        return c
      })
    const path = process.env.SITE_URL ? `${process.env.SITE_URL}/posts/${params.pid}` : ''
    const description = pageChunks
      .filter(c => ['header', 'text', 'link'].includes(c.type))
      .map(c => {
        return c.contents.map(content => content.text || content.link?.text || '').join('')
      }).slice(undefined, 5).join('\n').slice(0, 150) + '...'
    return {
      props: { data: JSON.stringify(pageChunks), description: description, ogpImageURL: ogpImages[params.pid] || '', path: path, pid: params.pid },
      revalidate: 1,
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export const getStaticPaths = async () => {
  const tasks: Promise<Collection[]>[] = []
  const collectionIdForDaily = 'cb7f4670-623c-410e-b59e-da29fd96c691'
  const collectionViewIdForDaily = '73f23905-79a0-4926-8780-0333d9a1993b'
  tasks.push(NotionRepository.shared().queryCollection(
    collectionIdForDaily,
    collectionViewIdForDaily,
  ))

    const collectionIdForTech = '4e0c474c-0ceb-48a0-b4c9-94da93f48c71'
    const collectionViewIdForTech = '41e53f7e-d7c9-400f-8ee3-2e5a2ffdf9f9'
    tasks.push(
      NotionRepository.shared().queryCollection(collectionIdForTech, collectionViewIdForTech),
    )

  const collectionIdForDrafts = 'a2f54dd1-bf9b-4ddf-a0aa-079d59555043'
  const collectionViewIdForDrafts = '159ab648-8e6b-443a-bf6d-2103ff5467d6'
  if (process.env.APP_ENV !== 'production') {
    tasks.push(NotionRepository.shared().queryCollection(
      collectionIdForDrafts,
      collectionViewIdForDrafts,
    ))
  }
  const queryCollections: Collection[] = []
  const result = await Promise.all(tasks)
  const paths = queryCollections
    .concat(...result)
    .filter(c =>
      c.parentId === collectionIdForDaily ||
      c.parentId === collectionIdForTech ||
      c.parentId === collectionIdForDrafts,
    )
    .map(c => { return { params: { pid: c.id } }})
  return {
    paths: paths,
    fallback: false,
  }
}

export default Post
