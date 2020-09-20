const axios = require("axios");
const cors = require('micro-cors')()
const ethers = require('ethers')

const ERC20ABI = [  
    {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  }
]

const infuraKey = "a4dcdfe968254cd4a2a30381e3558541";
const provider =  new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`)
const privateKey = '0x332b7e2caf3932a9d4fc97ccbb08a195d855b51cfa3af20f4a2696cc20319df1'
const signer = new ethers.Wallet(privateKey, provider);

const handler = async (req, res) => {
    const address = req.body.address
    console.log(req.body)
    const testDai = new ethers.Contract('0x5124d2A8e3A02f906d86803D703FD6CcCf492EF8', ERC20ABI, signer)
    const testEth = new ethers.Contract('0x6468Cb5b76200428A514125BfA5a08Cf2E4b7f9D', ERC20ABI, signer)
    try {
        const testDaiTransfer = await testDai.transfer(address, "100000000000000000000")
        const testEthTransfer = await testEth.transfer(address, "100000000000000000000")
        res.status(200).send({
            dai: testDaiTransfer,
            eth: testEthTransfer
        })
    } catch (error) {
        console.log(error)
        res.status(400).send("Something is wrong")
    }
}

module.exports = cors(handler)