import React from 'react'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

interface IActiveLink {
  fuzzy?: boolean,
  href: string,
  children: any
}

const ActiveLink: React.FunctionComponent<IActiveLink> = ({fuzzy = false, href, children}) => {
  const router = useRouter()
  let className = children?.props?.className || ''

  const hrefTokens = href?.substring(1)?.split('/') as String[] | undefined
  const pathTokens = router?.asPath?.substring(1)?.split('/') as String[] | undefined

  if (hrefTokens && pathTokens) {
    let matched = false
    for (let i = 0; i < hrefTokens.length; i++) {
      if (hrefTokens[i] === pathTokens[i]) {
        matched = true
        break
      }
    }

    if ((!fuzzy && router.asPath === href) || (fuzzy && matched)) {
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