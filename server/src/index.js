const express = require('express');
const cors = require('cors');
const auctionsController = require('./controllers/auctions');
const inventoryController = require('./controllers/inventory');
const itemsController = require('./controllers/items');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

app.get('/', auctionsController.get);
app.get('/inventory', inventoryController.get);
app.get('/items', itemsController.get);

const port = process.env.PORT || 1999;
app.listen(port, () => {
  console.log(`MyAH2 listening on http://localhost:${port}`);
});
