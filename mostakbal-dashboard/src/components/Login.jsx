import React, { useRef } from 'react';
import './Login.scss'; // تأكد من وجود ملف CSS
import Swal from 'sweetalert2';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firestoredb';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const User = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const HandleLogin = async (event) => {
    event.preventDefault();
  
    const userName = User.current.value.trim(); // إزالة التحويل إلى أحرف صغيرة في البداية
    const userPassword = password.current.value.trim();
  
    console.log("Entered Username:", userName);
    console.log("Entered Password:", userPassword);
  
    if (userName && userPassword) {
      Swal.fire({
        title: 'Validating...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      try {
        const q = query(
          collection(db, "Users"),
          where("UserName", "==", userName) // تأكد من أن هذا الحقل صحيح
        );
  
        const querySnapshot = await getDocs(q);
        console.log("Query Result Length:", querySnapshot.docs.length); // تحقق من طول النتيجة
        console.log("Query Result:", querySnapshot.docs.map(doc => doc.data())); // طباعة البيانات المستردة
  
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
  
          // تحقق من كلمة المرور
          if (userData.Password === userPassword) {
            Swal.fire({
              title: 'Success',
              text: 'Login successful!',
              icon: 'success'
            });
            console.log("User logged in:", userData);
            
            // حفظ نوع المستخدم في localStorage
            localStorage.setItem("userType", userData.UserType);
            
            // الانتقال إلى الداشبورد
            window.location.reload();
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Username or password is incorrect.',
              icon: 'error'
            });
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Username or password is incorrect.',
            icon: 'error'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'There was an error during login.',
          icon: 'error'
        });
        console.error("Error logging in:", error);
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please enter both username and password.',
        icon: 'error'
      });
    }
  };
  
  // دالة لجلب جميع المستخدمين وعرضهم في console
  const fetchAllUsers = async () => {
    const usersRef = collection(db, "Users");
    const usersSnapshot = await getDocs(usersRef);

    usersSnapshot.forEach((doc) => {
      console.log("Stored User:", doc.data()); // عرض جميع بيانات المستخدمين المخزنة
    });
  };

  // قم باستدعاء هذه الدالة مرة واحدة للتحقق من البيانات المخزنة
  React.useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <input ref={User} type="text" placeholder="Username" required />
          </div>
          <div className="input-group">
            <input ref={password} type="password" placeholder="Password" required />
          </div>
          <button type="submit" onClick={HandleLogin} className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
