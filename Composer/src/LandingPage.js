import React, { useRef, useState, Component } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
  Modal,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from 'reactstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import CustomRule from './Syntax';
import OpenSheetDisplay from './OpenSheetDisplay';
import ExamplesNavbar from './ExamplesNavbar.js';
import Footer from './Footer.js';
import axios from 'axios';
import classnames from 'classnames';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import './assets/scss/blk-design-system-react.scss?v=1.2.0';
import './assets/demo/demo.css';
import './assets/css/nucleo-icons.css';

import { parse_and_evaluate } from './parser';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    console.log('Page Rerendered');
    localStorage.removeItem('parsedResult');
    this.rerender = this.rerender.bind(this);
    this.state = {
      sheetContent: '',
      editorContent: '',
      twoNewLine: false,
      saveFileModal: false,
      fileName: '',
      fileNameFocus: false,
      loggedIn: false,
      openAlert: false,
      alertMessage: '',
      alertSeverity: '',
      selectFileModal: false,
      FileList: [],
      selectedFileName: '',
      showMusicSheet: true,
    };
  }

  shouldComponentUpdate() {
    if (localStorage.getItem('loginInfo')) {
      console.log(JSON.parse(localStorage.getItem('loginInfo')));
    }
    return false;
  }

  rerender() {
    console.log('rerender');
    console.log(localStorage.getItem('loginInfo'));
    if (localStorage.getItem('loginInfo')) {
      this.setState({ loggedIn: true });
    }
    this.forceUpdate();
  }

  componentDidMount() {
    const customRule = new CustomRule();
    this.refs.aceEditor.editor.getSession().setMode(customRule);
    this.refs.aceEditor.editor.setAutoScrollEditorIntoView(true);
    this.refs.aceEditor.editor.commands.on('afterExec', (eventData) => {
      if (eventData.command.name === 'insertstring') {
        if (eventData.args === '\n') {
          if (this.state.twoNewLine === true) {
            this.setState({ twoNewLine: false }, () => {
              this.refreshSheet();
            });
          } else {
            this.setState({ twoNewLine: true });
          }
        } else {
          this.setState({ twoNewLine: false });
        }
      }
    });
  }

  editorOnChange(e) {
    this.setState({ editorContent: e });
  }

  refreshSheet() {
    console.log('Refreshing music sheet');
    this.setState({ showMusicSheet: true });
    try {
      var parsed = parse_and_evaluate(this.state.editorContent);
      // console.log(parsed);
      if (!parsed.startsWith('<?xml')) return;
      // this.setState({ sheetContent: '' }, () => {
      this.setState({ sheetContent: parsed }, () => {
        console.log('updating page');
        this.forceUpdate();
      });
      // });
    } catch (error) {
      console.log(error);
    }
  }

  retrieveFileList() {
    var email = JSON.parse(localStorage.getItem('loginInfo')).email;
    console.log(JSON.parse(localStorage.getItem('loginInfo')));
    axios
      .get('http://localhost:8080/getFile', { params: { username: email, fileName: '' } })
      .then((res) => {
        console.log(res.data);
        this.setState({ FileList: res.data.files, selectedFileName: res.data.files[0] }, () => this.forceUpdate());
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  saveFile() {
    console.log(this.state);
    console.log(this.state.fileName);
    console.log(this.state.editorContent);
    var email = JSON.parse(localStorage.getItem('loginInfo')).email;
    console.log(JSON.parse(localStorage.getItem('loginInfo')));

    axios
      .post('http://localhost:8080/save', { data: this.state.editorContent }, { params: { username: email, fileName: this.state.fileName } })
      .then((res) => {
        console.log(res.data);
        this.setState({ saveFileModal: false, showMusicSheet: true });
        this.forceUpdate();
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({ showMusicSheet: true });
      });
  }

  retrieveFile() {
    console.log(this.state.selectedFileName);
    var email = JSON.parse(localStorage.getItem('loginInfo')).email;
    console.log(JSON.parse(localStorage.getItem('loginInfo')));
    axios
      .get('http://localhost:8080/getFile', { params: { username: email, fileName: this.state.selectedFileName } })
      .then((res) => {
        console.log(res.data);
        this.setState({ editorContent: res.data, selectFileModal: false }, () => this.forceUpdate());
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  downloadSheet() {
    
  }

  changeSelected(e) {
    this.setState({ selectedFileName: e.target.value });
  }

  openModal() {
    this.setState({ saveFileModal: true, showMusicSheet: false });
    console.log(this.state.saveFileModal);
    this.forceUpdate();
  }

  render() {
    const { editorContent, sheetContent, saveFileModal, fileName, fileNameFocus } = this.state;
    return (
      <>
        <ExamplesNavbar render={this.rerender} />
        <div className='wrapper'>
          <div className='page-header'>
            {/* <img alt='...' className='path' src={require('./assets/img/blob.png').default} /> */}
            {/* <img alt='...' className='path2' src={require('./assets/img/path2.png').default} /> */}
            <img alt='...' className='shapes triangle' src={require('./img/triunghiuri.png').default} />
            {/* <img alt='...' className='shapes wave' src={require('./assets/img/waves.png').default} /> */}
            {/* <img alt='...' className='shapes squares' src={require('./assets/img/patrat.png').default} /> */}
            {/* <img alt='...' className='shapes circle' src={require('./assets/img/cercuri.png').default} /> */}
            <div className='content-center'>
              <Row className='row-grid justify-content-between align-items-center text-left'>
                <Col lg='6' md='6'>
                  <h1 className='text-white'>
                    We make generating sheet music <br />
                    <span className='text-white'>easy</span>
                  </h1>
                  <p className='text-white mb-3'>Place Holder</p>
                  {/* <div className='btn-wrapper mb-3'>
                  <p className='category text-success d-inline'>From 9.99%/mo</p>
                  <Button className='btn-link' color='success' href='#pablo' onClick={(e) => e.preventDefault()} size='sm'>
                    <i className='tim-icons icon-minimal-right' />
                  </Button>
                </div> */}
                  <div className='btn-wrapper'>
                    <div className='button-container'>
                      <Button className='btn-icon btn-simple btn-round btn-neutral' color='default' href='https://github.com'>
                        <i className='fab fa-github' />
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col lg='4' md='5'>
                  <img alt='...' className='img-fluid' src={require('./img/etherum.png').default} />
                </Col>
              </Row>
            </div>
          </div>
          <section className='section section-lg'>
            <img alt='...' className='path' src={require('./assets/img/path4.png').default} />
            {/* <img alt='...' className='path2' src={require('./assets/img/path5.png').default} /> */}
            {/* <img alt='...' className='path3' src={require('./assets/img/path2.png').default} /> */}
            <Container>
              <Row className='justify-content-center'>
                <Col lg='12'>
                  <h1 className='text-center'>Your best benefit</h1>
                  <Row className='row-grid justify-content-center'>
                    <Col lg='3'>
                      <div className='info'>
                        <div className='icon icon-primary'>
                          <i className='tim-icons icon-money-coins' />
                        </div>
                        <h4 className='info-title'>Low Commission</h4>
                        <hr className='line-primary' />
                        <p>Divide details about your work into parts. Write a few lines about each one. A paragraph describing a feature will.</p>
                      </div>
                    </Col>
                    <Col lg='3'>
                      <div className='info'>
                        <div className='icon icon-warning'>
                          <i className='tim-icons icon-chart-pie-36' />
                        </div>
                        <h4 className='info-title'>High Incomes</h4>
                        <hr className='line-warning' />
                        <p>
                          Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing
                          feature will be a feature.
                        </p>
                      </div>
                    </Col>
                    <Col lg='3'>
                      <div className='info'>
                        <div className='icon icon-success'>
                          <i className='tim-icons icon-single-02' />
                        </div>
                        <h4 className='info-title'>Verified People</h4>
                        <hr className='line-success' />
                        <p>
                          Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing be
                          enough.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
          <section className='section section-lg section-coins'>
            <img alt='...' className='path' src={require('./assets/img/path3.png').default} />
            <div style={{ margin: '5rem' }}>
              <Row>
                <Col md='4'>
                  <hr className='line-info' />
                  <h1>
                    {/* Choose the coin  */}
                    Start generating <span className='text-info'>music sheet</span>
                  </h1>
                </Col>
              </Row>
              <Row>
                <Col md='12' lg='6'>
                  <Card className='card-coin card-plain'>
                    {/* <CardHeader>
                    <img alt='...' className='img-center img-fluid' src={require('./assets/img/bitcoin.png').default} />
                  </CardHeader> */}
                    <CardBody>
                      <Row style={{ height: '75vh', padding: '1rem' }}>
                        <AceEditor
                          ref='aceEditor'
                          mode='text'
                          theme='monokai'
                          width='100%'
                          height='75vh'
                          value={editorContent}
                          onChange={(e) => this.editorOnChange(e)}
                          on
                          wrapEnabled
                          editorProps={{ $blockScrolling: true }}
                          setOptions={{
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 4,
                            showPrintMargin: false,
                            hScrollBarAlwaysVisible: true,
                            vScrollBarAlwaysVisible: true,
                          }}
                          fontSize={18}
                        />
                      </Row>
                    </CardBody>

                    <CardFooter className='text-center'>
                      <Button className='btn-simple' disabled={!this.state.loggedIn} color='primary' onClick={() => this.openModal()}>
                        Save to Cloud
                      </Button>
                      <Button
                        className='btn-simple'
                        disabled={!this.state.loggedIn}
                        color='primary'
                        onClick={() => {
                          this.retrieveFileList();
                          this.setState({ selectFileModal: true });
                          this.forceUpdate();
                        }}>
                        Select file from cloud
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
                <Col md='12' lg='6'>
                  <Card className='card-coin card-plain'>
                    {/* <CardHeader>
                    <img alt='...' className='img-center img-fluid' src={require('./assets/img/etherum.png').default} />
                  </CardHeader> */}
                    <CardBody>
                      <Row style={{ height: '75vh', padding: '1rem' }}>
                        <div style={{ background: '#fff', width: '100%', height: '75vh', overflow: 'auto' }}>
                          {/* <OpenSheetMusicDisplay file={'MuzioClementi_SonatinaOpus36No1_Part2.xml'} /> */}
                          {this.state.showMusicSheet && <OpenSheetDisplay id='musicSheetSVG' content={sheetContent} />}
                        </div>
                      </Row>
                    </CardBody>
                    <CardFooter className='text-center'>
                      <Button className='btn-simple' color='success' onClick={() => this.refreshSheet()}>
                        Refresh
                      </Button>
                      <Button className='btn-simple' color='success' onClick={() => this.downloadSheet()}>
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </div>
          </section>
          <Footer />
        </div>
        <Modal
          modalClassName='modal-black'
          isOpen={this.state.saveFileModal}
          toggle={() => {
            this.setState({ saveFileModal: false });
            this.forceUpdate();
          }}>
          <div className='modal-header justify-content-center'>
            <button
              className='close'
              onClick={() => {
                this.setState({ saveFileModal: false });
                this.forceUpdate();
              }}>
              <i className='tim-icons icon-simple-remove' />
            </button>
            <h4 className='title title-up'>Save file to cloud</h4>
          </div>
          <div className='modal-body'>
            <Form role='form'>
              <FormGroup className='mb-3'>
                <InputGroup
                  className={classnames('input-group-alternative', {
                    'input-group-focus': this.state.fileNameFocus,
                  })}>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='tim-icons icon-cloud-upload-94' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='File Name'
                    type='name'
                    onFocus={(e) => {
                      this.setState({ fileNameFocus: true });
                      this.forceUpdate();
                    }}
                    onBlur={(e) => {
                      this.setState({ fileNameFocus: false });
                      this.forceUpdate();
                    }}
                    value={this.state.fileName}
                    onChange={(e) => {
                      this.setState({ fileName: e.target.value });
                      this.forceUpdate();
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <div className='text-center'>
                <Button className='my-4' color='primary' type='button' onClick={() => this.saveFile()}>
                  Save
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        <Modal
          modalClassName='modal-black'
          isOpen={this.state.selectFileModal}
          toggle={() => {
            this.setState({ selectFileModal: false });
            this.forceUpdate();
          }}>
          <div className='modal-header justify-content-center'>
            <button
              className='close'
              onClick={() => {
                this.setState({ selectFileModal: false });
                this.forceUpdate();
              }}>
              <i className='tim-icons icon-simple-remove' />
            </button>
            <h4 className='title title-up'>Select file from cloud</h4>
          </div>
          <div className='modal-body'>
            <Form role='form'>
              <FormGroup className='mb-3'>
                <InputGroup>
                  <div style={{ width: '100%', padding: '1rem' }}>
                    <select class='form-control' id='exampleFormControlSelect1' onChange={this.changeSelected.bind(this)}>
                      {this.state.FileList.map((file) => (
                        <option style={{ color: 'black' }}>{file}</option>
                      ))}
                    </select>
                  </div>
                </InputGroup>
              </FormGroup>
              <div className='text-center'>
                <Button className='my-4' color='primary' type='button' onClick={() => this.retrieveFile()}>
                  Retrieve
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default LandingPage;

// function LandingPageDeprecated() {
//   const aceEditor = useRef();
//   const [refreshDisplayState, setDisplayState] = useState(0);
//   const [content, setContent] = useState('');
//   React.useEffect(() => {
//     console.log('useEffect called');
//     localStorage.removeItem('parsedResult');
//     document.body.classList.toggle('landing-page');
//     const customRule = new CustomRule();
//     const editor = aceEditor.current;
//     editor.editor.getSession().setMode(customRule);
//     editor.editor.setAutoScrollEditorIntoView(true);
//     // Specify how to clean up after this effect:
//     return function cleanup() {
//       document.body.classList.toggle('landing-page');
//     };
//   }, []);

//   var openSheetDisplayRefresh = () => {
//     console.log(content);
//     console.log('refresh');
//     try {
//       var parsed = parse_and_evaluate(content);
//       localStorage.removeItem('parsedResult');
//       localStorage.setItem('parsedResult', parsed);
//       setDisplayState(refreshDisplayState + 1);
//     } catch (error) {}
//   };

//   var onChange = (value) => {
//     setContent(value);
//   };

//   return (
//     <>
//       <ExamplesNavbar />
//       <div className='wrapper'>
//         <div className='page-header'>
//           <img alt='...' className='path' src={require('./assets/img/blob.png').default} />
//           <img alt='...' className='path2' src={require('./assets/img/path2.png').default} />
//           <img alt='...' className='shapes triangle' src={require('./assets/img/triunghiuri.png').default} />
//           <img alt='...' className='shapes wave' src={require('./assets/img/waves.png').default} />
//           <img alt='...' className='shapes squares' src={require('./assets/img/patrat.png').default} />
//           <img alt='...' className='shapes circle' src={require('./assets/img/cercuri.png').default} />
//           <div className='content-center'>
//             <Row className='row-grid justify-content-between align-items-center text-left'>
//               <Col lg='6' md='6'>
//                 <h1 className='text-white'>
//                   We make generating sheet music <br />
//                   <span className='text-white'>easy</span>
//                 </h1>
//                 <p className='text-white mb-3'>Place Holder</p>
//                 {/* <div className='btn-wrapper mb-3'>
//                   <p className='category text-success d-inline'>From 9.99%/mo</p>
//                   <Button className='btn-link' color='success' href='#pablo' onClick={(e) => e.preventDefault()} size='sm'>
//                     <i className='tim-icons icon-minimal-right' />
//                   </Button>
//                 </div> */}
//                 <div className='btn-wrapper'>
//                   <div className='button-container'>
//                     <Button className='btn-icon btn-simple btn-round btn-neutral' color='default' href='https://github.com'>
//                       <i className='fab fa-github' />
//                     </Button>
//                   </div>
//                 </div>
//               </Col>
//               <Col lg='4' md='5'>
//                 <img alt='...' className='img-fluid' src={require('./assets/img/etherum.png').default} />
//               </Col>
//             </Row>
//           </div>
//         </div>
//         <section className='section section-lg'>
//           <img alt='...' className='path' src={require('./assets/img/path4.png').default} />
//           {/* <img alt='...' className='path2' src={require('./assets/img/path5.png').default} /> */}
//           {/* <img alt='...' className='path3' src={require('./assets/img/path2.png').default} /> */}
//           <Container>
//             <Row className='justify-content-center'>
//               <Col lg='12'>
//                 <h1 className='text-center'>Your best benefit</h1>
//                 <Row className='row-grid justify-content-center'>
//                   <Col lg='3'>
//                     <div className='info'>
//                       <div className='icon icon-primary'>
//                         <i className='tim-icons icon-money-coins' />
//                       </div>
//                       <h4 className='info-title'>Low Commission</h4>
//                       <hr className='line-primary' />
//                       <p>Divide details about your work into parts. Write a few lines about each one. A paragraph describing a feature will.</p>
//                     </div>
//                   </Col>
//                   <Col lg='3'>
//                     <div className='info'>
//                       <div className='icon icon-warning'>
//                         <i className='tim-icons icon-chart-pie-36' />
//                       </div>
//                       <h4 className='info-title'>High Incomes</h4>
//                       <hr className='line-warning' />
//                       <p>
//                         Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing feature
//                         will be a feature.
//                       </p>
//                     </div>
//                   </Col>
//                   <Col lg='3'>
//                     <div className='info'>
//                       <div className='icon icon-success'>
//                         <i className='tim-icons icon-single-02' />
//                       </div>
//                       <h4 className='info-title'>Verified People</h4>
//                       <hr className='line-success' />
//                       <p>
//                         Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing be
//                         enough.
//                       </p>
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//         <section className='section section-lg section-coins'>
//           <img alt='...' className='path' src={require('./assets/img/path3.png').default} />
//           <div style={{ margin: '5rem' }}>
//             <Row>
//               <Col md='4'>
//                 <hr className='line-info' />
//                 <h1>
//                   {/* Choose the coin  */}
//                   Start generating <span className='text-info'>music sheet</span>
//                 </h1>
//               </Col>
//             </Row>
//             <Row>
//               <Col md='12' lg='6'>
//                 <Card className='card-coin card-plain'>
//                   {/* <CardHeader>
//                     <img alt='...' className='img-center img-fluid' src={require('./assets/img/bitcoin.png').default} />
//                   </CardHeader> */}
//                   <CardBody>
//                     <Row style={{ height: '75vh', padding: '1rem' }}>
//                       <AceEditor
//                         ref={aceEditor}
//                         mode='text'
//                         theme='monokai'
//                         width='100%'
//                         height='75vh'
//                         onChange={onChange}
//                         wrapEnabled
//                         editorProps={{ $blockScrolling: true }}
//                         setOptions={{
//                           enableSnippets: false,
//                           showLineNumbers: true,
//                           tabSize: 4,
//                           showPrintMargin: false,
//                           hScrollBarAlwaysVisible: true,
//                           vScrollBarAlwaysVisible: true,
//                         }}
//                         fontSize={18}
//                       />
//                     </Row>
//                   </CardBody>
//                   <CardFooter className='text-center'>
//                     <Button className='btn-simple' color='primary' onClick={() => this.setState({})})}>
//                       Save to Cloud
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </Col>
//               <Col md='12' lg='6'>
//                 <Card className='card-coin card-plain'>
//                   {/* <CardHeader>
//                     <img alt='...' className='img-center img-fluid' src={require('./assets/img/etherum.png').default} />
//                   </CardHeader> */}
//                   <CardBody>
//                     <Row style={{ height: '75vh', padding: '1rem' }}>
//                       <div style={{ background: '#fff', width: '100%', height: '75vh', overflow: 'auto' }}>
//                         {/* <OpenSheetMusicDisplay file={'MuzioClementi_SonatinaOpus36No1_Part2.xml'} /> */}
//                         <OpenSheetDisplay key={refreshDisplayState} file={'music.xml'} />
//                       </div>
//                     </Row>
//                   </CardBody>
//                   <CardFooter className='text-center'>
//                     <Button className='btn-simple' color='success' onClick={openSheetDisplayRefresh}>
//                       Refresh
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </Col>
//             </Row>
//           </div>
//         </section>
//         <Footer />
//         <Modal modalClassName='modal-black' isOpen={saveFileModal} toggle={() => setCreateAccountModal(false)}>
//           <div className='modal-header justify-content-center'>
//             <button className='close' onClick={() => setCreateAccountModal(false)}>
//               <i className='tim-icons icon-simple-remove' />
//             </button>
//             <h4 className='title title-up'>Create account with email</h4>
//           </div>
//           <div className='modal-body'>
//             <Form role='form'>
//               <FormGroup className='mb-3'>
//                 <InputGroup
//                   className={classnames('input-group-alternative', {
//                     'input-group-focus': createAccountEmailFocus,
//                   })}>
//                   <InputGroupAddon addonType='prepend'>
//                     <InputGroupText>
//                       <i className='tim-icons icon-email-85' />
//                     </InputGroupText>
//                   </InputGroupAddon>
//                   <Input
//                     placeholder='Email'
//                     type='email'
//                     onFocus={(e) => setCreateAccountEmailFocus(true)}
//                     onBlur={(e) => setCreateAccountEmailFocus(false)}
//                     value={createAccountEmail}
//                     onChange={(e) => setCreateAccountEmail(e.target.value)}
//                   />
//                 </InputGroup>
//               </FormGroup>
//               <FormGroup className={retypeCorrect ? 'has-danger mb-3' : 'mb-3'}>
//                 <InputGroup
//                   className={classnames('input-group-alternative', {
//                     'input-group-focus': createAccountPasswordFocus,
//                   })}>
//                   <InputGroupAddon addonType='prepend'>
//                     <InputGroupText>
//                       <i className='tim-icons icon-key-25' />
//                     </InputGroupText>
//                   </InputGroupAddon>
//                   <Input
//                     placeholder='Password'
//                     type='password'
//                     onFocus={(e) => {
//                       setCreateAccountPasswordFocus(true);
//                       setRetypeCorrect(false);
//                     }}
//                     onBlur={(e) => setCreateAccountPasswordFocus(false)}
//                     value={createAccountPassword}
//                     onChange={(e) => setCreateAccountPassword(e.target.value)}
//                   />
//                 </InputGroup>
//               </FormGroup>
//               <FormGroup className={retypeCorrect ? 'has-danger mb-3' : 'mb-3'}>
//                 <InputGroup
//                   className={classnames('input-group-alternative', {
//                     'input-group-focus': createAccountRetypePasswordFocus,
//                   })}>
//                   <InputGroupAddon addonType='prepend'>
//                     <InputGroupText>
//                       <i className='tim-icons icon-key-25' />
//                     </InputGroupText>
//                   </InputGroupAddon>
//                   <Input
//                     placeholder='Retype Password'
//                     type='password'
//                     onFocus={(e) => {
//                       setCreateAccountRetypePasswordFocus(true);
//                       setRetypeCorrect(false);
//                     }}
//                     onBlur={(e) => setCreateAccountRetypePasswordFocus(false)}
//                     value={createAccountRetypePassword}
//                     onChange={(e) => setCreateAccountRetypePassword(e.target.value)}
//                   />
//                 </InputGroup>
//               </FormGroup>
//               <div className='text-center'>
//                 <Button className='my-4' color='primary' type='button' onClick={createAccount}>
//                   Create Account
//                 </Button>
//               </div>
//             </Form>
//           </div>
//         </Modal>
//       </div>
//     </>
//   );
// }
