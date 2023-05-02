import { GetStaticPropsResult, NextPage } from 'next'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'
import { TopContent } from 'components/TopContent'
import NotionRepository from 'repositories/notion-repository'
import Page from 'models/page'

type Props = {
  pagesResponseJSONString: string
}

const IndexPage: NextPage<Props> = ({ pagesResponseJSONString }) => {
  const pagesResponseJSON = JSON.parse(
    pagesResponseJSONString || '[]',
  ) as PageObjectResponse[]
  const pages = pagesResponseJSON
    .map((pageObject) => Page.createFromDatabaseResponse(pageObject))
    .filter((p): p is Page => !!p && p.isAccessible)

  return (
    <Layout title="Home">
      <PageContent>
        <TopContent pages={pages} />
      </PageContent>
    </Layout>
  )
}

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<Props>
> => {
  try {
    const posts = await NotionRepository.shared().fetchPosts(
      '2e5aa052b3aa48b0b775039da0f2e969',
    )

    return {
      props: {
        pagesResponseJSONString: JSON.stringify(posts),
      },
      revalidate: 1,
    }
  } catch (error) {
    throw error
  }
}

export default IndexPage
