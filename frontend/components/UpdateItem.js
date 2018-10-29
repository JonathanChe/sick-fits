// global installs
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

// relative path installs
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessages from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY(id: ID!) {
    item(where: { id: $id}) {
      id
      title
      description
      price
    }
  }
`

// exporting for sharing query amongst components and for testing
export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION( 
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
` 

export default class UpdateItems extends Component {
  state = {
    title: '', 
    description: '',
    image: '', 
    largeImage: '', 
    price: 0
  }

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val })
  }

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        // can't say this.state because it doesn't have id of item
        id: this.props.id, // make our own
        // spread in any of the changes that need to come along for the ride
        ...this.state,
      }
    });
  }

  render() {
    return (
      <Query 
        query={ SINGLE_ITEM_QUERY } 
        variables={{ id: this.props.id }}
      >
        {({ data, loading}) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p> No Item Found </p>
          return (
          <Mutation mutation={ UPDATE_ITEM_MUTATION } varaibles={ this.state }>

            {(updateItem, { loading, error }) => (
              <Form onSubmit={e => this.updateItem(e, updateItem)}> 
                <ErrorMessages error={error} />

                <fieldset disabled={loading} aria-busy={loading}>

                  <label htmlFor="title"> 
                  Title
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="Title" 
                    required 
                    defaultValue={data.item.title}
                    onChange={this.handleChange}
                    />
                  </label>

                  <label htmlFor="price"> 
                  Price
                  <input 
                    type="number" 
                    id="price" 
                    name="price" 
                    placeholder="Price" 
                    required 
                    defaultValue={data.item.price}
                    onChange={this.handleChange}
                    />
                  </label>

                  <label htmlFor="description"> 
                  Description
                  <textarea 
                    id="description" 
                    name="description" 
                    placeholder="Enter a Description" 
                    required 
                    defaultValue={data.item.description}
                    onChange={this.handleChange}
                    />
                  </label>

                  <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                </fieldset>
              </Form>
            )}
        </Mutation>
        )
      }}
    </Query>
    )
  }
}
