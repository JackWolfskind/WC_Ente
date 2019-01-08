const TeleBot = require('telebot');

var fs = require('fs');

var self = this;

self.loadToken = new Promise(
    (resolve, reject) => { 
    fs.readFile('./quotes.json', 'utf8', function(err, quotes) {
        if (err) {
            return reject(err);
        }
        self.quotes = JSON.parse(quotes).quotes;
        resolve();
    })
});



self.loadQuotes = new Promise(
    (resolve, reject) => { 
        fs.readFile('./tokenfile', 'utf8', function(err, token) {
        if (err) {
            reject(err);
        }
        self.token = token;
        resolve();
    });
});


self.init = function () {

    self.bot = new TeleBot({
        token: self.token, // Required. Telegram Bot API token.
        polling: { // Optional. Use polling.
            interval: 1000, // Optional. How often check updates (in ms).
            timeout: 0, // Optional. Update polling timeout (0 - short polling).
            limit: 100, // Optional. Limits the number of updates to be retrieved.
            retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
        },
        pluginFolder: '../plugins/', // Optional. Plugin folder location.
    });
    

};

self.getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

self.getRandomQuote = function () {
    if (self.quotes) {
        return self.quotes[self.getRandomInt(self.quotes.length)];
    }
}

Promise.all([self.loadToken, self.loadQuotes]).then(function () {
    self.init();
    self.bot.on('text', (msg) => msg.reply.text(self.getRandomQuote()));
    self.bot.start();
});