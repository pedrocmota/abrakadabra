import React from 'react'
import {Flex, Box, Text, Link} from '@chakra-ui/react'
import getConfig from 'next/config'
import {IpublicRuntimeConfig} from '../utils/types/environment'

const Footer: React.FunctionComponent = () => {
  const publicRuntimeConfig = getConfig().publicRuntimeConfig as IpublicRuntimeConfig
  return (
    <Flex
      width="100%"
      height="180px"
      minHeight="180px"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#212529"
    >
      <Text
        color="#ffffff"
        fontSize="20px"
        marginBottom="15px"
      >
        Abrakadabra v{publicRuntimeConfig.version}
      </Text>
      <Text
        color="#ffffff"
        fontSize="18px"
      >
        Desenvolvido por Pedro Mota
      </Text>
      <Box>
        <Link
          color="#ffffff"
          fontSize="18px"
          textDecoration="none"
          cursor="pointer"
          href="https://github.com/pedrocmota/abrakadabra"
          target="_blank"
          _hover={{
            color: '#16B897'
          }}
          _active={{
            color: '#16B897'
          }}
        >
          Github
        </Link>
        <Link
          color="#ffffff"
          fontSize="18px"
          marginLeft="20px"
          textDecoration="none"
          cursor="pointer"
          href="https://www.mit.edu/~amini/LICENSE.md"
          target="_blank"
          _hover={{
            color: '#16B897'
          }}
          _active={{
            color: '#16B897'
          }}
        >
          Licença MIT
        </Link>
      </Box>
    </Flex>
  )
}

export default Footer