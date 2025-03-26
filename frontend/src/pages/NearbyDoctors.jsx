import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faMapMarkerAlt, faSearch, faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const NearbyDoctorsForm = () => {
  const [searchData, setSearchData] = useState({
    specialist: "",
    location: "",
    availabilitySlot: null,
  });

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setSearchData((prevState) => ({
      ...prevState,
      availabilitySlot: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDoctors([]);

    const requestData = {
      specialist: searchData.specialist,
      location: searchData.location,
      availabilitySlot: searchData.availabilitySlot ? searchData.availabilitySlot.getTime() : null,
    };

    try {
      const response = await fetch("http://localhost:4000/api/search-doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      if (data.length === 0) {
        setError("No doctors found for the selected criteria.");
      }
      setDoctors(data);
    } catch (error) {
      setError("Error fetching doctors. Please try again.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faUserMd} className="mr-3 text-blue-500 text-3xl" />
          Find Nearby Doctors
        </h2>
        <p className="text-gray-500 mt-2">Search doctors near you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faUserMd} className="mr-2 text-blue-500" />
            Specialist
          </label>
          <select
            name="specialist"
            value={searchData.specialist}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            required
          >
            <option value="">Select Specialist</option>
            <option value="Pediatricians">Pediatrician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" />
            Location
          </label>
          <input
            type="text"
            name="location"
            value={searchData.location}
            onChange={handleChange}
            placeholder="Enter area or city"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-2 text-blue-500" />
            Availability Slot
          </label>
          <DatePicker
            selected={searchData.availabilitySlot}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select Date & Time"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faSearch} className="mr-2" />
          {loading ? "Searching..." : "Search Doctors"}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* Display Search Results */}
      {doctors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Available Doctors</h3>
          <ul className="space-y-4">
            {doctors.map((doctor) => (
              <li key={doctor._id} className="p-4 border rounded-lg shadow-sm bg-gray-100">
                <p className="font-bold text-lg text-blue-700">{doctor.name}</p>
                <p className="text-gray-700">{doctor.speciality} - {doctor.address.line1}, {doctor.address.line2}</p>
                {doctor.date && (
                  <p className="text-sm text-gray-500">
                    Available on: {new Date(doctor.date).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NearbyDoctorsForm;
