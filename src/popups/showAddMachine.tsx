import {useState, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input} from '@chakra-ui/react'
import {toasts} from '../pages/_app'
import axios from 'axios'

export const showAddMachine = (closeCallback: () => void) => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Adicionar máquina',
    html: <AddMachine />,
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

const AddMachine: React.FunctionComponent = () => {
  const [alias, setAlias] = useState('')
  const [loading, setLoading] = useState(false)
  const validButton = alias.length > 3 && alias.length < 30 && !loading
  const {addToast} = toasts

  const createMachine = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/createMachine', {
      alias: alias
    }).then(() => {
      addToast('Máquina criada com sucesso!', {appearance: 'success'})
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
        id="machineAlias"
        type="text"
        placeholder="Digite o nome da máquina"
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
          onClick={createMachine}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Criar máquina
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