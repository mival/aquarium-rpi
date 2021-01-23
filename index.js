const raspi = require('raspi');
const pwm = require('raspi-pwm');
const softPwm = require('raspi-soft-pwm');
const express = require('express')
const cors = require('cors')
const app = express()

raspi.init(() => {
//   let i = 0;
//   const led = new pwm.PWM('GPIO18');
//   http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(req.url);
//     const q = url.parse(req.url, true).query;
//     const value = parseFloat(q.white);
//     res.end();
//   }).listen(8080);

  app.use(cors())

  app.get('/:color', function (req, res, next) {
    const { query } = req || {};
    const { value: valueStr } = query || {}
    const value = parseFloat(valueStr);
    const blue = new softPwm.SoftPWM('GPIO18');
    const green = new softPwm.SoftPWM('GPIO15');
    const red = new softPwm.SoftPWM('GPIO14');

    const { color } = req.params || {};

    switch(color) {
      case 'blue':
        if (!isNaN(value)) {
          blue.write(value);
        }
      case 'green':
        if (!isNaN(value)) {
          green.write(value);
        }
      case 'red':
        if (!isNaN(value)) {
          red.write(value);
        }
      break;

      default:
      break;
    }
    res.json({ color, value })
  })

  app.listen(8080, function () {
    console.log('CORS-enabled web server listening on port 80')
  })

  // setInterval(() => {
  //   if (i > 1) i = 0;
  //   led.write(i); // 50% Duty Cycle, aka half brightness
  //   i += 0.01
  // }, 10);
});