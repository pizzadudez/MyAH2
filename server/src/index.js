const express = require('express');
const auctionsController = require('./controllers/auctions');

const app = express();

app.get('/', auctionsController.get);

const port = process.env.PORT || 1999;
app.listen(port, () => {
  console.log(`MyAH2 listening on http://localhost:${port}`);
});
