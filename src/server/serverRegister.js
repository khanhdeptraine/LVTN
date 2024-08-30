// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, 'recordRegister.json');

app.post('/api/saveDoctor', (req, res) => {
    const doctorData = req.body;

    // Đọc dữ liệu hiện tại từ file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Lỗi khi đọc file.');
        }

        let records = [];
        if (data) {
            try {
                records = JSON.parse(data);
            } catch (parseErr) {
                return res.status(500).send('Lỗi khi phân tích dữ liệu.');
            }
        }

        // Thêm dữ liệu mới vào mảng
        records.push(doctorData);

        // Ghi lại dữ liệu vào file
        fs.writeFile(filePath, JSON.stringify(records, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send('Lỗi khi ghi file.');
            }
            res.status(200).send('Dữ liệu bác sĩ đã được lưu.');
        });
    });
});

app.listen(5000, () => {
    console.log('Server đang chạy trên port 5000');
});
