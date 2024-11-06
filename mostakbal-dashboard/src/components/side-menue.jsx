import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faSignOutAlt, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css'; // تأكد من استيراد أنماط AOS
import { db } from '../firestoredb';
import { collection, getDocs } from "firebase/firestore"; 
import Swal from 'sweetalert2';
import Report from './Reports';
import Navbar from './navbar';
import OwnerShowEmployee from './ownerShowEmployee';
import MyDashBoard from './MyDashBoard';

export default function SideMenue() {
    const Date = useRef();
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [showStudentAttendance, setShowStudentAttendance] = useState(false);
    const [showFloorMenue, setShowFloorMenue] = useState(false);
    const [studentAttendence, SetstudentAttendence] = useState(false);
    const [employeeAttendence, SetemployeeAttendence] = useState(false);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [Reports , setReports]= useState(false)
    const [typeOfProps , setTypeOfProps] = useState(false)
    const [myDashboard , setMyDashboard] = useState(false)
    
    

    const fetchCollection = async (collectionName) => {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName)); // استعلام لجلب الوثائق
            const documents = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // تحويل الوثائق إلى مصفوفة من الكائنات
            return documents; // إرجاع الوثائق
        } catch (error) {
            console.error("Error fetching collection: ", error); // طباعة الأخطاء في حالة وجودها
            return []; // إرجاع مصفوفة فارغة في حالة حدوث خطأ
        }
    };

    const handleDateChange = () => {
        const ChosendDate = Date.current.value; // الحصول على القيمة من حقل الإدخال
        if (ChosendDate) {
            getAttendances(ChosendDate); // استدعاء الدالة لجلب البيانات عند تغيير التاريخ
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'يرجى اختيار تاريخ',
                text: 'الرجاء تحديد تاريخ لاستخدامه.',
            });
        }
    };
    
    const ToggleReports= (ReportType)=>{
        setTypeOfProps(ReportType)
        console.log(ReportType)
        setReports(true)
        SetstudentAttendence(false);
        SetemployeeAttendence(false);
        

    }
    
    const handleLogOut = ()=>{
        localStorage.removeItem('userType')
        window.location.reload()
    }

    const getAttendances = async (ChosendDate) => {
        setLoading(true)
        Swal.fire({
            title: "تم اختيار التاريخ",
            text: `تم اختيار التاريخ: ${ChosendDate}`,
            icon: "info",
            confirmButtonText: "موافق",
        });

        const attendances = await fetchCollection(ChosendDate); // استدعاء الدالة لجلب بيانات الحضور
        if (attendances.length > 0) {
            setLoading(false)
            Swal.fire({
                title: "بيانات الحضور",
                text: "تم جلب البينات بنجاح ",
                icon: "success",
                confirmButtonText: "موافق",
            });
            setStudentsData(attendances)
            const uniqueClasses=[...new Set(attendances.map(el => el.class))]
            setClasses(uniqueClasses)
            console.log(classes)
        } else {
            setLoading(false)
            Swal.fire({
                icon: 'error',
                title: 'لا توجد بيانات',
                text: 'لا توجد بيانات لحضور الطلاب في هذا التاريخ.',
            }); 
        }
    };
    useEffect(() => {
        console.log(classes); // سيتم طباعة القيمة المحدثة لـ classes
    }, [classes]);
    const showemployeeData = () => {
        SetemployeeAttendence(!employeeAttendence);
        setMyDashboard(false)
        SetstudentAttendence(false);
        setReports(false)
 
    };

    const showStudentData = () => {
        SetstudentAttendence(!studentAttendence);
        SetemployeeAttendence(false);
        setMyDashboard(false)
        setReports(false)
    };
    const ToogleDashbaord =()=>{
        setMyDashboard(!myDashboard)
        SetstudentAttendence(false)
        SetemployeeAttendence(false);
        setReports(false) 
    }

    const toggleFloorMenue = () => {

        setShowFloorMenue(!showFloorMenue);
    };

    const toggleAttendance = () => {
        setShowStudentAttendance(!showStudentAttendance);
        setReports(false)
        SetstudentAttendence(false)
        setMyDashboard(false)
    };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className="app">
              {loading && (
                    <div className="overlay">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            {!isSidebarVisible && (
                <button className="btn btn-outline-light text-black" onClick={toggleSidebar}>
                    Show Menu
                </button>
            )}
            <div className={`sidebar bg-dark overflow-auto ${isSidebarVisible ? '' : 'sidebar-hidden'}`}>
                <div className="sidebar-header">
                    <h4 className="text-white">القائمة</h4>
                    <button className="btn btn-outline-light" onClick={toggleSidebar}>
                        {isSidebarVisible ? 'إخفاء القائمة' : 'إظهار القائمة'}
                    </button>
                </div>
                <ul className="list-unstyled components">
                <li data-aos="fade-up" data-aos-delay="400">
                        <a className="p-2 border rounded d-flex gap-3"  onClick={ToogleDashbaord}> 
                        <FontAwesomeIcon icon={faChartSimple}/>
                            DashBoard
                        </a>
                    </li>
                    <li className='animate__animated animate__backInUp' data-aos-delay="100">
                        <a className="p-2 border rounded d-flex gap-3" onClick={toggleAttendance}>
                            <FontAwesomeIcon icon={faHome} />
                            Attendance
                        </a>
                        {showStudentAttendance && (
                            <ul className='list-unstyled components'>
                                <li className='animate__animated animate__backInUp' data-aos-delay="100">
                                    <a className="p-2 border rounded d-flex gap-3" onClick={showemployeeData}>
                                        Employee Attendance
                                    </a>
                                </li>
                                <li className='animate__animated animate__backInUp' data-aos-delay="100">
                                    <a className="p-2 border rounded d-flex gap-3" onClick={showStudentData}>
                                        Student Attendance
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className='animate__animated animate__backInUp' data-aos-delay="100">
                        <a className="p-2 border rounded d-flex gap-3" onClick={toggleFloorMenue}>
                            <FontAwesomeIcon icon={faUser} />
                            Floor Reports
                        </a>
                        {showFloorMenue && (
                            <ul className='list-unstyled components'>
                                <li className='animate__animated animate__backInUp' data-aos-delay="100">
                                    <a className="p-2 border rounded d-flex gap-3" onClick={()=>{
                                        ToggleReports("ground")
                                    }}>
                                        Ground Floor
                                    </a>
                                </li>
                                <li className='animate__animated animate__backInUp' data-aos-delay="100">
                                    <a className="p-2 border rounded d-flex gap-3" onClick={()=>{
                                        ToggleReports("SecondFloor")
                                    }}>
                                        
                                        Second Floor
                                    </a>
                                </li>
                                <li className='animate__animated animate__backInUp' data-aos-delay="100">
                                    <a className="p-2 border rounded d-flex gap-3" onClick={()=>{
                                        ToggleReports("ThirdFloor")
                                    }} >
                                        Third Floor
                                    </a>
                                </li>
                                <li className='animate__animated animate__backInUp' data-aos-delay="100">
                                    <a className="p-2 border rounded d-flex gap-3" onClick={()=>{
                                        ToggleReports("FourthFloor")
                                    }} >
                                        Fourth Floor
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className='animate__animated animate__backInUp' data-aos-delay="100">
                        <a className="p-2 border rounded d-flex gap-3" onClick={()=>{
                                        ToggleReports("adminstrator")
                                    }} >
                            <FontAwesomeIcon icon={faCog} />
                            Administrative Reports
                        </a>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="400">
                        <a className="p-2 border rounded d-flex gap-3" onClick={handleLogOut}> 
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            Logout
                        </a>
                    </li>
                </ul>
            </div>

            {/* المحتوى الرئيسي */}
            <div className={`content ${isSidebarVisible ? '' : 'full-width'}`}>
                <div className="container">
                    <Navbar/>
                    <h1 className='animate__animated animate__backInUp animate__slow fs-3' >Welcome to Our Dashboard</h1>
                    {studentAttendence && (
                        <>
                            <h1>This is student attendance data</h1>
                            <div className="col-12 d-flex flex-column align-items-center">
                                <div className='col-12 d-flex flex-column align-items-center mt-2'>
                                    <label htmlFor="Date" className='fs-4'>chose the date</label>
                                    <input 
                                        type="date" 
                                        name='Date' 
                                        id='Date' 
                                        ref={Date} 
                                        className='btn btn-danger' 
                                        onChange={handleDateChange} // استدعاء الدالة عند تغيير التاريخ
                                    />
                                    <div className='mt-2 d-flex flex-column col-12 justify-content-center align-items-center'>
                                    {classes ? classes.map((el,index)=>{
                                        const updatedClassItem = /^\d/.test(el) ? `primary ${el}` : el;
                                       return <>
                                            <div className='d-flex flex-column justify-content-center align-items-center gap-3'>
                                                <h2 key={index}>{updatedClassItem}</h2>
                                                <table className="table table-success table-striped">
<thead>
<tr>
     <td>attendance</td>
     <td>StudentName</td>
     <td>gender</td>
     <td>Reason for absence</td>
     <td>class</td>
     <td>comments</td>
 </tr>
</thead>
<tbody>
     {studentsData.filter((student)=>student.class === el).map((el , index)=>{
        return (<>
        <tr>
         <td>{el.attendance === true ? <input type="checkbox" disabled checked />: <input type="checkbox" disabled  />}</td>
         <td>{el.studentname}</td>
         <td>{el.type}</td>
         <td>{el.attendanceReason ? el.attendanceReason : "No Comment"}</td>
         <td>{el.class}</td>
         <td>{el.note ? el.note : "No comment"}</td>
     </tr>
        
        
        
        </>)
     })}
</tbody>
</table>
                                            </div>
                                           
                                        
                                        </>
                                    }): null}
                                   
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {employeeAttendence && (
                        <>
                         <OwnerShowEmployee/>
                        </>
                    )}
                    {Reports && <><Report ReportType={typeOfProps}/></>}
                    {myDashboard && (
                        <>
                        <MyDashBoard />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
