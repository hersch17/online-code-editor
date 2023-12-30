import "../styles/editor.css";
import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "../api/axios.js";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { python } from "@codemirror/lang-python";
// import { cpp } from "@codemirror/lang-cpp";
// import { andromeda } from "@ ";
import Editor from "@monaco-editor/react";
import Output from "../Components/Output";
import Status from "../Components/Status";
import Topbar from "../Components/Topbar";
import { langArray } from "../assets/lang.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-simple-toasts";

const CodeEditor = () => {
  const [code, setCode] =
    useState(`#include<stdio.h>
int main()
{
  printf("Hello world!");
  return 0;
}`);
  const [language, setLanguage] = useState(
    langArray[0].id
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState();
  const [fileName, setFileName] = useState("");
  const [email, setEmail] = useState("");
  const [fileID, setFileID] = useState();
  const [editorLanguage, setEditorLanguage] =
    useState("cpp");
  const [processing, setProcessing] =
    useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("code", fileName);
  // }, [fileName]);
  // const runCode = async () => {
  //   const payLoad = { language: language, code };
  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:8080/api/v1/run",
  //       payLoad
  //     );
  //     console.log(data);
  //     setOutput(data.output);
  //   } catch ({ response }) {
  //     if (response) {
  //       console.log(response);
  //       const errMsg = response.data.err.stderr;
  //       console.log(errMsg);
  //       setOutput(errMsg);
  //     } else {
  //       window.alert(
  //         "Error connecting to server"
  //       );
  //     }
  //   }
  // };
  const runCode = async () => {
    setProcessing(true);
    toast("Processing", {
      loading: true,
      className: "my-theme",
      duration: 2500,
    });
    setOutput();
    const formData = {
      language_id: language,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(input),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host":
          process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key":
          process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response
          ? err.response.data
          : err;
        setProcessing(false);
        console.log(error);
        toast(`Processing error`, {
          className: "my-theme",
        });
      });
  };
  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url:
        process.env.REACT_APP_RAPID_API_URL +
        "/" +
        token,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Host":
          process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key":
          process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutput(response.data);
        toast(`Compiled Successfully!`, {
          className: "my-theme",
        });
        console.log(
          "response.data",
          response.data
        );
        console.log(
          "output",
          atob(response.data.stdout)
        );
        console.log(
          "error",
          atob(response.data.stderr)
        );
        return;
      }
    } catch (err) {
      console.log("err", err);
      //setProcessing(false);

      toast(`Processing error`, {
        className: "my-theme",
      });
    }
  };
  const handleSave = async () => {
    if (!fileName) {
      toast("Enter file name", {
        className: "my-theme",
      });
      return;
    }
    const data = {
      language: language,
      code: code,
      email: email,
      name: fileName,
    };
    await axios
      .post("/run", data)
      .then((res) => {
        toast("File successfully saved", {
          className: "my-theme",
        });
        setFileID(res?.data?.jobID);
      })
      .catch((err) => {
        toast("Error connecting to server", {
          className: "my-theme",
        });
        console.log("Axios", err);
      });
  };
  const handleFileDelete = async () => {
    console.log("delete reached...");
    await axios
      .delete("/run/".concat(fileID), {})
      .then((res) => {
        toast("File successfully deleted", {
          className: "my-theme",
        });
        setCode("");
        setFileID("");
        setFileName("");
        setOutput("");
      })
      .catch((err) => {
        toast("Error connecting to server", {
          className: "my-theme",
        });
        console.log("Axios", err);
      });
  };

  useEffect(() => {
    const userEmail =
      sessionStorage.getItem("user_email");
    if (userEmail) {
      setEmail(userEmail);
    } else {
      navigate("/login");
    }
  }, []);
  function handleEditorChange(value, event) {
    setCode(value);
  }
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  return (
    <div className="container">
      <Topbar
        setCode={setCode}
        handleSave={handleSave}
        setFileName={setFileName}
        setLanguage={setLanguage}
        email={email}
        setFileID={setFileID}
      />
      <div className="main">
        <div className="code-editor">
          <div className="code-header">
            <select
              className="lang-select"
              onChange={(e) => {
                let code = e.target.value * 1;
                setLanguage(code);
                if (code >= 48 && code <= 54)
                  setEditorLanguage("cpp");
                else if (
                  code === 63 ||
                  code === 93
                )
                  setEditorLanguage("javascript");
                else if (
                  code === 70 ||
                  code === 71 ||
                  code === 92
                )
                  setEditorLanguage("python");
              }}
              value={language}
            >
              {langArray.map((ele) => {
                return (
                  <option
                    value={ele.id}
                    key={ele.name}
                  >
                    {ele.name}
                  </option>
                );
              })}
            </select>
            <div className="input-container">
              <input
                type="text"
                className="custom-input"
                value={fileName}
                onChange={(e) => {
                  setFileName(e.target.value);
                }}
                placeholder="Enter file name..."
              />
            </div>
            <div className="delete-btn">
              {fileID ? (
                <FontAwesomeIcon
                  icon={faTrash}
                  size="xl"
                  onClick={() =>
                    handleFileDelete()
                  }
                />
              ) : null}
            </div>
            <div
              className="run-btn"
              onClick={() => runCode()}
            >
              <FontAwesomeIcon
                icon={faPlay}
                size="xl"
              />
            </div>
          </div>
          {/* <CodeMirror
            value={code}
            //theme={andromeda}
            extensions={[
              // javascript({ jsx: true }),
              // python(),
              cpp({}),
            ]}
            onChange={(value, viewUpdate) => {
              setCode(value);
            }}
            height="80vh"
            basicSetup={{ autocompletion: true }}
            className="CodeMirror"
          /> */}
          <div className="editor-container">
            <Editor
              height="80vh"
              width="100%"
              defaultLanguage="javascript"
              language={editorLanguage}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              value={code}
            />
          </div>
        </div>
        <div className="right">
          <Output
            stderr={output?.stderr}
            stdout={output?.stdout}
            status_id={output?.status_id}
            compile_output={
              output?.compile_output
            }
            message={output?.message}
          />
          <div className="code-input">
            {/* <h4 className="header">Input</h4> */}
            <textarea
              className="custom-code-input"
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Input..."
            />
          </div>
          <Status outputDetails={output} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
