import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { summaryDonations } from './helpers';
// Image imports
import BaanKruNoi from '../public/images/baan-kru-noi.jpg';
import HFHT from '../public/images/habitat-for-humanity-thailand.jpg';
import MakhampomTheater from '../public/images/makhampom-theater.jpg';
import PaperRanger from '../public/images/paper-ranger.jpg';
import AssociationOfBlind from '../public/images/thailand-association-of-the-blind.jpg';
// React Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
// CSS
import './style.css';

const Card = styled.div`
  margin: 10px;
  border: 1px solid #ccc;
  text-align: center;
`;

const CardBottom = styled.span`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? 'royalblue' : 'white')};
  color: ${(props) => (props.primary ? 'white' : 'royalblue')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid royalblue;
  border-radius: 3px;
`;

const imageImports = [
  BaanKruNoi,
  HFHT,
  MakhampomTheater,
  PaperRanger,
  AssociationOfBlind,
];

export default connect((state) => state)(
  class App extends Component {
    state = {
      charities: [],
      selectedAmount: 10,
    };

    // Helper functions
    notify = (id, amount, currency) => {
      const self = this;
      var message = `Paying ${amount} ${currency} to ${
        this.state.charities[id - 1].name
      }`;
      self.props.dispatch({
        type: 'UPDATE_MESSAGE',
        message: message,
      });
      // Call a toast method
      toast(message);
    };

    componentDidMount() {
      const self = this;
      fetch('http://localhost:3001/charities')
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          self.setState({ charities: data });
        });

      fetch('http://localhost:3001/payments')
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          self.props.dispatch({
            type: 'UPDATE_TOTAL_DONATE',
            amount: summaryDonations(data.map((item) => item.amount)),
          });
        });
    }

    render() {
      const grayTextStyle = {
        color: 'gray',
        padding: '10px',
        fontFamily: 'Arial',
      };

      const centerTitle = {
        textAlign: 'center',
      };

      const imageStyle = {
        minWidth: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      };

      const self = this;
      const cards = this.state.charities.map(function (item, i) {
        const payments = [10, 20, 50, 100, 500].map((amount, j) => (
          <label key={j}>
            <input
              type="radio"
              name="payment"
              onClick={function () {
                self.setState({ selectedAmount: amount });
              }}
            />
            {amount}
          </label>
        ));

        return (
          <div>
            <Card className="image" key={i}>
              <img src={imageImports[i]} alt="" style={imageStyle} />
              <div className="overlay">
                {/* Content to place in the overlay goes here */}
                {/* TODO: Utilize state to set the display of the overlay instead of using hover */}
                <p style={grayTextStyle}>
                  Select the amount to donate ({item.currency})
                </p>
                {payments}
                <br />
                <StyledButton
                  onClick={() =>
                    handlePay.call(
                      self,
                      item.id,
                      self.state.selectedAmount,
                      item.currency
                    )
                  }
                >
                  Pay
                </StyledButton>
              </div>
              <CardBottom>
                <p style={grayTextStyle}>{item.name}</p>
                <StyledButton>Donate</StyledButton>
              </CardBottom>
            </Card>
          </div>
        );
      });

      const donate = this.props.donate;
      const message = this.props.message;

      return (
        <div>
          <div style={centerTitle}>
            <h1 style={grayTextStyle}>Omise Tamboon React</h1>
          </div>

          <ToastContainer
            autoClose={3000}
            position="bottom-right"
            hideProgressBar={true}
            limit={3}
          />
          <div style={centerTitle}>
            <p style={grayTextStyle}>All donations: {donate}</p>
          </div>
          {cards}
        </div>
      );
    }
  }
);

/**
 * Handle pay button
 * 
 * @param {*} The charities Id
 * @param {*} amount The amount was selected
 * @param {*} currency The currency
 * 
 * @example
 * fetch('http://localhost:3001/payments', {
      method: 'POST',
      body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
    })
 */
function handlePay(id, amount, currency) {
  fetch('http://localhost:3001/payments', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
  });

  // Send toast message to user
  this.notify(id, amount, currency);
}
