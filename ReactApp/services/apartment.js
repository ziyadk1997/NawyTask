import axios from "axios";
const baseUrl = "http://localhost:8100/api/apartment";

const ApartmentService = {
  getApartments: function () {
    return axios.get(`${baseUrl}/getApartments`);
  },

  getApartment: function (id) {
    return axios.get(`${baseUrl}/getApartments/${id}`);
  },
};

export default ApartmentService;
