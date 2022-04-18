import {useState, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import axios from 'axios'
import {validateEmail} from '../utils/filter'

export const showRecoveryPassword = () => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Recuperar conta',
    html: <RecoveryPassword />,
    width: '450px',
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

const RecoveryPassword: React.FunctionComponent = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const validButton = validateEmail(email) && !loading
  const {addToast} = toasts

  const sendRecoveryEmail = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/sendRecoveryEmail', {
      email: email
    }).then(() => {
      Swal.fire({
        html: `
        <div style="text-align: left">
          <div>
            Se este endereço de e-mail estiver correto, um e-mail será enviado com um link para
            você recuperar sua conta.
          </div>
          <div style="margin-top: 12px">
            Esse link será válido por apenas 5 minutos.
          </div>
        </div>
        `,
        showClass: {
          popup: 'animate__animated animate__zoomIn'
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut'
        }
      })
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
        id="email"
        type="email"
        placeholder="Digite o e-mail da conta"
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
          onClick={sendRecoveryEmail}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Recupear conta
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