import React from 'react'
import Head from 'next/head'
import {SSRProvider} from 'react-bootstrap'
import {ToastProvider, useToasts} from 'react-toast-notifications'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/global.css'
import type {AppProps} from 'next/app'

const App = ({Component, pageProps}: AppProps) => {
  return (
    <SSRProvider>
      <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
        <Wrapper>
          <Head>
            <meta charSet="utf-8" />
            <link rel="icon" href="/icon.png" />
          </Head>
          <Component {...pageProps} />
        </Wrapper>
      </ToastProvider>
    </SSRProvider>
  )
}

export let toasts: ReturnType<typeof useToasts> = null as any

const Wrapper: React.FunctionComponent = (props) => {
  toasts = useToasts()
  return (
    <>
      {props.children}
    </>
  )
}

export default App