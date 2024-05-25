import axios from "axios";

const AttendanceListTableInfo = {};

AttendanceListTableInfo.postLessonInfo = (lessonName, selectedDate) => {
  axios.defaults.withCredentials = true;
  return axios.post("http://localhost:9000/instructor/attendanceList", {
    lessonName: lessonName,
    selectedDate: selectedDate,
  });
};

AttendanceListTableInfo.postDateInfo = (lessonName) => {
  return axios.post("http://localhost:9000/instructor/attendanceDate", {
    lessonName: lessonName,
  });
};

export default AttendanceListTableInfo;
