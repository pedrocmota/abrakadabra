import {useState, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import axios from 'axios'
import {validateEmail} from '../utils/filter'

export const showChangeEmail = () => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Trocar e-mail',
    html: <ChangeEmail />,
    showDenyButton: false,
    showConfirmButton: false
  })
}

const ChangeEmail: React.FunctionComponent = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const validButton = validateEmail(email) && !loading
  const {addToast} = toasts

  const changeEmail = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/changeEmail', {
      email: email
    }).then(() => {
      addToast('E-mail alterado com sucesso!', {appearance: 'success'})
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
        id="email"
        type="email"
        placeholder="Digite seu novo e-mail"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setEmail(e.target.value)}}
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
          onClick={changeEmail}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Trocar e-mail
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