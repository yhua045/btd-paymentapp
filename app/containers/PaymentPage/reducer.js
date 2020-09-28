import produce from 'immer';
import {
  TOGGLE_PAYMENT_FORM,
  SAVE_PAYMENT_AMOUNT,
  SUBMIT_PAYMENT,
  UPDATE_CREDIT_CARD_DETAIL,
  UPDATE_PAYMENT_AMONNT,
  BANK_PAYMENT_GATEWAY_ERROR,
  PAYMENT_SUCCESS,
  UPDATE_FORM_VALIDATION_STATE,
} from './constants';

export const initialState = {
  creditCard: {
    nameOnCard: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    securityCode: '',
  },
  payment: {
    amount: 0,
    reference: '',
    description: '',
  },
  screenState: {
    editPaymentAmount: false,
    confirmPayment: false,
    bankApiError: {},
    formValidationState: true,
  },
};

/* eslint-disable default-case, no-param-reassign */
const paymentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case TOGGLE_PAYMENT_FORM:
        // Delete prefixed '@' from the github username
        draft.editPaymentAmount = !state.editPaymentAmount;
        break;
      case SAVE_PAYMENT_AMOUNT:
        // Delete prefixed '@' from the github username
        draft.editPaymentAmount = false;
        draft.payment.amount = action.paymentAmount;
        break;
      case SUBMIT_PAYMENT:
        // Delete prefixed '@' from the github username
        draft.screenState.bankApiError = {};
        break;
      case UPDATE_PAYMENT_AMONNT:
        // Delete prefixed '@' from the github username
        draft.payment[action.propertyName] = action.value;
        break;
      case UPDATE_CREDIT_CARD_DETAIL:
        if (action.propertyName === 'cardNumber') {
          action.value = action.value.replace(/\s/g, '');
        }
        draft.creditCard[action.propertyName] = action.value;
        break;
      case BANK_PAYMENT_GATEWAY_ERROR:
        draft.screenState.bankApiError = action.error;
        break;
      case PAYMENT_SUCCESS:
        //reset the form state
        draft = initialState;
        break;
      case UPDATE_FORM_VALIDATION_STATE:
        draft.screenState.formValidationState = action.isValid;
        break;
    }
  });

export default paymentReducer;
