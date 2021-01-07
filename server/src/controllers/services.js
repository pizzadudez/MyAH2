const router = require('express').Router();
const { spawn } = require('child_process');
const path = require('path');

const pythonEnv = path.join(
  __dirname,
  '../../../services/env/Scripts/python.exe'
);
const servicesPath = path.join(__dirname, '../../../services');

const auctionsUpdate = () => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonEnv, [
      path.join(servicesPath, '/blizz_api/main.py'),
    ]);
    pythonProcess.on('close', code => {
      if (code == 0) {
        resolve('auctions updated')
      } else {
        reject(`auctions update service exited with code: ${code}`)
      }
    })
    pythonProcess.on('error', err => {
      console.log(err);
      reject(err);
    });
  });
};

const inventoryUpdate = () => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonEnv, [
      path.join(servicesPath, '/inventory/main.py'),
    ]);
    pythonProcess.on('close', code => {
      if (code == 0) {
        resolve('auctions updated')
      } else {
        reject(`auctions update service exited with code: ${code}`)
      }
    })
    pythonProcess.on('error', err => {
      console.log(err);
      reject(err);
    });
  });
};

router.get('/update', async (req, res) => {
  try {
    // Notify that we are running the update
    res.json({
      updating: true,
    });
    // Run child processes
    inventoryUpdate()
      .then(msg => console.log(msg))
      .catch(err => console.log(err));
    auctionsUpdate()
      .then(msg => console.log(msg))
      .catch(err => console.log(err));
  } catch (err) {
    console.log(err);
    res.json({
      error: err,
    });
  }
});

module.exports = router;
