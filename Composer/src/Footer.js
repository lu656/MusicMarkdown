/*!

=========================================================
* BLK Design System React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import { Link } from 'react-router-dom';
// reactstrap components
import { Button, NavItem, NavLink, Nav, Container, Row, Col, UncontrolledTooltip } from 'reactstrap';

export default function Footer() {
  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col md='3'>
            <h1 className='title'>Composem</h1>
          </Col>
          <Col md='6'></Col>
          <Col md='3'>
            <h3 className='title'>Follow us:</h3>
            <div className='btn-wrapper profile'>
              <Button
                className='btn-icon btn-neutral btn-round btn-simple'
                color='default'
                href='https://www.github.com'
                id='tooltip230450801'
                target='_blank'>
                <i className='fab fa-github-square' />
              </Button>
              <UncontrolledTooltip delay={0} target='tooltip230450801'>
                Check out our repo
              </UncontrolledTooltip>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
