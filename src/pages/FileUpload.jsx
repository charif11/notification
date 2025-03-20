import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [api, setApi] = useState("api/charif");
  const [imageUrl, setImageUrl] = useState(""); // ✅ เพิ่ม state สำหรับ URL ของภาพผลลัพธ์
  const [detectedObjects, setDetectedObjects] = useState([]); // ✅ เพิ่ม state สำหรับผลลัพธ์ที่ตรวจจับได้

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast("กรุณากรอกข้อมูลให้ครบ", "info");
      // showToastInfo("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("born", born);

    try {
      const response = await axios.post(
        `http://127.0.0.1:1880/${api}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast("อัปโหลดไฟล์สำเร็จ!", "success");
      setDetectedObjects(response.data.detected_objects); // ✅ อัปเดตข้อมูลที่ตรวจจับได้
      setImageUrl(`${response.data.image_url}?t=${Date.now()}`);
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการอัปโหลดไฟล์", "error");
      console.error("Upload Error:", error);
    }
  };

  // const showToastInfo = (msg) => {
  //   toast.info(msg, {
  //     position: "top-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // };
  const showToast = (msg, type) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    switch (type) {
      case "success":
        toast.success(msg, options);
        break;
      case "info":
        toast.info(msg, options);
        break;
      case "error":
        toast.error(msg, options);
        break;
      default:
        toast(msg, options); // Default to basic toast if type is not provided
    }
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-10 w-full h-screen">
      {/* ฝั่งอัปโหลด */}
      <div className="border-3 shadow-lg shadow-cyan-500/50 border-blue-500 p-8 rounded-2xl flex flex-col w-sm bg-black">
        <h2 className="text-3xl break-words text-white">
          ส่งการแจ้งไปยัง Line และ Telegram
        </h2>
        <input
          type="text"
          placeholder="ชื่อ"
          className="input input-warning my-8"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="ปีเกิด(พ.ศ.)"
          className="input input-warning"
          onChange={(e) => setBorn(e.target.value)}
        />
        <label className="label mt-4 mb-1">ระบุ API</label>
        <input
          type="text"
          className="input input-info"
          placeholder="api/xxx"
          value={api} 
          onChange={(e) => setApi(e.target.value)}
        />
        <input
          type="file"
          className="file-input file-input-warning my-8"
          onChange={handleFileChange}
        />
        <button className="btn btn-primary" onClick={handleUpload}>
          Upload
        </button>
      </div>

      {/* ฝั่งแสดงผล */}
      {(detectedObjects.length > 0 || imageUrl) && (
        <div className="border-3 shadow-lg shadow-red-500/50 border-red-500 p-8 rounded-2xl flex flex-col w-sm bg-black">
          <h2 className="text-3xl break-words text-white">ผลลัพธ์</h2>

          {/* ✅ แสดงรายการวัตถุที่ตรวจจับได้ */}
          {detectedObjects.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg mt-4 text-white">
              <h3 className="text-xl">วัตถุที่ตรวจจับได้:</h3>
              <ul className="list-disc list-inside">
                {detectedObjects.map((obj, index) => (
                  <li key={index}>
                    {obj.class} - ความมั่นใจ: {obj.confidence}%
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ แสดงภาพที่มี Bounding Box */}
          {imageUrl && (
            <div className="mt-4">
              <h3 className="text-white">ภาพผลลัพธ์:</h3>
              <img
                src={imageUrl}
                alt="Detected Objects"
                className="mt-2 rounded-lg max-h-[300px] w-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* ใส่ ToastContainer */}
      <ToastContainer />
    </div>
  );
}

export default FileUpload;
