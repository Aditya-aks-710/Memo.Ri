import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SigninBox } from './pages/signin';
import { SignUpBox } from './pages/signup';
import { Dashboard } from './pages/dashboard';
import { useEffect, useState } from 'react';

function App() {
  const [token, settoken] = useState<string | null>(null)
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const storedtoken = localStorage.getItem("token");
    settoken(storedtoken);
    setloading(false);
  }, []);

  return (
    <>
      {loading && <div className='text-xl'>Loading</div>}
      {!loading && <Router>
        <Routes>
          <Route path='/api/v1/signin' element={<SigninBox settoken={settoken}/>}/>
          <Route path='/api/v1/signup' element={<SignUpBox/>}/>

          <Route
            path='/'
            element={token ? <Dashboard/> : <Navigate to='/api/v1/signin' replace/>}
          />
        </Routes>
      </Router>}
    </>
  )
}

export default App
