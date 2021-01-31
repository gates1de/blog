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

export const getStaticPaths = async () => ({
  // FIXME: fetch pages
  paths: [{ params: { pid: '1caf5c36-6007-4644-add6-119830ebb6d9' } }],
  fallback: false,
})

export default Post
