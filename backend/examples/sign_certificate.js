const dotenv = require('dotenv');
const ethers = require('ethers');
const axios = require('axios');

dotenv.config({
    path: '../.env'
});

// Load from environment variables or configuration
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;
const API_HOST = process.env.HOST == '0.0.0.0' ? 'localhost' : process.env.HOST;
const API_PORT = process.env.PORT || 80;
const API_VERSION = `/v${process.env.VERSION.split('.')[0]}`; // Extract major version
const API_ROOT_PATH = process.env.ROOT_PATH;

const API_URL = `http://${API_HOST}:${API_PORT}${API_ROOT_PATH}${API_VERSION}`;

const BASE_PATH = '/certificates';

const wallet = new ethers.Wallet(PRIVATE_KEY);

async function findCertificate(certificateId) {
    try {
        const response = await axios.get(`${API_URL}${BASE_PATH}/${certificateId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching certificate:', error);
        throw error;
    }
}

async function signCertificate(certificateId) {
    try {
        const certificate = await findCertificate(certificateId);
        const hash = certificate.pre_issued_hash;


        const signature = await wallet.signMessage(ethers.getBytes('0x' + hash));
        console.log('Certificate signed successfully. Signature:', signature);
        const address = wallet.address;
        console.log('Signer address:', address);
    } catch (error) {
        console.error('Error signing certificate:', error);
    }
}

signCertificate('dfaeedf6-8fc0-4f75-85bc-d666973ad12f');
