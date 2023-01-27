import React, { useState } from "react";
import "./ImageUpload.css";
const Tesseract = require("tesseract.js");

const ImageUpload = () => {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState({});
  const [loading, isLoading] = useState(false);
  const [confidence, setConfidence] = useState();
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  };

  const handleClick = () => {
    Tesseract.recognize(imagePath, "eng", {
      logger: (m) => {
        m.progress < 1 ? isLoading(true) : isLoading(false);
        setProgress(m.progress);
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        let confidenceResult = result.data.confidence;
        setConfidence(confidenceResult);
        let text = result.data.text;
        console.log(result.data.text);
        if (confidenceResult < 55) {
          return setText(
            <img
              src="https://www.gran-turismo.com/gtsport/decal/5845681194092494864_1.png"
              alt="warning"
              className="checkmark"
            />
          );
        }

        if (
          text.includes("WHEAT") ||
          text.includes("wheat") ||
          text.includes("Wheat") ||
          text.includes("RYE") ||
          text.includes("Rye") ||
          text.includes("rye") ||
          text.includes("BARLEY") ||
          text.includes("Barley") ||
          text.includes("barley")
        ) {
          setText({
            img: (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/768px-Cross_red_circle.svg.png"
                alt="checkmark"
                className="checkmark"
              ></img>
            ),
            text: <p>{text}</p>,
          });
        } else {
          setText({
            img: (
              <img
                src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3506993/green-checkmark-circle-icon-md.png"
                alt="checkmark"
                className="checkmark"
              ></img>
            ),
            text: <p>{text}</p>,
          });
        }
      });
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>Please upload a image to be scanned!</h3>
        {!loading ? (
          <div className="text-box">
            <p className="results" id="inner">
              {" "}
              {text.img}
              {text.text}
              {confidence > 55 ? (
                <p>High confidence : {confidence}%</p>
              ) : (
                <p></p>
              )}
            </p>
          </div>
        ) : (
          <label>
            <br />
            <br />
            Loading <br />
            <progress value={progress}></progress>
          </label>
        )}
        <br />
        {confidence < 55 ? (
          <p>
            The confidence score of this scan is: {confidence}% <br />
            Please take a more clear picture to get more confident results...
          </p>
        ) : (
          <p></p>
        )}
        <br />
        <input type="file" onChange={handleChange} />
        <br />

        <button
          onClick={() => {
            handleClick();
            setConfidence(0);
          }}
          style={{ height: 50 }}
        >
          {" "}
          Scan image
        </button>
        <br />
        <button
          onClick={() => {
            setText("");
            window.location.reload(true);
          }}
        >
          {" "}
          Clear{" "}
        </button>
      </main>
    </div>
  );
};

export default ImageUpload;
