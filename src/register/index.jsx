import React from 'react'
import axios from 'axios'

import { Formik, Form, FastField, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

import styles from './styles.scss'

class Register extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      phone_number: '',
      dateOfBirth: new Date(),
      address_street: '',
      address_city: '',
      address_subdivision: '',
      address_postal_code: '',
      address_country_code: '',
      ssn: '',
      photo_id: null
    }
  }

  submit (values, { setSubmitting }) {
    const data = new FormData()

    Object.keys(values).forEach(key => {
      if (key === 'dateOfBirth') {
        const dob = values[key]
        data.append('dob_year', dob.getFullYear())
        data.append('dob_month', dob.getMonth() + 1)
        data.append('dob_day', dob.getDate())
      } else {
        data.append(key, values[key])
      }
    })

    data.delete('dateOfBirth')

    axios.post('/api/users', data)
      .then(console.log)
      .catch(console.log)
      .finally(() => {
        setSubmitting(false)
      })
  }

  render () {
    return (
      <div className={styles.registration}>
        <Formik
          initialValues={this.state}
          validationSchema={yup.object().shape({
            first_name: yup.string(),
            last_name: yup.string(),
            email: yup.string().email(),
            password: yup.string(),
            password_confirm: yup.string()
                                 .oneOf([yup.ref('password'), null]),
            phone_number: yup.string(),
            dateOfBirth: yup.date().max(new Date()),
            address_street: yup.string(),
            address_city: yup.string(),
            address_subdivision: yup.string(),
            address_postal_code: yup.number(),
            address_country_code: yup.string(),
            ssn: yup.string()
          }).required()}
          onSubmit={this.submit.bind(this)}>
          {({
            isSubmitting,
            isValid,
            setFieldValue
          }) => (
            <Form disabled={isSubmitting}>
              <div className={styles.nameInputs}>
                <FastField
                  className={styles.textInput}
                  type="text"
                  name="first_name"
                  placeholder="First Name"/>
                <ErrorMessage name="first_name" component="div"/>

                <FastField
                  className={styles.textInput}
                  type="text"
                  name="last_name"
                  placeholder="Last Name"/>
                <ErrorMessage name="last_name" component="div"/>
              </div>

              <FastField
                className={styles.textInput}
                type="email"
                name="email"
                placeholder="Email"/>
              <ErrorMessage name="email" component="div"/>

              <Field
                className={styles.textInput}
                type="password"
                name="password"
                placeholder="Password"/>
              <ErrorMessage name="password" component="div"/>

              <Field
                className={styles.textInput}
                type="password"
                name="password_confirm"
                placeholder="Confirm Password"
              />
              <ErrorMessage name="password_confirm" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="phone_number"
                placeholder="Phone Number"/>
              <ErrorMessage name="phone_number" component="div"/>

              <label htmlFor="dateOfBirth">Date of Birth</label>
              <Field type="date" name="dateOfBirth"
                     render={({ field }) => (
                       <DatePicker
                         className={styles.textInput}
                         selected={field.value}
                         onChange={date => setFieldValue('dateOfBirth', date)}
                       />
                     )}
              />
              <ErrorMessage name="dateOfBirth" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="address_street"
                placeholder="Street"
              />
              <ErrorMessage name="address_street" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="address_city"
                placeholder="City"
              />
              <ErrorMessage name="address_city" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="address_subdivision"
                placeholder="State"
              />
              <ErrorMessage name="address_subdivision" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="address_postal_code"
                placeholder="Zip Code"
              />
              <ErrorMessage name="address_postal_code" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="address_country_code"
                placeholder="Country"
              />
              <ErrorMessage name="address_country_code" component="div"/>

              <FastField
                className={styles.textInput}
                type="text"
                name="ssn"
                placeholder="Social Security Number"
              />
              <ErrorMessage name="ssn" component="div"/>

              <label htmlFor="photo_id">Photo ID</label>
              <input
                className={styles.fileInput}
                name="photo_id"
                type="file"
                onChange={event => console.log(event.currentTarget.files[0])}
              />

              <button className={styles.submitButton} type="submit" disabled={isSubmitting || !isValid}>Register</button>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default Register
