import { useState } from "react";
import "./App.css";

function App() {
  const [src, setsrc] = useState();

  const displayIMG = (event) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setsrc(url);
      console.log("show", URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div className="App">
      <input
        type="file"
        accept=".png , .jpg , .jpeg"
        name="pic"
        id="pic"
        onChange={(e) => displayIMG(e)}
      />

      <img src={src} alt="..." className="pic" />
    </div>
  );
}

export default App;
