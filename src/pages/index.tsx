import { GetStaticPropsResult, NextPage } from 'next'

import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'

type Props = {
  data?: any
}

const IndexPage: NextPage<Props> = ({}) => {
  return (
    <Layout title="Home">
      <PageContent>Hello, world! 👋</PageContent>
    </Layout>
  )
}

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<Props>
> => {
  try {
    return {
      props: {},
      revalidate: true,
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export default IndexPage
