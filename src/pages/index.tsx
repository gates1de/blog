import { GetStaticPropsResult, NextPage } from 'next'

import Layout from 'components/Layout'
import PageChunk from 'models/page-chunk'
import NotionRepository from 'repositories/notion-repository'

type Props = {
  data?: any
}

const IndexPage: NextPage<Props> = ({ data }) => {
  const pageChunks = JSON.parse(data) as PageChunk[]
  console.dir(pageChunks)
  return (
    <Layout title="Home">
      <h1>Welcome to gates1de's blog! 👋</h1>
    </Layout>
  )
}

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<Props>
> => {
  try {
    const pageChunks = await NotionRepository.shared().loadPageChunk(
      '1caf5c36-6007-4644-add6-119830ebb6d9',
    )
    return {
      props: { data: JSON.stringify(pageChunks) },
      revalidate: true,
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export default IndexPage
