import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Link } from 'components/Link'
import {
  CategoryButtons,
  Category,
  CATEGORIES,
} from 'components/CategoryButtons'
import Page from 'models/page'

type Props = {
  pages: Page[]
}

export const TopContent = ({ pages }: Props) => {
  const [category, setCategory] = useState<Category>(CATEGORIES.ALL)
  const filteredPages = useMemo(() => {
    if (category === CATEGORIES.ALL) {
      return pages
    }
    return pages.filter((p) => p.tags.some((t) => t === category))
  }, [pages, category])

  return (
    <Container>
      <CategoryButtons selectedCategory={category} setCategory={setCategory} />
      {pages.length === 0 ? (
        <p>記事データがありません</p>
      ) : (
        <>
          {filteredPages.map((page) => (
            <Link key={page.id} href={'/posts/' + page.id}>
              <TitleContainer>
                <p>
                  {page.tags.map((tag, index) => (
                    <CategoryTag key={`${tag}-${index}`} category={tag}>
                      {tag}
                    </CategoryTag>
                  ))}
                  {page.createdTimeText || ''}
                </p>
                {page.title}
              </TitleContainer>
            </Link>
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
`

export const CategoryTag = styled.span<{ category?: string }>`
  background-color: ${(props) => {
    switch (props.category) {
      case 'Daily':
        return '#ffa83b77'
      case 'Tech':
        return '#0089ff55'
      default:
        return '#5a5a5a55'
    }
  }};
  border-radius: 0.5rem;
  font-size: 1.4rem;
  margin-right: 2rem;
  padding: 0.5rem;
`
