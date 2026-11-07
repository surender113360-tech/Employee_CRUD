import React from 'react'
import { useNavigate } from 'react-router-dom'

const Add_emp = () => {

  const navigate =useNavigate()


  return (
   <div className="employee-form-container">
      <h2>Add New Employee</h2>
      <form  className="employee-form">
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
             
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
          
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
          
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Job Title / Role</label>
            <input
              type="text"
              id="role"
              name="role"
             
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              
            >
              <option value="Engineering">Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hireDate">Hire Date</label>
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Employment Status</label>
            <select
              id="status"
              name="status"
              
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
        </div>

        <button type="submit" className="save-btn" onClick={()=>navigate('/')}>
          Add Employee
        </button>
      </form>
    </div>
        
  )
}

export default Add_emp