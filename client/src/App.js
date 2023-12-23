import "./App.css";
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
function App() {
  const [code, setCode] = useState(`print("hi")`);
  const [language, setLanguage] = useState("py");
  const [output, setOutput] = useState("");
  const dict = {
    "C++": "cpp",
    Javascript: "js",
    Python: "py",
  };
  // useEffect(() => {
  //   console.log("code: ", lang);
  // }, [lang]);
  const runCode = async () => {
    const payLoad = { language: language, code };
    try {
      const { data } = await axios.post(
        "http://localhost:8080/run",
        payLoad
      );
      console.log(data);
      setOutput(data.output);
    } catch ({ response }) {
      if (response) {
        console.log(response);
        const errMsg = response.data.err.stderr;
        console.log(errMsg);
        setOutput(errMsg);
      } else {
        window.alert(
          "Error connecting to server"
        );
      }
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
              <option>Python</option>
              <option>C++</option>
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
            height="300px"
            theme={andromeda}
            maxHeight="300px"
            extensions={[
              javascript({ jsx: true }),
              python(),
              cpp(),
            ]}
            onChange={(value, viewUpdate) => {
              setCode(value);
              //console.log(viewUpdate);
            }}
          />
        </div>
        <div className="right">
          <div className="input">
            <div className="code-header">
              Input
            </div>
            <CodeMirror
              theme={andromeda}
              maxHeight="400px"
              height="200px"
            />
          </div>
          <div className="output">
            <div className="code-header">
              Output
            </div>
            <CodeMirror
              theme={andromeda}
              value={output}
              maxHeight="400px"
              height="200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
