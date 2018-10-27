// global installs
import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

// relative path installs
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessages from './ErrorMessage';

// exporting for sharing query amongst components and for testing
export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION( 
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
` 

export default class CreateItems extends Component {
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

  uploadFile = async event => {
    // pull the file out of selection
    const files = e.target.files;
    // use form data api to prep data 
    const data = new FormData();
    // append first file user selected
    data.append('file', files[0]);
    // add upload preset, need for cloudinary
    data.append('upload_preset', 'sickfits');

    // hit cloudinary api
    const res = await fetch('https://api.cloudinary.com/v1_1/jonathanche/image/upload', {
      method: 'POST', 
      body: data
    });
    // parse data that comes back
    const file = await res.json();
    // put data into state
    this.setState({
      image: file.secure_url,
      // eager is a secondary transform that happens
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} varaibles={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            // stop the form from submitting
            e.preventDefault()
            // call the mutation
            const res  = await createItem();
            // change them to the single item page 
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            })
          }}> 
            <ErrorMessages error={error} />

            <fieldset disabled={loading} aria-busy={loading}>

            <label htmlFor="file"> 
              Image
              <input 
                type="file" 
                id="file" 
                name="file" 
                placeholder="Upload an image" 
                required 
                value={this.state.image}
                onChange={this.uploadFile}
                />
              </label>

              <label htmlFor="title"> 
              Title
              <input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="Title" 
                required 
                value={this.state.title}
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
                value={this.state.price}
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
                value={this.state.description}
                onChange={this.handleChange}
                />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
    </Mutation>
    )
  }
}
