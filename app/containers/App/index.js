/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import PaymentPage from 'containers/PaymentPage/Loadable';
import ThankYouPage from 'containers/ThankYouPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s - BTD Payment" defaultTitle="BTD Payment">
        <meta
          name="description"
          content="BTD credit card payment application"
        />
      </Helmet>
      <Switch>
        <Route exact path="/" component={PaymentPage} />
        <Route exact path="/thankyou" component={ThankYouPage} />
        <Route
          path="/btd-home"
          component={() => {
            window.location.href = 'http://www.btd.com.au/';
            return null;
          }}
        />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
}
