import {useState, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input, Select} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import axios from 'axios'
import {validateEmail} from '../utils/filter'

export const showAddUser = (closeCallback: () => void) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Adicionar usuário',
    html: <AddUser />,
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

const AddUser: React.FunctionComponent = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [loading, setLoading] = useState(false)
  const validButton = (() => {
    if ((name.length < 3 || name.length > 30) || loading) {
      return false
    }
    if (!validateEmail(email) || userType.length < 1) {
      return false
    }
    if (password1.length < 6 || password1.length > 30 || password1 !== password2) {
      return false
    }
    return true
  })()
  const {addToast} = toasts

  const createUser = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/createUser', {
      name: name,
      email: email,
      isAdmin: userType === '2' ? 'true' : 'false',
      password: password1
    }).then(() => {
      addToast('Usuário criado com sucesso!', {appearance: 'success'})
      Swal.close()
    }).catch((error) => {
      setLoading(false)
      if (error.response.status === 409) {
        return addToast('Esse e-email já está sendo utilizado', {appearance: 'error'})
      } else {
        return addToast(`Erro desconhecido. Status ${error.response.status}`, {appearance: 'error'})
      }
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
        id="name"
        type="text"
        placeholder="Digite o nome do usuário"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setName(e.target.value)}}
      />

      <Input
        id="userEmail"
        type="email"
        placeholder="Digite o e-mail do usuário"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setEmail(e.target.value)}}
      />

      <Select
        id="userType"
        placeholder="Selecione o tipo do usuário"
        width="100%"
        height="45px"
        fontSize="16px"
        backgroundColor="#ffffff"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        onChange={(e) => setUserType(e.currentTarget.value)}
      >
        <option value="1">Comum</option>
        <option value="2">Administrador</option>
      </Select>

      <Input
        id="password1"
        type="password"
        placeholder="Digite a senha do usuário"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setPassword1(e.target.value)}}
      />

      <Input
        id="password2"
        type="password"
        placeholder="Repita a senha do usuário"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setPassword2(e.target.value)}}
      />

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
          onClick={createUser}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Criar Usuário
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