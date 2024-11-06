import { faGraduationCap, faPeopleGroup, faPersonChalkboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paper, Typography } from '@mui/material';
import { Box, Grid } from '@mui/system';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { db } from '../firestoredb';

export default function MyDashBoard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [studentAttendence , setStudentAttendence] = useState([]);
  const [studentsWhoAttended , setStudentsWhoAttended] =useState([]);


  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${year}-${month}-${day}`; // الصيغة YYYY-MM-DD
    setCurrentDate(formattedDate);
  };

  const getAttendenceData = async () => {
    if (currentDate) {
      console.log(`Fetching data from collection: ${currentDate}`);
      
      try {
        const q = query(collection(db, currentDate)); // استخدم currentDate كاسم للكولكشن
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log("No documents found for this date.");
        } else {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          setStudentAttendence(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  
  // استخدام useEffect لمراقبة studentAttendence وتحديث studentsWhoAttended عند تحديثها
  useEffect(() => {
    const attendedStudents = studentAttendence.filter((el) => el.attendance === true);
    setStudentsWhoAttended(attendedStudents);
    console.log("Students who attended:", attendedStudents);
  }, [studentAttendence]);
  

    const getData = async () => {
      if (currentDate) {
        console.log(`Fetching data from collection: ${currentDate}`);
        
        try {
          const q = query(collection(db, 'students' )); // استخدم currentDate كاسم للكولكشن
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            console.log("No documents found for this date.");
          } else {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            
            setStudentData(data);
            
            console.log("Fetched data:", data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

  useEffect(() => {
    getFormattedDate();
  }, []);

  useEffect(() => {
    if (currentDate) {
      getData();
      getAttendenceData()
    }
  }, [currentDate]);

  useEffect(() => {
    const targetCount = 25;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && studentData.length > 0) { // انتظر حتى يتم تحميل بيانات الطلاب
          increaseCount(setEmployeeCount, targetCount);
          increaseCount(setTeacherCount, targetCount);
          increaseCount(setStudentCount, studentData.length);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    const target = document.getElementById('statistics-section');
    if (target) observer.observe(target);
  
    return () => {
      observer.disconnect();
    };
  }, [studentData.length]); 
  

  const increaseCount = (setter, target) => {
    let start = 0;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / target));

    const interval = setInterval(() => {
      start += 1;
      setter(start);

      if (start >= target) {
        clearInterval(interval);
      }
    }, stepTime);
  };

  const didnotcome = studentAttendence.length - studentsWhoAttended.length
  const come = studentsWhoAttended.length
  // بيانات الرسم البياني
  const data = [
    { id: 'حضر', value: come , label: 'حضر' },
    { id: "لم يحضر", value: didnotcome , label: 'لم يحضروا' },
  ];

  const COLORS = ['#0088FE', '#00C49F'];
  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Grid container spacing={3} id="statistics-section">
          <Grid size={{ xs: 12,sm:12, md:4 , lg:4 }} >
            <Paper elevation={24} sx={{ background: 'blue', flexWrap: 'wrap', paddingY: '40px', color: 'white', paddingX: '35px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '50px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FontAwesomeIcon icon={faPeopleGroup} />
                <Typography variant='body2'>Employees</Typography>
              </Box>
              <Box>
                <Typography variant='h4'>{employeeCount}</Typography>
              </Box>
              <Box className="line" sx={{ width: '100%', background: '#FFBD2E' }}></Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12,sm:12, md:4 , lg:4 }} >
            <Paper elevation={24} sx={{ background: 'blue', flexWrap: 'wrap', paddingY: '40px', color: 'white', paddingX: '35px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '50px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FontAwesomeIcon icon={faPersonChalkboard} />
                <Typography variant='body2'>Teachers</Typography>
              </Box>
              <Box>
                <Typography variant='h4'>{teacherCount}</Typography>
              </Box>
              <Box className="line" sx={{ width: '100%', background: '#FFBD2E' }}></Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} size={{ xs: 12,sm:12, md:4 , lg:4 }} >
            <Paper elevation={24} sx={{ background: 'blue', flexWrap: 'wrap', paddingY: '40px', color: 'white', paddingX: '35px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '50px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FontAwesomeIcon icon={faGraduationCap} />
                <Typography variant='body2'>Students</Typography>
              </Box>
              <Box>
                <Typography variant='h4'>{studentCount}</Typography>
              </Box>
              <Box className="line" sx={{ width: '100%', background: '#FFBD2E' }}></Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={3} sx={{ marginTop: '40px' }}>
          <Grid size={{ xs: 12,sm:12, md:4 , lg:4 }} > 
            <Paper sx={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <Typography variant='h6'>Student attendance rate</Typography>
              <Typography variant='h6'>{studentData.length} \ {studentsWhoAttended.length}</Typography>

              <PieChart width={300} height={500} style={{ padding: '20px', background: '#f0f0f0', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
  <Pie
    data={data}
    dataKey="value"
    cx="50%"
    cy="50%"
    innerRadius={100}
    outerRadius={150}
    fill="#8884d8"
    paddingAngle={5}
    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // عرض اسم الحقل مع النسبة المئوية
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12,sm:12, md:8 , lg:8 }} > 
            <Paper sx={{ width: '100%', padding: '16px' }}>
              <Typography variant='h2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, distinctio commodi. Nulla velit, consequuntur rem, nisi labore nesciunt minus ea molestiae iste culpa quisquam maiores. Placeat explicabo voluptate cumque quisquam.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
