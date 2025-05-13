import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@mui/material';
import { db2 } from '../firestore2'; // تأكد من استيراد إعدادات Firebase بشكل صحيح
import { collection, getDocs } from 'firebase/firestore'; // تأكد من استيراد الدوال الصحيحة

export default function ControllSchoolNews() {
  const [rows, setRows] = useState([]); // حالة لتخزين البيانات
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  useEffect(() => {
    const fetchSchoolNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db2, 'SchoolNews')); // استعلام جلب البيانات من مجموعة SchoolNews
        const schoolNews = querySnapshot.docs.map((doc, index) => ({
          id: index + 1, // تعيين id بشكل تلقائي باستخدام التعداد (auto increment)
          PostTitle: doc.data().PostTitle, // ربط الحقل PostTitle
          PostContent: doc.data().PostContent, // ربط الحقل PostContent
          PostImage: doc.data().PostImage, // ربط الحقل PostImage
          ShowHide: doc.data().ShowHide, // ربط الحقل ShowHide
        }));
        setRows(schoolNews); // تحديث حالة البيانات
      } catch (error) {
        console.error('Error fetching school news:', error); // طباعة الأخطاء في الكونسول
      }
    };

    fetchSchoolNews();
  }, []); // سيتم تحميل البيانات مرة واحدة عند تحميل الكومبوننت

  // دالة لمعالجة التعديل
  const handleEdit = (id) => {
    console.log('Edit post with ID:', id);
    // قم بتوجيه المستخدم إلى صفحة التعديل أو عرض نافذة التعديل هنا
  };

  // دالة لمعالجة الحذف
  const handleDelete = (id) => {
    console.log('Delete post with ID:', id);
    // قم بتنفيذ عملية الحذف هنا (مثلاً، عبر API أو تحديث حالة)
  };

  const columns = [
    { field: 'id', headerName: 'Post ID', width: 70 },
    { field: 'PostTitle', headerName: 'Post Title', width: 130 },
    { field: 'PostContent', headerName: 'Post Content', width: 200 },
    { field: 'PostImage', headerName: 'Post Image', width: 200 },
    {
      field: 'ShowHide',
      headerName: 'Show/Hide',
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.ShowHide ? 'Visible' : 'Hidden'}</span>
          </div>
        );
      },
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <FontAwesomeIcon
              className='text-primary'
              icon={faEdit}
              style={{ cursor: 'pointer', marginRight: 10 }}
              onClick={() => handleEdit(params.row.id)}
            />
            <FontAwesomeIcon
              className='text-danger'
              icon={faTrashAlt}
              style={{ cursor: 'pointer' }}
              onClick={() => handleDelete(params.row.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Typography variant='h5'>This is School News & Events</Typography>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows} // استخدام البيانات التي تم جلبها من Firestore
          columns={columns}
          pageSize={paginationModel.pageSize} // تحديد عدد الصفوف في كل صفحة
          page={paginationModel.page} // تحديد الصفحة الحالية
          onPageChange={(newPage) => setPaginationModel((prev) => ({ ...prev, page: newPage }))} // تحديث الصفحة عند التغيير
          onPageSizeChange={(newPageSize) => setPaginationModel((prev) => ({ ...prev, pageSize: newPageSize }))} // تغيير عدد الصفوف في الصفحة
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
