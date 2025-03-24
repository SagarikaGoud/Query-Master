import React, { useState } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [inputFormat, setInputFormat] = useState("pdf");
  const [outputFormat, setOutputFormat] = useState("txt");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Animation configurations
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 200,
  });

  const slideIn = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: 400,
  });

  const float = useSpring({
    from: { transform: "translateY(0)" },
    to: { transform: "translateY(-10px)" },
    loop: { reverse: true },
    config: { duration: 3000 },
  });

  const pulse = useSpring({
    from: { transform: "scale(1)" },
    to: { transform: "scale(1.05)" },
    loop: { reverse: true },
    config: { duration: 1000 },
  });

  // Get API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://query-master-1.onrender.com";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Please select a PDF, DOCX, or TXT file');
      return;
    }
    
    setFile(selectedFile);
    setError("");
  };

  const handleInputFormatChange = (e) => {
    setInputFormat(e.target.value);
  };

  const handleOutputFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("input_format", inputFormat);
    formData.append("output_format", outputFormat);

    try {
      const response = await axios.post(`${API_BASE_URL}/process`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDownloadLink(`${API_BASE_URL}${response.data.download_link}`);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.statusText;
      } else if (error.request) {
        errorMessage = "No response from server. Please try again later.";
      }
      setError(errorMessage);
      console.error("Error:", errorMessage, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <animated.div className="App" style={float}>
      <animated.h1 style={fadeIn}>QueryMaster</animated.h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <animated.form onSubmit={handleSubmit} style={slideIn}>
        <div className="form-group">
          <label>Input Format:</label>
          <select 
            value={inputFormat} 
            onChange={handleInputFormatChange}
            disabled={isLoading}
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
          </select>
        </div>
        
        <div className="form-group">
          <input 
            type="file" 
            onChange={handleFileChange} 
            disabled={isLoading}
            accept=".pdf,.docx,.txt"
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Output Format:</label>
          <select 
            value={outputFormat} 
            onChange={handleOutputFormatChange}
            disabled={isLoading}
          >
            <option value="txt">TXT</option>
            <option value="docx">DOCX</option>
            <option value="xls">XLS</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !file}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            "Process File"
          )}
        </button>
      </animated.form>
      
      {downloadLink && (
        <animated.a 
          href={downloadLink} 
          download 
          style={pulse}
          className="download-link"
        >
          Download Answers
        </animated.a>
      )}
    </animated.div>
  );
}

export default App;









// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [file, setFile] = useState(null);
//   const [format, setFormat] = useState("txt");
//   const [downloadLink, setDownloadLink] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleFormatChange = (e) => {
//     setFormat(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("format", format);

//     try {
//       const response = await axios.post("/api/process", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setDownloadLink(`http://localhost:5000${response.data.download_link}`);
//     } catch (error) {
//       console.error("Error processing file:", error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>QueryMaster</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept=".pdf" onChange={handleFileChange} required />
//         <select value={format} onChange={handleFormatChange}>
//           <option value="txt">TXT</option>
//           <option value="docx">DOCX</option>
//           <option value="xls">XLS</option>
//           <option value="pdf">PDF</option>
//         </select>
//         <button type="submit">Process PDF</button>
//       </form>
//       {downloadLink && (
//         <a href={downloadLink} download>
//           Download Answers
//         </a>
//       )}
//     </div>
//   );
// }

// export default App;