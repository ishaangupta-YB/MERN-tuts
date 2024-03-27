import React, { useState, useContext } from "react";
import { CountContext } from "../context";

function Landing() {
  const [count, setcount] = useState(1);

  return (
    <div>
      <CountContext.Provider value={{ count, setcount }}>
        <Count />
      </CountContext.Provider>
    </div>
  );
}

function Count() {
  const { setcount } = useContext(CountContext);

  return (
    <div>
      <CountRenderer />
      <Buttons setcount={setcount} />
    </div>
  );
}

function CountRenderer() {
  const { count } = useContext(CountContext);
  return <div>{count}</div>;
}

function Buttons() {
  const { count, setcount } = useContext(CountContext);

  return (
    <div>
      <button onClick={() => setcount(count + 1)}>Increase</button>
      <button onClick={() => setcount(count - 1)}>decrease</button>
    </div>
  );
}
export default Landing;
