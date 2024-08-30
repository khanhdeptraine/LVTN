// src/RegisterDoctorForm.js
import React, { useState } from 'react';
import Web3 from 'web3';
import DoctorRegistryABI from '../ABI/DoctorRegistryABI.json';
// ABI của hợp đồng

const contractAddress = '0xYourContractAddress'; // Địa chỉ hợp đồng của bạn

function RegisterDoctorForm() {
    const [name, setName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [account, setAccount] = useState('');

    const handleRegisterDoctor = async (event) => {
        event.preventDefault();

        if (!window.ethereum) {
            alert('Vui lòng cài đặt MetaMask!');
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);

            const doctorRegistryContract = new web3.eth.Contract(DoctorRegistryABI, contractAddress);

            await doctorRegistryContract.methods.registerDoctor(
                name,
                licenseNumber,
                specialization
            ).send({ from: accounts[0], gas: 1000000 });

            // Gửi dữ liệu đến API để lưu vào file JSON
            const doctorData = {
                name,
                licenseNumber,
                specialization,
                account // Bao gồm địa chỉ ví
            };

            await fetch('http://localhost:5000/api/saveDoctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doctorData)
            });

            alert('Bác sĩ đã được đăng ký thành công!');
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            alert('Lỗi khi đăng ký bác sĩ. Vui lòng kiểm tra console để biết thêm chi tiết.');
        }
    };

    return (
        <div>
            <h2>Đăng Ký Bác Sĩ</h2>
            {account && <p>Tài khoản kết nối: {account}</p>}
            <form onSubmit={handleRegisterDoctor}>
                <div>
                    <label>
                        Họ và tên bác sĩ:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Số giấy phép:
                        <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Chuyên môn:
                        <input
                            type="text"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Đăng Ký</button>
            </form>
        </div>
    );
}

export default RegisterDoctorForm;
