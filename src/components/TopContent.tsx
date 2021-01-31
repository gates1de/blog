import styled from 'styled-components'

import { Link } from 'components/Link'
import Collection from 'models/collection'

type Props = {
  collections: Collection[]
}

export const TopContent = ({ collections }: Props) => {
  return (
    <Container>
      {collections.length === 0 ? (
        <p>記事データがありません</p>
      ) : (
        <>
          {collections.map((collection) => {
            switch (collection.type) {
              case 'page':
                return (
                  <Link key={collection.id} href={'/posts/' + collection.id}>
                    <TitleContainer>
                      {collection.createdTimeString && (
                        <p>{collection.createdTimeString}</p>
                      )}
                      {collection.title}
                    </TitleContainer>
                  </Link>
                )
              default:
                return null
            }
          })}
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: calc(24px + env(safe-area-inset-left));
  padding-right: calc(24px + env(safe-area-inset-right));
  width: 100%;

  h1 {
    font-size: 2.4rem;
    line-height: 3.2rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  a {
    color: #37352f;

    :visited {
      color: #37352f;
    }
  }
`

const TitleContainer = styled.div`
  font-size: 4rem;
  font-weight: 600;
  line-height: 6rem;
  margin: 3rem 0 1rem;

  p {
    font-size: 1.4rem;
    line-height: 3rem;
    margin: 1rem 0;
  }

  span {
    font-size: 1.4rem;
    margin-left: 1rem;
    opacity: 0.5;
  }
`
