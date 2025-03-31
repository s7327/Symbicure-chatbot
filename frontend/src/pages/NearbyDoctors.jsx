import React, { useState } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
>>>>>>> c50f1c4 (Updated Code)
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
<<<<<<< HEAD
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
=======
  const [error, setError] = useState("");
  const navigate = useNavigate();
>>>>>>> c50f1c4 (Updated Code)

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
<<<<<<< HEAD

=======
>>>>>>> c50f1c4 (Updated Code)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
<<<<<<< HEAD
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
=======
  
    try {
      let lat, lon;
  
      if (searchData.location) {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchData.location)}`
        );
        const geoData = await geoResponse.json();
        if (geoData.length > 0) {
          lat = geoData[0].lat;
          lon = geoData[0].lon;
        } else {
          throw new Error("Location not found.");
        }
      } else {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              lat = position.coords.latitude;
              lon = position.coords.longitude;
              resolve();
            },
            (err) => reject(err)
          );
        });
      }
  
      const radius = 5000;
      const overpassQuery = `[out:json]; node[amenity=doctors](around:${radius},${lat},${lon}); out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.elements.length === 0) {
        setError("No doctors found in this area.");
        setLoading(false);
        return;
      }
  
      // Calculate distance function (Haversine formula)
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (deg) => (deg * Math.PI) / 180;
        const R = 6371; // Earth's radius in km
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };
  
      // Map doctors with distance calculation
      let filteredDoctors = data.elements.map((doctor) => ({
        id: doctor.id,
        name: doctor.tags?.name || "Unknown Doctor",
        speciality: searchData.specialist || "General Practitioner",
        lat: doctor.lat,
        lon: doctor.lon,
        address: doctor.tags?.["addr:street"] || "Unknown Location",
        mapLink: `https://www.google.com/maps?q=${doctor.lat},${doctor.lon}`,
        distance: calculateDistance(lat, lon, doctor.lat, doctor.lon), // Add distance
      }));
  
      // Sort by nearest distance and take only top 6
      filteredDoctors = filteredDoctors.sort((a, b) => a.distance - b.distance).slice(0, 6);
  
      navigate("/search-results", { state: { results: filteredDoctors } });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Error fetching doctors. Try again.");
>>>>>>> c50f1c4 (Updated Code)
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
=======
  
>>>>>>> c50f1c4 (Updated Code)

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
<<<<<<< HEAD
            required
          >
            <option value="">Select Specialist</option>
            <option value="Pediatricians">Pediatrician</option>
=======
          >
            <option value="">Select Specialist</option>
            <option value="Pediatrician">Pediatrician</option>
>>>>>>> c50f1c4 (Updated Code)
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
<<<<<<< HEAD
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
=======
>>>>>>> c50f1c4 (Updated Code)
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

<<<<<<< HEAD
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
=======
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
>>>>>>> c50f1c4 (Updated Code)
    </div>
  );
};

export default NearbyDoctorsForm;
