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

const Card = styled.div`
  margin: 10px;
  border: 1px solid #ccc;
  text-align: center;
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
      // Call a toast method
      toast(
        `Paying ${amount} ${currency} to ${this.state.charities[id - 1].name}`
      );
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
      const titleStyle = {
        color: 'gray',
        padding: '10px',
        fontFamily: 'Arial',
      };

      const centerTitle = {
        textAlign: 'center',
      };

      const imageStyle = {
        maxWidth: '50%',
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
            <Card key={i}>
              <img src={imageImports[i]} alt="" style={imageStyle} />
              <p>{item.name}</p>
              {payments}
              <button
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
              </button>
            </Card>
          </div>
        );
      });

      const style = {
        color: 'red',
        margin: '1em 0',
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
      };

      const donate = this.props.donate;
      const message = this.props.message;

      return (
        <div>
          <div style={centerTitle}>
            <h1 style={titleStyle}>Omise Tamboon React</h1>
          </div>

          <ToastContainer hideProgressBar={true} limit={3} />
          <p>All donations: {donate}</p>
          <p style={style}>{message}</p>
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
  // console.log(id, amount, currency);
  this.notify(id, amount, currency);
}
