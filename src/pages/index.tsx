import {createRef, useState} from 'react'
import type {NextPage} from 'next'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Flex,
  Container,
  Image,
  Text,
  Button,
  Input,
  Table,
  Th,
  Thead
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useToasts} from 'react-toast-notifications'
import {filter} from '../utils/filter'
import {showChangeEmail} from '../popups/showChangeEmail'
import {showChangePassword} from '../popups/showChangePassword'
import {requireSession} from '../utils/request'
import {getIndexProps} from '../models/getIndexProps'
import {IProfileData, ICards, IAccess} from '../models/Schemas'

interface IHome extends IProfileData {
  cards: ICards[],
  accesses: IAccess[]
}

const Home: NextPage<IHome> = (props) => {
  const [cards, setCards] = useState<ICards[]>(props.cards)
  const {addToast} = useToasts()
  const tableCards = createRef<HTMLTableElement>()
  const tableAccesses = createRef<HTMLTableElement>()

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
          setCards(cards.map(newCard => {
            if (newCard._id === card._id) {
              newCard.status = parseInt(status)
            }
            return newCard
          }))
          addToast('Estado alterado com sucesso!', {appearance: 'success'})
        } else {
          addToast(`Erro desconhecido. Status code ${response.status}`, {appearance: 'error'})
        }
      }
    })
  }

  return (
    <>
      <Head>
        <title>Abrakadabra</title>
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
            <Flex
              id="superiorContainer"
              width="100%"
              sx={{
                '@media screen and (max-width: 614px)': {
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  '& #infoContainer': {
                    width: '100%',
                    marginLeft: '0px',
                    marginTop: '15px'
                  }
                }
              }}
            >
              <Image
                src="/profile.jpg"
                width="120px"
                height="120px"
                borderRadius="50%"
              />
              <Flex
                id="infoContainer"
                flexDir="column"
                flexGrow="1"
                marginLeft="20px"
                overflow="auto"
              >
                <Text as="h1">
                  {props.fullname}
                </Text>
                <Text as="h5">
                  {(props.isAdmin ? 'Administrador(a)' : 'Usuário(a) comum')}
                </Text>
                <Flex
                  id="buttonsContainer"
                  width="100%"
                  sx={{
                    '@media screen and (max-width: 614px)': {
                      flexDirection: 'column',
                      '& button': {
                        width: '100%',
                        marginLeft: '0px'
                      }
                    }
                  }}
                >
                  <Button
                    width="160px"
                    height="30px"
                    marginTop="12px"
                    backgroundColor="#009879"
                    border="0"
                    borderRadius="2px"
                    color="#ffffff"
                    sx={{
                      '@media screen and (max-width: 614px)': {
                        height: '38px'
                      }
                    }}
                    _disabled={{
                      backgroundColor: '#9B9191'
                    }}
                    _hover={{
                      backgroundColor: '#03A786'
                    }}
                    onClick={showChangeEmail}
                  >
                    Trocar e-mail
                  </Button>
                  <Button
                    width="160px"
                    height="30px"
                    marginTop="12px"
                    backgroundColor="#009879"
                    border="0"
                    borderRadius="2px"
                    color="#ffffff"
                    marginLeft="5px"
                    sx={{
                      '@media screen and (max-width: 614px)': {
                        height: '38px'
                      }
                    }}
                    onClick={showChangePassword}
                    _disabled={{
                      backgroundColor: '#9B9191'
                    }}
                    _hover={{
                      backgroundColor: '#03A786'
                    }}
                  >
                    Trocar senha
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            <hr />

            <Flex
              id="containerCards"
              flexDir="column"
            >
              <Text
                fontSize="22px"
                marginLeft="3px"
                marginBottom="10px"
              >
                Seus cartões registrados
              </Text>
              <Input
                type="search"
                placeholder="Pesquisar"
                height="34px"
                fontSize="16px"
                paddingLeft="6px"
                border="1px solid #DADADA"
                borderRadius="3px"
                paddingRight="10px"
                _placeholder={{
                  color: '#212529'
                }}
                sx={{
                  '@media screen and (max-width: 614px)': {
                    height: '40px'
                  }
                }}
                onChange={(e) => {filter(e.target.value, tableCards.current)}}
              />
              <Flex overflowX="auto">
                <Table ref={tableCards}
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
                      <Th>Código do cartão</Th>
                      <Th>Nome do cartão</Th>
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
                          <td>
                            {card.status === 0 && 'Sem UUID'}
                            {card.status === 1 && 'Funcionando'}
                            {card.status === 2 && 'Desativado'}
                            {card.status === 3 && 'Esperando leitura'}
                          </td>
                          <td>
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
                          </td>
                        </tr>
                      )
                    }))}
                  </tbody>
                </Table>
              </Flex>
              {(props.cards.length === 0) && (
                <Text
                  width="100%"
                  textAlign="center"
                  marginTop="10px"
                  fontSize="19px"
                >
                  Nenhum cartão registrado
                </Text>
              )}
            </Flex>
            <hr />

            <Flex
              id="containerAccesses"
              flexDir="column"
            >
              <Text
                fontSize="22px"
                marginLeft="3px"
                marginBottom="10px"
              >
                Seus últimos 50 acessos registrados
              </Text>
              <Input
                type="search"
                placeholder="Pesquisar"
                height="34px"
                fontSize="16px"
                paddingLeft="6px"
                border="1px solid #DADADA"
                borderRadius="3px"
                paddingRight="10px"
                _placeholder={{
                  color: '#212529'
                }}
                sx={{
                  '@media screen and (max-width: 614px)': {
                    height: '40px'
                  }
                }}
                onChange={(e) => {filter(e.target.value, tableAccesses.current)}}
              />
              <Flex overflowX="auto">
                <Table ref={tableAccesses}
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
                    whiteSpace="nowrap"
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
                      <th>Data/Horário</th>
                      <th>Pessoa</th>
                      <th>Lugar</th>
                    </tr>
                  </Thead>
                  <tbody>
                    {props.accesses.map(((access) => {
                      return (
                        <tr key={access._id}>
                          <td>{dayjs.unix(access.datetime).format('DD/MM/YYYY HH:mm:ss')}</td>
                          <td>{access.user}</td>
                          <td>{access.place}</td>
                        </tr>
                      )
                    }))}
                  </tbody>
                </Table>
              </Flex>
              {(props.accesses.length === 0) && (
                <Text
                  width="100%"
                  textAlign="center"
                  marginTop="10px"
                  fontSize="19px"
                >
                  Nenhum acesso registrado
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = requireSession(context.req.cookies.session, false)
  if (session) {
    const props = await getIndexProps(session.userID)
    return {
      props: props!
    }
  } else {
    return {
      props: {},
      redirect: {
        destination: '/login'
      }
    }
  }
}

export default Home