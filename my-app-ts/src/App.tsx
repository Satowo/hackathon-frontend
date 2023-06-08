import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/signUp/Register";
import Login from "./pages/signIn/Login";
import Mypage from "./pages/myPage/Mypage";

function App() {
  return (
    <div className='App h-screen w-screen'>
      <BrowserRouter>
        <Routes>
          <Route path={`/register/`} element={<Register />} />
          <Route path={`/login/`} element={<Login />} />
          <Route path={`/`} element={<Mypage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
