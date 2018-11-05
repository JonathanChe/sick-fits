// npm imports
import React from 'react';

// rel path imports
import CartStyles  from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';

const Cart = () => {
  return (
    <CartStyles open>
      <header>
        <CloseButton title="close">&times;</CloseButton>
        <Supreme>Your Cart</Supreme>
        <p>You have __ Items in your cart.</p>
      </header>

      <footer>
        <p>$11.11</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  )
};

export default Cart;