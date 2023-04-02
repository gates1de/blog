import { Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'

export const CATEGORIES = {
  ALL: 'All',
  DAILY: 'Daily',
  TECH: 'Tech',
} as const

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES]

export const CategoryButtons: React.FC<{
  selectedCategory: Category
  setCategory: Dispatch<SetStateAction<Category>>
}> = ({ selectedCategory, setCategory }) => {
  return (
    <Container>
      {Object.entries(CATEGORIES).map(([key, value]) => (
        <Button
          key={key}
          category={value}
          className={selectedCategory === value ? 'selected' : undefined}
          onClick={() => setCategory(value)}
        >
          {value}
        </Button>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
  padding: 1rem;
  width: 100%;
`

const Button = styled.button<{ category?: string }>`
  background-color: transparent;
  border: none;
  font-size: 1.4rem;
  height: 100%;
  min-height: 5rem;
  min-width: 10rem;
  outline: none;
  padding: 0 2rem;

  &.selected {
    ${(props) => {
      switch (props.category) {
        case 'Daily':
          return css`
            border-bottom: solid 2px #ffa83b77;
            color: #ffa83b;
          `
        case 'Tech':
          return css`
            border-bottom: solid 2px #0089ff55;
            color: #0089ff;
          `
        default:
          return css`
            border-bottom: solid 2px #3a3a3a;
          `
      }
    }};
  }

  &.noselected {
    color: #3a3a3a;
    border-bottom: solid 2px #3a3a3a;
  }

  :hover {
    cursor: pointer;
  }
`
