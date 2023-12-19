import React, { useState, useEffect } from "react";

const YogaEnrollmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    current_batch: "",
    start_date: "",
  });
  const [amount, setAmount] = useState(null);
  const [batches, setBatches] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Fetch batches from the API when the component mounts
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        console.log(process.env.REACT_APP_SITE);
        const response = await fetch(`https://flexmoney-backend-o2ny.onrender.com/api/batches`);
        const batchesData = await response.json();
        setBatches(batchesData);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []); 

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAmount = () => {
    setAmount(500);
  };

  const handlePayment = () => {
    setPaymentSuccess(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://flexmoney-backend-o2ny.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const user = await response.json();
        console.log("User registered successfully:", user);

        setRegistrationStatus("success"); 
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.error("Invalid input data:", errorData);
        setRegistrationStatus("error"); 
      } else if (response.status === 409) {
        const errorData = await response.json();
        console.error("Email already exists:", errorData);
        setRegistrationStatus("error"); 
      } else {
        console.error("Unexpected error:", response.status);
        setRegistrationStatus("error"); 
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setRegistrationStatus("error"); 
    }
  };

  return (
    <div>
      <h2>Yoga Class Enrollment Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="batch">Choose a Batch:</label>
        <select
          id="batch"
          name="current_batch"
          onChange={handleInputChange}
          required
        >
          <option value="" disabled selected>
            Select Batch
          </option>
          {/* Dynamically populate the options from the fetched batches */}
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.time_slot}
            </option>
          ))}
        </select>

        <label htmlFor="start_date">Start Date:</label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleInputChange}
          required
        />

        <button type="button" onClick={calculateAmount}>
          Calculate Amount
        </button>

        {amount !== null && (
          <div>
            <p>Amount to be paid: {amount} Rs</p>
          </div>
        )}

        {amount !== null && !paymentSuccess && (
          <button type="button" onClick={handlePayment}>
            Pay
          </button>
        )}

        {registrationStatus === "success" && (
          <div className="success-message">
            <p style={{ color: "#2ae106" }}>User registered successfully! &#10004;</p>
          </div>
        )}

        {registrationStatus === "error" && (
          <div className="error-message">
            <p style={{ color: "red" }}>Registration failed. Please check your input.</p>
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default YogaEnrollmentForm;
