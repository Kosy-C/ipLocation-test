const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const iplocationRouter = require('./Router/router')

const app = express();

app.use(express.json());
app.use(bodyParser.json());


app.use('/api', iplocationRouter);
app.get('/', (req, res) => {
  res.send('yes')
  console.log('we')
})

app.listen(3200, () => {
  console.log('Server started on port 3200');
});
