const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - IP: ${req.ip}\n`;
    fs.appendFile('visits.log', logEntry, (err) => {
        if (err) console.error('Failed to log visit:', err);
    });
    next();
});

app.get('/logs', (req, res) => {
    fs.readFile('visits.log', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Could not read log file' });
        
        const logs = data.split('\n').filter(line => line).map(line => {
            const [time, ip] = line.split(' - IP: ');
            return { time, ip };
        });

        res.json(logs);
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));