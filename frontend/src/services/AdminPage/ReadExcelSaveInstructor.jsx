import axios from "axios";


const ReadExcelSaveInstructor = {
  saveToDatabase: async (data) => {
    try {
      const response = await axios.post('http://localhost:9000/admin/upload-data-instructor', data);
      return response;
    } catch (error) {
      console.error("Failed to save data:", error);
      throw error;
    }
  }
};

export default ReadExcelSaveInstructor;
