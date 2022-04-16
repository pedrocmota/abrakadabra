import React from 'react'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

interface IActiveLink {
  href: string,
  children: any
}

const ActiveLink: React.FunctionComponent<IActiveLink> = ({href, children}) => {
  const router = useRouter()
  let className = children?.props?.className || ''

  const hrefTokens = href?.substring(1)?.split('/') as String[] | undefined
  const rawPath = router?.asPath?.substring(1).split('?')[0]
  const pathTokens = rawPath.split('/') as String[] | undefined

  if (hrefTokens && pathTokens) {
    let matched = false
    for (let i = 0; i < hrefTokens.length; i++) {
      if (hrefTokens[i] === pathTokens[i]) {
        matched = true
        break
      }
    }

    if (matched) {
      className = `${className} active`
    }
  }

  return (
    <NextLink href={href}>
      {React.cloneElement(children, {className})}
    </NextLink>
  )
}

export default ActiveLink