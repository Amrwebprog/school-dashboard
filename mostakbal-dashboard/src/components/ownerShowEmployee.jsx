import React, { useRef, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firestoredb';
import Swal from 'sweetalert2';
import { Paper, Checkbox, TextField } from '@mui/material'; // تأكد من استيراد TextField هنا
import { DataGrid } from '@mui/x-data-grid';

export default function OwnerShowEmployee() {
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const ChosenDate = useRef();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
    const [searchQuery, setSearchQuery] = useState(''); // حالة لتخزين نص البحث

    const columns = [
        {
            field: 'attendance',
            headerName: 'Attendance',
            width: 100,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value === true}
                    disabled
                />
            ),
            cellClassName: 'small-cell'
        },
        { field: 'attendanceReason', headerName: 'Attendance Reason', width: 150, cellClassName: 'small-cell' },
        { field: 'employeeName', headerName: 'Employee Name', width: 150, cellClassName: 'small-cell' },
        { field: 'employeeJob', headerName: 'Employee Job', width: 150, cellClassName: 'small-cell' },
        { field: 'title', headerName: 'Job Title', width: 150, cellClassName: 'small-cell' },
        { field: 'branch', headerName: 'Branch', width: 150, cellClassName: 'small-cell' }
    ];

    const GetEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const chosenDate = ChosenDate.current.value;
            const collectionName = "Employee_" + chosenDate; // Assuming this is the correct collection structure
            const q = query(collection(db, collectionName));
            const querySnapshot = await getDocs(q);

            const employees = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setEmployeeData(employees);

            if (employees.length > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم العثور على بيانات',
                    text: 'تم العثور على بيانات الموظفين لهذا اليوم!',
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'لا توجد بيانات',
                    text: 'لا توجد بيانات للموظفين لهذا اليوم!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء جلب بيانات الموظفين!',
            });
        } finally {
            setLoading(false);
        }
    };

    // وظيفة لتصفية البيانات بناءً على نص البحث
    const filteredEmployeeData = employeeData.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="d-flex flex-wrap flex-column col-12 justify-content-center align-items-center">
                {loading && (
                    <div className="overlay">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <h1>Enter Date To Display Employee Attendance</h1>
                <input type="date" ref={ChosenDate} onChange={GetEmployee} />

                {/* حقل البحث */}
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Paper sx={{ width: '100%', marginTop: '20px' }}>
                    <DataGrid
                        rows={filteredEmployeeData.map((employee) => ({
                            id: employee.id,
                            attendance: employee.attendance,
                            attendanceReason: employee.attendanceReason,
                            employeeName: employee.employeeName,
                            employeeJob: employee.Job,
                            title: employee.title,
                            branch: employee.branch
                        }))}
                        columns={columns}
                        pagination
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        rowsPerPageOptions={[25, 50, 100]}
                        checkboxSelection
                        sx={{ border: 1, '& .MuiDataGrid-cell': { fontSize: '0.8rem' } }} 
                    />
                </Paper>
            </div>
        </>
    );
}
