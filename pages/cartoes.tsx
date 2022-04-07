import {createRef, useEffect, useState} from 'react'
import type {NextPage} from 'next'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Flex,
  Container,
  Input,
  Select,
  Table,
  Th,
  Thead,
  Button,
  Text
} from '@chakra-ui/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useToasts} from 'react-toast-notifications'
import {filter} from '../utils/filter'
import {showAddCard} from '../popups/showAddCard'
import {requireSession} from '../utils/request'
import {getUserProps} from '../models/getUserProps'
import {IProfileData, ICards} from '../models/Schemas'

interface ICardsProps extends IProfileData {
  users: {
    _id: string,
    name: string
  }[]
}

const Cards: NextPage<ICardsProps> = (props) => {
  const [user, setUser] = useState('')
  const [data, setData] = useState<ICards[]>([])
  const [inReadingMode, setInReadingMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const {addToast} = useToasts()
  const table = createRef<HTMLTableElement>()
  const cards = data.filter(e => e.user === user)

  useEffect(() => {
    refresh()
  }, [user])

  const refresh = async () => {
    setLoading(true)
    if (user !== '') {
      const response = await axios.get('/api/getCardsByUser', {
        params: {
          userID: user
        }
      })
      setLoading(false)
      setData(response.data.cards)
      setInReadingMode(response.data.inReadingMode)
    }
  }

  const deleteCard = (cardID: string) => {
    Swal.fire({
      title: 'Você confirma a ação?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete('/api/deleteCard', {
          data: {
            cardID: cardID
          }
        })
        if (response.status === 200) {
          setData(data.filter((e) => (e._id !== cardID)))
          addToast('Cartão deletado com sucesso!', {appearance: 'success'})
        } else {
          addToast(`Erro desconhecido. Status code ${response.status}`, {appearance: 'error'})
        }
      }
    })
  }

  const changeCardStatus = async (card: ICards, status: string) => {
    Swal.fire({
      title: 'Você confirma a ação?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post('/api/changeCardStatus', {
          cardID: card._id,
          status: status
        })
        if (response.status === 200) {
          setData(cards.map(newCard => {
            if (newCard._id === card._id) {
              newCard.status = parseInt(status)
            }
            return newCard
          }))
          addToast('Estado alterado com sucesso!', {appearance: 'success'})
          setInReadingMode(cards.some((card) => card.status === 3))
        } else {
          addToast(`Erro desconhecido. Status code ${response.status}`, {appearance: 'error'})
        }
      }
    })
  }

  return (
    <>
      <Head>
        <title>Abrakadabra - Cartões registrados</title>
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
              Cartões registrados
            </Text>
            <Button
              width="240px"
              height="34px"
              marginBottom="15px"
              backgroundColor="#009879"
              border="0"
              borderRadius="2px"
              color="#ffffff"
              padding="10px"
              onClick={() => showAddCard(props, () => refresh())}
              sx={{
                '@media screen and (max-width: 614px)': {
                  width: '100%',
                  height: '40px'
                }
              }}
              _hover={{
                backgroundColor: '#03A786'
              }}
            >
              Cadastrar novo cartão
            </Button>
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
                onChange={(e) => {filter(e.target.value, table.current)}}
              />
              <Select
                placeholder="Selecione o usuário"
                width="200px"
                height="34px"
                border="1px solid #DADADA"
                borderRadius="3px"
                marginLeft="10px"
                onChange={(e) => setUser(e.currentTarget.value)}
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
                >
                  <tr id="thdead">
                    <Th>Código do cartão</Th>
                    <Th>Nome do cartão</Th>
                    <Th>UUID</Th>
                    <Th>Estado</Th>
                    <Th width="250px">Ação</Th>
                  </tr>
                </Thead>
                <tbody>
                  {cards.map(((card) => {
                    return (
                      <tr key={card._id}>
                        <td>{card.code}</td>
                        <td>{card.alias}</td>
                        <td>{card.uuid}</td>
                        <td>
                          {card.status === 0 && 'Sem UUID'}
                          {card.status === 1 && 'Funcionando'}
                          {card.status === 2 && 'Desativado'}
                          {card.status === 3 && 'Esperando leitura'}
                        </td>
                        <td>
                          <Flex
                            flexDir="column"
                          >
                            {(card.status === 0 && !inReadingMode) && (
                              <Button
                                width="100%"
                                height="30px"
                                backgroundColor="#3E3BFF"
                                border="0"
                                borderRadius="2px"
                                color="#ffffff"
                                padding="10px"
                                onClick={() => changeCardStatus(card, '3')}
                                _disabled={{
                                  backgroundColor: '#9B9191'
                                }}
                                _hover={{
                                  backgroundColor: '#4442ff'
                                }}
                              >
                                Ativar modo leitura
                              </Button>
                            )}
                            {(card.status === 1) && (
                              <Button
                                width="100%"
                                height="30px"
                                backgroundColor="#CE505B"
                                border="0"
                                borderRadius="2px"
                                color="#ffffff"
                                padding="10px"
                                onClick={() => changeCardStatus(card, '2')}
                                _disabled={{
                                  backgroundColor: '#9B9191'
                                }}
                                _hover={{
                                  backgroundColor: '#DD5E69'
                                }}
                              >
                                Desativar cartão
                              </Button>
                            )}
                            {(card.status === 2) && (
                              <Button
                                width="100%"
                                height="30px"
                                backgroundColor="#009879"
                                border="0"
                                borderRadius="2px"
                                color="#ffffff"
                                padding="10px"
                                onClick={() => changeCardStatus(card, '1')}
                                _disabled={{
                                  backgroundColor: '#9B9191'
                                }}
                                _hover={{
                                  backgroundColor: '#03A786'
                                }}
                              >
                                Ativar cartão
                              </Button>
                            )}
                            {(card.status === 3 && inReadingMode) && (
                              <Button
                                width="100%"
                                height="30px"
                                backgroundColor="#3E3BFF"
                                border="0"
                                borderRadius="2px"
                                color="#ffffff"
                                padding="10px"
                                onClick={() => changeCardStatus(card, '0')}
                                _disabled={{
                                  backgroundColor: '#9B9191'
                                }}
                                _hover={{
                                  backgroundColor: '#4442ff'
                                }}
                              >
                                Desativar modo leitura
                              </Button>
                            )}
                            <Button
                              width="100%"
                              height="30px"
                              backgroundColor="#CE505B"
                              border="0"
                              borderRadius="2px"
                              color="#ffffff"
                              padding="10px"
                              marginTop="10px"
                              onClick={() => deleteCard(card._id as string)}
                              _disabled={{
                                backgroundColor: '#9B9191'
                              }}
                              _hover={{
                                backgroundColor: '#DD5E69'
                              }}
                            >
                              Deletar cartão
                            </Button>
                          </Flex>
                        </td>
                      </tr>
                    )
                  }))}
                </tbody>
              </Table>
            </Flex>
            {(cards.length === 0 && user === '') && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                Selecione um usuário
              </Text>
            )}
            {(!loading && cards.length === 0 && user !== '') && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                O usuário não tem cartões registrados
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
    const props = await getUserProps(session.userID)
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

export default Cards