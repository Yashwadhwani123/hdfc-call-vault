import React,{useState} from 'react'
import { CalendarContainer } from 'react-datepicker';
import DatePicker from "react-datepicker";
import Calender from "../../images/Icon metro-calendar.svg";
import '../../stylesheets/common/date-picker.css'


const Datepicker = (props) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  return (
    <>  
    <div className=''>
    <DatePicker
  
     wrapperClassName='datePicker'

      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
      }}
      
    
    />
  
     </div>
    </>
   
  );
};

export default Datepicker