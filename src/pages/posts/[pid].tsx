import { GetStaticPropsResult, NextPage } from 'next'

import { BlogContent } from 'components/BlogContent'
import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'
import PageChunk from 'models/page-chunk'
import NotionRepository from 'repositories/notion-repository'

type Props = {
  data?: any
  pid: string
}

type StaticProps = {
  params: { pid: string }
}

const Post: NextPage<Props> = ({ data, pid }) => {
  const pageChunks = (JSON.parse(data) as any[]).map(d => new PageChunk(d))
  return (
    <Layout title="Home">
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
    return {
      props: { data: JSON.stringify(pageChunks), pid: params.pid },
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
