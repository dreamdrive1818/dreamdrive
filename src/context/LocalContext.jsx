import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase/firebaseConfig';

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



const [selectedUserBlog, setSelectedUserBlog] = useState(()=> localStorage.getItem('selectedBlog') ? JSON.parse(localStorage.getItem('selectedBlog')) : null);


const Goto = () =>{
  window.location.href = "https://forms.zohopublic.in/dreamdrive1818gm1/form/CONSENTFORMFORCARHIRE/formperma/XcyUB9S6UcHoPngvocFg76vVhZcn4lJco34EPSjBy_o";
}

useEffect(()=>{
  localStorage.setItem('selectedBlog', JSON.stringify(selectedUserBlog));
})
  // Fetch TFN from Firebase
  useEffect(() => {
    const fetchTFN = async () => {
      try {
        const docRef = doc(db, "siteNumbers", "hcvatron.com");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setCurrentTFN({
            intlFormat: data.numberIntl || "",
            localFormat: data.numberLocal || "",
          });
        } else {
          console.log("No such document!");
          setCurrentTFN({ intlFormat: "", localFormat: "" });
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
    <LocalContext.Provider value={{ webinfo, setwebinfo,selectedUserBlog, setSelectedUserBlog, Goto }}>
      {children}
    </LocalContext.Provider>
  );
};

export const useLocalContext = () => useContext(LocalContext);
