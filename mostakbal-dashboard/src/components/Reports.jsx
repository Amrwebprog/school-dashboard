import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { ProjectContext } from './GlobalContext';
import logo from '../assets/WhatsApp_Image_2024-09-19_at_07.54.16_9ef7e240-removebg-preview.png'

export default function Report(props) {
  const { allReport } = useContext(ProjectContext);
  const [flor, setFlor] = useState([]);
  const [showDoc, setShowDoc] = useState(false);
  const [reportData , setReportData] = useState([])


  const ShowPaper = (iD) => {
    
    const Reportinfo = flor.filter((el, index) => {
      return index === iD;
    });
   
    setReportData(Reportinfo)
   setShowDoc(true)
    
  };

  const filterData = () => {
    const floordata = allReport.filter((el) => {
     
      switch (props.ReportType) {
        case 'ground':
          return el.ReportType === 'LandFloor';
        case 'SecondFloor':
          return el.ReportType === 'secondFloor';
        case 'ThirdFloor':
          return el.ReportType === 'ThirdFloor';
        case 'FourthFloor':
          return el.ReportType === 'FourthFloor';
        case 'adminstrator':
          return el.ReportType === 'adminstrator';
        default:
          return false; // Ensure the default case returns false
      }
    });
    setFlor(floordata);
  };
  

  const rows = [...flor];

  useEffect(() => {
    filterData();
  }, [allReport, props.ReportType]);

  return (
    <>
      {showDoc && (reportData.map((el , index)=>{
        return(
         <div className='col-12 h-100 d-flex justify-content-center align-items-center z-3 top-0 start-0 end-0 position-fixed h-100 gray-overlay'>
         <div className='paper border bg-light col-10 d-flex gap-3 flex-column align-items-center p-4'>
           <div className='wordborder col-12 h-100 d-flex flex-column'>
             <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDoc(false)}></button>
             <img className='schoollogo' src={logo} alt="School Logo" />
             <h1 className='d-flex col-12 justify-content-center'><u>{el.ReportHeader}</u></h1>
             <div className="line col-12"></div>
             <h3 className='text-start'><u>Report type:</u> <b>{el.ReportType}</b></h3>
             <h5>{el.ReportBody}</h5>
           </div>
         </div>
       </div>
       )  
      })
       
      )}

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='center'>Report Name</TableCell>
              <TableCell align='center'>Report Type</TableCell>
              <TableCell align='center'>Date</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.ReportHeader}
                </TableCell>
                <TableCell align="center">{row.ReportType}</TableCell>
                <TableCell align="center">{row.Date}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => {
                    ShowPaper(index);
                  }}>
                    Show Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
