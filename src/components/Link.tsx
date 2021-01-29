import React, { forwardRef } from 'react'
import { default as NextLink } from 'next/link'

type Props = {
  as?: string
  children?: any
  className?: string
  display?: string
  href: string
  isBlank?: boolean
  linkColor?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  prefetch?: boolean
  style?: React.CSSProperties | undefined
}

export const Link: React.FC<Props> = (props) => {
  if (props.href.startsWith('/')) {
    return <InnerLink {...props} />
  }
  return <OuterLink {...props} />
}

const InnerLink = forwardRef<HTMLAnchorElement, Props>(
  (
    { as, children, className, display, href, onClick, prefetch, style },
    ref,
  ) => {
    if (!href) {
      return children
    }
    return (
      <NextLink
        href={href}
        as={as}
        prefetch={prefetch === false ? false : undefined}
        passHref
      >
        <a
          className={className}
          ref={ref}
          onClick={onClick}
          style={{ display: display, ...style }}
        >
          {children}
        </a>
      </NextLink>
    )
  },
)

const OuterLink: React.FC<Props> = ({
  children,
  className,
  href,
  isBlank = true,
  linkColor = 'inherit',
  onClick,
}) => (
  <a
    className={className}
    href={href}
    onClick={onClick}
    rel="noopener"
    style={{ color: linkColor }}
    target={isBlank ? '_blank' : undefined}
  >
    {children}
  </a>
)
