import { GetStaticPropsResult, NextPage } from 'next'

import { BlogContent } from 'components/BlogContent'
import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'
import NotionRepository from 'repositories/notion-repository'
import { ogpImages } from 'constants/image-path'
import { useRouter } from 'next/router'
import PageBlock from 'models/page-block'
import Page from 'models/page'

type Props = {
  pageBlockJSON?: string
  pageJSON?: string
  description: string
  ogpImageURL: string
  path: string
  pid: string
}

type StaticProps = {
  params: { pid: string }
}

const Post: NextPage<Props> = ({
  pageBlockJSON,
  pageJSON,
  description,
  ogpImageURL,
  path,
}) => {
  const router = useRouter()

  const page = pageJSON
    ? Page.createFromDatabaseResponse(JSON.parse(pageJSON))
    : undefined
  const pageBlocks = pageBlockJSON
    ? (JSON.parse(pageBlockJSON) as any[]).map((data) => new PageBlock(data))
    : []

  if (!page?.isAccessible) {
    return (
      <Layout
        title={''}
        url={path}
        imageURL={ogpImageURL}
        description={description}
      >
        <p style={{ textAlign: 'center' }}>
          ページが存在しない or 公開されていません
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      title={''}
      url={path}
      imageURL={ogpImageURL}
      description={description}
    >
      <PageContent>
        {router.isFallback ? (
          <div>Loading...</div>
        ) : (
          <>{page && <BlogContent page={page} pageBlocks={pageBlocks} />}</>
        )}
      </PageContent>
    </Layout>
  )
}

export const getStaticProps = async ({
  params,
}: StaticProps): Promise<GetStaticPropsResult<Props>> => {
  try {
    const path = process.env.SITE_URL
      ? `${process.env.SITE_URL}/posts/${params.pid}`
      : ''
    const description = 'test'
    const page = await NotionRepository.shared().fetchPage(params.pid)
    const pageBlocks = await NotionRepository.shared().fetchPageBlocks(
      params.pid,
    )
    return {
      props: {
        description: description,
        ogpImageURL: ogpImages[params.pid] || '',
        pageJSON: JSON.stringify(page),
        pageBlockJSON: JSON.stringify(pageBlocks),
        path: path,
        pid: params.pid,
      },
      revalidate: 1,
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export const getStaticPaths = async () => {
  const posts = await NotionRepository.shared().fetchPosts(
    '2e5aa052b3aa48b0b775039da0f2e969',
  )

  const paths = posts.map((p) => {
    return { params: { pid: p.id } }
  })

  return {
    paths: paths,
    fallback: true,
  }
}

export default Post
