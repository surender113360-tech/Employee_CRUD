import PageTitle from "../components/PageTitle";


function EmployeeDashboard(){



    return(
        <>
        <PageTitle title="My Dashboard" sub = "Your Work Infromation in one place   "/>
        <div className="welcome-card">
            <h2>Welcome!</h2>
             <p>Use the menu to  view profile ,attendance,leave request and payroll details.</p>
        </div>
        </>
    )
}
export default EmployeeDashboard