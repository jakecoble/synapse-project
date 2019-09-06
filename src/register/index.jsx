import React from 'react'
import axios from 'axios'

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

  submit (e) {
    e.preventDefault()

    const data = new FormData()

    Object.keys(this.state).forEach(key => {
      if (key === 'dateOfBirth') {
        const dob = this.state[key]
        data.append('dob_year', dob.getFullYear())
        data.append('dob_month', dob.getMonth() + 1)
        data.append('dob_day', dob.getDate())
      } else {
        data.append(key, this.state[key])
      }
    })

    data.delete('dateOfBirth')

    axios.post('/api/users', data)
      .then(console.log)
      .catch(console.log)
  }

  change (e) {
    const target = event.target
    const value = target.value

    this.setState({
      [target.name]: value
    })
  }

  dobChange (date) {
    this.setState({
      dateOfBirth: date
    })
  }

  fileChange (e) {
    this.setState({
      photo_id: e.target.files[0]
    })
  }

  render () {
    const change = this.change.bind(this)
    const dobChange = this.dobChange.bind(this)
    const fileChange = this.fileChange.bind(this)
    const submit = this.submit.bind(this)

    var {
      first_name,
      last_name,
      email,
      password,
      password_confirm,
      phone_number,
      dateOfBirth,
      address_street,
      address_city,
      address_subdivision,
      address_postal_code,
      address_country_code,
      ssn,
      photo_id
    } = this.state

    return (
      <form action="/users" encType="multipart/form-data" onSubmit={submit}>
        <input className={styles.textInput} name="first_name" type="text" value={first_name} onChange={change} placeholder="First Name"/>
        <input name="last_name" type="text" value={last_name} onChange={change} placeholder="Last Name"/>

        <input name="email" type="text" value={email} onChange={change} placeholder="Email"/>

        <input name="password" type="password" value={password} onChange={change} placeholder="Password"/>
        {/* <input name="password_confirm" type="password" value={passwordConfirm} onChange={change} placeholder="Confirm password"/> */}

        <input name="phone_number" type="text" value={phone_number} onChange={change} placeholder="000-000-0000"/>

        <DatePicker name="dateOfBirth"
                    value={dateOfBirth}
                    onChange={dobChange} />

        <input name="address_street" type="text" value={address_street} onChange={change} />
        <input name="address_city" type="text" value={address_city} onChange={change} />
        <input name="address_subdivision" type="text" value={address_subdivision} onChange={change} />
        <input name="address_postal_code" type="text" value={address_postal_code} onChange={change} />
        <input name="address_country_code" type="text" value={address_country_code} onChange={change} />

        <input name="ssn" type="text" value={ssn} onChange={change} />

        <input name="photo_id" type="file" onChange={fileChange} />

        <button>Register</button>
      </form>
    )
  }
}

export default Register
