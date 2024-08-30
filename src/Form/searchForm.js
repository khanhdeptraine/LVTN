import React, { useState } from 'react';

function SearchRecord() {
    const [searchName, setSearchName] = useState('');
    const [record, setRecord] = useState(null);
    const [error, setError] = useState('');

    const handleSearchRecord = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/records/${encodeURIComponent(searchName.trim().toLowerCase())}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError('No matching record found');
                } else {
                    throw new Error('Network response was not ok');
                }
                setRecord(null);
                return;
            }
            const foundRecord = await response.json();

            setRecord({
                illness: foundRecord.illness,
                notes: foundRecord.notes,
                prescription: foundRecord.prescription,
                date: new Date(foundRecord.birthDate * 1000).toLocaleString()
            });
            setError('');
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            setError('Lỗi khi tra cứu hồ sơ. Vui lòng kiểm tra console để biết thêm chi tiết.');
            setRecord(null);
        }
    };

    return (
        <div>
            <h2>Tra Cứu Hồ Sơ Bệnh Nhân</h2>
            <form onSubmit={handleSearchRecord}>
                <div>
                    <label>
                        Họ và tên bệnh nhân:
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Tra Cứu Hồ Sơ</button>
            </form>

            {error && <p>{error}</p>}

            {record && (
                <div>
                    <h3>Kết quả tra cứu:</h3>
                    <p><strong>Bệnh:</strong> {record.illness}</p>
                    <p><strong>Chú ý:</strong> {record.notes}</p>
                    <p><strong>Toa thuốc:</strong> {record.prescription}</p>
                    <p><strong>Ngày nhập hồ sơ:</strong> {record.date}</p>
                </div>
            )}
        </div>
    );
}

export default SearchRecord;
