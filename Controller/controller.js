const axios = require('axios');
const fs = require('fs');
const path = require('path');
// const dataFile = require('../config/db.json')

const apiKey = ' 3767958a0e854ca39b1ee3a3dde0991d'; 
// const dataFile = 'data.json';
const dataFile = path.join(__dirname, '../config/db.json');


// read the data from the data.json file and parse it as JSON
let data = [];
try {
  const fileData = fs.readFileSync(dataFile, 'utf-8');
  data = JSON.parse(fileData);
} catch (err) {
  console.error(`Error reading data file: ${err}`);
}

// controller functions for IPLocation
const getIPLocations = (req, res) => {
  const activeOnly = req.query.activeOnly === 'true';
  const filteredData = activeOnly ? data.filter(item => item.isActive) : data;
  res.json(filteredData);
};

const getIPLocationById = (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ message: ' Not found (No Domain with such ID)' });
  }
  res.json(item);
};

const createIPLocation = async (req, res) => {
  const { domain } = req.body;

  // check if the domain already exists
  const existingItem = data.find(item => item.domain === domain);
  if (existingItem) {
    return res.status(409).json({ message: 'Domain already exists' });
  }

  // fetch geolocation data from ipgeolocation.io
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=3767958a0e854ca39b1ee3a3dde0991d
  &domain=google.com`;
  try {
    const response = await axios.get(url);
    const { longitude, latitude, geoname_id } = response.data;

    // create the new IPLocation object
    const newItem = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
      domain,
      long: longitude,
      lat: latitude,
      geoname_id,
      isActive: true
    };

    // add the new item to the data array
    data.push(newItem);

    // save the updated data array to the file
    fs.writeFileSync(dataFile, JSON.stringify(data));

    res.status(201).json(newItem);
  } catch (err) {
    console.error(`Error fetching geolocation data: ${err}`);
    res.status(500).json({ message: 'Failed to fetch geolocation data' });
  }
};

const updateIPLocation = async (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = data.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  const { domain } = req.body;

  // fetch geolocation data from ipgeolocation.io
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=3767958a0e854ca39b1ee3a3dde0991d
&domain=google.com`;
  try {
    const response = await axios.get(url);
    const { longitude, latitude, geoname_id } = response.data;

    // update the IPLocation object
    data[itemIndex].domain = domain;
    data[itemIndex].long = longitude;
    data[itemIndex].lat = latitude;
    data[itemIndex].geoname_id = geoname_id;

    // save the updated data array to the file
    fs.writeFileSync(dataFile, JSON.stringify(data));

    res.json(data[itemIndex]);
  } catch (err) {

    console.error(`Error fetching geolocation data: ${err}`);
    res.status(500).json({ message: 'Failed to fetch geolocation data' });
  }
};

const deleteIPLocation = (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = data.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Not found (No Domain with such ID)' });
  }
  data.splice(itemIndex,1)
  fs.writeFileSync(dataFile, JSON.stringify(data));
  res.json({ message: 'Deleted Successful' });
};

module.exports = {
  getIPLocations,
  getIPLocationById,
  createIPLocation,
  updateIPLocation,
  deleteIPLocation
};

