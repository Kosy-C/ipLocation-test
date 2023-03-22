const express = require('express');
const router = express.Router();
const {
  getIPLocations,
  getIPLocationById,
  createIPLocation,
  updateIPLocation,
  deleteIPLocation
} = require('../Controller/controller');

router.get('/iplocations', getIPLocations);
router.get('/iplocations/:id', getIPLocationById);
router.post('/iplocations', createIPLocation);
router.put('/iplocations/:id', updateIPLocation);
router.delete('/iplocations/:id', deleteIPLocation);

module.exports = router;
