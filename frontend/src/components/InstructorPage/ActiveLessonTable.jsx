import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const ActiveLessonTable = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("tr-TR");
    const columns = [
        {
            name: "Öğrenci No",
            selector: row => row.no,
            sortable: true
        },
        {
            name: "Ad",
            selector: row => row.name,
            sortable: true
        },
        {
            name: "Soyad",
            selector: row => row.surName,
            sortable: true
        },
        {
            name: "Bölüm",
            selector: row => row.department,
            sortable: true
        }
    ];

    const data = [
        {
            no: 21100011050,
            name: "Sema",
            surName: "EKMEK",
            department: "Bilgisayar Mühendisliği"
        },
        {
            no: 21100011051,
            name: "Sena",
            surName: "İncekenar",
            department: "Makine Mühendisliği"
        },
        {
            no: 21100011052,
            name: "Ali",
            surName: "Şeker",
            department: "Elektrik Elektronik Mühendisliği"
        },
        {
            no: 21100011050,
            name: "Sema",
            surName: "EKMEK",
            department: "Bilgisayar Mühendisliği"
        }
    ];


    const [records, setRecords] = useState(data);


    const handleFilter = e => {
        const keyword = e.target.value.toLowerCase();
        const filteredData = data.filter(
            item =>
                item.no.toString().toLowerCase().includes(keyword) ||
                item.name.toLowerCase().includes(keyword) ||
                item.surName.toLowerCase().includes(keyword) ||
                item.department.toLowerCase().includes(keyword)
        );
        setRecords(filteredData);
    };
    
    return (
        <div className='container'>
        <h1 className="text-3xl font-bold">Aktif Ders Yoklaması</h1>
        <h1 className="text-xl font-semibold">{formattedDate}</h1>

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
                data={records}
                searchable={true}
                pagination={true}
                fixedHeader
                responsive
            />
        </div>
    </div>
    );
};

export default ActiveLessonTable;
