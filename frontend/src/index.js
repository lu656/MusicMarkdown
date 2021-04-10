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
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './assets/scss/blk-design-system-react.scss?v=1.2.0';
import './assets/demo/demo.css';
import './assets/css/nucleo-icons.css';

import Index from './views/Index.js';
import LandingPage from './views/examples/LandingPage.js';
// import RegisterPage from './views/examples/RegisterPage.js';
// import ProfilePage from './views/examples/ProfilePage.js';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/' render={(props) => <LandingPage {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
