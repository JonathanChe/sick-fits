// npm imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

// relative path imports
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles';
import PriceTag from'./styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  render() {
    const { item } = this.props;
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt ={item.title} />} {/* checks to see if there is an item image, if evaluated second part runs */}
        <Title>
          <Link href={{
            pathname: '/item',
            query: {id: item.id}/* query (=?) that comes along with it in the url*/
          }}>
            <a>{item.title}</a>
          </Link>
        </Title>

        <PriceTag> {formatMoney(item.price)} </PriceTag>

        <p>{item.description}</p>
        <div className="buttonList">
          <Link href={{
            pathname: 'update',
            query: { id: item.id }
          }}>
            <a>Edit</a>
          </Link>
          <button>Add to Cart</button>
          <DeleteItem >Delete this Item</DeleteItem>
        </div>
        
      </ItemStyles>
    )
  }
}