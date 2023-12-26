import React, { useEffect } from "react";
import "../styles/outputwin.css";

const Output = ({
  status_id,
  stdout,
  stderr,
}) => {
  function decodeBase64(base64) {
    const text = atob(base64);
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }
  const showOutput = () => {
    if (status_id === 3) {
      //accepted
      return (
        <pre
          style={{
            color: "green",
            whiteSpace: "pre-wrap",
          }}
        >
          {decodeBase64(stdout)}
        </pre>
      );
    } else if (status_id === 11) {
      //run-time error
      return (
        <pre style={{ color: "red" }}>
          {decodeBase64(stderr)}
        </pre>
      );
    } else if (status_id === 6) {
      //compilation error
      return (
        <pre style={{ color: "red" }}>
          {decodeBase64(stdout)}
        </pre>
      );
    }
  };
  useEffect(() => {
    console.log(
      "output window",
      status_id,
      stdout,
      stderr
    );
  }, [status_id, stderr, stdout]);
  return (
    <div className="output-window">
      <h4 className="heading">Output</h4>
      <div className="output-display">
        {status_id ? <>{showOutput()} </> : ``}
      </div>
    </div>
  );
};

export default Output;
