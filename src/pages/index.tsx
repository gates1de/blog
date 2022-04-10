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
    const spaceId = 'fd81ab51-dc87-429c-a482-24ce801aaf66'

    const collectionIdForDaily = 'cb7f4670-623c-410e-b59e-da29fd96c691'
    const collectionViewIdForDaily = '73f23905-79a0-4926-8780-0333d9a1993b'
    tasks.push(
      NotionRepository.shared().queryCollection(
        collectionIdForDaily,
        collectionViewIdForDaily,
        spaceId,
      ),
    )

    const collectionIdForTech = '4e0c474c-0ceb-48a0-b4c9-94da93f48c71'
    const collectionViewIdForTech = '04307066-2147-4cec-b5ac-ae179b8a2b05'
    tasks.push(
      NotionRepository.shared().queryCollection(
        collectionIdForTech,
        collectionViewIdForTech,
        spaceId,
      ),
    )

    const collectionIdForDrafts = 'a2f54dd1-bf9b-4ddf-a0aa-079d59555043'
    const collectionViewIdForDrafts = '159ab648-8e6b-443a-bf6d-2103ff5467d6'
    if (process.env.APP_ENV !== 'production') {
      tasks.push(
        NotionRepository.shared().queryCollection(
          collectionIdForDrafts,
          collectionViewIdForDrafts,
          spaceId,
        ),
      )
    }
    let queryCollections: Collection[] = []
    const result = await Promise.all(tasks)
    queryCollections = queryCollections
      .concat(...result)
      .sort((a, b) => (b.createdTime || 0) - (a.createdTime || 0))
    return {
      props: {
        data: JSON.stringify(
          queryCollections.filter(
            (c) =>
              c.parentId === collectionIdForDaily ||
              c.parentId === collectionIdForTech ||
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
