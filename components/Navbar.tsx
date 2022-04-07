import React from 'react'
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'
import ActiveLink from './ActiveLink'

interface IMenubar {
  name: string,
  isAdmin: boolean
}

const Menubar: React.FunctionComponent<IMenubar> = (props) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link href="/">
            <a>Abrakadabra</a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {(props.isAdmin) && (
              <>
                <Nav.Link as="span">
                  <ActiveLink href="/acessos">
                    <a>Histórico de acessos</a>
                  </ActiveLink>
                </Nav.Link>
                <Nav.Link as="span">
                  <ActiveLink href="/cartoes">
                    <a>Cartões registrados</a>
                  </ActiveLink>
                </Nav.Link>
                <Nav.Link as="span">
                  <ActiveLink href="/maquinas">
                    <a>Máquinas registradas</a>
                  </ActiveLink>
                </Nav.Link>
                <Nav.Link as="span">
                  <ActiveLink href="/contas">
                    <a>Contas registradas</a>
                  </ActiveLink>
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <NavDropdown title={props.name} id="collasible-nav-dropdown">
              <NavDropdown.Item as="div">
                <Link href="/api/logout">
                  Deslogar
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menubar