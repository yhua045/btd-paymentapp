import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import 'font-awesome/css/font-awesome.min.css';
import amex from 'payment-icons/min/flat/amex.svg';
import visa from 'payment-icons/min/flat/visa.svg';
import maestro from 'payment-icons/min/flat/maestro.svg';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import unionpay from 'payment-icons/min/flat/unionpay.svg';
import jcb from 'payment-icons/min/flat/jcb.svg';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectCreditCard,
  makeSelectScreenState,
  makeSelectPayment,
} from './selectors';
import {
  togglePaymentAmountForm,
  savePaymentAmount,
  submitPayment,
  changeCreditCardDetail,
  changePaymentAmount,
  updateFormValidationState,
} from './actions';

const key = 'paymentPage';

export function PaymentPage({
  loading,
  error,
  creditCard,
  payment,
  screenState,
  onSubmitPayment,
  onSavePaymentAmount,
  onChangeCreditCardDetail,
  onTogglePaymentAmountForm,
  onChangePaymentAmount,
  onFormValidationStateChanged,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    initialiseTooltip();
  }, []);

  const initialiseTooltip = () => {
    $(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  };

  const expiryYearOptions = () => {
    let currentYear = parseInt(moment().format('YY'), 10);
    const nextTenYears = [];
    for (let i = 0; i < 10; i++) {
      currentYear++;
      nextTenYears.push({
        value: currentYear,
        key: `year-${currentYear.toString()}`,
      });
    }
    return nextTenYears;
  };

  const expiryMonthOptions = () => {
    const monthsInYear = [];
    for (let i = 1; i < 13; i++) {
      monthsInYear.push({
        value: i.toString().padStart(2, '0'),
        key: `month-${i.toString()}`,
      });
    }
    return monthsInYear;
  };

  const onFocus = evt => {
    $(evt.target.id)
      .parents('.form-group')
      .addClass('focused');
  };

  const onBlur = evt => {
    const inputValue = evt.target.value;
    const element = $(evt.target.id);
    if (!inputValue) {
      element.removeClass('filled');
      element.parents('.form-group').removeClass('focused');
    } else {
      element.addClass('filled');
    }
  };

  const isEmpty = field => !field;
  const isGreaterThanZero = number => parseFloat(number) > 0;
  const validateForm = () => {
    if (
      isEmpty(payment.amount) ||
      isEmpty(payment.reference) ||
      isEmpty(payment.description) ||
      isEmpty(creditCard.nameOnCard) ||
      isEmpty(creditCard.cardNumber) ||
      isEmpty(creditCard.expiryMonth) ||
      isEmpty(creditCard.expiryYear) ||
      !isGreaterThanZero(payment.amount)
    ) {
      return false;
    }

    return true;
  };

  const handleFormSubmission = evt => {
    if (validateForm() === false) {
      onFormValidationStateChanged(false);
      return;
    }
    onFormValidationStateChanged(true);
    onSubmitPayment(evt);
  };

  const fieldErrors = [];
  if (screenState.bankApiError.messages) {
    screenState.bankApiError.messages.forEach(err => fieldErrors.push(err));
  }

  if (error) {
    fieldErrors.push(error);
  }
  let fieldErrorId = 0;
  const isError = error || (screenState.bankApiError && fieldErrors.length > 0);
  const formValidationCssClass = !screenState.formValidationState
    ? 'needs-validation was-validated'
    : 'needs-validation';

  return (
    <div className={formValidationCssClass}>
      <div className="row">
        <div className="col-12">&nbsp;</div>
      </div>
      <div className="row">
        <div className="col-12">
          <h5>
            <Link to="/btd-home">
              <i className="fa fa-arrow-circle-left" />
              &nbsp;Back to home
            </Link>
          </h5>
        </div>
      </div>
      <div className="row">
        <div className="col-12">&nbsp;</div>
      </div>
      <div className="row">
        <div className="col-2 text-center">
          <img src={amex} className="img-thumbnail" alt="mastercard" />
        </div>
        <div className="col-2 text-center">
          <img src={mastercard} className="img-thumbnail" alt="mastercard" />
        </div>
        <div className="col-2 text-center">
          <img src={maestro} className="img-thumbnail" alt="maestro" />
        </div>
        <div className="col-2 text-center">
          <img src={visa} className="img-thumbnail" alt="visa" />
        </div>
        <div className="col-2 text-center">
          <img src={unionpay} className="img-thumbnail" alt="unionpay" />
        </div>
        <div className="col-2 text-center">
          <img src={jcb} className="img-thumbnail" alt="jcb" />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="reference">Reference</label>
        <input
          value={payment.reference}
          onChange={onChangePaymentAmount}
          type="text"
          id="reference"
          name="reference"
          className="form-control"
          required
          maxLength="30"
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Reference"
        />
        {isEmpty(payment.reference) && (
          <div className="invalid-feedback">
            Reference cannot be empty and maximum number of characters cannot
            exceed 50 characters
          </div>
        )}
        <small id="paymentReferenceHelp" className="form-text text-muted">
          Reference that appear on the bank statement
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          value={payment.description}
          onChange={onChangePaymentAmount}
          type="text"
          id="description"
          name="description"
          className="form-control"
          required
          maxLength="40"
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Description"
        />
        {isEmpty(payment.description) && (
          <div className="invalid-feedback">
            Reference cannot be empty maximum number of characters cannot exceed
            `00` characters
          </div>
        )}
        <small id="paymentDescHelp" className="form-text text-muted">
          Description that appears on the bank statement
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          value={payment.amount}
          onChange={onChangePaymentAmount}
          type="number"
          id="amount"
          name="amount"
          className="form-control"
          required
          min="1"
          step="0.01"
          placeholder="$0.00"
        />
        {!isGreaterThanZero(payment.amount) && (
          <div className="invalid-feedback">
            Payment amount needs to be greater than $0
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="nameOnCard">Name on Card</label>
        <input
          id="nameOnCard"
          name="nameOnCard"
          type="text"
          className="form-control"
          value={creditCard.nameOnCard}
          onChange={onChangeCreditCardDetail}
          placeholder="Name on Card"
          required
        />
        {isEmpty(creditCard.nameOnCard) && (
          <div className="invalid-feedback">Reference cannot be empty</div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>&nbsp;
        <span
          className="badge badge-secondary"
          data-toggle="tooltip"
          title="The digits appear on the front of the card"
        >
          &#63;
        </span>
        <div className="input-group">
          <input
            id="cardNumber"
            name="cardNumber"
            type="number"
            className="form-control"
            value={creditCard.cardNumber}
            onChange={onChangeCreditCardDetail}
            maxLength="19"
            placeholder="Card Number"
            required
          />
          {isEmpty(creditCard.cardNumber) && (
            <div className="invalid-feedback">Reference cannot be empty</div>
          )}
        </div>
        <small id="cardNumberHelp" className="form-text text-muted">
          Enter digits without spaces
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="expiryMonth">Expiry Date</label>
        <div className="row">
          <div className="col-5">
            <select
              value={creditCard.expiryMonth}
              onChange={onChangeCreditCardDetail}
              className="form-control"
              name="expiryMonth"
              id="expiryMonth"
              required
            >
              <option value="">Month</option>
              {expiryMonthOptions().map(({ id, value }) => (
                <option key={id} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {isEmpty(creditCard.expiryMonth) && (
              <div className="invalid-feedback">Please select a month</div>
            )}
          </div>
          <div className="col-2 text-center">/</div>
          <div className="col-5">
            <select
              value={creditCard.expiryYear}
              onChange={onChangeCreditCardDetail}
              className="form-control"
              name="expiryYear"
              id="expiryYear"
              required
            >
              <option value="">Year</option>
              {expiryYearOptions().map(({ id, value }) => (
                <option key={id} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {isEmpty(creditCard.expiryYear) && (
              <div className="invalid-feedback">Please select an year</div>
            )}
          </div>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="securityCode">Security Code</label>&nbsp;
        <span
          className="badge badge-secondary"
          data-toggle="tooltip"
          title="The 3 CVV digits appear on the back of the card"
        >
          &#63;
        </span>
        <div className="input-group">
          <input
            id="securityCode"
            name="securityCode"
            type="text"
            className="form-control"
            value={creditCard.securityCode}
            onChange={onChangeCreditCardDetail}
            maxLength="4"
            placeholder="Security Code"
            required
          />
          <div className="input-group-append">
            {isEmpty(creditCard.securityCode) && (
              <div className="invalid-feedback">Reference cannot be empty</div>
            )}
          </div>
        </div>
        <small id="cardNumberHelp" className="form-text text-muted">
          Last three digits on the card back
        </small>
      </div>
      {isError && (
        <div className="alert alert-danger">
          <h6>Something is wrong</h6>
          <hr />
          {fieldErrors.map(fieldError => (
            <div key={fieldErrorId++}>{fieldError}</div>
          ))}
        </div>
      )}
      <div>
        <button
          type="submit"
          className="btn btn-block btn-success"
          id="submitPayment"
          onClick={handleFormSubmission}
          disabled={loading}
        >
          <i className="fa fa-lock" />
          &nbsp;Pay&nbsp;
          {payment.amount > 0 && <span>&#36;{payment.amount}</span>}
          {loading && (
            <span
              className="spinner-border spinner-border-sm ml-3"
              role="status"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      <div className="row">
        <div className="col-12">&nbsp;</div>
      </div>
    </div>
  );
}

PaymentPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  creditCard: PropTypes.object,
  screenState: PropTypes.object,
  payment: PropTypes.object,
  onSubmitPayment: PropTypes.func,
  onSavePaymentAmount: PropTypes.func,
  onChangeCreditCardDetail: PropTypes.func,
  onTogglePaymentAmountForm: PropTypes.func,
  onChangePaymentAmount: PropTypes.func,
  onFormValidationStateChanged: PropTypes.func,
};

const mapStateToProp = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  creditCard: makeSelectCreditCard(),
  payment: makeSelectPayment(),
  screenState: makeSelectScreenState(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onTogglePaymentAmountForm: evt =>
      dispatch(togglePaymentAmountForm(evt.target.value)),
    onSubmitPayment: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(submitPayment());
    },
    onSavePaymentAmount: evt => dispatch(savePaymentAmount(evt.target.value)),
    onChangeCreditCardDetail: evt =>
      dispatch(changeCreditCardDetail(evt.target.name, evt.target.value)),
    onChangePaymentAmount: evt =>
      dispatch(changePaymentAmount(evt.target.name, evt.target.value)),
    onFormValidationStateChanged: isValid =>
      dispatch(updateFormValidationState(isValid)),
  };
}

const withConnect = connect(
  mapStateToProp,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PaymentPage);
