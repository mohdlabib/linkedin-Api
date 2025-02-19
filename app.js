require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const express = require('express');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 2140;

const apiUrl = `https://api.scrapin.io/enrichment/profile?apikey=${process.env.API_KEY}&linkedInUrl=${encodeURIComponent(process.env.LINKEDIN_URL)}`;

async function updateData() {
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log('Data berhasil diperbarui!');
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}

app.get('/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal membaca data' });
    }
    res.json(JSON.parse(data));
  });
});

updateData();
cron.schedule('0 0 * * *', updateData);

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
