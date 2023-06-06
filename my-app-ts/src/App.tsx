import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/signUp/Register";
import Login from "./pages/signIn/Login";
import Mypage from "./pages/myPage/Mypage";

function App() {
  return (
    <div className='App'>
        <header className='App-header'>
        </header>
        <div className="container">
          <BrowserRouter>
            <Routes>
              <Route path={`/register/`} element={<Register />} />
              <Route path={`/login/`} element={<Login />} />
              <Route path={`/`} element={<Mypage />} />
            </Routes>
          </BrowserRouter>
        </div>
        {/* <Form onSubmit={onSubmit}/> */}
    </div>
  );
}

export default App;
