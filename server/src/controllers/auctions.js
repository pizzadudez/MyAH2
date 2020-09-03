const db = require('../db');

exports.get = async (req, res) => {
  try {
    // All auctions
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
      obj[realm] = obj[realm] || {};
      obj[realm][item_id] = obj[realm][item_id] || {};
      obj[realm][item_id].auctions = obj[realm][item_id].auctions || [];
      obj[realm][item_id].auctions.push(auc);

      obj[realm][item_id].quantity = obj[realm][item_id].quantity || 0;
      obj[realm][item_id].quantity += auc.quantity;
      return obj;
    }, {});

    // Add extra properties
    Object.keys(json).forEach(realm => {
      Object.keys(json[realm]).forEach(item => {
        const { auctions, quantity } = json[realm][item];

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

        json[realm][item] = {
          auctions,
          quantity,
          mean_price,
        };
      });
    });

    res.json(json);
  } catch (err) {
    console.trace(err);
    res.sendStatus(500);
  }
};
