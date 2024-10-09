const axios = require('axios');
const Cryptocurrency = require('../models/Cryptocurrency');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINS = ['bitcoin', 'matic-network', 'ethereum'];

class CryptoService {
  async fetchCoinData(coinId) {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/${coinId}`);
      const { market_data } = response.data;
      return {
        price: market_data.current_price.usd,
        marketCap: market_data.market_cap.usd,
        change24h: market_data.price_change_percentage_24h
      };
    } catch (error) {
      console.error(`Error fetching data for ${coinId}:`, error);
      throw error;
    }
  }

  async updateCryptoData() {
    for (const coinId of COINS) {
      try {
        const data = await this.fetchCoinData(coinId);
        await Cryptocurrency.create({
          coinId,
          ...data
        });
        console.log(`Updated data for ${coinId}`);
      } catch (error) {
        console.error(`Failed to update data for ${coinId}:`, error);
      }
    }
  }

  async getLatestStats(coinId) {
    const latestData = await Cryptocurrency.findOne({ coinId }).sort({ timestamp: -1 });
    if (!latestData) {
      throw new Error('No data found for the specified coin');
    }
    return {
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h
    };
  }

  async calculateDeviation(coinId) {
    const data = await Cryptocurrency.find({ coinId }).sort({ timestamp: -1 }).limit(100);
    if (data.length === 0) {
      throw new Error('No data found for the specified coin');
    }

    const prices = data.map(item => item.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const squaredDifferences = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / prices.length;
    const standardDeviation = Math.sqrt(variance);

    return parseFloat(standardDeviation.toFixed(2));
  }
}

module.exports = new CryptoService();