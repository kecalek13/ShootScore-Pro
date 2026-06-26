import  * as React from "react";

function App() {
  return (
    <div className="flex flex-row">
      <input name="points" type="number" value={"0"} id="pointsInput" />
      <button onClick={() => console.log("Kliknutí")}></button>
    </div>
  );
}