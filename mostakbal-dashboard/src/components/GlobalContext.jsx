import { createContext, useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firestoredb';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [studentAttendence, SetstudentAttendence] = useState(false);
  const [allReport, setAllReport] = useState([]);

  const GetReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Report"));
      const reports = [];
  
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
  
      setAllReport(reports);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    GetReports();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        studentAttendence,
        SetstudentAttendence,
        allReport,
        setAllReport,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };
