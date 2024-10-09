const cryptoService = require('../services/cryptoService');

async function updateCryptoData() {
  try {
    await cryptoService.updateCryptoData();
    console.log('Crypto data update completed');
  } catch (error) {
    console.error('Error updating crypto data:', error);
  }
}

module.exports = { updateCryptoData };