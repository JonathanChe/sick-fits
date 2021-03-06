import React, { Component } from 'react'
import { Query } from 'react-apollo'; // allows us to query data directly into this component
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item'
import Pagination from './Pagination';

// name your queries
// exporting for sharing query amongst components and for testing
export const ALL_ITEMS_QUERY = gql` 
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* puts them side by side, grid-auto keeps them centered */
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

export default class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page}></Pagination>
        <p> Items </p>
        <Query query={ALL_ITEMS_QUERY}>
          {/* only child of a query component must be a function */}
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error: {error.message}</p>
            return (
            <ItemsList>
              {data.items.map(item => <Item item={item} key={item.id}/>)}
            </ItemsList>
            );
          }}
        </Query>
        <Pagination></Pagination>
      </Center>
    )
  }
}
