import {useState, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input, Select} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import axios from 'axios'

export const showAddCard = (props: IAddCard, closeCallback: () => void) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Adicionar cartão',
    html: <AddCard users={props.users} />,
    showDenyButton: false,
    showConfirmButton: false,
    showClass: {
      popup: 'animate__animated animate__zoomIn'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut'
    },
    didClose: () => closeCallback()
  })
}

interface IAddCard {
  users: {
    _id: string,
    name: string
  }[]
}

const AddCard: React.FunctionComponent<IAddCard> = (props) => {
  const [alias, setAlias] = useState('')
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(false)
  const users = [...props.users.slice(0, 0), ...props.users.slice(0 + 1)]
  const validButton = alias.length > 3 && alias.length < 30 && user.length > 0 && !loading
  const {addToast} = toasts

  const createCard = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/createCard', {
      alias: alias,
      userID: user
    }).then(() => {
      addToast('Cartão criado com sucesso!', {appearance: 'success'})
      Swal.close()
    }).catch((error) => {
      setLoading(false)
      return addToast(`Erro desconhecido. Status ${error.response.status}`, {appearance: 'error'})
    })
  }

  return (
    <Flex
      as="form"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      marginTop="15px"
    >
      <Input
        id="aliasCard"
        type="text"
        placeholder="Digite o nome do cartão"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setAlias(e.target.value)}}
      />
      <Select
        placeholder="Selecione o usuário"
        width="100%"
        height="45px"
        backgroundColor="#ffffff"
        border="1px solid #DADADA"
        fontSize="16px"
        borderRadius="3px"
        marginTop="10px"
        onChange={(e) => setUser(e.currentTarget.value)}
      >
        {(users.map(user => {
          return (
            <option key={user._id} value={user._id}>{user.name}</option>
          )
        }))}
      </Select>
      <Box marginTop="20px">
        <Button
          type="submit"
          width="150px"
          height="35px"
          backgroundColor="#009879"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          disabled={!validButton}
          onClick={createCard}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Criar cartão
        </Button>
        <Button
          width="150px"
          height="35px"
          backgroundColor="#CE505B"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          marginLeft="10px"
          _disabled={{
            backgroundColor: '#9B9191'
          }}
          _hover={{
            backgroundColor: '#DD5E69'
          }}
          onClick={() => Swal.close()}
        >
          Fechar
        </Button>
      </Box>
    </Flex>
  )
}