// npm imports
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// rel path imports
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

export default class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation 
        mutation={SIGNUP_MUTATION} 
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await signup(); // await in case of error so that set state will not get trigger
              this.setState({ name: '', email: '', password: '' })
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for An Account</h2>
                <ErrorMessage error={error}/>

                <label htmlFor="email">
                  Email
                  <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState}/>
                </label>

                <label htmlFor="name">
                  Name
                  <input type="text" name="name" placeholder="name" value={this.state.name} onChange={this.saveToState}/>
                </label>

                <label htmlFor="password">
                  Password
                  <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState}/>
                </label>
                
                <button type="submit">Sign Up</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
