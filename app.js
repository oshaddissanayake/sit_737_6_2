const express = require('express');
const winston = require('winston');

const app = express();
const port = 3000;

// Setup Winston Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Default Route
app.get('/', (req, res) => {
    res.send('Hello! updated Calculator microservice is running.');
});

// Middleware for input validation
function validateInputs(req, res, next) {
    const { num1, num2 } = req.query;
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input parameters');
        return res.status(400).json({ error: 'Invalid input parameters. Please provide valid numbers.' });
    }
    req.num1 = parseFloat(num1);
    req.num2 = parseFloat(num2);
    next();
}


// API Endpoints
app.get('/add', validateInputs, (req, res) => {
    const result = req.num1 + req.num2;
    logger.info(`Addition operation: ${req.num1} + ${req.num2} = ${result}`);
    res.json({ operation: 'addition', result });
});

app.get('/subtract', validateInputs, (req, res) => {
    const result = req.num1 - req.num2;
    logger.info(`Subtraction operation: ${req.num1} - ${req.num2} = ${result}`);
    res.json({ operation: 'subtraction', result });
});

app.get('/multiply', validateInputs, (req, res) => {
    const result = req.num1 * req.num2;
    logger.info(`Multiplication operation: ${req.num1} * ${req.num2} = ${result}`);
    res.json({ operation: 'multiplication', result });
});

app.get('/divide', validateInputs, (req, res) => {
    if (req.num2 === 0) {
        logger.error('Division by zero attempt');
        return res.status(400).json({ error: 'Cannot divide by zero.' });
    }
    const result = req.num1 / req.num2;
    logger.info(`Division operation: ${req.num1} / ${req.num2} = ${result}`);
    res.json({ operation: 'division', result });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});