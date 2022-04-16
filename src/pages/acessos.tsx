import {createRef, useEffect, useState} from 'react'
import type {NextPage} from 'next'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import {useRouter} from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {Flex, Container, Input, Select, Button, Text, Table, Thead, Th} from '@chakra-ui/react'
import dayjs from 'dayjs'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useToasts} from 'react-toast-notifications'
import {filter} from '../utils/filter'
import {requireSession} from '../utils/request'
import {getAccessesProps, IAccessesProps} from '../models/GetAccessesProps'
import {IAccess} from '../models/Schemas'

const Accesses: NextPage<IAccessesProps> = (props) => {
  const router = useRouter()
  const [user, setUser] = useState((router.query.user as string) || '')
  const [data, setData] = useState<IAccess[]>([])
  const [loading, setLoading] = useState(false)

  const {addToast} = useToasts()
  const table = createRef<HTMLTableElement>()
  const accesses = data.filter(e => e.user === user)

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (user !== '') {
        const response = await axios.get('/api/getAccessesByUser', {
          params: {
            userID: user
          }
        })
        setLoading(false)
        setData(response.data)
      }
    })()
  }, [user])

  const deleteAccess = (accessID: string) => {
    Swal.fire({
      title: 'Você confirma a ação?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete('/api/deleteAccess', {
          data: {
            accessID: accessID
          }
        })
        if (response.status === 200) {
          setData(data.filter((e) => (e._id !== accessID)))
          addToast('Acesso deletado com sucesso!', {appearance: 'success'})
        } else {
          addToast(`Erro desconhecido. Status code ${response.status}`, {appearance: 'error'})
        }
      }
    })
  }

  return (
    <>
      <Head>
        <title>Abrakadabra - Histórico de acessos</title>
      </Head>
      <Flex
        as="div"
        flexDir="column"
        width="100%"
        flex="1"
      >
        <Container>
          <Navbar name={props.name} isAdmin={props.isAdmin} />
        </Container>
        <Flex
          id="background"
          display="flex"
          flexDir="column"
          alignItems="center"
          width="100%"
          flex="1"
          backgroundColor="#F5F5F5"
        >
          <Flex
            id="container"
            display="flex"
            flexDir="column"
            width="95%"
            maxW="1000px"
            flex="1"
            marginTop="40px"
            marginBottom="40px"
          >
            <Text
              as="h1"
              fontSize="24px"
              marginBottom="25px"
              paddingLeft="1px"
            >
              Histórico de acessos
            </Text>
            <Flex
              display="flex"
              __css={{
                '& select': {
                  paddingRight: '0px'
                },
                '@media screen and (max-width: 520px)': {
                  flexDirection: 'column',
                  '& .chakra-select__wrapper': {
                    width: '100%',
                    marginLeft: '0px',
                    marginTop: '10px'
                  }
                }
              }}
            >
              <Input
                type="search"
                placeholder="Pesquisar"
                flexGrow="1"
                height="34px"
                fontSize="16px"
                paddingLeft="6px"
                border="1px solid #DADADA"
                borderRadius="3px"
                _placeholder={{
                  color: '#212529'
                }}
                sx={{
                  '@media screen and (max-width: 614px)': {
                    height: '40px'
                  }
                }}
                onChange={(e) => {filter(e.target.value, table.current)}}
              />
              <Select
                value={user}
                placeholder="Selecione o usuário"
                width="200px"
                height="34px"
                backgroundColor="#ffffff"
                border="1px solid #DADADA"
                borderRadius="3px"
                marginLeft="10px"
                sx={{
                  '@media screen and (max-width: 614px)': {
                    height: '40px'
                  }
                }}
                onChange={(e) => {
                  const userID = e.currentTarget.value
                  setUser(userID)
                  const urlSearch = new URLSearchParams(window.location.search)
                  if (userID.length > 0) {
                    urlSearch.set('user', userID)
                  } else {
                    urlSearch.delete('user')
                  }
                  const path = window.location.pathname + (userID.length > 0 ? '?' : '') + urlSearch.toString()
                  history.pushState(null, '', path)
                }}
              >
                {(props.users.map(user => {
                  return (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  )
                }))}
              </Select>
            </Flex>
            <Flex overflowX="auto">
              <Table ref={table}
                width="100%"
                marginTop="10px"
                whiteSpace="nowrap"
                __css={{
                  '& thead': {
                    backgroundColor: '#009879'
                  },
                  '& th': {
                    paddingLeft: '10px'
                  },
                  '& td': {
                    padding: '16px',
                    color: '#1F1C1C'
                  },
                  '& tr:hover:not(#thdead)': {
                    backgroundColor: '#E7E7E7'
                  }
                }}
              >
                <Thead
                  height="40px"
                  padding-left="15px"
                  fontSize="16px"
                  color="#ffffff"
                  text-align="left"
                  paddingRight="10px"
                  sx={{
                    '@media screen and (max-width: 614px)': {
                      '& th': {
                        paddingTop: '8px',
                        paddingBottom: '8px'
                      }
                    }
                  }}
                >
                  <tr id="thdead">
                    <Th>Data/horário</Th>
                    <Th>Pessoa</Th>
                    <Th>Lugar</Th>
                    <Th width="220px">Ação</Th>
                  </tr>
                </Thead>
                <tbody>
                  {(accesses.map((access) => {
                    return (
                      <tr key={access._id}>
                        <td>{dayjs.unix(access.datetime).format('DD/MM/YYYY HH:mm:ss')}</td>
                        <td>{access.userName}</td>
                        <td>{access.place}</td>
                        <td>
                          <Button
                            width="100%"
                            height="30px"
                            backgroundColor="#CE505B"
                            border="0"
                            borderRadius="2px"
                            color="#ffffff"
                            padding="10px"
                            marginTop="10px"
                            onClick={() => deleteAccess(access._id as string)}
                            _disabled={{
                              backgroundColor: '#9B9191'
                            }}
                            _hover={{
                              backgroundColor: '#DD5E69'
                            }}
                          >
                            Deletar acesso
                          </Button>
                        </td>
                      </tr>
                    )
                  }))}
                </tbody>
              </Table>
            </Flex>
            {(accesses.length === 0 && user === '') && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                Selecione um usuário
              </Text>
            )}
            {(!loading && accesses.length === 0 && user !== '' && props.users.some((u) => u._id === user)) && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                O usuário não tem acessos registrados
              </Text>
            )}
            {(!loading && !props.users.some((u) => u._id === user)) && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                O usuário não existe
              </Text>
            )}
          </Flex>
        </Flex>
        <Footer />
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = requireSession(context.req.cookies.session, true)
  if (session) {
    const props = await getAccessesProps(session.userID)
    return {
      props: props!
    }
  } else {
    return {
      props: {},
      redirect: {
        destination: '/'
      }
    }
  }
}

export default Accesses