import "../styles/editor.css";
import React, {
  useEffect,
  useState,
} from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
// import { andromeda } from "@ ";
import Editor from "@monaco-editor/react";
import Output from "../Components/Output";
import Status from "../Components/Status";
import Topbar from "../Components/Topbar";
import { langArray } from "../assets/lang.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const CodeEditor = () => {
  const [code, setCode] =
    useState(`#include<stdio.h>
int main()
{
  int n;
  scanf("%d", &n);
  printf("Hello world!!! %d", n);
  return 0;
}`);
  const [language, setLanguage] = useState(
    langArray[0].id
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState();
  const [fileName, setFileName] =
    useState("main");
  const [email, setEmail] = useState("");
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
    //setProcessing(true);
    setOutput();
    const formData = {
      language_id: language,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(input),
    };
    const options = {
      method: "POST",
      // url: process.env.REACT_APP_RAPID_API_URL,
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host":
          "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key":
          "92424d02f9msh583477408bb8f18p11cc1bjsne32099da0d43",
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
        //setProcessing(false);
        console.log(error);
      });
  };
  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url:
        "https://judge0-ce.p.rapidapi.com/submissions" +
        "/" +
        token,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Host":
          "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key":
          "92424d02f9msh583477408bb8f18p11cc1bjsne32099da0d43",
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        //setProcessing(false)
        setOutput(response.data);
        //showSuccessToast(`Compiled Successfully!`)
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
      //showErrorToast();
    }
  };
  const handleSave = async () => {
    console.log("clicked...");
    const data = {
      language: language,
      code: code,
      email: email,
      name: fileName,
    };
    await axios
      .post(
        "http://localhost:8080/api/v1/run",
        data
      )
      .then((res) => console.log(res))
      .catch((err) => console.log("Axios", err));
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
  return (
    <div className="container">
      <Topbar
        setCode={setCode}
        handleSave={handleSave}
        setFileName={setFileName}
        setLanguage={setLanguage}
        email={email}
      />
      <div className="main">
        <div className="code-editor">
          <div className="code-header">
            <select
              className="lang-select"
              onChange={(e) => {
                setLanguage(e.target.value * 1);
              }}
              value={language}
            >
              {langArray.map((ele) => {
                return (
                  <option value={ele.id}>
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
              />
            </div>
            <button
              className="run-btn"
              onClick={() => runCode()}
            >
              <FontAwesomeIcon
                icon={faPlay}
                size="xl"
              />
            </button>
          </div>
          <CodeMirror
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
          />
        </div>
        <div className="right">
          <Output
            stderr={output?.stderr}
            stdout={output?.stdout}
            status_id={output?.status_id}
            compile_output={
              output?.compile_output
            }
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
