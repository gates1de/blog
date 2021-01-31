import { GetStaticPropsResult, NextPage } from 'next'

import { BlogContent } from 'components/BlogContent'
import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'
import PageChunk from 'models/page-chunk'
import NotionRepository from 'repositories/notion-repository'

type Props = {
  data?: any
  pid: string
  path: string
}

type StaticProps = {
  params: { pid: string }
}

const Post: NextPage<Props> = ({ data, path, pid }) => {
  const pageChunks = (JSON.parse(data) as any[]).map(d => new PageChunk(d))
  const titleChunkContents = pageChunks.find(c => c.type === 'page')?.contents || [{ text: 'Untitled' }]
  return (
    <Layout title={titleChunkContents[0].text} url={path}>
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
    const pageChunks = await NotionRepository.shared().loadPageChunk(
      params.pid,
    )
    const path = process.env.SITE_URL ? `${process.env.SITE_URL}/posts/${params.pid}` : ''
    return {
      props: { data: JSON.stringify(pageChunks), path: path, pid: params.pid },
      revalidate: true,
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export const getStaticPaths = async () => {
  const collectionId = 'cb7f4670-623c-410e-b59e-da29fd96c691'
  const collectionViewId = '73f23905-79a0-4926-8780-0333d9a1993b'
  const queryCollection = await NotionRepository.shared().queryCollection(
    collectionId,
    collectionViewId,
  )
  const paths = queryCollection.filter(c => c.parentId === collectionId).map(c => { return { params: { pid: c.id } }})
  return {
    paths: paths,
    fallback: false,
  }
}

export default Post