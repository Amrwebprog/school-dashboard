import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function ControllStudentNews() {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [status, setStatus] = useState('false'); // إضافة حالة لزر "True/False"


  const insertStudentNew = ()=>{
    
  }
  const ToggleStudentForm = () => {
    setShowStudentForm(!showStudentForm);
  };

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatus(newStatus); // تحديث حالة "True" أو "False"
    }
  };

  const columns = [
    { field: 'id', headerName: 'Post ID', width: 70 },
    { field: 'Title', headerName: 'Post Title', width: 130 },
    { field: 'Content', headerName: 'Post Content', width: 130 },
    { field: 'Img', headerName: 'Post Image', width: 200 },
    {
      field: 'Action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <FontAwesomeIcon
              className="text-primary"
              icon={faEdit}
              style={{ cursor: 'pointer', marginRight: 10 }}
              onClick={() => handleEdit(params.row.id)}
            />
            <FontAwesomeIcon
              className="text-danger"
              icon={faTrashAlt}
              style={{ cursor: 'pointer' }}
              onClick={() => handleDelete(params.row.id)}
            />
          </div>
        );
      },
    },
  ];

  const rows = [
    { id: 1, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 2, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 3, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 4, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 5, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 6, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 7, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 8, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
    { id: 9, Content: 'This is post Content', Title: 'This is Post Title', Img: 'test', Action: '' },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

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

  return (
    <div>
      {showStudentForm ? (
        <div className="overlay" onClick={ToggleStudentForm}>
          <Paper
            className="col-8"
            onClick={(event) => event.stopPropagation()} // لمنع الإغلاق عند الضغط على الـ Paper
            sx={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Student News & Events Form
            </Typography>

            {/* TextField 1 (Title) */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
            />

            {/* TextField 2 (Content) */}
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: '16px' }}
            />

            <Typography variant='h5'>visibility</Typography>
            {/* True/False Toggle */}
            <ToggleButtonGroup
              value={status}
              exclusive
              onChange={handleStatusChange}
              sx={{ marginBottom: '16px' }}
            >
              <ToggleButton value="true">True</ToggleButton>
              <ToggleButton value="false">False</ToggleButton>
            </ToggleButtonGroup>

            {/* Upload File */}
            <Button variant="outlined" component="label" sx={{ marginBottom: '16px' }}>
              Upload File
              <input type="file" hidden />
            </Button>

            {/* Submit Button */}
            <Button onClick={insertStudentNew} variant="contained" color="primary" sx={{ marginTop: '16px' }}>
              Submit
            </Button>
          </Paper>
        </div>
      ) : null}

      <Typography variant="h5">This is Student News & Events</Typography>
      <Button onClick={ToggleStudentForm} variant="contained" sx={{ marginBottom: '10px', marginTop: '10px' }}>
        Add New & Event
      </Button>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
