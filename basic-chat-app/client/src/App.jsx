import "./App.css";
import Form from "./modules/Dashboard/Form/Form";

import {BrowserRouter , Routes, Route  } from "react-router-dom";
 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/users/sign_up' element={<Form isSignInPage={false} />} />
        <Route path='/users/sign_in' element={<Form isSignInPage={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
