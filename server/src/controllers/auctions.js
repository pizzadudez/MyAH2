const db = require('../db');
const fs = require('fs');
const path = require('path');

const inventoryDataPath = path.join(__dirname, '../../../db/inventory.json');

exports.get = async (req, res) => {
  try {
    // Inventory data from inventory service
    const inventory = JSON.parse(fs.readFileSync(inventoryDataPath, 'utf8'));
    // All auctions from blizz_api service
    const auctions = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM auctions
        ORDER BY realm, price ASC, auc_id DESC`,
        (err, rows) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(rows);
          }
        }
      );
    });
    // Transform into nested json response
    const json = auctions.reduce((obj, auc) => {
      const { realm, item_id } = auc;
      obj[item_id] = obj[item_id] || {};
      obj[item_id][realm] = obj[item_id][realm] || {};
      obj[item_id][realm].auctions = obj[item_id][realm].auctions || [];
      // add own_auc prop
      auc.own_auc = !!inventory[realm].auction_ids.includes(auc.auc_id);
      obj[item_id][realm].auctions.push(auc);

      obj[item_id][realm].quantity = obj[item_id][realm].quantity || 0;
      obj[item_id][realm].quantity += auc.quantity;
      return obj;
    }, {});

    // Add extra properties
    Object.keys(json).forEach(item => {
      Object.keys(json[item]).forEach(realm => {
        const { auctions, quantity } = json[item][realm];

        // Calculate mean price (of first 40% items posted)
        let currQuantity = 0;
        let currTotalPrice = 0;
        for (const auc of auctions) {
          currQuantity += auc.quantity;
          currTotalPrice += auc.quantity * auc.price;
          if (currQuantity >= quantity * 0.4) {
            break;
          }
        }
        const mean_price = Math.round(currTotalPrice / currQuantity);

        // Add data from inventory.json
        const {
          inventory: realmInventory,
          auctions: realmAuctions,
        } = inventory[realm];

        const my_quantity =
          (realmInventory[item] || 0) + (realmAuctions[item] || 0);

        // Add extra properties
        json[item][realm] = {
          auctions,
          quantity,
          mean_price,
          my_quantity,
          my_auction_ids: inventory[realm].auction_ids,
        };
      });
    });

    res.json(json);
  } catch (err) {
    console.trace(err);
    res.sendStatus(500);
  }
};
