import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Modal,
  FormGroup,
  UncontrolledPopover,
  PopoverBody,
  PopoverHeader,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  UncontrolledCarousel,
} from 'reactstrap';

export default function ExamplesNavbar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState('');
  const [color, setColor] = React.useState('navbar-transparent');
  const [signInFormModal, setsignInFormModal] = React.useState(false);
  const [signInEmailFocus, setSignInEmailFocus] = React.useState(false);
  const [signInPasswordFocus, setSignInPasswordFocus] = React.useState(false);

  const [createAccountModal, setCreateAccountModal] = React.useState(false);
  const [createAccountEmailFocus, setCreateAccountEmailFocus] = React.useState(false);
  const [createAccountPasswordFocus, setCreateAccountPasswordFocus] = React.useState(false);
  const [createAccountRetypePasswordFocus, setCreateAccountRetypePasswordFocus] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('scroll', changeColor);
    return function cleanup() {
      window.removeEventListener('scroll', changeColor);
    };
  }, []);

  const changeColor = () => {
    if (document.documentElement.scrollTop > 99 || document.body.scrollTop > 99) {
      setColor('bg-info');
    } else if (document.documentElement.scrollTop < 100 || document.body.scrollTop < 100) {
      setColor('navbar-transparent');
    }
  };

  const toggleCollapse = () => {
    document.documentElement.classList.toggle('nav-open');
    setCollapseOpen(!collapseOpen);
  };

  const onCollapseExiting = () => {
    setCollapseOut('collapsing-out');
  };

  const onCollapseExited = () => {
    setCollapseOut('');
  };

  return (
    <Navbar className={'fixed-top ' + color} color-on-scroll='100' expand='lg'>
      <Container>
        <div className='navbar-translate'>
          <NavbarBrand to='/' id='navbar-brand' tag={Link}>
            <span>MMD • </span>
            Music Markdown
          </NavbarBrand>
          <UncontrolledTooltip placement='bottom' target='navbar-brand'>
            Designed to make sheet music accessible to everyone
          </UncontrolledTooltip>
          <button aria-expanded={collapseOpen} className='navbar-toggler navbar-toggler' onClick={toggleCollapse}>
            <span className='navbar-toggler-bar bar1' />
            <span className='navbar-toggler-bar bar2' />
            <span className='navbar-toggler-bar bar3' />
          </button>
        </div>
        <Collapse
          className={'justify-content-end ' + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}>
          <div className='navbar-collapse-header'>
            <Row>
              <Col className='collapse-brand' xs='8'>
                <a href='#pablo' onClick={(e) => e.preventDefault()}>
                  MMD • Music Markdown
                </a>
              </Col>
              <Col className='collapse-close text-right' xs='4'>
                <button aria-expanded={collapseOpen} className='navbar-toggler' onClick={toggleCollapse}>
                  <i className='tim-icons icon-simple-remove' />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
            <NavItem className='p-0'>
              <NavLink data-placement='bottom' href='https://github.com' rel='noopener noreferrer' target='_blank' title='Check out our GitHub'>
                <i className='fab fa-github' />
                <p className='d-lg-none d-xl-none'>GitHub</p>
              </NavLink>
            </NavItem>
            <NavItem>
              <Button
                className='nav-link d-none d-lg-block'
                color='primary'
                onClick={() => {
                  setCreateAccountModal(true);
                }}>
                <i className='tim-icons icon-spaceship' /> Create an Account
              </Button>
            </NavItem>
            <NavItem>
              <Button
                className='nav-link d-none d-lg-block'
                color='default'
                onClick={() => {
                  setsignInFormModal(true);
                }}>
                <i className='tim-icons icon-single-02' /> Sign in
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
      <Modal modalClassName='modal-black' isOpen={signInFormModal} toggle={() => setsignInFormModal(false)}>
        <div className='modal-header justify-content-center'>
          <button className='close' onClick={() => setsignInFormModal(false)}>
            <i className='tim-icons icon-simple-remove' />
          </button>
          <h4 className='title title-up'>Sign in with email</h4>
        </div>
        <div className='modal-body'>
          <Form role='form'>
            <FormGroup className='mb-3'>
              <InputGroup
                className={classnames('input-group-alternative', {
                  'input-group-focus': signInEmailFocus,
                })}>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='tim-icons icon-email-85' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder='Email' type='email' onFocus={(e) => setSignInEmailFocus(true)} onBlur={(e) => setSignInEmailFocus(false)} />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup
                className={classnames('input-group-alternative', {
                  'input-group-focus': signInPasswordFocus,
                })}>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='tim-icons icon-key-25' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Password'
                  type='password'
                  onFocus={(e) => setSignInPasswordFocus(true)}
                  onBlur={(e) => setSignInPasswordFocus(false)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup check className='mt-3'>
              <Label check>
                <Input defaultChecked type='checkbox' />
                <span className='form-check-sign' />
                Remember me!
              </Label>
            </FormGroup>
            <div className='text-center'>
              <Button className='my-4' color='primary' type='button'>
                Sign in
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal modalClassName='modal-black' isOpen={createAccountModal} toggle={() => setCreateAccountModal(false)}>
        <div className='modal-header justify-content-center'>
          <button className='close' onClick={() => setCreateAccountModal(false)}>
            <i className='tim-icons icon-simple-remove' />
          </button>
          <h4 className='title title-up'>Create account with email</h4>
        </div>
        <div className='modal-body'>
          <Form role='form'>
            <FormGroup className='mb-3'>
              <InputGroup
                className={classnames('input-group-alternative', {
                  'input-group-focus': createAccountEmailFocus,
                })}>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='tim-icons icon-email-85' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Email'
                  type='email'
                  onFocus={(e) => setCreateAccountEmailFocus(true)}
                  onBlur={(e) => setCreateAccountEmailFocus(false)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className='has-danger'>
              <InputGroup
                className={classnames('input-group-alternative', {
                  'input-group-focus': createAccountPasswordFocus,
                })}>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='tim-icons icon-key-25' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Password'
                  type='password'
                  onFocus={(e) => setCreateAccountPasswordFocus(true)}
                  onBlur={(e) => setCreateAccountPasswordFocus(false)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className='has-danger'>
              <InputGroup
                className={classnames('input-group-alternative', {
                  'input-group-focus': createAccountRetypePasswordFocus,
                })}>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='tim-icons icon-key-25' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Retype Password'
                  type='password'
                  onFocus={(e) => setCreateAccountRetypePasswordFocus(true)}
                  onBlur={(e) => setCreateAccountRetypePasswordFocus(false)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup check className='mt-3'>
              <Label check>
                <Input defaultChecked type='checkbox' />
                <span className='form-check-sign' />
                Remember me!
              </Label>
            </FormGroup>
            <div className='text-center'>
              <Button className='my-4' color='primary' type='button'>
                Sign in
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </Navbar>
  );
}
