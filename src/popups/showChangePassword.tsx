import {useState, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input, Text} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import axios from 'axios'

export const showChangePassword = () => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Trocar senha',
    html: <ChangePassword />,
    showDenyButton: false,
    showConfirmButton: false,
    showClass: {
      popup: 'animate__animated animate__zoomIn'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut'
    }
  })
}

const ChangePassword: React.FunctionComponent = () => {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const validButton = password1.length > 6 && password1.length < 30 && password1 === password2 && !loading
  const {addToast} = toasts

  const changePassword = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/changePassword', {
      password: password1
    }).then(() => {
      addToast('Senha alterada com sucesso!', {appearance: 'success'})
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
        id="password1"
        type="password"
        placeholder="Digite sua nova senha"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setPassword1(e.target.value)}}
      />
      <Input
        id="password2"
        type="password"
        placeholder="Repita sua nova senha"
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
      <Text
        width="100%"
        textAlign="left"
        marginTop="10px"
      >
        * A senha deve ter entre 6 e 30 caracteres
      </Text>
      <Box marginTop="5px">
        <Button
          type="submit"
          width="150px"
          height="35px"
          backgroundColor="#009879"
          border="0"
          borderRadius="2px"
          color="#ffffff"
          disabled={!validButton}
          onClick={changePassword}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Trocar senha
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