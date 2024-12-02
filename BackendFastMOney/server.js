const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Adjust the origin as per your frontend setup
app.use(express.json());

// In-Memory Data
let mainBalance = 45000; // Initial balance
const transactions = []; // Transaction history

// Default Bank Accounts
const bankAccounts = {
    'Islami Bank PLC': { accountNumber: '111222333', balance: 10000, pin: '1234' },
    'Dutch-Bangla PLC': { accountNumber: '222333444', balance: 15000, pin: '2345' },
    'Janata Bank PLC': { accountNumber: '333444555', balance: 8000, pin: '3456' },
    'Rupali Bank PLC': { accountNumber: '444555666', balance: 12000, pin: '4567' },
    'Dhaka Bank PLC': { accountNumber: '555666777', balance: 5000, pin: '5678' },
    'Brack Bank PLC': { accountNumber: '666777888', balance: 20000, pin: '6789' },
};

// Routes

// Test Route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Get Main Balance
app.get('/api/balance', (req, res) => {
    res.json({ balance: mainBalance });
});

// Add Transaction
app.post('/api/transaction', (req, res) => {
    const { action, number, amount, bank } = req.body;

    if (!action || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transaction data.' });
    }

    // Validate and process the transaction
    if (action === 'Add Money') {
        if (!bank || !bankAccounts[bank]) {
            return res.status(400).json({ message: 'Invalid bank selected.' });
        }

        // Deduct from bank and add to main balance
        if (bankAccounts[bank].balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds in the selected bank account.' });
        }

        bankAccounts[bank].balance -= amount;
        mainBalance += amount;
    } else if (['Cash Out', 'Send Money', 'Pay Bill'].includes(action)) {
        if (mainBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance in your account.' });
        }

        mainBalance -= amount;
    } else {
        return res.status(400).json({ message: 'Unsupported transaction type.' });
    }

    // Record the transaction
    const transaction = {
        action,
        number: number || 'N/A',
        amount,
        bank: bank || 'N/A',
        date: new Date().toLocaleString(),
    };
    transactions.push(transaction);

    res.status(201).json({ message: 'Transaction completed successfully.', success: true, transaction });
});

// Get Transactions
app.get('/api/transactions', (req, res) => {
    res.json(transactions);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
