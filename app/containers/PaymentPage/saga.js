import { call, put, select, takeLatest } from 'redux-saga/effects';
import { appLoading, appError } from 'containers/App/actions';
import { push } from 'react-router-redux';
import { SUBMIT_PAYMENT } from './constants';
import { submitPayment, bankApiError, paymentSuccess } from './actions';
import request from 'utils/request';
import {
  makeSelectCreditCard,
  makeSelectPayment,
  makeSelectScreenState,
} from './selectors';
import { appConfig } from 'containers/App/config';

function parseSimplifyApiResponse(paymentTokenApiResponse) {
  if (paymentTokenApiResponse.error) {
    if (paymentTokenApiResponse.error.code === 'validation') {
      return toApiPaymentResult(false,
        paymentTokenApiResponse.error.fieldErrors.map(err => err.message),
      );
    }

    return toApiPaymentResult(false,
      [`An unexpected error has occurred, please try again later. Please contact technical support if problem persists`]);
  }

  return toApiPaymentResult(true, [''], paymentTokenApiResponse.id);
}

function toApiPaymentResult(success, messages, token) {
  return {
    success,
    messages,
    token,
  };
}

export function getSimplifyApiPaymentToken(creditCard) {
  const simplifyApiPromise = new Promise((resolve, reject) => {
    SimplifyCommerce.generateToken(
      {
        key: appConfig.simplifyApiToken, //
        card: {
          number: creditCard.cardNumber,
          cvc: creditCard.securityCode,
          expMonth: creditCard.expiryMonth,
          expYear: creditCard.expiryYear,
        },
      },
      response => {
        resolve(response);
      },
    );
  });

  return simplifyApiPromise;
}

/**
 * Github repos request/response handler
 */
export function* submitPaymentToSimplifyApi() {
  yield put(appLoading(true));
  const { amount, description, reference } = yield select(makeSelectPayment());
  const creditCard = yield select(makeSelectCreditCard());
  let apiError = false;
  let paymentToken = '';

  try {
    const paymentTokenResult = yield call(
      getSimplifyApiPaymentToken,
      creditCard,
    );

    const paymentTokenResponse = parseSimplifyApiResponse(paymentTokenResult);
    if (!paymentTokenResponse.success) {
      apiError = true;
      yield put(bankApiError(paymentTokenResponse));
      yield put(appLoading(false));
    } else {
      paymentToken = paymentTokenResponse.token;
    }
  } catch (err) {
    yield put(appError(err));
    yield put(appLoading(false));
  }

  if (!apiError) {
    try {
      //API endpoint
      const requestURL = appConfig.btdApi;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: paymentToken,
          paymentAmount: amount,
          description,
          reference,
        }),
      };
      // Call our request helper (see 'utils/request')
      const paymentApiResponse = yield call(
        request,
        requestURL,
        requestOptions,
      );

      if (!paymentApiResponse.isSuccess) {
        yield put(appError(paymentApiResponse.error));
        yield put(appLoading(false));
      } else {
        yield put(paymentSuccess());
        yield put(appLoading(false));
        yield put(push('/thankyou'));
      }
    } catch (error) {
      yield put(
        appError('An unexpected error has occurred. Please try again later.'),
      );
      yield put(appLoading(false));
    }
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(SUBMIT_PAYMENT, submitPaymentToSimplifyApi);
}
