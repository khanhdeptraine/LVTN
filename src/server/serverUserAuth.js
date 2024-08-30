const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// Endpoint để lấy tất cả hồ sơ từ file record.json
app.get('/api/records/:name', (req, res) => {
    const patientName = req.params.name.toLowerCase(); // Chuyển đổi tên tìm kiếm thành chữ thường

    fs.readFile('record.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const records = JSON.parse(data);
        const foundRecord = records.find(record => record.patientFullName.toLowerCase() === patientName); // Chuyển đổi tên trong dữ liệu thành chữ thường

        if (foundRecord) {
            res.json(foundRecord);
        } else {
            res.status(404).send('Record not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
