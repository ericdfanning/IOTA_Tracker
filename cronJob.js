const CronJob = require('cron').CronJob;
const axios = require('axios');
var express = require('express');
var app = express();

let emailService = require('./emailService');

(function() {

  var lastPrice = 0 // keep track of previous price

  var pricesObj = {curPrice: 0, prevPrice: 0}
  const scan = () => {
    // make GET request to crypto compare for iota data
    // if you want to add additional request or change this request,
    // change the currency symbol in the url at the 'sym=SOME_SYMBOL'
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=IOT&tsyms=USD')
      .then((res) => {
        // since the returned data is a string, change it to a number in order
        // do have a deeper comparison in the if/else statement below.
        let price = Number(res.data.USD)
        let sendIt = false

        // if the currency changes by a dollar either more or less than the previous
        // price that we're keeping track of on line 10 above, then send the email
        if (lastPrice < price) {
          // change the range you'd like to be notified by if you want.
          // right now it's set to $1 increments. You can change it to 
          // whatever you'd like. 
          if (price - lastPrice > 1) {
            sendIt = true
            pricesObj = {curPrice: price, prevPrice: lastPrice}
          }
        } else if (lastPrice > price) {
          if (lastPrice - price > 1) {
            sendIt = true
            pricesObj = {curPrice: price, prevPrice: lastPrice}
          }
        }

        if (sendIt) {
          console.log('sending email', pricesObj)
          
          // send the previous price (lastPrice) and current price to the
          // emailService file so that the amounts can be included in the email
          emailService.sendEmail(pricesObj)
          lastPrice = price
        }
      })
  }

  // this cron job will run on the first second of every minute of every day.
  // crypto compare only allows a GET request every 10 seconds anyways
  let job = new CronJob({
    cronTime: '01 * * * * *',
    onTick: scan,
    start: true,
    timeZone: 'America/Los_Angeles'
  });

})();