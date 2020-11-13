// const cors = require('micro-cors')()
const ethers = require('ethers')
const axios = require('axios')


const allowCors = fn => async (req, res) => {
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
	res.setHeader(
	  'Access-Control-Allow-Headers',
	  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	)
	if (req.method === 'OPTIONS') {
	  res.status(200).end()
	  return
	}
	return await fn(req, res)
  }

const config = {
	privateKey: '0xe5d49951d72b64ecf999d198333539a6b7af0717d0ada784d0badf3ff3c27f94',
	infuraKey: 'a4dcdfe968254cd4a2a30381e3558541',
	ethFaucetAddress: '0x4E6521F2653fEDb02Bc33e1cBB34BD41A953D0Bf'
}

const infuraKey = config.infuraKey;
const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`)
const privateKey = config.privateKey
const signer = new ethers.Wallet(privateKey, provider);

const handler = async (req, res) => {
	const address = req.body.address

	try {
		const etherScanApiUrl = 'https://api-kovan.etherscan.io/api'
		const params = {
			module: 'account',
			action: 'txlist',
			address,
			startblock: '0',
			endblock: '99999999',
			sort: 'desc',
			apikey: 'HUWMR5VJHDQ7EEZYEUWQAAHBNMURE1R1CH',
		}
		const result = await axios.get(etherScanApiUrl, {
			params
		})

		let i;

		console.log(result.data.result.length)


		if (result.data.result.length === 0) {
			const transaction = await signer.sendTransaction({
				to: address,
				value: ethers.utils.parseEther("0.05")
			});
			res.status(200).send(transaction)
		} else {
			for (i = 0; i < result.data.result.length; i++) {
				console.log(result.data.result[i].from)
				if (result.data.result[i].from.toLowerCase() === config.ethFaucetAddress.toLowerCase()) {
					const currentTimeStamp = Math.round(+new Date() / 1000)
					if (currentTimeStamp >= parseInt(result.data.result[i].timeStamp) + 86400) {
						const transaction = await signer.sendTransaction({
							to: address,
							value: ethers.utils.parseEther("0.05")
						});
						res.status(200).send(transaction)
					} else {
						res.status(400).send('Not allowed')
					}
					break;
				} else {
					const transaction = await signer.sendTransaction({
						to: address,
						value: ethers.utils.parseEther("0.05")
					});
					res.status(200).send(transaction)
					break;
				}
			}
		}

	} catch (error) {
		console.log(error)
		res.status(400).send("Something is not right")
	}
}

module.exports = allowCors(handler)