import React, {useState, FormEvent} from 'react'
import Head from 'next/head'
import Router from 'next/router'
import {GetServerSideProps} from 'next'
import {Flex, Text, Input, Button} from '@chakra-ui/react'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import {RecoveryCodesSchema} from '../models/Schemas'

interface IRecovery {
  recoveryCode: string
}

const Recovery: React.FunctionComponent<IRecovery> = (props) => {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const {addToast} = useToasts()
  const validButton = password1.length > 6 && password1.length < 30 && password1 === password2 && !loading

  const sendRecoveryPassword = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/recoveryPassword', {
      recoveryCode: props.recoveryCode,
      password: password1
    }).then(() => {
      addToast('Senha alterada com sucesso!', {
        appearance: 'success'
      })
      Router.push('/login')
    }).catch((error) => {
      setLoading(false)
      if (error.response.status === 404) {
        return addToast('Esse código expirou', {appearance: 'error'})
      } else {
        return addToast(`Erro desconhecido. Status ${error.response.status}`, {appearance: 'error'})
      }
    })
  }

  return (
    <>
      <Head>
        <title>Abrakadabra - Recuperar conta</title>
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
              textAlign="center"
            >
              Recuperar conta
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
            onSubmit={sendRecoveryPassword}
          >
            <Input
              id="password1"
              name="password1"
              placeholder="Sua nova senha"
              type="password"
              value={password1}
              onChange={e => setPassword1(e.target.value)}
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
            <Input
              id="password2"
              name="password2"
              placeholder="Repita sua nova senha"
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
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
              disabled={!validButton}
              _disabled={{
                backgroundColor: '#9B9191'
              }}
              sx={{
                '@media screen and (max-width: 400px)': {
                  height: '50px'
                }
              }}
            >
              Trocar senha
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query?.recoverycode as string | undefined
  const recoveryCodesSchema = await RecoveryCodesSchema()
  const recoveryCode = await recoveryCodesSchema.findOne({
    code: query
  })
  return {
    props: {
      recoveryCode: query
    },
    notFound: recoveryCode === null
  }
}

export default Recovery