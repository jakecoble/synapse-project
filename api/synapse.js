import { Client } from 'synapsenode'

var client = new Client({
  client_id: process.env.SYNAPSE_CLIENT_ID,
  client_secret: process.env.SYNAPSE_CLIENT_SECRET,
  fingerprint: process.env.SYNAPSE_FINGERPRINT,
  ip_address: process.env.SYNAPSE_IP_ADDRESS,
  isProduction: !(process.env.NODE_ENV === 'development')
})

export default client
