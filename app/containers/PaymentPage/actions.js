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

export function togglePaymentAmountForm() {
  return {
    type: TOGGLE_PAYMENT_FORM,
  };
}

export function savePaymentAmount(amount) {
  return {
    type: SAVE_PAYMENT_AMOUNT,
    amount,
  };
}

export function submitPayment() {
  return {
    type: SUBMIT_PAYMENT,
  };
}

export function changeCreditCardDetail(propertyName, value) {
  return {
    type: UPDATE_CREDIT_CARD_DETAIL,
    propertyName,
    value,
  };
}

export function changePaymentAmount(propertyName, value) {
  return {
    type: UPDATE_PAYMENT_AMONNT,
    propertyName,
    value,
  };
}

export function bankApiError(error) {
  return {
    type: BANK_PAYMENT_GATEWAY_ERROR,
    error,
  };
}

export function paymentSuccess() {
  return {
    type: PAYMENT_SUCCESS,
  };
}

export function updateFormValidationState(isValid) {
  return {
    type: UPDATE_FORM_VALIDATION_STATE,
    isValid,
  };
}
