import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name); // ✅ เพิ่ม name ลงใน FormData
    formData.append("born", born); // ✅ เพิ่ม born ลงใน FormData
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:1880/api/charif",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("File uploaded successfully");
    } catch (error) {
      setMessage("Error uploading file");
      console.error("Upload Error:", error);
    }
  };
  

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="border-3 shadow-lg shadow-cyan-500/50 border-blue-500 p-8 rounded-2xl flex flex-col w-sm bg-black">
        <h2 className="text-3xl break-words text-white">ส่งการแจ้งไปยัง line และ telegram</h2>
        <input
          type="text"
          placeholder="ชื่อ"
          className="input input-warning my-8"
          onChange={e=>setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="ปีเกิด"
          className="input input-warning"
          onChange={e=>setBorn(e.target.value)}
        />
        <input
          type="file"
          className="file-input file-input-warning my-8"
          onChange={handleFileChange}
        />
        <button className="btn btn-primary" onClick={handleUpload}>
          Upload
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default FileUpload;
