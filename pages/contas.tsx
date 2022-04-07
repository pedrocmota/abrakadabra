import {createRef, useState} from 'react'
import type {NextPage} from 'next'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Flex,
  Container,
  Input,
  Button,
  Table,
  Th,
  Text,
  Thead
} from '@chakra-ui/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useToasts} from 'react-toast-notifications'
import {filter} from '../utils/filter'
import {showAddUser} from '../popups/showAddUser'
import {requireSession} from '../utils/request'
import {getUserProps} from '../models/getUserProps'
import {IProfileData, IUsers} from '../models/Schemas'

interface IAccountsProps extends IProfileData {
  userID: string,
  isAdmin: boolean,
  users: IUsers[]
}

const Accounts: NextPage<IAccountsProps> = (props) => {
  const [data, setData] = useState<IUsers[]>(props.users)
  const {addToast} = useToasts()
  const table = createRef<HTMLTableElement>()

  const refresh = async () => {
    const response = await axios.get('/api/getUsers')
    setData(response.data)
  }

  const deleteUser = (userID: string) => {
    Swal.fire({
      title: 'Você confirma a ação?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete('/api/deleteUser', {
          data: {
            userID: userID
          }
        })
        if (response.status === 200) {
          setData(data.filter((e) => (e._id !== userID)))
          addToast('Usuário deletado com sucesso!', {appearance: 'success'})
        } else {
          addToast(`Erro desconhecido. Status code ${response.status}`, {appearance: 'error'})
        }
      }
    })
  }

  return (
    <>
      <Head>
        <title>Abrakadabra - Contas registradas</title>
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
              Contas registradas
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
              onClick={() => showAddUser(() => refresh())}
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
              Cadastrar nova conta
            </Button>
            <Flex
              display="flex"
              __css={{
                '& select': {
                  paddingRight: '0px'
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
                    <Th>Nome</Th>
                    <Th>Tipo de usuário</Th>
                    <Th width="220px">Ação</Th>
                  </tr>
                </Thead>
                <tbody>
                  {(data.map((user) => {
                    return (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>
                          {user.admin && 'Administrador'}
                          {!user.admin && 'Usuário comum'}
                        </td>
                        <td>
                          {(props.userID !== user._id) && (
                            <Button
                              width="100%"
                              height="30px"
                              backgroundColor="#CE505B"
                              border="0"
                              borderRadius="2px"
                              color="#ffffff"
                              padding="10px"
                              onClick={() => deleteUser(user._id as string)}
                              disabled={props.userID === user._id}
                              _disabled={{
                                backgroundColor: '#9B9191'
                              }}
                              _hover={{
                                backgroundColor: '#DD5E69'
                              }}
                            >
                              Deletar usuário
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  }))}
                </tbody>
              </Table>
            </Flex>
            {(data.length === 0) && (
              <Text
                width="100%"
                textAlign="center"
                marginTop="20px"
                fontSize="22px"
              >
                Não há contas registradas
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
      props: {
        userID: session.userID,
        ...props!
      }
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

export default Accounts