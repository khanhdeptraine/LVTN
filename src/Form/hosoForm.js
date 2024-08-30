// src/HosoForm.js
import React, { useState } from 'react';
import Web3 from 'web3';
import UserAuthABI from '.ABI/UserAuthABI.json'; // ABI của hợp đồng

const contractAddress = '0xcCbE68Be194A82bdC6ade701d77bC07155445922'; // Địa chỉ hợp đồng của bạn

function HosoForm() {
    const [patientFullName, setPatientFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [illness, setIllness] = useState('');
    const [notes, setNotes] = useState('');
    const [prescription, setPrescription] = useState('');
    const [account, setAccount] = useState('');

    const handleAddRecord = async (event) => {
        event.preventDefault();

        if (!window.ethereum) {
            alert('Vui lòng cài đặt MetaMask!');
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);

            const userAuthContract = new web3.eth.Contract(UserAuthABI, contractAddress);
            const birthDateTimestamp = new Date(birthDate).getTime() / 1000;

            await userAuthContract.methods.addRecord(
                patientFullName,
                birthDateTimestamp,
                illness,
                notes,
                prescription
            ).send({ from: accounts[0], gas: 1000000 });

            // Gửi dữ liệu đến API để lưu vào file JSON
            const record = {
                patientFullName,
                birthDate: birthDateTimestamp,
                illness,
                notes,
                prescription
            };

            await fetch('http://localhost:5000/api/saveRecord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            });

            alert('Hồ sơ đã được thêm thành công!');
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            alert('Lỗi khi thêm hồ sơ. Vui lòng kiểm tra console để biết thêm chi tiết.');
        }
    };

    return (
        <div>
            <h2>Thêm Hồ Sơ Bệnh Nhân</h2>
            {account && <p>Tài khoản kết nối: {account}</p>}
            <form onSubmit={handleAddRecord}>
                <div>
                    <label>
                        Họ và tên bệnh nhân:
                        <input
                            type="text"
                            value={patientFullName}
                            onChange={(e) => setPatientFullName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Ngày sinh:
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Bệnh:
                        <input
                            type="text"
                            value={illness}
                            onChange={(e) => setIllness(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Chú ý:
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Toa thuốc:
                        <input
                            type="text"
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Thêm Hồ Sơ</button>
            </form>
        </div>
    );
}

export default HosoForm;
