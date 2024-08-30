// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract UserAuth {
    // Cấu trúc hồ sơ bệnh án
    struct UserRecord {
        string patientFullName; // Họ tên bệnh nhân
        uint256 birthDate; // Ngày tháng năm sinh (thời gian tính bằng giây từ epoch)
        string illness; // Bệnh
        string notes; // Chú ý
        string prescription; // Toa thuốc
        uint256 date; // Ngày nhập hồ sơ (thời gian hiện tại)
    }

    // Mapping để lưu trữ các hồ sơ bệnh án theo địa chỉ của bệnh nhân
    mapping(address => UserRecord[]) private records;

    // Sự kiện thông báo khi một hồ sơ bệnh án được thêm vào
    event RecordAdded(
        address indexed patient,
        string patientFullName,
        uint256 birthDate,
        string illness,
        string notes,
        string prescription,
        uint256 date
    );

    // Thêm một hồ sơ bệnh án mới
    function addRecord(
        string memory _patientFullName,
        uint256 _birthDate,
        string memory _illness,
        string memory _notes,
        string memory _prescription
    ) public {
        // Tạo mới hồ sơ bệnh án
        UserRecord memory newRecord = UserRecord({
            patientFullName: _patientFullName,
            birthDate: _birthDate,
            illness: _illness,
            notes: _notes,
            prescription: _prescription,
            date: block.timestamp // Lấy thời gian hiện tại
        });

        // Lưu hồ sơ bệnh án vào mapping theo địa chỉ người dùng
        records[msg.sender].push(newRecord);

        // Phát ra sự kiện khi thêm hồ sơ thành công
        emit RecordAdded(
            msg.sender,
            _patientFullName,
            _birthDate,
            _illness,
            _notes,
            _prescription,
            block.timestamp
        );
    }

    // Lấy danh sách các hồ sơ bệnh án của bệnh nhân
    function getRecords()
        public
        view
        returns (
            string[] memory patientFullNames,
            uint256[] memory birthDates,
            string[] memory illnesses,
            string[] memory notes,
            string[] memory prescriptions,
            uint256[] memory dates
        )
    {
        uint256 recordCount = records[msg.sender].length;
        patientFullNames = new string[](recordCount);
        birthDates = new uint256[](recordCount);
        illnesses = new string[](recordCount);
        notes = new string[](recordCount);
        prescriptions = new string[](recordCount);
        dates = new uint256[](recordCount);

        for (uint256 i = 0; i < recordCount; i++) {
            UserRecord memory record = records[msg.sender][i];
            patientFullNames[i] = record.patientFullName;
            birthDates[i] = record.birthDate;
            illnesses[i] = record.illness;
            notes[i] = record.notes;
            prescriptions[i] = record.prescription;
            dates[i] = record.date;
        }
    }

    // Tra cứu hồ sơ bệnh án dựa trên họ tên và ngày sinh
    function lookupRecord(
        string memory _patientFullName,
        uint256 _birthDate
    )
        public
        view
        returns (
            string memory illness,
            string memory notes,
            string memory prescription,
            uint256 date
        )
    {
        uint256 recordCount = records[msg.sender].length;

        for (uint256 i = 0; i < recordCount; i++) {
            UserRecord memory record = records[msg.sender][i];
            if (
                keccak256(abi.encodePacked(record.patientFullName)) ==
                keccak256(abi.encodePacked(_patientFullName)) &&
                record.birthDate == _birthDate
            ) {
                return (
                    record.illness,
                    record.notes,
                    record.prescription,
                    record.date
                );
            }
        }

        revert("No matching record found");
    }
}
