//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeTree from './components/EmployeeTree';
import EmployeeEdit from './components/EmployeeEdit';
import ServicePage from './components/ServicePage';

function App() {
  return (
    <div className="App">
      <Router>
          <nav className="">
            <div>
                <ul className="nav justify-content-center">
                    <li className="nav-item"><Link className="nav-link" to="/">List</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/tree">Tree</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/edit/0">New user</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/service">Service</Link></li>
                </ul>
              </div>
          </nav>

          <Routes>
              <Route path="/" element={<EmployeeList />} />
              <Route path="/tree" element={<EmployeeTree />} />
              <Route path="/edit/:id" element={<EmployeeEdit />} />
              <Route path="/service" element={<ServicePage />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
