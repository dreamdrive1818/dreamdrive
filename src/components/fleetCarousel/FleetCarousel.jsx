import React, { useState, useEffect } from "react";
import "./FleetCarousel.css";
import { useAdminContext } from "../../context/AdminContext";
import { useOrderContext } from "../../context/OrderContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarSide,
  faUserFriends,
  faSuitcaseRolling,
  faGasPump,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";

const FleetCarousel = () => {
  const { fetchCars } = useAdminContext();
  const { handleOrder } = useOrderContext();
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const itemsPerPage = 3;
  const navigate = useNavigate();
  const location = useLocation();
  const isCarsPage = location.pathname === "/cars";
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  useEffect(() => {
    const loadCars = async () => {
      const carData = await fetchCars();
      setCars(carData);
    };
    loadCars();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 15000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const paginatedCars = cars.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleRent = (car) => {
    handleOrder(car);
    navigate("/order");
  };

  return (
    <div className="fleet-container" style={{ paddingTop: isCarsPage ? "2rem" : "8rem" }}>
      <div className="fleet-div">
        <h4>THE CARS</h4>
        <h2>Our Impressive Fleet</h2>
        <p className="fleet-subtitle">Choose your car and get ready to ride in style.</p>

        <div className="fleet-carousel-wrapper">
          <button className="carousel-arrow left" onClick={() => setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))}>
            &#8249;
          </button>

          <div className="fleet-cards">
            {paginatedCars.map((car, index) => {
              const absoluteIndex = currentPage * itemsPerPage + index;
              return (
                <div
                  key={car.id}
                  className="fleet-card"
                  onMouseEnter={() => setHoveredIndex(absoluteIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="fleet-card-top">
                    <img src={car.images?.[0]} alt={car.name} />
                  </div>
                  <div className="fleet-card-bot">
                    <div className="fleet-card-bot-name">
                      <h3>{car.name}</h3>
                    </div>
                    <div className="fleet-card-bot-section">
                      <p>
                        Starting at <br />
                        <span>₹{car?.price && car.price + ".00" || "--"}</span>
                      </p>
                      <button onClick={() => handleRent(car)}>Rent</button>
                    </div>
                  </div>

                  <div className={`car-hover-info ${hoveredIndex === absoluteIndex ? "car-hover-info-show" : ""}`}>
                    <div className="hover-top">
                      <div><strong>{car.details?.kilometer}</strong><p>Kilometer</p></div>
                      <div><strong>{car.details?.extraKm}</strong><p>Extra Km</p></div>
                      <div><strong>{car.details?.extraHr}</strong><p>Extra Hr</p></div>
                    </div>
                    <div className="hover-bottom">
                      <div><FontAwesomeIcon icon={faCarSide} size="lg" /><p>{car.details?.type}</p></div>
                      <div><FontAwesomeIcon icon={faUserFriends} size="lg" /><p>{car.details?.seats}</p></div>
                      <div><FontAwesomeIcon icon={faSuitcaseRolling} size="lg" /><p>{car.details?.luggage}</p></div>
                      <div><FontAwesomeIcon icon={faGasPump} size="lg" /><p>{car.details?.fuel}</p></div>
                      <div><FontAwesomeIcon icon={faCogs} size="lg" /><p>{car.details?.mt}</p></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-arrow right" onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}>
            &#8250;
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={i === currentPage ? "active" : ""} onClick={() => setCurrentPage(i)}>
              {`0${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetCarousel;
