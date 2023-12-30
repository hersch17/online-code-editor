import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import "../styles/topbar.css";
import Async from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faFolderOpen,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
const Topbar = ({
  setCode,
  handleSave,
  setFileName,
  setLanguage,
  email,
  setFileID,
}) => {
  // useEffect(() => {
  //   console.log("file", selectedFile);
  // }, [selectedFile]);
  const readFile = (file) => {
    const inputFileName =
      file?.name?.split(".")[0];
    const type = file?.name?.split(".")[1];
    console.log(type);
    if (
      type === "cpp" ||
      type === "py" ||
      type === "c"
    ) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setCode(reader.result);
        setFileName(inputFileName);
        if (type === "py") setLanguage(92);
        else if (type === "js") setLanguage(93);
        else if (type === "cpp") setLanguage(54);
        else if (type === "c") setLanguage(50);
      };
      reader.onerror = () => {
        window.alert("Error reading file");
      };
    } else window.alert("Unsupported file");
  };
  const getAllCodes = async () => {
    return await axios
      .post(
        "http://localhost:8080/api/v1/run/codes",
        { email: email }
      )
      .then((res) => {
        const result = res.data.job;
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  };
  const customStyle = {
    option: (styles) => {
      return { ...styles, color: "black" };
    },
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("user_email");
    toast("Logged out", {
      className: "my-theme",
    });
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div class="file-input-container">
          <label class="file-icon-container">
            {/* <span class="file-icon">📂</span> */}
            {/* <span class="file-name">
              Select a file
            </span> */}
            <FontAwesomeIcon
              icon={faFolderOpen}
            />
            <input
              type="file"
              class="file-input"
              onChange={(e) =>
                readFile(e.target.files[0])
              }
            />
          </label>
        </div>
        <div className="save-button-container">
          <button
            className="save-button"
            onClick={() => handleSave()}
          >
            {/* <span className="save-icon">💾</span> */}
            <FontAwesomeIcon
              icon={faFloppyDisk}
            />
            {/* Save */}
          </button>
        </div>
        <div className="react-select">
          <Async
            // cacheOptions
            loadOptions={getAllCodes}
            onChange={(e) => {
              setFileID(e._id);
              setFileName(e.name);
              setCode(e.code);
              setLanguage(e.language);
            }}
            defaultOptions
            getOptionLabel={(e) => e.name}
            isSearchable={true}
            styles={customStyle}
            placeholder="Search..."
            //onChange={(e)=>{console.log((e))}}
          />
        </div>
        <div
          className="logout-icon-container"
          onClick={() => {
            handleLogout();
          }}
        >
          <FontAwesomeIcon
            className="logout-icon"
            icon={faRightFromBracket}
            size="xl"
          />
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
