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
    const tasks: Promise<Collection[]>[] = []
    const collectionId = 'cb7f4670-623c-410e-b59e-da29fd96c691'
    const collectionViewId = '73f23905-79a0-4926-8780-0333d9a1993b'
    tasks.push(
      NotionRepository.shared().queryCollection(collectionId, collectionViewId),
    )

    const collectionIdForDrafts = 'a2f54dd1-bf9b-4ddf-a0aa-079d59555043'
    const collectionViewIdForDrafts = '159ab648-8e6b-443a-bf6d-2103ff5467d6'
    if (process.env.APP_ENV !== 'production') {
      tasks.push(
        NotionRepository.shared().queryCollection(
          collectionIdForDrafts,
          collectionViewIdForDrafts,
        ),
      )
    }
    let queryCollections: Collection[] = []
    const result = await Promise.all(tasks)
    queryCollections = queryCollections.concat(...result)
    return {
      props: {
        data: JSON.stringify(
          queryCollections.filter(
            (c) =>
              c.parentId === collectionId ||
              c.parentId === collectionIdForDrafts,
          ),
        ),
      },
    } as GetStaticPropsResult<Props>
  } catch (error) {
    throw error
  }
}

export default IndexPage
