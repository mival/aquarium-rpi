const raspi = require('raspi');
const pwm = require('raspi-pwm');
const softPwm = require('raspi-soft-pwm');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const COLORS = {
  blue: 'GPIO18',
  green: 'GPIO15',
  red: 'GPIO14',
  white: 'GPIO23',
  yellow: 'GPIO24',
};

const data = {};
const colorPwms = {};

const setData = (key, value) => {
  data[key] = value;
  colorPwms[key].write(value);
  return data;
}

const getData = () => {
  return data;
}

raspi.init(() => {
  // init
  Object.keys(COLORS).forEach(color => {
    colorPwms[color] = new softPwm.SoftPWM(COLORS[color]);
    colorPwms[color].write(0);
    setData(color, 0);
  });

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/data', (req, res) => {
    res.json(getData());
  })

  app.post('/turn-on', (req, res) => {
    Object.keys(COLORS).forEach(color => {
      setData(color, 1);
    })
    res.json(getData());
  })

  app.post('/turn-off', (req, res) => {
    Object.keys(COLORS).forEach(color => {
      setData(color, 0);
    })
    res.json(getData());
  })


  app.get('/colors', (req, res) => {
    res.json(Object.keys(COLORS));
  })

  app.post('/set/:color', (req, res) => {
    const { body } = req || {};
    const { color, value: valueStr } = body || {}
    const value = parseFloat(valueStr);

    if (Object.keys(COLORS).includes(color) && colorPwms[color]) {
      if (!isNaN(value)){
        setData(color, value);
      }
    }

    res.json({ color, value })
  })

  app.listen(8080, function () {
    console.log('CORS-enabled web server listening on port 80')
  })
});