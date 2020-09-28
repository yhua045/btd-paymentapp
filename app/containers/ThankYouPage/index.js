import React, { useEffect, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import H1 from 'components/H1';
import 'font-awesome/css/font-awesome.min.css';
import { Link, withRouter } from 'react-router-dom';

export function ThankYou({ history }) {
  useEffect(() => {
    delayRedirectToHome();
  }, []);

  const delayRedirectToHome = () => {
    setTimeout(() => {
      history.push('/btd-home');
    }, 15000);
  };

  return (
    <article>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <i
              style={{ color: '#1e78d9', fontSize: '16rem' }}
              className="fa fa-check-circle fa-10x"
            />
            <H1 style={{ color: '#1e78d9' }}>THANK YOU</H1>
            <p>Your payment has been received.</p>
            <br />
            <p>
              You will be redirected back to <Link to="/btd-home">BTD</Link>
              &nbsp;site in 30 seconds, or alternatively, you can&nbsp;
              <Link to="/btd-home">here</Link>&nbsp;to return.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default withRouter(ThankYou);
