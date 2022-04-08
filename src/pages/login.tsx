import React, {useState, FormEvent} from 'react'
import type {NextPage} from 'next'
import Head from 'next/head'
import Router from 'next/router'
import {Flex, Text, Input, Button} from '@chakra-ui/react'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import {GetServerSideProps} from 'next'
import {showRecoveryPassword} from '../popups/showRecoveryPassword'
import {requireSession} from '../utils/request'

const Login: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const {addToast} = useToasts()

  const sendLogin = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/login', {
      email: email,
      password: password
    }).then(() => {
      Router.push('/')
    }).catch((error) => {
      setLoading(false)
      if (error.response.status === 401) {
        return addToast('Usuário e/ou senha incorretos', {appearance: 'error'})
      } else {
        return addToast(`Erro desconhecido. Status ${error.response.status}`, {appearance: 'error'})
      }
    })
  }

  return (
    <>
      <Head>
        <title>Abrakadabra - Login</title>
      </Head>
      <Flex
        className="background"
        width="100%"
        height="100%"
        backgroundColor="#D6D6D6"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          width="100%"
          height="100%"
          maxWidth="400px"
          maxHeight="370px"
          backgroundColor="#F0F0F0"
          borderRadius="5px"
          flexDirection="column"
          sx={{
            '@media screen and (max-width: 400px)': {
              maxHeight: '100%'
            }
          }}
        >
          <Flex
            width="100%"
            height="120px"
            backgroundColor="#212529"
            justifyContent="center"
            alignItems="center"
            borderTopLeftRadius="5px"
            borderTopRightRadius="5px"
            sx={{
              '@media screen and (max-width: 400px)': {
                borderRadius: '0px'
              }
            }}
          >
            <Text
              as="h1"
              fontSize="32px"
              fontFamily="Sans-serif"
              color="#F3F3F3"
            >
              Abrakadabra
            </Text>
          </Flex>
          <Flex
            as="form"
            width="100%"
            flex="1"
            flexDirection="column"
            alignItems="center"
            padding="30px"
            paddingLeft="40px"
            paddingRight="40px"
            onSubmit={sendLogin}
          >
            <Input
              id="login"
              name="login"
              placeholder="Seu e-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              width="100%"
              height="40px"
              fontSize="18px"
              backgroundColor="#FAFAFA"
              border="1px solid #7E7979"
              paddingLeft="10px"
              borderRadius="2px"
              sx={{
                '@media screen and (max-width: 400px)': {
                  height: '50px'
                }
              }}
            />
            <Input
              id="password"
              name="password"
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              width="100%"
              height="40px"
              fontSize="18px"
              backgroundColor="#FAFAFA"
              border="1px solid #7E7979"
              borderRadius="2px"
              paddingLeft="10px"
              marginTop="12px"
              sx={{
                '@media screen and (max-width: 400px)': {
                  height: '50px'
                }
              }}
            />
            <Button
              type="submit"
              width="100%"
              height="40px"
              marginTop="12px"
              backgroundColor="#009879"
              color="#ffffff"
              border="0"
              disabled={loading}
              _disabled={{
                backgroundColor: '#9B9191'
              }}
              sx={{
                '@media screen and (max-width: 400px)': {
                  height: '50px'
                }
              }}
            >
              Logar
            </Button>
            <Flex
              width="100%"
              marginTop="10px"
            >
              <Text
                color="#1584C0"
                cursor="pointer"
                onClick={showRecoveryPassword}
                _hover={{
                  textDecoration: 'underline'
                }}
              >
                Esqueci minha senha
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = requireSession(context.req.cookies.session, false)
  return {
    props: {},
    ...(session !== undefined) && {
      redirect: {
        destination: '/'
      }
    }
  }
}

export default Login