import {useState, useEffect, createRef, FormEvent} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {Flex, Box, Button, Input, Text} from '@chakra-ui/react'
import IMask from 'imask'
import {toasts} from '../pages/_app'
import axios from 'axios'

export const showChangePin = () => {
  const MySwal = withReactContent(Swal)
  return MySwal.fire({
    title: 'Trocar PIN',
    html: <ChangePIN />,
    showDenyButton: false,
    showConfirmButton: false
  })
}

const ChangePIN: React.FunctionComponent = () => {
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [loading, setLoading] = useState(false)
  const validButton = pin1.length === 8 && pin1 === pin2 && !loading
  const {addToast} = toasts
  const inputPin1Ref = createRef<HTMLInputElement>()
  const inputPin2Ref = createRef<HTMLInputElement>()

  useEffect(() => {
    IMask(inputPin1Ref.current!, {mask: '00000000'})
    IMask(inputPin2Ref.current!, {mask: '00000000'})
  }, [])

  const changePIN = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    axios.post('/api/changePIN', {
      pin: pin1
    }).then(() => {
      addToast('PIN alterado com sucesso!', {appearance: 'success'})
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
        id="pin1"
        type="password"
        placeholder="Digite seu novo PIN"
        pattern="[0-9]*"
        inputMode="numeric"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        ref={inputPin1Ref}
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setPin1(e.target.value)}}
      />
      <Input
        id="pin2"
        type="password"
        placeholder="Repita seu novo PIN"
        pattern="[0-9]*"
        inputMode="numeric"
        width="100%"
        height="45px"
        fontSize="16px"
        paddingLeft="6px"
        border="1px solid #DADADA"
        borderRadius="3px"
        marginTop="10px"
        ref={inputPin2Ref}
        _placeholder={{
          color: '#212529'
        }}
        onChange={(e) => {setPin2(e.target.value)}}
      />
      <Text
        width="100%"
        textAlign="left"
        marginTop="10px"
      >
        * O PIN deve ter 8 caracteres numéricos
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
          onClick={changePIN}
          _disabled={{
            backgroundColor: '#9B9191 !important'
          }}
          _hover={{
            backgroundColor: '#03A786'
          }}
        >
          Trocar PIN
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