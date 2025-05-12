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
    images: [""],
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
    setCars(carList);
    const indexMap = {};
    carList.forEach(car => indexMap[car.id] = 0);
    setCarouselIndex(indexMap);
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.details) {
      setFormData(prev => ({
        ...prev,
        details: { ...prev.details, [name]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
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
      images: [""],
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
    });
    setEditCarId(car.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteCar(id);
    loadCars();
  };

  const handlePrev = (id) => {
    setCarouselIndex(prev => ({
      ...prev,
      [id]: prev[id] === 0 ? cars.find(car => car.id === id)?.images?.length - 1 : prev[id] - 1,
    }));
  };

  const handleNext = (id) => {
    setCarouselIndex(prev => ({
      ...prev,
      [id]: (prev[id] + 1) % (cars.find(car => car.id === id)?.images?.length || 1),
    }));
  };

  const handleThumbClick = (carId, index) => {
    setCarouselIndex(prev => ({ ...prev, [carId]: index }));
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
            <p>₹{car.price}</p>
            <p>{car.details?.type}</p>
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

            {/* Car Detail Inputs */}
            {[
              { label: "Kilometer Limit", name: "kilometer", placeholder: "e.g. 300/Day" },
              { label: "Extra Kilometer Rate", name: "extraKm", placeholder: "e.g. ₹5/Km" },
              { label: "Extra Hour Rate", name: "extraHr", placeholder: "e.g. ₹100/Hr" },
              { label: "Car Type", name: "type", placeholder: "e.g. SUV, Sedan" },
              { label: "Seats", name: "seats", type: "number", placeholder: "e.g. 5" },
              { label: "Luggage Capacity", name: "luggage", type: "number", placeholder: "e.g. 3" },
              { label: "Fuel Type", name: "fuel", placeholder: "e.g. Petrol, Diesel" },
              { label: "Manual Transmission", name: "mt", placeholder: "YES / NO" },
            ].map(({ label, name, type = "text", placeholder }) => (
              <div key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData.details[name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

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
