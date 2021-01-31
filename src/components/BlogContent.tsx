import styled from 'styled-components'

import { Link } from 'components/Link'
import StyledDivider from 'components/StyledDivider'
import PageChunk from 'models/page-chunk'

type Props = {
  pageId: string
  pageChunks: PageChunk[]
}

export const BlogContent = ({ pageId, pageChunks }: Props) => {
  return (
    <Container>
      {pageChunks.length === 0 ? (
        <p>記事データがありません</p>
      ) : (
        <>
          {pageChunks.map((chunk) => {
            switch (chunk.type) {
              case 'page':
                if (pageId !== chunk.id) {
                  return null
                }
                return (
                  <TitleContainer key={chunk.id}>
                    {chunk.contents[0].text || ''}
                    {chunk.createdTimeString && (
                      <p>
                        作成日: {chunk.createdTimeString}
                        {chunk.lastEditedTimeString !==
                          chunk.createdTimeString && (
                          <span>
                            {' '}
                            (最終編集日: {chunk.lastEditedTimeString} )
                          </span>
                        )}
                      </p>
                    )}
                  </TitleContainer>
                )
              case 'header':
                return <h1 key={chunk.id}>{chunk.contents[0].text || ''}</h1>
              case 'text':
                if (chunk.contents.length === 0) {
                  return null
                }
                return (
                  <div key={chunk.id}>
                    {chunk.contents.map((content) => {
                      if (content.text) {
                        return content.text
                      }
                      if (
                        content.link &&
                        content.link.text &&
                        content.link.url
                      ) {
                        return (
                          <Link
                            key={chunk.id}
                            href={
                              content.link.url.startsWith('/') &&
                              content.link.hash
                                ? '/posts/' + pageId + '#' + content.link.hash
                                : content.link.url
                            }
                          >
                            {content.link.text}
                          </Link>
                        )
                      }
                    })}
                  </div>
                )
              default:
                return null
            }
          })}
          {pageChunks
            .filter((c) => c.type === 'bulleted_list')
            .map((chunk, i) => (
              <div key={chunk.id}>
                {i == 0 && <StyledDivider style={{ margin: '6rem 0 2rem' }} />}
                <AnnotationContainer id={chunk.id.replace(/-/g, '')}>
                  <span>• </span>
                  {chunk.contents.map((content) => {
                    if (content.text) {
                      return content.text
                    }
                    if (content.link && content.link.text && content.link.url) {
                      return (
                        <Link
                          key={chunk.id}
                          href={
                            content.link.url.startsWith('/') &&
                            content.link.hash
                              ? '/posts/' + pageId + '#' + content.link.hash
                              : content.link.url
                          }
                        >
                          {content.link.text}
                        </Link>
                      )
                    }
                  })}
                </AnnotationContainer>
              </div>
            ))}
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
    border-bottom: 0.05em solid;
    border-color: rgba(55, 53, 47, 0.4);
    color: #37352f;
    opacity: 0.7;

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
const AnnotationContainer = styled.div`
  font-size: 1.2rem;
  line-height: 2rem;
`
