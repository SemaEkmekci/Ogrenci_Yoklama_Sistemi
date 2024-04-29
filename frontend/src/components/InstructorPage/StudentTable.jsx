import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import StudentTableServices from '../../services/InstructorPage/StudentTable';

const StudentTable = () => {
    const columns = [
        {
            name: "Öğrenci No",
            selector: row => row.ogrenci_no,
            sortable: true
        },
        {
            name: "Ad",
            selector: row => row.ad,
            sortable: true
        },
        {
            name: "Soyad",
            selector: row => row.soyad,
            sortable: true
        },
        {
            name: "Bölüm",
            selector: row => row.bolum,
            sortable: true
        },
        {
            name: "Aldığı Ders",
            selector: row => row.ders_adi,
            sortable: true
        }
    ];

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        fetchStudentInfo();
    }, []);

    const fetchStudentInfo = async () => {
        try {
            const response = await StudentTableServices.getStudentInfo();
            setRecords(response.data.students);
        } catch (error) {
            console.error("Error fetching student info:", error);
        }
    };

    const handleFilter = e => {
        const keyword = e.target.value.toLowerCase();
        setKeyword(keyword);
        const filteredData = records.filter(
            item =>
                item.ogrenci_no.toString().toLowerCase().includes(keyword) ||
                item.ad.toLowerCase().includes(keyword) ||
                item.soyad.toLowerCase().includes(keyword) ||
                item.bolum.toLowerCase().includes(keyword)
        );
        setFilteredRecords(filteredData);
    };

    const dataToDisplay = keyword !== "" ? filteredRecords : records;

    return (
        <div className='container'>
            <div className='text-end mb-2'>
                <input 
                    type="text" 
                    className="px-3 py-1 border-2 border-gray-400 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out hover:border-blue-300" 
                    placeholder="Ara..."
                    onChange={handleFilter}
                />
            </div>
            <div className="overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={dataToDisplay}
                    searchable={true}
                    pagination={true}
                    fixedHeader
                    responsive
                />
            </div>
        </div>
    );
};

export default StudentTable;
