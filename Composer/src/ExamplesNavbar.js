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
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from 'reactstrap';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import sha256 from 'js-sha256';
import axios from 'axios';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

export default function ExamplesNavbar(props) {
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

  const [signInEmail, setSignInEmail] = React.useState('');
  const [signInPassword, setSignInPassword] = React.useState('');

  const [createAccountEmail, setCreateAccountEmail] = React.useState('');
  const [createAccountPassword, setCreateAccountPassword] = React.useState('');
  const [createAccountRetypePassword, setCreateAccountRetypePassword] = React.useState('');

  const [retypeCorrect, setRetypeCorrect] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  const [alertSeverity, setAlertSeverity] = React.useState('success');
  const [alertMessage, setAlertMessage] = React.useState('error');

  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [loginInfo, setLoginInfo] = React.useState({});

  React.useEffect(() => {
    window.addEventListener('scroll', changeColor);

    const itemStr = localStorage.getItem('loginInfo');
    // if the item doesn't exist, return null
    if (itemStr) {
      const item = JSON.parse(itemStr);
      const now = new Date();
      // compare the expiry time of the item with the current time
      if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem('loginInfo');
        return null;
      }
      setLoginInfo(item);
      props.render();
      setLoginSuccess(true);
    }

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

  const createAccount = () => {
    console.log(createAccountEmail);
    console.log(createAccountPassword);
    console.log(createAccountRetypePassword);

    if (createAccountEmail.length === 0) {
      setAlertMessage('Failed create account. Email required.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    if (createAccountPassword.length === 0) {
      setAlertMessage('Failed create account. Password required.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    if (createAccountRetypePassword.length === 0) {
      setAlertMessage('Failed create account. Retype empty.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    if (createAccountPassword !== createAccountRetypePassword) setRetypeCorrect(true);
    else {
      setAlertMessage('Failed create account. Retype empty.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }
    axios
      .get('http://localhost:8080/createAccount', { params: { email: createAccountEmail, password: sha256(createAccountPassword) } })
      .then((res) => {
        console.log(res.data);
        setAlertMessage('Successfully created account.');
        setAlertSeverity('success');
        setOpenAlert(true);
        setCreateAccountModal(false);
      })
      .catch((err) => {
        console.log(err.message);
        setAlertMessage('Username already exists.');
        setAlertSeverity('error');
        setOpenAlert(true);
      });
  };

  const signIn = () => {
    console.log(signInEmail);
    console.log(signInPassword);
    console.log(remember);

    if (signInEmail.length === 0) {
      setAlertMessage('Failed login. Email required.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    if (signInPassword.length === 0) {
      setAlertMessage('Failed login. Password required.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    axios
      .get('http://localhost:8080/login', { params: { email: signInEmail, password: sha256(signInPassword) } })
      .then((res) => {
        console.log(res.data);
        setLoginInfo({
          email: signInEmail,
          password: sha256(signInPassword),
        });

        setAlertMessage('Successful login');
        setAlertSeverity('success');
        setOpenAlert(true);
        setsignInFormModal(false);
        setLoginSuccess(true);

        if (remember) {
          const now = new Date();
          const item = {
            email: signInEmail,
            password: sha256(signInPassword),
            expiry: now.getTime() + 86400000,
          };
          localStorage.setItem('loginInfo', JSON.stringify(item));
        } else {
          localStorage.removeItem('loginInfo');
          setSignInEmail('');
          setSignInPassword('');
        }
        props.render();
        return;
      })
      .catch((err) => {
        console.log(err.message);
        setAlertMessage('Invalid username and password.');
        setAlertSeverity('error');
        setOpenAlert(true);
        setLoginSuccess(false);
        return;
      });
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenAlert(false);
  };

  return (
    <>
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
              {!loginSuccess && (
                <>
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
                </>
              )}
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
                  <Input
                    placeholder='Email'
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    type='email'
                    onFocus={(e) => setSignInEmailFocus(true)}
                    onBlur={(e) => setSignInEmailFocus(false)}
                  />
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
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup check className='mt-3'>
                <Label check>
                  <Input
                    type='checkbox'
                    value={remember}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setRemember(e.target.checked);
                    }}
                  />
                  <span className='form-check-sign' />
                  Remember me!
                </Label>
              </FormGroup>
              <div className='text-center'>
                <Button className='my-4' color='primary' type='button' onClick={signIn}>
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
                    value={createAccountEmail}
                    onChange={(e) => setCreateAccountEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className={retypeCorrect ? 'has-danger mb-3' : 'mb-3'}>
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
                    onFocus={(e) => {
                      setCreateAccountPasswordFocus(true);
                      setRetypeCorrect(false);
                    }}
                    onBlur={(e) => setCreateAccountPasswordFocus(false)}
                    value={createAccountPassword}
                    onChange={(e) => setCreateAccountPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className={retypeCorrect ? 'has-danger mb-3' : 'mb-3'}>
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
                    onFocus={(e) => {
                      setCreateAccountRetypePasswordFocus(true);
                      setRetypeCorrect(false);
                    }}
                    onBlur={(e) => setCreateAccountRetypePasswordFocus(false)}
                    value={createAccountRetypePassword}
                    onChange={(e) => setCreateAccountRetypePassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className='text-center'>
                <Button className='my-4' color='primary' type='button' onClick={createAccount}>
                  Create Account
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </Navbar>
      <Snackbar open={openAlert} autoHideDuration={4000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
