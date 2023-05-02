import Image from 'next/image'
import styled from 'styled-components'
import SyntaxHighlighter from 'react-syntax-highlighter'
import githubGist from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist'

import { Link } from 'components/Link'
import StyledDivider from 'components/StyledDivider'
import { CategoryTag } from 'components/TopContent'
import { YoutubeContainer } from 'components/YoutubeContainer'

import PageBlock from 'models/page-block'
import Page from 'models/page'

import breakpoint from 'styles/breakpoint'

type Props = {
  page: Page
  pageBlocks: PageBlock[]
}

export const BlogContent = ({ page, pageBlocks }: Props) => {
  return (
    <Container>
      {pageBlocks.length === 0 ? (
        <p>記事データがありません</p>
      ) : (
        <>
          <TitleContainer>
            {page.title}
            {page.createdTimeText && (
              <p>
                {page.tags.map((tag, index) => (
                  <CategoryTag key={`${tag}-${index}`} category={tag}>
                    {tag}
                  </CategoryTag>
                ))}
                作成日: {page.createdTimeText}
                {page.lastEditedTimeText !== page.createdTimeText && (
                  <span className="last-edited-time">
                    {' '}
                    (最終編集日: {page.lastEditedTimeText} )
                  </span>
                )}
              </p>
            )}
          </TitleContainer>

          {pageBlocks.map((pageBlock) => {
            switch (pageBlock.type) {
              case 'bulleted_list_item':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <AnnotationContainer key={pageBlock.id}>
                    <li id={pageBlock.id}>
                      {pageBlock.richTexts?.map((richText, index) => {
                        if (
                          richText.type === 'text' &&
                          richText.text.link?.url
                        ) {
                          return (
                            <Link
                              key={`${pageBlock.id}-${index}`}
                              href={richText.text.link.url}
                            >
                              {richText.text.content}
                            </Link>
                          )
                        }

                        return richText.plain_text || null
                      })}

                      {pageBlock.bulletedListItemChildren?.map((child) => (
                        <ul key={child.id}>
                          <li>
                            {child.richTexts?.map((richText, index) => {
                              if (
                                richText.type === 'text' &&
                                richText.text.link?.url
                              ) {
                                return (
                                  <Link
                                    key={`${pageBlock.id}-${index}`}
                                    href={richText.text.link.url}
                                  >
                                    {richText.text.content}
                                  </Link>
                                )
                              }

                              return richText.plain_text || null
                            })}
                          </li>
                        </ul>
                      ))}
                    </li>
                  </AnnotationContainer>
                )
              case 'callout':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <CalloutContainer key={pageBlock.id}>
                    {pageBlock.callout && (
                      <span>{pageBlock.callout.icon?.emoji || ''}</span>
                    )}
                    {pageBlock.richTexts[0].plain_text || ''}
                  </CalloutContainer>
                )
              case 'code':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <CodeContainer key={pageBlock.id}>
                    {pageBlock.richTexts
                      .filter((richText) => !!richText.plain_text)
                      .map((richText, i) => (
                        <SyntaxHighlighter
                          key={pageBlock.id + i}
                          codeTagProps={{
                            style: {
                              fontFamily:
                                'source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace',
                              fontSize: '0.9em',
                            },
                          }}
                          customStyle={{
                            backgroundColor: '#FAFAFA',
                            padding: '2rem',
                          }}
                          language={pageBlock.code?.language || ''}
                          style={githubGist}
                        >
                          {richText.plain_text || ''}
                        </SyntaxHighlighter>
                      ))}
                  </CodeContainer>
                )
              case 'divider':
                return (
                  <StyledDivider
                    key={pageBlock.id}
                    style={{ margin: '6rem 0 2rem' }}
                  />
                )
              case 'heading_1':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <h1 key={pageBlock.id}>
                    {pageBlock.richTexts[0].plain_text || ''}
                  </h1>
                )
              case 'heading_2':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <h2 key={pageBlock.id}>
                    {pageBlock.richTexts[0].plain_text || ''}
                  </h2>
                )
              case 'heading_3':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <h3 key={pageBlock.id}>
                    {pageBlock.richTexts[0].plain_text || ''}
                  </h3>
                )
              case 'image':
                if (!pageBlock.image?.file) {
                  return null
                }

                return (
                  <ImageContainer key={pageBlock.id}>
                    <Image
                      alt=""
                      width={pageBlock.imageType === 'icon' ? 200 : 600}
                      height={pageBlock.imageType === 'icon' ? 200 : 600}
                      src={pageBlock.image.file.url}
                      style={{ height: '100%', objectFit: 'contain' }}
                    />
                  </ImageContainer>
                )
              case 'paragraph':
                if (!pageBlock.richTexts || pageBlock.richTexts.length === 0) {
                  return null
                }

                return (
                  <TextContainer key={pageBlock.id}>
                    {pageBlock.richTexts.map((richText, i) => {
                      if (richText) {
                        if (richText.annotations.bold) {
                          return (
                            <b key={pageBlock.id + i}>{richText.plain_text}</b>
                          )
                        }

                        if (richText.annotations.code) {
                          return (
                            <span
                              key={`${pageBlock.id}-${i}`}
                              className="codeblock"
                            >
                              {richText.plain_text}
                            </span>
                          )
                        }

                        if (
                          richText.type === 'text' &&
                          richText.text.link?.url
                        ) {
                          return (
                            <Link
                              key={`${pageBlock.id}-${i}`}
                              href={richText.text.link.url}
                            >
                              {richText.text.content}
                            </Link>
                          )
                        }
                      }
                      return richText.plain_text
                    })}
                  </TextContainer>
                )
              case 'video':
                if (!pageBlock.video?.external?.url) {
                  return null
                }

                return (
                  <YoutubeContainer
                    key={pageBlock.id}
                    videoURL={pageBlock.video.external.embedUrl}
                  />
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
    margin-top: 4rem;
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

  span.last-edited-time {
    font-size: 1.4rem;
    margin-left: 1rem;
    opacity: 0.5;
  }
`

const CalloutContainer = styled.div`
  background-color: #fff7e8;
  border-radius: 1.2rem;
  display: flex;
  font-size: 1.6rem;
  justify-content: left;
  line-height: 3rem;
  margin: 2rem auto auto;
  padding: 2rem 3rem;
  width: 60rem;

  span {
    margin-right: 1rem;
  }

  @media (max-width: ${breakpoint.tablet}px) {
    font-size: 1.4rem;
    line-height: 2.4rem;
    padding: 2rem;
    width: 100%;
  }
`

const TextContainer = styled.div`
  line-height: 3rem;

  span.codeblock {
    background: rgba(135, 131, 120, 0.15);
    border-radius: 3px;
    color: #eb5757;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier,
      monospace;
    font-size: 85%;
    line-height: normal;
    padding: 0.2em 0.4em;
  }
`

const CodeContainer = styled.div`
  line-height: 2.4rem;
`

const AnnotationContainer = styled.ul`
  margin: 0.5rem 0;
`

const ImageContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`
