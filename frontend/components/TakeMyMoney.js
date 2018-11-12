// npm imports
import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

// rel path imports
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => {
    return tally + cartItem.quantity;
  }, 0);
}

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends React.Component {
  onToken = (res, createOrder) => {
    // manually call the mutation once we have the stripe token
    createOrder({
      variables: {
        token: res.id,
      }
    }).catch(err => alert(err.message));
  }
  
  render() {
    return (
      <User>
        {({ data: { me }}) => (
          <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query: CREATE_ORDER_MUTATION}]}>
            {(createOrder) => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)}`}
                image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                stripeKey="pk_test_BuczA4cyPzL4sQE2QXEiFqtg"
                current="USD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
          )}
        </Mutation>
        )}
      </User>
    )
  }
}

export default TakeMyMoney;