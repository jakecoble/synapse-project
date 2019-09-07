import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'

import { Formik, Form, FastField } from 'formik'

import { logIn, fetchAccounts } from '../actions'

class Login extends React.Component {
  submit (values) {
    axios.post('/api/sessions', values)
         .then(({ data }) => {
           this.props.logIn({
             id: data.id,
             name: data.name
           })
           this.props.fetchAccounts()
         })
         .then(() => {
           this.props.history.push('/')
         })
         .catch(error => console.log(error))
  }

  render () {
    return (
      <div>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={this.submit.bind(this)}>
          {({ isSubmitting }) => (
            <Form>
              <FastField type="email" name="email" placeholder="Email"/>

              <FastField type="password" name="password" placeholder="Password"/>

              <button type="submit">Login</button>
            </Form>
          )}
        </Formik>

        <Link to="/register">Register</Link>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logIn: user => dispatch(logIn(user)),
    fetchAccounts: () => dispatch(fetchAccounts())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Login))
