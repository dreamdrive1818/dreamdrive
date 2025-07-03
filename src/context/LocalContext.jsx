import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

const LocalContext = createContext();

export const LocalProvider = ({ children }) => {
  const [currentTFN, setCurrentTFN] = useState({ intlFormat: "", localFormat: "" });
  const [webinfo,setwebinfo] = useState({
    name: "Dream Drive",
    phone: " ",
    phonecall: "",
    address:"105 Jagriti Bhawan, near Adarsh Nagar, Bariatu, Ranchi - 834009 Jharkhand",
    email:"info@hcvatron.com"
});




const handleNavigation = () =>{
   window.location.href = '/cars';
}



  // Fetch TFN from Firebase
  useEffect(() => {
    const fetchTFN = async () => {
      try {
        const docRef = doc(db, "siteNumbers", "dream-drive.co");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setCurrentTFN({
            intlFormat: data.numberIntl || "",
            localFormat: data.numberLocal || "",
          });
        } else {
          console.log("No such document!");
          setCurrentTFN({ intlFormat: "919942027772", localFormat: "+91 (994) 202-7772" });
        }
      } catch (error) {
        console.error("Error fetching TFN: ", error);
      }
    };

    fetchTFN();
  }, []);

  
  useEffect(() => {
    setwebinfo((prevWebinfo) => ({
      ...prevWebinfo,
      phone: currentTFN.localFormat,
      phonecall: currentTFN.intlFormat,
    }));
  }, [currentTFN]);

  return (
    <LocalContext.Provider value={{ webinfo, setwebinfo, handleNavigation }}>
      {children}
    </LocalContext.Provider>
  );
};

export const useLocalContext = () => useContext(LocalContext);
