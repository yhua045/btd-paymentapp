import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPaymentPage = state => state.paymentPage || initialState;

const makeSelectCreditCard = () =>
  createSelector(
    selectPaymentPage,
    paymentState => paymentState.creditCard,
  );
const makeSelectPayment = () =>
  createSelector(
    selectPaymentPage,
    paymentState => paymentState.payment,
  );
const makeSelectScreenState = () =>
  createSelector(
    selectPaymentPage,
    paymentState => paymentState.screenState,
  );

export {
  selectPaymentPage,
  makeSelectCreditCard,
  makeSelectPayment,
  makeSelectScreenState,
};
