import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Paper,
} from '@mui/material';
import { db2 } from '../firestore2';
import { collection, getDocs } from 'firebase/firestore';

export default function Messages() {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Name');  // Sort based on 'Name'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db2, 'Messages'));
      const messages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.Timestamp ? data.Timestamp.toDate().toLocaleDateString() : '';  // Format date
        return { id: doc.id, ...data, Date: date };
      });
      console.log('Fetched messages:', messages); // Debugging: see the fetched data
      setRows(messages);
    };

    fetchMessages();
  }, []);

  // Sort function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle changes in the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle text input change for filtering
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  // Filter rows based on the entered filter text
  const filteredRows = rows.filter((row) =>
    (row.Name && row.Name.toLowerCase().includes(filterText.toLowerCase())) ||
    (row.Message && row.Message.toLowerCase().includes(filterText.toLowerCase())) ||
    (row.Email && row.Email.toLowerCase().includes(filterText.toLowerCase())) ||
    (row.PhoneNumber && row.PhoneNumber.includes(filterText))  // For phone number, no need to lower case
  );

  console.log('Filtered rows:', filteredRows);  // Debugging: check filtered rows

  // Sort rows based on selected order
  const sortedRows = filteredRows.sort((a, b) => {
    if (orderBy === 'Name') {
      return order === 'asc' ? a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name);
    }
    return 0;
  });

  return (
    <Paper>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filterText}
        onChange={handleFilterChange}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'Name' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'Name'}
                  direction={orderBy === 'Name' ? order : 'asc'}
                  onClick={() => handleRequestSort('Name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'Email' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'Email'}
                  direction={orderBy === 'Email' ? order : 'asc'}
                  onClick={() => handleRequestSort('Email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Date</TableCell> {/* New Date Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.Email}</TableCell>
                  <TableCell>{row.Message}</TableCell>
                  <TableCell>{row.PhoneNumber}</TableCell>
                  <TableCell>{row.Date}</TableCell> {/* Display the Date */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
