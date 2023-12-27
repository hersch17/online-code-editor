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
} from "@fortawesome/free-solid-svg-icons";
const Topbar = ({
  setCode,
  handleSave,
  setFileName,
  setLanguage,
}) => {
  const [selectedFile, setSelectedFile] =
    useState();
  useEffect(() => {
    console.log("file", selectedFile);
  }, [selectedFile]);
  const readFile = (file) => {
    //const type = file.name.split(".")[1];
    // if (type !== "cpp" || type !== "py") {
    //   window.alert("Unsupported file");
    //   return;
    // }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setCode(reader.result);
    };
    reader.onerror = () => {
      window.alert("Error reading file");
    };
  };
  const getAllCodes = async () => {
    return await axios
      .get("http://localhost:8080/api/v1/run")
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
        <button
          className="save-button"
          onClick={() => handleSave()}
        >
          {/* <span className="save-icon">💾</span> */}
          <FontAwesomeIcon icon={faFloppyDisk} />
          {/* Save */}
        </button>
        <div className="react-select">
          <Async
            cacheOptions
            loadOptions={getAllCodes}
            onChange={(e) => {
              setSelectedFile(e._id);
              setFileName(e.name);
              setCode(e.code);
              setLanguage(e.language);
            }}
            defaultOptions
            getOptionLabel={(e) => e.name}
            isSearchable={true}
            styles={customStyle}
            //onChange={(e)=>{console.log((e))}}
          />
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
