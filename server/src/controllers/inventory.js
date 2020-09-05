const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../../db/inventory.json');

exports.get = async (req, res) => {
  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(json);
  } catch (err) {
    console.trace(err);
    res.sendStatus(500);
  }
};
