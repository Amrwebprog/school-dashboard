import React, { useState, useEffect } from 'react';
import { db2 } from '../firestore2'; // تأكد من مسار إعدادات Firestore الخاصة بك
import { collection, getDocs } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from '@mui/material';

export default function Addmissions() {
  const [admissionsData, setAdmissionsData] = useState([]);
  const [filterText, setFilterText] = useState(''); // حالة خاصة بالنص الذي يتم إدخاله للبحث

  // جلب بيانات القبول من Firestore
  useEffect(() => {
    const fetchAdmissionsData = async () => {
      const querySnapshot = await getDocs(collection(db2, 'Addissions'));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched admissions data:', data); // لتصحيح الأخطاء
      setAdmissionsData(data);
    };

    fetchAdmissionsData();
  }, []);

  // فلترة البيانات بناءً على النص المدخل في البحث
  const filteredAdmissionsData = admissionsData.filter((admission) =>
    (admission.StudentName && admission.StudentName.toLowerCase().includes(filterText.toLowerCase())) ||
    (admission.ParentName && admission.ParentName.toLowerCase().includes(filterText.toLowerCase())) ||
    (admission.Email && admission.Email.toLowerCase().includes(filterText.toLowerCase())) ||
    (admission.ContactPhoneNumber && admission.ContactPhoneNumber.includes(filterText)) // لا حاجة إلى lowercase لرقم الهاتف
  );

  return (
    <Paper>
      <TextField
        label="بحث"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)} // تحديث النص المدخل للبحث
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Parent Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Phone Number</TableCell>
              <TableCell>Desired Grade</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Student Age</TableCell>
              <TableCell>Student Birthday</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmissionsData.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell>{admission.StudentName || 'N/A'}</TableCell>
                <TableCell>{admission.ParentName || 'N/A'}</TableCell>
                <TableCell>{admission.Email || 'N/A'}</TableCell>
                <TableCell>{admission.ContactPhoneNumber || 'N/A'}</TableCell>
                <TableCell>{admission.DesiredGrade || 'N/A'}</TableCell>
                <TableCell>{admission.Message || 'N/A'}</TableCell>
                <TableCell>{admission.StudentAge || 'N/A'}</TableCell>
                <TableCell>{admission.StudentBirthday || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
