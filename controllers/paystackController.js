const cors = require('cors');


const initiatePayment = async (req, res) => {
  const https = require('https')

  const params = JSON.stringify({
     "email": "customer@email.com",
     "amount": "20000"
  })

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: 'Bearer sk_test_c5720e30c019711ef0bfa5d503b2ca8efe4f20ae',
      'Content-Type': 'application/json'
    }
  }

  const reqpaystack = https.request(options, respaystack => {
     let data = ''

    respaystack.on('data', (chunk) => {
      data += chunk
    });

    respaystack.on('end', () => {
      res.send(data)
      console.log(JSON.parse(data))
    })
  }).on('error', error => {
     console.error(error)
  })

reqpaystack.write(params)
reqpaystack.end()
}

module.exports =  {initiatePayment};