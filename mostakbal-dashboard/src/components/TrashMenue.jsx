import React, { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCog,
  faSignOutAlt,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "aos/dist/aos.css";

import AOS from "aos"; // استيراد JS لـ AOS
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore"; // Firestore imports
import Swal from "sweetalert2";
import { db } from "../firestoredb";
import logo from "../../src/assets/WhatsApp_Image_2024-09-19_at_07.54.16_9ef7e240-removebg-preview.png";

import { Fab, Menu, MenuItem, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SideMenue() {
  const branch = useRef();
  const embloyeJob = useRef();
  const fname = useRef();
  const sname = useRef();
  const lname = useRef();
  const jobTitle = useRef();
  const studentName = useRef();
  const studentClass = useRef();
  const studentGender = useRef();
  const docRef = useRef();
  const [studentsData, setStudentsData] = useState([]);
  const [classes, setClasses] = useState([]); // حالة جديدة للفصول
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [showStudentForm, setShowSudentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStudentEdit, setShowStudentEdit] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPaper, setSHowPaper] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [anchorEl, setanchorEl] = useState(null);
  const [paperData, setPaperData] = useState();
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showAllEmployee, setShowAllEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [job, setJob] = useState([]);

  const ReportHeader = useRef();
  const ReportParagraph = useRef();
  const ReportType = useRef();
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";

  const toggleShowAllEmployee = () => {
    setShowAllEmployee(!showAllEmployee);
    setShowSudentForm(false);
    setShowReportForm(false);
    setShowStudentEdit(false);
    setShowEmployeeForm(false);
    getEmloyee();
  };

  const toogleEmployee = () => {
    setShowEmployeeForm(!showEmployeeForm);
    setShowSudentForm(false);
    setShowReportForm(false);
    setShowStudentEdit(false);
    setShowAllEmployee(false);
  };

  const handleMenuClose = (event) => {
    setanchorEl(null);
    event.stopPropagation();
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose(event), handleDownloadPDF(event);
        }}
      >
        Download Report as PDF
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>open Edit mode</MenuItem>
      <MenuItem onClick={()=>{
        setSHowPaper(!showPaper)
      }}>Exit</MenuItem>
    </Menu>
  );

  const handleProfileMenuOpen = (event) => {
    setanchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: 10,

    right: 1200,
    margin: "0 auto",
  });

  const GetStudent = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "students"));
    const studentsArray = [];

    querySnapshot.forEach((doc) => {
      studentsArray.push({ id: doc.id, ...doc.data() }); // إضافة بيانات الطالب إلى المصفوفة
    });

    setStudentsData(studentsArray); // تحديث حالة الطلاب
    setLoading(false);
  };
  const getEmloyee = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "employee"));
    const employeeArray = [];

    querySnapshot.forEach((doc) => {
      employeeArray.push({ id: doc.id, ...doc.data() }); // إضافة بيانات الطالب إلى المصفوفة
    });

    setEmployeeData(employeeArray); // تحديث حالة الطلاب
    setLoading(false);
    console.log(employeeData);
  };

  const toggleShowReport = () => {
    setShowReportForm(!showReportForm);
    setShowStudentEdit(false);
    setShowSudentForm(false);
    setShowEmployeeForm(false);
    setShowAllEmployee(false);
  };
  const toggleChangeStudent = async (userID) => {
    const studentData = studentsData.find((el) => el.studentname === userID);

    console.log(studentData);
    Swal.fire({
      title: "Edit student details",
      html:
        `<div class"col-8 d-flex justify-content-center align-items-center gap-3">` +
        `<input value="${studentData.studentname}" id="swal-input1" class="swal2-input col-6 mb-5" placeholder="Student Name">` +
        `<select class="col-12">
                ${classes.map((el, idx) => {
                  return `<option key=${idx} value=${el} key={idx}>
                        ${el}
                        
                    </option>`;
                })}
                
                </select>` +
        '<select id="swal-input3" class="swal2-input col-12">' +
        '<option value="" disabled>Select Gender</option>' +
        '<option value="male" ' +
        (studentData.gender === "male" ? "selected" : "") +
        ">Male</option>" +
        '<option value="female" ' +
        (studentData.gender === "female" ? "selected" : "") +
        ">Female</option>" +
        "</select>" +
        `</div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: () => {
        const studentName = document.getElementById("swal-input1").value;
        const studentClass = document.getElementById("swal-input2").value;
        const gender = document.getElementById("swal-input3").value;

        if (!studentName || !studentClass || !gender) {
          Swal.showValidationMessage("Please fill out all fields");
          return false;
        }

        return {
          studentName,
          studentClass,
          gender,
        };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const { studentName, studentClass, gender } = result.value;

        // عرض SweetAlert آخر للتأكيد
        Swal.fire({
          title: "Confirm Changes",
          text: `Are you sure you want to update the details to:\nName: ${studentName}\nClass: ${studentClass}\nGender: ${gender}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "No, cancel!",
        }).then(async (confirmResult) => {
          if (confirmResult.isConfirmed) {
            // تحديث بيانات الطالب في Firebase
            const studentDocRef = doc(db, "students", studentData.id); // استبدل studentData.id بمحدد المستند الصحيح

            try {
              await updateDoc(studentDocRef, {
                studentname: studentName,
                class: studentClass,
                gender: gender,
              });

              Swal.fire({
                title: "Student Details Updated",
                text: `Name: ${studentName}, Class: ${studentClass}, Gender: ${gender}`,
                icon: "success",
              });
              GetStudent();
            } catch (error) {
              console.error("Error updating student details:", error);
              Swal.fire(
                "Error",
                "There was an error updating the student details. Please try again.",
                "error"
              );
            }
          }
        });
      }
    });
  };
  const toggleChangeEmployeex = async (employeeID) => {
    const EmployeeData = employeeData.find((el) => el.employeeName === employeeID);
    const uniqueTitle = [
        ...new Set(employeeData.map((Title) => Title.employeeTitle)),
    ];
    const uniqueBranch = [...new Set(employeeData.map((branch) => branch.employeeBranch ))];
    console.log(EmployeeData);
    Swal.fire({
        title: "Edit student details",
        html:
        `<div class="container p-3 d-flex flex-column align-items-center gap-4">` +
            `<div class="form-group w-100">
                <label for="swal-input1" class="form-label">Student Name</label>
                <input value="${EmployeeData.employeeName}" id="swal-input1" class="swal2-input w-100 mb-3" placeholder="Student Name">
            </div>` +
            `<div class="form-group w-100">
                <label for="swal-select-branch" class="form-label">Branch</label>
                <select id="swal-select-branch" class="form-select w-100 mb-3">
                    ${uniqueBranch.map((branch, idx) => {
                        return `<option key=${idx} value="${branch}">
                            ${branch}
                        </option>`;
                    }).join('')}
                </select>
            </div>` +
            `<div class="form-group w-100">
                <label for="swal-select-job" class="form-label">Job</label>
                <select id="swal-select-job" class="form-select w-100 mb-3">
                    ${job.map((jobTitle, idx) => {
                        return `<option key=${idx} value="${jobTitle}">
                            ${jobTitle}
                        </option>`;
                    }).join('')}
                </select>
            </div>` +
            `<div class="form-group w-100">
                <label for="swal-select-title" class="form-label">Job Title</label>
                <select id="swal-select-title" class="form-select w-100 mb-3">
                    ${uniqueTitle.map((title, idx) => {
                        return `<option key=${idx} value="${title}">
                            ${title}
                        </option>`;
                    }).join('')}
                </select>
            </div>` +
        `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Submit",
        preConfirm: () => {
            const employeeName = document.getElementById("swal-input1").value;
            const employeeJob = document.getElementById("swal-select-job").value;
            const employeeTitle = document.getElementById("swal-select-title").value;
            const employeeBranch = document.getElementById("swal-select-branch").value;

            if (!employeeName || !employeeJob || !employeeTitle || !employeeBranch) {
                Swal.showValidationMessage("Please fill out all fields");
                return false;
            }

            return {
                employeeName,
                employeeJob,
                employeeTitle,
                employeeBranch,
            };
        },
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        if (result.isConfirmed) {
            const { employeeName, employeeJob, employeeTitle , employeeBranch } = result.value;

            // عرض SweetAlert آخر للتأكيد
            Swal.fire({
                title: "Confirm Changes",
                text: `Are you sure you want to update the details to:\nEmployee Name: ${employeeName}\nEmployee Job: ${employeeJob}\nEmployee Title: ${employeeTitle}\nBranch: ${employeeBranch}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "No, cancel!",
            }).then(async (confirmResult) => {
                if (confirmResult.isConfirmed) {
                    // تحديث بيانات الطالب في Firebase
                    const employeeDocRef = doc(db, "employee", EmployeeData.id);

                    try {
                        await updateDoc(employeeDocRef, {
                            employeeBranch: employeeBranch,
                            employeeJob: employeeJob,
                            employeeName: employeeName,
                            employeeTitle: employeeTitle,
                        });

                        Swal.fire({
                            title: "Employee Details Updated",
                            text: `Name: ${employeeName}, Job: ${employeeJob}, Title: ${employeeTitle} , Branch: ${employeeBranch}`,
                            icon: "success",
                        });
                        getEmloyee();
                    } catch (error) {
                        console.error("Error updating student details:", error);
                        Swal.fire(
                            "Error",
                            "There was an error updating the student details. Please try again.",
                            "error"
                        );
                    }
                }
            });
        }
    });
};

  const toggleDeleteStudent = async (userID) => {
    const studentData = studentsData.find((el) => el.studentname === userID);

    // تحقق من وجود بيانات الطالب
    if (!studentData) {
      Swal.fire("خطأ", "لم يتم العثور على بيانات الطالب.", "error");
      return;
    }

    // عرض SweetAlert للتأكيد على المسح
    Swal.fire({
      title: "تأكيد المسح",
      text: `هل أنت متأكد أنك تريد مسح الطالب: ${studentData.studentname}؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "لا، ألغي!",
    }).then(async (confirmResult) => {
      if (confirmResult.isConfirmed) {
        const studentDocRef = doc(db, "students", studentData.id); // استبدل studentData.id بمحدد المستند الصحيح

        try {
          // قم بحذف الطالب من Firestore
          await deleteDoc(studentDocRef);

          Swal.fire({
            title: "تم الحذف",
            text: `تم حذف الطالب: ${studentData.studentname} بنجاح.`,
            icon: "success",
          });
          GetStudent();
        } catch (error) {
          console.error("حدث خطأ أثناء حذف بيانات الطالب:", error);
          Swal.fire(
            "خطأ",
            "حدث خطأ أثناء حذف بيانات الطالب. حاول مرة أخرى.",
            "error"
          );
        }
      }
    });
  };
  const toggleDeleteEmployee = async (EmployeeID) =>{
    const EmployeeData = employeeData.find((el) => el.employeeName === EmployeeID);

    // تحقق من وجود بيانات الطالب
    if (!EmployeeData) {
      Swal.fire("خطأ", "لم يتم العثور على بيانات الموظف.", "error");
      return;
    }

    // عرض SweetAlert للتأكيد على المسح
    Swal.fire({
      title: "تأكيد المسح",
      text: `هل أنت متأكد أنك تريد مسح الموظف: ${EmployeeData.employeeName}؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "لا، ألغي!",
    }).then(async (confirmResult) => {
      if (confirmResult.isConfirmed) {
        const EmployeeDocRef = doc(db, "employee", EmployeeData.id); // استبدل studentData.id بمحدد المستند الصحيح

        try {
          // قم بحذف الطالب من Firestore
          await deleteDoc(EmployeeDocRef);

          Swal.fire({
            title: "تم الحذف",
            text: `تم حذف الموظف: ${EmployeeData.employeeName} بنجاح.`,
            icon: "success",
          });
          getEmloyee();
        } catch (error) {
          console.error("حدث خطأ أثناء حذف بيانات الموظف:", error);
          Swal.fire(
            "خطأ",
            "حدث خطأ أثناء حذف بيانات الموظف. حاول مرة أخرى.",
            "error"
          );
        }
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const selectedDate = document.querySelector("#StudentDate").value; // احصل على التاريخ من حقل الإدخال

    // تحقق مما إذا كان selectedDate صالحًا
    if (!selectedDate) {
      alert("يرجى تحديد تاريخ."); // إخطار المستخدم بضرورة تحديد تاريخ
      setLoading(false);
      return; // الخروج من الدالة مبكرًا
    }

    const attendanceData = studentsData.map((student) => {
      const checkbox = document.querySelector(
        `input[type="checkbox"][data-student="${student.studentname}"]`
      );
      const isChecked = checkbox ? checkbox.checked : false;
      return {
        attendance: isChecked,
        attendanceReason: isChecked ? "حاضر" : "غايب",
        class: student.class,
        date: selectedDate,
        note: isChecked ? "مش غايب" : "حاضر",
        studentname: student.studentname,
        type: student.gender,
      };
    });

    try {
      // أضف البيانات إلى Firebase لكل طالب
      for (const student of attendanceData) {
        // تأكد من أن الفصل والتاريخ ليسا فارغين
        if (!student.class) {
          console.error("الفصل غير موجود: ", student.studentname);
          continue; // تخطي إذا لم يكن الفصل صالحًا
        }

        const docRef = doc(
          collection(db, selectedDate),
          student.class + "_" + new Date().getTime()
        ); // استخدم التاريخ كاسم مجموعة مع تمييز فريد
        await setDoc(docRef, student); // أضف بيانات الطالب إلى المستند
      }
      alert("تمت إضافة البيانات بنجاح!");
    } catch (error) {
      console.error("خطأ في إضافة البيانات:", error);
    }
    setLoading(false);
  };

  const HandleEmployeeSub = async () => {
    setLoading(true);
    const selectedDate = document.querySelector("#EmployeeDate").value;

    if (!selectedDate) {
      alert("يرجى تحديد تاريخ.");
      setLoading(false);
      return;
    }

    const attendanceData = employeeData.map((employeeEl) => {
      const checkbox = document.querySelector(
        `input[type="checkbox"][data-Employee="${employeeEl.employeeName}"]`
      );
      const isChecked = checkbox ? checkbox.checked : false;
      return {
        attendance: isChecked,
        attendanceReason: isChecked ? "حاضر" : "غايب",
        branch: employeeEl.employeeBranch,
        date: selectedDate,
        note: isChecked ? "حاضر" : "غايب",
        employeeName: employeeEl.employeeName, // تصحيح الاسم
        title: employeeEl.employeeTitle, // تصحيح الاسم
        Job: employeeEl.employeeJob
      };
    });

    try {
      for (const employee of attendanceData) {
        if (!employee.branch) {
          console.error("الفرع غير موجود:", employee.employeeName); // تصحيح الرسالة
          continue;
        }

        const docRef = doc(
          collection(db, `Employee_${selectedDate}`), // إضافة كلمة "Employee" قبل التاريخ
          `${employee.branch}_${new Date().getTime()}`
        );
        await setDoc(docRef, employee);
      }
      alert("تمت إضافة البيانات بنجاح!");
    } catch (error) {
      console.error("خطأ في إضافة البيانات:", error);
    }
    setLoading(false);
  };

  const ShowReport = () => {
    event.preventDefault();
    const header = ReportHeader.current.value;
    const paragraph = ReportParagraph.current.value;
    const type = ReportType.current.value;
    if ((header, paragraph, type)) {
      const paperarray = [header, paragraph, type];
      setPaperData(paperarray);
    } else {
      null;
    }
    setSHowPaper(!showPaper);
  };

  const toggleStudentEdit = () => {
    setShowStudentEdit(!showStudentEdit);
    setShowSudentForm(false);
    setShowReportForm(false);
    setShowEmployeeForm(false);
    setShowAllEmployee(false);
    if (!showStudentEdit) {
      GetStudent();
    }
  };

  const toggleStudentForm = () => {
    setShowSudentForm(!showStudentForm);
    setShowStudentEdit(false);
    setShowReportForm(false);
    setShowEmployeeForm(false);
    setShowAllEmployee(false);
  };
  
  // دالة لإدخال بيانات الطالب في Firestore
  const insertData = async (e) => {
    e.preventDefault();

    const englishNamePattern = /^[A-Za-z\s]+$/;
    if (!englishNamePattern.test(studentName.current.value)) {
      Swal.fire(
        "خطأ",
        "الاسم يجب أن يكون مكتوبًا باللغة الإنجليزية فقط.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "students"), {
        studentname: studentName.current.value,
        class: studentClass.current.value,
        gender: studentGender.current.value,
      });

      Swal.fire("تم بنجاح!", "تم إدخال البيانات بنجاح", "success");
    } catch (error) {
      console.error("حدث خطأ أثناء إدخال البيانات:", error);
      Swal.fire("خطأ", "حدث خطأ أثناء إدخال البيانات. حاول مرة أخرى.", "error");
    } finally {
      setLoading(false);
    }
  };
  const insertReport = async () => {
    event.preventDefault();

    const header = ReportHeader.current.value.trim();
    const typeofreport = ReportType.current.value.trim();
    const ReportBody = ReportParagraph.current.value.trim();

    // Get the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US"); // Format as needed (MM/DD/YYYY)

    console.log(header, typeofreport, ReportBody, formattedDate);

    if (header && typeofreport && ReportBody) {
      setLoading(true);
      try {
        await addDoc(collection(db, "Report"), {
          ReportBody: ReportBody,
          ReportHeader: header,
          ReportType: typeofreport,
          Date: formattedDate,
          status: "pending",
        });
        Swal.fire({
          title: "تم ارسال التقرير بنجااااح ",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const InsertEmployee = async (event) => {
    event.preventDefault(); // منع التحديث الافتراضي للصفحة عند الإرسال

    const job = embloyeJob.current.value.trim();
    const Name =
      fname.current.value.trim() +
      " " +
      sname.current.value.trim() +
      " " +
      lname.current.value.trim();
    const Title = jobTitle.current.value.trim();
    const empBranch = branch.current.value.trim();

    // Regex to validate name (only letters and spaces allowed)
    const nameRegex = /^[A-Za-z\s\u0600-\u06FF]+$/; // يسمح بالحروف العربية والإنجليزية والمسافات

    console.log(Name);
    console.log(job);
    console.log(Title);
    console.log(empBranch);

    if (job && Name && Title && empBranch) {
      if (nameRegex.test(Name)) {
        // التحقق من صلاحية الاسم
        setLoading(true); // بدء عملية التحميل
        try {
          // إضافة بيانات الموظف إلى مجموعة "employee" في Firestore
          await addDoc(collection(db, "employee"), {
            employeeBranch: empBranch,
            employeeJob: job,
            employeeName: Name,
            employeeTitle: Title,
          });

          Swal.fire({
            title: "تم إضافة الموظف بنجاح",
            icon: "success",
          });
        } catch (error) {
          console.log("Error adding employee:", error);
          Swal.fire({
            title: "حدث خطأ أثناء إضافة الموظف",
            icon: "error",
          });
        } finally {
          setLoading(false); // إنهاء عملية التحميل
        }
      } else {
        Swal.fire({
          title: "الاسم غير صالح. يجب أن يحتوي فقط على حروف.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "يرجى ملء جميع الحقول",
        icon: "error",
      });
    }
  };

  const handleDownloadPDF = (event) => {
    event.preventDefault();

    if (docRef.current) {
      html2canvas(docRef.current, { scale: 2 }) // استخدم معامل تكبير
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();

          // ضبط الأبعاد بشكل دقيق
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
          pdf.save("download.pdf");
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
        });
    } else {
      console.error("docRef.current is null or undefined");
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);
  useEffect(() => {
    // إعداد IntersectionObserver للـ sidebar
    const sidebar = document.querySelector(".sidebar.overflow-auto");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
          } else {
            entry.target.classList.remove("aos-animate");
          }
        });
      },
      { root: sidebar, threshold: 0.1 }
    );

    // مراقبة العناصر
    const items = document.querySelectorAll("[data-aos]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect(); // تنظيف المراقب عند إلغاء المكون
  }, [isSidebarVisible]);

  // تحديث الفصول بشكل فريد
  useEffect(() => {
    if (studentsData.length > 0) {
      const uniqueClasses = [
        ...new Set(studentsData.map((student) => student.class)),
      ];
      setClasses(uniqueClasses);
    }
  }, [studentsData]); // تحديث الفصول عندما تتغير بيانات الطلاب

  useEffect(() => {
    if (employeeData.length > 0) {
      const uniqueJobs = [
        ...new Set(employeeData.map((job) => job.employeeJob)),
      ];
      setJob(uniqueJobs);
      console.log(job);
    }
  }, [employeeData]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="app">
      {loading && (
        <div className="overlay">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!isSidebarVisible ? (
        <button
          className="btn btn-outline-light text-black"
          onClick={toggleSidebar}
        >
          Show Menu
        </button>
      ) : null}

      <div
        className={`sidebar overflow-auto ${
          isSidebarVisible ? "" : "sidebar-hidden"
        }`}
      >
        <div className="sidebar-header">
          <h4 className="text-white">القائمة</h4>
          <button className="btn btn-outline-light" onClick={toggleSidebar}>
            {isSidebarVisible ? "إخفاء القائمة" : "إظهار القائمة"}
          </button>
        </div>
        <ul className="list-unstyled components">
          <li data-aos="fade-up" data-aos-delay="100">
            <a className="p-2 border rounded" onClick={toggleStudentForm}>
              <FontAwesomeIcon icon={faHome} /> اضافة طالب
            </a>
          </li>
          <li data-aos="fade-up">
            <a
              onClick={toggleStudentEdit}
              className="p-3 border rounded"
              href="#"
            >
              <FontAwesomeIcon icon={faUser} /> اضافة و تعديل غياب الطلاب اليوم
            </a>
          </li>
          <li data-aos="fade-up">
            <a
              onClick={toggleShowReport}
              className="p-3 border rounded"
              href="#"
            >
              <FontAwesomeIcon icon={faCog} /> اضافة تقرير
            </a>
          </li>
          <li data-aos="fade-up">
            <a className="p-2 border rounded" href="#" onClick={toogleEmployee}>
              <FontAwesomeIcon icon={faCog} /> اضافة موظف
            </a>
          </li>
          <li data-aos="fade-up" data-aos-delay="400">
            <a
              className="p-2 border rounded"
              href="#"
              onClick={toggleShowAllEmployee}
            >
              <FontAwesomeIcon icon={faCog} /> اضافة و تعديل غياب الموظف اليوم
            </a>
          </li>
          <li data-aos="fade-up">
            <a className="p-2 border rounded" href="#">
              <FontAwesomeIcon icon={faSignOutAlt} /> تسجيل الخروج
            </a>
          </li>
        </ul>
      </div>

      <div className={`content ${isSidebarVisible ? "" : "full-width"}`}>
        <div className="container">
          <h1>مرحبًا بك في لوحة التحكم</h1>
          {showStudentForm ? (
            <form
              className="mt-5 p-4 border rounded bg-light shadow"
              onSubmit={insertData}
            >
              <h1 className="text-danger">
                برجاء ادخال اسم الطالب باللغة الانجليزية
              </h1>
              <div className="form-group mb-3">
                <label htmlFor="studentName">اسم الطالب</label>
                <input
                  ref={studentName}
                  type="text"
                  className="form-control"
                  id="studentName"
                  placeholder="أدخل اسم الطالب"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="classRoom">الفصل</label>
                <select
                  ref={studentClass}
                  className="form-select"
                  id="classRoom"
                  required
                >
                  <option selected disabled id="select-class">
                    اختر الفصل
                  </option>
                  <optgroup label="KG 1">
                    <option value="Moana">Moana</option>
                    <option value="Trolls">Trolls</option>
                    <option value="Brave">Brave</option>
                  </optgroup>
                  <optgroup label="KG 2">
                    <option value="Peter pan">Peter pan</option>
                    <option value="Snowwhite">Snowwhite</option>
                    <option value="Mowgli">Mowgli</option>
                    <option value="Crackers">Crackers</option>
                  </optgroup>
                  <optgroup label="Primary">
                    <option value="1a">1a</option>
                    <option value="1b">1b</option>
                    <option value="1c">1c</option>
                    <option value="2a">2a</option>
                    <option value="2b">2b</option>
                    <option value="2c">2c</option>
                    <option value="3a">3a</option>
                    <option value="3b">3b</option>
                    <option value="3c">3c</option>
                    <option value="4a">4a</option>
                    <option value="4b">4b</option>
                    <option value="4c">4c</option>
                    <option value="4d">4d</option>
                    <option value="5a">5a</option>
                    <option value="5b">5b</option>
                    <option value="5c">5c</option>
                    <option value="6a">6a</option>
                    <option value="6b">6b</option>
                  </optgroup>
                  <optgroup label="Prep">
                    <option value="prep1a">1a</option>
                    <option value="prep2a">2a</option>
                    <option value="prep2b">2b</option>
                    <option value="prep3">3</option>
                  </optgroup>
                  <optgroup label="High">
                    <option value="sec1">sec1</option>
                    <option value="sec2">sec2</option>
                    <option value="sec3">sec3</option>
                  </optgroup>
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="studentGender">النوع</label>
                <select
                  ref={studentGender}
                  className="form-select"
                  id="studentGender"
                  required
                >
                  <option selected disabled>
                    اختر النوع
                  </option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                إدخال البيانات
              </button>
            </form>
          ) : null}

          {showStudentEdit && (
            <div>
              <h2>تعديل الطلاب و اضافة الغياب</h2>
              <div className="d-flex col-12 justify-content-center align-items-center mb-3 ">
                <input
                  className="btn btn-danger"
                  id="StudentDate"
                  type="date"
                />
              </div>

              <ul className="d-flex flex-column overflow-auto col-12 align-items-center">
                {classes.length > 0 ? (
                  classes.map((classItem, index) => {
                    // التحقق مما إذا كان اسم الفصل يبدأ برقم
                    const updatedClassItem = /^\d/.test(classItem)
                      ? `primary ${classItem}`
                      : classItem;

                    return (
                      <li key={index} className="w-100 mb-4">
                        <h3 className="text-center">{updatedClassItem}</h3>

                        {/* عرض الجدول للطلاب في هذا الفصل */}
                        <table className="table table-bordered table-striped col-12 overflow-auto">
                          <thead>
                            <tr>
                              <th>الحضور</th>
                              <th>اسم الطالب</th>
                              <th>النوع</th> {/* هذا هو العمود المخصص للنوع */}
                              <th>سبب الغياب</th>
                              <th>الفصل</th>
                              <th>ملاحظات</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentsData
                              .filter((student) => student.class === classItem)
                              .map((student, index) => (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td>
                                      <input
                                        type="checkbox"
                                        data-student={student.studentname}
                                      />
                                    </td>
                                    <td>{student.studentname}</td>
                                    <td>{student.gender}</td>
                                    <td>
                                      <input
                                        type="text"
                                        style={{ outline: "none" }}
                                      />
                                    </td>
                                    <td>{student.class}</td>
                                    <td>
                                      <input
                                        type="text"
                                        style={{ outline: "none" }}
                                      />
                                    </td>
                                    <td>
                                      <div className="d-flex gap-3">
                                        <FontAwesomeIcon
                                          onClick={() => {
                                            toggleChangeStudent(
                                              student.studentname
                                            );
                                          }}
                                          className="fs-5 text-primary"
                                          style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                          }}
                                          icon={faPenToSquare}
                                        />
                                        <FontAwesomeIcon
                                          onClick={() => {
                                            toggleDeleteStudent(
                                              student.studentname
                                            );
                                          }}
                                          className="fs-5 text-danger"
                                          style={{ cursor: "pointer" }}
                                          icon={faTrash}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                          </tbody>
                        </table>
                      </li>
                    );
                  })
                ) : (
                  <p>لا توجد بيانات متاحة</p>
                )}
              </ul>
              <div className="col-12 d-flex flex-row justify-content-center mb-2">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          )}

          {showReportForm ? (
            <>
              <form className="mt-5 p-4 border rounded bg-light shadow">
                <h1 className="text-primary">This is Report Form</h1>
                <div className="form-group mb-3">
                  <label htmlFor="classRoom">اختار نوع التقرير</label>
                  <select
                    ref={ReportType}
                    className="form-select"
                    id="classRoom"
                    required
                  >
                    <option value="adminstrator">تقرير اداري</option>
                    <option value="LandFloor">تقرير الدور الارضي </option>
                    <option value="secondFloor">تقرير الدور الثاني</option>
                    <option value="ThirdFloor">تقرير الدور الثالث</option>
                    <option value="FourthFloor">تقرير الدور الرابع </option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="studentName">عنوان التقرير</label>
                  <input
                    ref={ReportHeader}
                    type="text"
                    className="form-control"
                    id="studentName"
                    placeholder="أكتب عنوان التقرير"
                    required
                  />
                </div>

                <div className="form-group mb-3 d-flex flex-column">
                  <label htmlFor="studentGender">اكتب التقرير</label>
                  <textarea
                    ref={ReportParagraph}
                    name=""
                    id="studentGender"
                    placeholder="اكتب محتوير "
                  ></textarea>
                </div>
                <div className="d-flex flex-row gap-3">
                  <button
                    onClick={insertReport}
                    type="submit"
                    className="btn btn-primary"
                  >
                    إدخال البيانات
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={ShowReport}
                  >
                    {showPaper ? "اخفاء" : "عرض"} قبل الارسال
                  </button>
                </div>
              </form>
              {showPaper ? (
                <>
                  <div
                    className="col-12 h-100 d-flex justify-content-center align-items-center z-3 top-0 start-0 end-0 position-fixed h-100 gray-overlay "
                    onClick={(event) => {
                      setSHowPaper(!showPaper);
                      event.stopPropagation();
                    }}
                  >
                    <StyledFab
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AddIcon />
                    </StyledFab>
                    {renderMenu}
                    <div
                      ref={docRef}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="paper border bg-light col-12 h-100 d-flex gap-3 flex-column align-items-center p-4"
                    >
                      <div className="wordborder overflow-auto col-12 h-100 d-flex flex-column ">
                        <button
                          type="button"
                          onClick={(event) => {
                            setSHowPaper(!showPaper);
                            event.stopPropagation();
                          }}
                          className="btn-close"
                          aria-label="Close"
                        ></button>
                        <img src={logo} className="schoollogo" />
                        <h1 className="d-flex col-12 justify-content-center">
                          <u>{paperData[0]}</u>
                        </h1>
                        <div className="line col-12"></div>
                        <h3 className="text-start">
                          <u>Report type:</u> <b>{paperData[2]}</b>{" "}
                        </h3>
                        <h5>{paperData[1]}</h5>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
          {showEmployeeForm ? (
            <>
              <h1 className="text-info">Employee Form</h1>
              <div className="card">
                <div className="col-12 p-2 d-flex flex-column gap-2">
                  <label htmlFor="EmployeBranch">Chose Employee Branch</label>
                  <select
                    className="btn btn-info"
                    name="EmployeBranch"
                    id="EmployeBranch"
                    ref={branch}
                  >
                    <option value="Branch1">Branch1</option>
                    <option value="Branch2">Branch2</option>
                    <option value="Branch3">Branch3</option>
                    <option value="Branch4">Branch4</option>
                    <option value="Branch5">Branch5</option>
                  </select>
                </div>

                <div className="col-12 p-2 d-flex flex-column gap-2">
                  <label htmlFor="EmployeJob">Chose Employee Job</label>
                  <select
                    className="btn btn-info"
                    name="EmployeJob"
                    id="EmployeJob"
                    ref={embloyeJob}
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="IT">IT</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="School-Manger">School Manger</option>
                    <option value="HR">HR</option>
                    <option value="accountant">accountant</option>
                    <option value="Head Of Stage">Head of stage</option>
                    <option value="Public relations">Public relations</option>
                    <option value="Student affairs">Student affairs</option>
                    <option value="Office manager">Office manager</option>
                    <option value="secretary">secretary</option>
                    <option value="Assistant school principal">
                      Assistant school principal
                    </option>
                    <option value="Teacher assistant">Teacher assistant</option>
                    <option value="Quran memorizer">Quran memorizer</option>
                    <option value="Social worker">Social worker</option>
                    <option value="nursing">nursing</option>
                    <option value="worker">worker</option>
                    <option value="security">security</option>
                    <option value="carpenter">carpenter</option>
                    <option value="Messaging">Messaging</option>
                    <option value="Bus Supervisor">Bus Supervisor</option>
                  </select>
                </div>
                <div className="col-12 p-2 d-flex flex-column gap-2">
                  <div className="input-group">
                    <span className="input-group-text">Full Name</span>
                    <input
                      type="text"
                      aria-label="First name"
                      ref={fname}
                      placeholder="First Name"
                      className="form-control"
                    />
                    <input
                      type="text"
                      aria-label="Last name"
                      ref={sname}
                      placeholder="Last Name"
                      className="form-control"
                    />
                    <input
                      type="text"
                      aria-label="Last name"
                      ref={lname}
                      placeholder="Third Name"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-12 p-2 d-flex flex-column gap-2">
                  <label htmlFor="EmployeBranch">Chose Employee Title</label>
                  <select
                    className="btn btn-info"
                    ref={jobTitle}
                    name="EmployeBranch"
                    id="EmployeBranch"
                  >
                    <optgroup label="School Manger">
                      <option value="school manger">School Manger</option>
                      <option value="Assistant manager">
                        Assistant School Manger
                      </option>
                    </optgroup>
                    <optgroup label="Teachers">
                      <option value="English">English</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Math">Math</option>
                      <option value="Science">Science</option>
                      <option value="German">German</option>
                      <option value="French">French</option>
                      <option value="ICT">ICT</option>
                      <option value="science">science</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Phosics">Phosics</option>
                      <option value="Biolgy">Biolgy</option>
                      <option value="History">History</option>
                      <option value="Geopraphy">Geopraphy</option>
                      <option value="Phelosofy">Phelosofy</option>
                      <option value="psychology">psychology</option>
                      <option value="Religion">Religion</option>
                      <option value="Quran">Quran</option>
                      <option value="HEC">HEC</option>
                      <option value="Music">Music</option>
                      <option value="Art">Art</option>
                      <option value="P.E">P.E</option>
                      <option value="library">library</option>
                      <option value="Skills">Skills</option>
                      <option value="Values">Values</option>
                    </optgroup>
                    <optgroup label="IT">
                      <option value="IT">IT</option>
                    </optgroup>
                    <optgroup label="Hr">
                      <option value="HR">HR</option>
                    </optgroup>
                    <optgroup label="Head of stage">
                      <option value="primary">primary </option>
                      <option value="prep">Prep </option>
                      <option value="KG">Kg </option>
                      <option value="secondry">secondry</option>
                    </optgroup>
                    <optgroup label="security">
                      <option value="security">security</option>
                      <option value="bodygard">bodygard</option>
                    </optgroup>
                    <optgroup label="Employee">
                      <option value="worker">worker</option>
                      <option value="bus driver">bus Driver</option>
                      <option value="public relations">public relations</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Office Manger">Office Manger</option>
                      <option value="Messaging">Messaging</option>
                      <option value="Bus Supervisor">Bus Supervisor</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Student affairs">Student affairs</option>
                      <option value="secretary">secretary</option>
                      <option value="Teacher Assistant">
                        Teacher Assistant
                      </option>
                      <option value="nursing">nursing</option>
                      <option value="Social Worker">Social Worker</option>
                    </optgroup>
                  </select>
                </div>
                <button className="btn btn-info" onClick={InsertEmployee}>
                  {" "}
                  Submit
                </button>
              </div>
            </>
          ) : null}
          {showAllEmployee ? (
            <>
              <h5 className="text-danger mt-3">
                حذف و تعديل و اضافة الغياب و الحطول{" "}
              </h5>
              <div className="d-flex justify-content-center col-12 flex-column text-center">
                <input id="EmployeeDate" type="date" />
                {job.map((jobEl, index) => {
                  return (
                    <>
                      <h5 key={index} className="mt-5">
                        {jobEl}
                      </h5>
                      <table className="table table-dark table-striped">
                        <thead>
                          <tr>
                            <th>Attendance</th>
                            <td>Employee Branch</td>
                            <th>ُEmployee Name</th>
                            <th>ُEmployee job</th>
                            <th>Employe Title</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeData
                            .filter((el) => {
                              return el.employeeJob === jobEl;
                            })
                            .map((employeeEl, index) => {
                              return (
                                <>
                                  <tr key={index}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        data-Employee={employeeEl.employeeName}
                                      />
                                    </td>
                                    <td>{employeeEl.employeeBranch}</td>
                                    <td>{employeeEl.employeeName}</td>
                                    <td>{employeeEl.employeeJob}</td>
                                    <td>{employeeEl.employeeTitle}</td>
                                    <td>
                                      <div className="d-flex gap-3">
                                        <FontAwesomeIcon
                                          className="fs-5 text-primary"
                                          style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                          }}
                                          onClick={() => {
                                            toggleChangeEmployeex(
                                              employeeEl.employeeName
                                            );
                                          }}
                                          icon={faPenToSquare}
                                        />
                                        <FontAwesomeIcon
                                          className="fs-5 text-danger"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            toggleDeleteEmployee(
                                              employeeEl.employeeName
                                            );
                                          }}
                                          icon={faTrash}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                        </tbody>
                      </table>
                    </>
                  );
                })}
              </div>
              <button
                className="btn btn-warning col-12 mb-3 mt-3"
                onClick={HandleEmployeeSub}
              >
                Submit
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
