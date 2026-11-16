import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './App.css'
import Home from './Home';
import Add_emp from './Add_emp';
import Present_today from './Present_today';
import Total_announce from './Total_announce';
import Approval from './Approval';
import Pending_approval from './Pending_approval';









const App = () => {
  



 














 return(
 <Router>
  
  <Routes>
    <Route path = '/' element={<Home/>}></Route>
    <Route path = "/Add-emp" element={<Add_emp/>}></Route>
    <Route path = '/today-present' element={<Present_today/>}></Route>
    <Route path = '/announcement' element={<Total_announce/>}></Route>
    <Route path ='/approval' element={<Approval/>}></Route>
    <Route path = '/Pending Approvals' element={<Pending_approval/>}></Route>
    
    
  </Routes>
   </Router>
 )
}

export default App