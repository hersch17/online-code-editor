import "../styles/editor.css";
import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { andromeda } from "@uiw/codemirror-theme-andromeda";
import Editor from "@monaco-editor/react";
import Output from "../Components/Output";
import Status from "../Components/Status";

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
  const [language, setLanguage] = useState(71);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState();
  const dict = {
    "C/C++": 54,
    Javascript: 93,
    Python: 71,
  };
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
  const readFile = (file) => {
    //console.log(file);
    const type = file.name.split(".")[1];
    if (type !== "cpp" || type !== "py") {
      window.alert("Unsupported file");
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setCode(reader.result);
    };
    reader.onerror = () => {
      window.alert("Error reading file");
    };
  };
  return (
    <div className="container">
      <div>
        <input
          type="file"
          onChange={(e) =>
            readFile(e.target.files[0])
          }
        />
      </div>
      <div className="main">
        <div className="code-editor">
          <label>Write your code here</label>
          <div className="code-header">
            <select
              className="lang-select"
              onChange={(e) => {
                console.log(dict[e.target.value]);
                setLanguage(dict[e.target.value]);
              }}
            >
              <option>C/C++</option>
              <option>Python</option>
              <option>Javascript</option>
            </select>
            <button
              className="run-btn"
              onClick={() => runCode()}
            >
              Run
            </button>
          </div>
          <CodeMirror
            value={code}
            theme={andromeda}
            extensions={[
              javascript({ jsx: true }),
              python(),
              cpp(),
            ]}
            onChange={(value, viewUpdate) => {
              setCode(value);
            }}
            height="80vh"
          />
        </div>
        <div className="right">
          <Output
            stderr={output?.stderr}
            stdout={output?.stdout}
            status_id={output?.status_id}
          />
          <div className="input">
            <h4 className="header">Input</h4>
            <textarea
              className="input-box"
              onChange={(e) =>
                setInput(e.target.value)
              }
            />
          </div>
          <Status outputDetails={output} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
