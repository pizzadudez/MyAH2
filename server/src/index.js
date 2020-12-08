const express = require('express');
const cors = require('cors');
const path = require('path');

const auctionsController = require('./controllers/auctions');
const inventoryController = require('./controllers/inventory');
const itemsController = require('./controllers/items');

const servicesController = require('./controllers/services');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

// Serve client
app.use(express.static(path.join(__dirname, '../../client/build')));
// Data API
app.get('/api/auctions', auctionsController.get);
app.get('/api/inventory', inventoryController.get);
app.get('/api/items', itemsController.get);
// Services API
app.use('/api/services', servicesController);

const port = process.env.PORT || 1999;
app.listen(port, () => {
  console.log(`MyAH2 listening on http://localhost:${port}`);
});
