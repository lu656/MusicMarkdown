import React, { useRef, useState, Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, ListGroupItem, ListGroup, Container, Row, Col } from 'reactstrap';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import CustomRule from './Syntax';
import OpenSheetDisplay from './OpenSheetDisplay';
import ExamplesNavbar from './ExamplesNavbar.js';
import Footer from './Footer.js';

import { parse_and_evaluate } from './parser';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    console.log('Page Rerendered');
    localStorage.removeItem('parsedResult');
    this.state = { sheetContent: '', editorContent: '' };
  }

  shouldComponentUpdate() {
    return false;
  }

  editorOnChange(e) {
    this.setState({ editorContent: e });
    console.log(this.state.editorContent);
  }

  refreshSheet() {
    console.log('Refreshing music sheet');
    try {
      var parsed = parse_and_evaluate(this.state.editorContent);
      if (!parsed.startsWith('<?xml')) return;
      // this.setState({ sheetContent: '' }, () => {
      this.setState({ sheetContent: parsed }, () => {
        console.log('updating page');
        this.forceUpdate();
      });
      // });
    } catch (error) {}
  }

  render() {
    const { editorContent, sheetContent } = this.state;
    return (
      <>
        <ExamplesNavbar />
        <div className='wrapper'>
          <div className='page-header'>
            <img alt='...' className='path' src={require('./assets/img/blob.png').default} />
            <img alt='...' className='path2' src={require('./assets/img/path2.png').default} />
            <img alt='...' className='shapes triangle' src={require('./assets/img/triunghiuri.png').default} />
            <img alt='...' className='shapes wave' src={require('./assets/img/waves.png').default} />
            <img alt='...' className='shapes squares' src={require('./assets/img/patrat.png').default} />
            <img alt='...' className='shapes circle' src={require('./assets/img/cercuri.png').default} />
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
                  <img alt='...' className='img-fluid' src={require('./assets/img/etherum.png').default} />
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
                      <Button className='btn-simple' color='primary'>
                        Save to Cloud
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
                          <OpenSheetDisplay content={sheetContent} />
                        </div>
                      </Row>
                    </CardBody>
                    <CardFooter className='text-center'>
                      <Button className='btn-simple' color='success' onClick={() => this.refreshSheet()}>
                        Refresh
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </div>
          </section>
          <Footer />
        </div>
      </>
    );
  }
}

export default LandingPage;

function LandingPageDeprecated() {
  const aceEditor = useRef();
  const [refreshDisplayState, setDisplayState] = useState(0);
  const [content, setContent] = useState('');
  React.useEffect(() => {
    console.log('useEffect called');
    localStorage.removeItem('parsedResult');
    document.body.classList.toggle('landing-page');
    const customRule = new CustomRule();
    const editor = aceEditor.current;
    editor.editor.getSession().setMode(customRule);
    editor.editor.setAutoScrollEditorIntoView(true);
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle('landing-page');
    };
  }, []);

  var openSheetDisplayRefresh = () => {
    console.log(content);
    console.log('refresh');
    try {
      var parsed = parse_and_evaluate(content);
      localStorage.removeItem('parsedResult');
      localStorage.setItem('parsedResult', parsed);
      setDisplayState(refreshDisplayState + 1);
    } catch (error) {}
  };

  var onChange = (value) => {
    setContent(value);
  };

  return (
    <>
      <ExamplesNavbar />
      <div className='wrapper'>
        <div className='page-header'>
          <img alt='...' className='path' src={require('./assets/img/blob.png').default} />
          <img alt='...' className='path2' src={require('./assets/img/path2.png').default} />
          <img alt='...' className='shapes triangle' src={require('./assets/img/triunghiuri.png').default} />
          <img alt='...' className='shapes wave' src={require('./assets/img/waves.png').default} />
          <img alt='...' className='shapes squares' src={require('./assets/img/patrat.png').default} />
          <img alt='...' className='shapes circle' src={require('./assets/img/cercuri.png').default} />
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
                <img alt='...' className='img-fluid' src={require('./assets/img/etherum.png').default} />
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
                        Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing feature
                        will be a feature.
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
                        ref={aceEditor}
                        mode='text'
                        theme='monokai'
                        width='100%'
                        height='75vh'
                        onChange={onChange}
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
                    <Button className='btn-simple' color='primary'>
                      Save to Cloud
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
                        <OpenSheetDisplay key={refreshDisplayState} file={'music.xml'} />
                      </div>
                    </Row>
                  </CardBody>
                  <CardFooter className='text-center'>
                    <Button className='btn-simple' color='success' onClick={openSheetDisplayRefresh}>
                      Refresh
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
