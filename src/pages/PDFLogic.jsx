// utils/pdfUtils.js
import axios from "axios";
import { saveAs } from "file-saver";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export const PDFLogic = async (resumeHtml, firebase, navigate, path) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    // Save pending task to localStorage
    localStorage.setItem("pendingPDFGeneration", JSON.stringify({ firebase,resumeHtml, path }));
    navigate("/login", { state: { from: `/${path}` } });
    return;
  }
  
    
    try {
        // Request PDF generation
        const db = getFirestore();
        const resumeRef = doc(db, `${path}`, userId);
        const dataToStore = {
            firebase,
            userId,
            updatedAt: new Date(),
        };
 
        
        await setDoc(resumeRef, dataToStore, { merge: true });
        console.log("Data stored in Firebase.");

       
        
       
        const response = await axios.post(
        `${import.meta.env.VITE_API_CALL}/generatepdf`,
        { resumeHtml },
        { responseType: "arraybuffer" }
        );
        
        // Convert response to PDF blob and trigger download
        const uint8Array = new Uint8Array(response.data);
        const blob = new Blob([uint8Array], { type: "application/pdf" });
        saveAs(blob, `${path}.pdf`);
        console.log("PDF generated and downloaded.");

 
        localStorage.removeItem(path);
    } catch (error) {
        console.error("Error generating or downloading PDF:", error);
    }
    };
