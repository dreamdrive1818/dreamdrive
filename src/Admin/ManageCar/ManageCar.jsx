import React, { useEffect, useState } from "react";
import "./ManageCar.css";
import { useAdminContext } from "../../context/AdminContext";

const ManageCar = () => {
  const { fetchCars, addCar, updateCar, deleteCar } = useAdminContext();

  const [cars, setCars] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCarId, setEditCarId] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    available: "Available",
    displayOrder: 1,
    images: [""],
    twelveHrWeekday: "",
    twentyFourHrWeekday: "",
    twentyFourHrWeekend: "",
    securityDeposit: "",
    details: {
      kilometer: "",
      extraKm: "",
      extraHr: "",
      type: "",
      seats: "",
      luggage: "",
      fuel: "",
      mt: "",
    },
  });

  const loadCars = async () => {
    const carList = await fetchCars();
    const sorted = carList
      .filter(car => car.displayOrder !== undefined)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    setCars(sorted);
    const indexMap = {};
    sorted.forEach((car) => (indexMap[car.id] = 0));
    setCarouselIndex(indexMap);
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.details) {
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "displayOrder" ? parseInt(value) : value,
      }));
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.images[0] || !formData.price) {
      return alert("Car name, starting price, and at least one image are required.");
    }

    if (editCarId) {
      await updateCar(editCarId, formData);
    } else {
      await addCar(formData);
    }

    setModalOpen(false);
    resetForm();
    loadCars();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      available: "Available",
      displayOrder: 1,
      images: [""],
      twelveHrWeekday: "",
      twentyFourHrWeekday: "",
      twentyFourHrWeekend: "",
      securityDeposit: "",
      details: {
        kilometer: "",
        extraKm: "",
        extraHr: "",
        type: "",
        seats: "",
        luggage: "",
        fuel: "",
        mt: "",
      },
    });
    setEditCarId(null);
  };

  const handleEdit = (car) => {
    setFormData({
      ...car,
      images: car.images || [""],
      available: car.available || "Available",
      twelveHrWeekday: car.twelveHrWeekday || "",
      twentyFourHrWeekday: car.twentyFourHrWeekday || "",
      twentyFourHrWeekend: car.twentyFourHrWeekend || "",
      securityDeposit: car.securityDeposit || "",
    });
    setEditCarId(car.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteCar(id);
    loadCars();
  };

  const handlePrev = (id) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [id]: prev[id] === 0 ? cars.find((car) => car.id === id)?.images?.length - 1 : prev[id] - 1,
    }));
  };

  const handleNext = (id) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % (cars.find((car) => car.id === id)?.images?.length || 1),
    }));
  };

  const handleThumbClick = (carId, index) => {
    setCarouselIndex((prev) => ({ ...prev, [carId]: index }));
  };

  return (
    <div className="manage-car-container">
      <h2>Manage Fleet</h2>
      <button className="add-btn" onClick={() => setModalOpen(true)}>+ Add Car</button>

      <div className="car-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <div className="carousel-container">
              <button className="arrow left" onClick={() => handlePrev(car.id)}>&#8249;</button>
              <img
                src={car.images?.[carouselIndex[car.id] || 0]}
                alt="car"
                className="carousel-image"
              />
              <button className="arrow right" onClick={() => handleNext(car.id)}>&#8250;</button>
            </div>
            <div className="thumbnails">
              {car.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="thumb"
                  className={`thumb ${carouselIndex[car.id] === index ? "active" : ""}`}
                  onClick={() => handleThumbClick(car.id, index)}
                />
              ))}
            </div>
            <h4>{car.name}</h4>
            <p>Starting Price : ₹{car.price}</p>
            <p>{car.details?.type}</p>
            <p>Display Order: {car.displayOrder}</p>
            <p>Availability: <strong>{car.available}</strong></p>
            <p>12 Hr Weekday: ₹{car.twelveHrWeekday}</p>
            <p>24 Hr Weekday: ₹{car.twentyFourHrWeekday}</p>
            <p>24 Hr Weekend: ₹{car.twentyFourHrWeekend}</p>
            <p>Security Deposit: ₹{car.securityDeposit}</p>
            <div className="car-actions">
              <button onClick={() => handleEdit(car)}>Edit</button>
              <button onClick={() => handleDelete(car.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editCarId ? "Edit Car" : "Add Car"}</h3>

            <label htmlFor="carName">Car Name</label>
            <input
              id="carName"
              type="text"
              name="name"
              placeholder="Car Name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <label htmlFor="carPrice">Starting Price (₹)</label>
            <input
              id="carPrice"
              type="text"
              name="price"
              placeholder="e.g. 2999"
              value={formData.price}
              onChange={handleInputChange}
            />

            <label htmlFor="twelveHrWeekday">12 Hr Weekday Price (₹)</label>
            <input
              id="twelveHrWeekday"
              type="text"
              name="twelveHrWeekday"
              placeholder="Enter 12 Hr Weekday Price"
              value={formData.twelveHrWeekday}
              onChange={handleInputChange}
            />

            <label htmlFor="twentyFourHrWeekday">24 Hr Weekday Price (₹)</label>
            <input
              id="twentyFourHrWeekday"
              type="text"
              name="twentyFourHrWeekday"
              placeholder="Enter 24 Hr Weekday Price"
              value={formData.twentyFourHrWeekday}
              onChange={handleInputChange}
            />

            <label htmlFor="twentyFourHrWeekend">24 Hr Weekend Price (₹)</label>
            <input
              id="twentyFourHrWeekend"
              type="text"
              name="twentyFourHrWeekend"
              placeholder="Enter 24 Hr Weekend Price"
              value={formData.twentyFourHrWeekend}
              onChange={handleInputChange}
            />

            <label htmlFor="securityDeposit">Security Deposit (₹)</label>
            <input
              id="securityDeposit"
              type="text"
              name="securityDeposit"
              placeholder="Enter Security Deposit"
              value={formData.securityDeposit}
              onChange={handleInputChange}
            />

            <label htmlFor="displayOrder">Display Position</label>
            <input
              id="displayOrder"
              type="number"
              name="displayOrder"
              placeholder="e.g. 1"
              value={formData.displayOrder}
              onChange={handleInputChange}
            />

            <label htmlFor="availability">Availability</label>
            <select
              id="availability"
              name="available"
              value={formData.available}
              onChange={handleInputChange}
              className="availability-dropdown"
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>

            <label>Image URLs</label>
            {formData.images.map((img, index) => (
              <div key={index} style={{ display: "flex", marginBottom: "0.5rem" }}>
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => removeImageField(index)} className="remove-img">×</button>
              </div>
            ))}
            <button type="button" onClick={addImageField} className="add-img-btn">
              + Add Image Field
            </button>

            {["kilometer", "extraKm", "extraHr", "type", "seats", "luggage", "fuel", "mt"].map(
              (key) => (
                <div key={key}>
                  <label htmlFor={key}>{key[0].toUpperCase() + key.slice(1)}</label>
                  <input
                    id={key}
                    type="text"
                    name={key}
                    placeholder={`Enter ${key}`}
                    value={formData.details[key]}
                    onChange={handleInputChange}
                  />
                </div>
              )
            )}

            <div className="modal-actions">
              <button onClick={handleSubmit}>{editCarId ? "Update" : "Add"}</button>
              <button onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCar;
