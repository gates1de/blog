import { GetStaticPropsResult, NextPage } from 'next'

import Layout from 'components/Layout'
import { PageContent } from 'components/PageContent'
import { TopContent } from 'components/TopContent'
import Collection from 'models/collection'
import NotionRepository from 'repositories/notion-repository'

type Props = {
  data?: any
}

const IndexPage: NextPage<Props> = ({ data }) => {
  const collections = (JSON.parse(data) as any[]).map((d) => new Collection(d))
  return (
    <Layout title="Home">
      <PageContent>
        <TopContent collections={collections} />
      </PageContent>
    </Layout>
  )
}

export const getServerSideProps = async (): Promise<
  GetStaticPropsResult<Props>
> => {
  try {
    // FIXME: fetch collection id using loadPageChunk
    const collectionId = 'cb7f4670-623c-410e-b59e-da29fd96c691'
    const collectionViewId = '73f23905-79a0-4926-8780-0333d9a1993b'
    const queryCollection = await NotionRepository.shared().queryCollection(
      collectionId,
      collectionViewId,
    )
    return {
      props: {
        data: JSON.stringify(
          queryCollection.filter((c) => c.parentId === collectionId),
        ),
      },
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export default IndexPage
