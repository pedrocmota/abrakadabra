import React from 'react'
import Head from 'next/head'
import {Flex, Text} from '@chakra-ui/react'

const NotFound: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Abrakadabra - Erro interno</title>
      </Head>
      <Flex
        width="100%"
        height="100%"
        backgroundColor="#f5f5f5"
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          as="h1"
          fontSize="50px"
          textAlign="center"
        >
          Erro 404
        </Text>
        <Text
          as="h2"
          fontSize="26px"
          textAlign="center"
          marginTop="15px"
          paddingLeft="15px"
          paddingRight="15px"
        >
          Houve um erro no servidor. Não foi culpa sua.
        </Text>
      </Flex>
    </>
  )
}

export default NotFound