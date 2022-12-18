//import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import NewTimeTable from './NewTimeTable';
import Layout from './Layout';
import CreateTimeTable from './CreateTimeTable';
import AddCourses from './AddCourses';
import CreateAccount from './CreateAccount';
import Login from './Login';
import ViewTimeTable from './ViewTimeTable';
import ShowTable from './ShowTable';
//import Administrator from './Administrator';
import Admin from './Administrator';
import StudentHome from './StudentHome';
import Entry from './Entry';
import ViewCourse from './ViewCourses';


function App() {

  //input formats: 
  /*  const courses = [['cA', 'tCA', '100'], ['cB', 'tCA', '100'], ['cC', 'tCA', '200'],
   ['cD', 'tCA', '100'], ['cE', 'tCA', '200'], ['cF', 'tCA', '300'], ['cG', 'tCA', '400']];
   const startDate = '2022-11-10';
   const endDate = '2022-12-4';
   const startTime = '08:00';
   const breakPerPeriod = '30';
   const periodsPerDay = 3;
   const hoursPerPeriod = 3; */

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          {/* <Route index element={<NewTimeTable courses={courses} periodsPerDay={periodsPerDay}
            startDate={startDate} endDate={endDate} startTime={startTime}
            breakPerPeriod={breakPerPeriod} hoursPerPeriod={hoursPerPeriod} />} /> */}
          <Route index element={<Entry />} />
          <Route path='newTimeTable' element={<NewTimeTable />} />
          <Route path='addCourses' element={<AddCourses />} />
          <Route path='createAccount' element={<CreateAccount />} />
          <Route path='administrator' element={<Admin />} />
          <Route path='login' element={<Login />} />
          <Route path='createTimeTable' element={<CreateTimeTable />} />
          <Route path='student' element={<StudentHome />} />
          <Route path='findTimeTable' element={<StudentHome />} />
          <Route path='viewTimeTable' element={<ViewTimeTable />} />
          <Route path='viewCourses' element={<ViewCourse />} />
          <Route path='showTable' element={<ShowTable />} />
          <Route path='entry' element={<Entry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
