const { createLogger, transports, transport } = require('winston');

const logger = createLogger({
    transports: [
        new transports.File({ filename: 'app.log'})
    ]
});

module.exports = logger;