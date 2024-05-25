import axios from 'axios';

const AttendanceDownloadServices = {};

AttendanceDownloadServices.downloadAttendanceList = async (heading, selectedDate) => {
  try {
    const response = await axios.post('http://localhost:9000/attendance/downloadAttendance', {
      lessonName: heading,
      selectedDate: selectedDate,
    }, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default AttendanceDownloadServices;
