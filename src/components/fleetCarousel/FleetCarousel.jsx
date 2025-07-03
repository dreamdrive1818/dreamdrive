import React, { useState, useEffect, useRef } from "react";
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
import { ClipLoader } from "react-spinners";
import HowItWorks from "../HowItWorks/HowItWorks";
import AnimateOnScroll from "../../assets/Animation/AnimateOnScroll";
import { motion } from "framer-motion";

const FleetCarousel = () => {
  const { fetchCars } = useAdminContext();
  const { handleOrder } = useOrderContext();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const itemsPerPage = 3;
  const navigate = useNavigate();
  const location = useLocation();
  const isCarsPage = location.pathname === "/cars";
  const intervalRef = useRef(null);

  const totalPages = Math.ceil(cars.length / itemsPerPage);

  useEffect(() => {
    const loadCars = async () => {
      const carData = await fetchCars();
      const sortedCars = [...carData].sort(
        (a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999)
      );
      setCars(sortedCars);
      setLoading(false);
    };
    loadCars();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isHovering) {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }
    }, 6000);
  };

  useEffect(() => {
    if (totalPages > 1) {
      startAutoSlide();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [totalPages, isHovering]);

  const paginatedCars = isMobile
    ? cars
    : cars.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
      );

  const handleRent = (car) => {
    handleOrder(car);
    navigate("/order");
  };

  return (
    <>
      <motion.div
        className="fleet-container"
        style={{ paddingTop: isCarsPage ? "2rem" : "8rem" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="fleet-div">
          <h4>THE CARS</h4>
          <h2>Our Impressive Fleet</h2>
          <p className="fleet-subtitle">Choose your car and get ready to ride in style.</p>

          {loading ? (
            <div className="fleet-spinner">
              <ClipLoader size={75} color="#6366f1" />
            </div>
          ) : (
            <>
              <AnimateOnScroll className="fleet-carousel-wrapper">
                {!isMobile && (
                  <button
                    className="carousel-arrow left"
                    onClick={() => {
                      setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
                      startAutoSlide();
                    }}
                  >
                    &#8249;
                  </button>
                )}

                <div className="fleet-cards">
                  {paginatedCars.map((car, index) => {
                    const absoluteIndex = currentPage * itemsPerPage + index;
                    const isAvailable = car.available === "Available";

                    return (
                      <motion.div
                        key={car.id}
                        className={`fleet-card ${!isAvailable ? "fleet-card-unavailable" : ""}`}
                        onMouseEnter={() => {
                          setHoveredIndex(absoluteIndex);
                          setIsHovering(true);
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          setIsHovering(false);
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
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
                              <span>₹{car?.price ? car.price + ".00" : "--"}</span>
                            </p>
                            {isAvailable ? (
                              <button onClick={() => handleRent(car)}>Rent</button>
                            ) : (
                              <button className="not-available-btn" disabled>
                                Not Available
                              </button>
                            )}
                          </div>
                        </div>
                        <div
                          className={`car-hover-info ${
                            hoveredIndex === absoluteIndex ? "car-hover-info-show" : ""
                          }`}
                        >
                          <div className="hover-top">
                            <div>
                              <strong>₹{car.twelveHrWeekday}</strong>
                              <p>12 Hr (Weekday)</p>
                            </div>
                            <div>
                              <strong>₹{car.twentyFourHrWeekday}</strong>
                              <p>24 Hr (Weekday)</p>
                            </div>
                            <div>
                              <strong>{car.details?.extraHr}</strong>
                              <p>Extra Hr</p>
                            </div>
                          </div>
                          <div className="hover-bottom">
                            <div>
                              <FontAwesomeIcon icon={faCarSide} />
                              <p>{car.details?.type}</p>
                            </div>
                            <div>
                              <FontAwesomeIcon icon={faUserFriends} />
                              <p>{car.details?.seats}</p>
                            </div>
                            <div>
                              <FontAwesomeIcon icon={faSuitcaseRolling} />
                              <p>{car.details?.luggage}</p>
                            </div>
                            <div>
                              <FontAwesomeIcon icon={faGasPump} />
                              <p>{car.details?.fuel}</p>
                            </div>
                            <div>
                              <FontAwesomeIcon icon={faCogs} />
                              <p>{car.details?.mt}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {!isMobile && (
                  <button
                    className="carousel-arrow right"
                    onClick={() => {
                      setCurrentPage((prev) => (prev + 1) % totalPages);
                      startAutoSlide();
                    }}
                  >
                    &#8250;
                  </button>
                )}
              </AnimateOnScroll>

              {!isMobile && (
                <div className="carousel-dots">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={i === currentPage ? "active" : ""}
                      onClick={() => {
                        setCurrentPage(i);
                        startAutoSlide();
                      }}
                    >
                      {`0${i + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {location.pathname === "/cars" && <HowItWorks />}
    </>
  );
};

export default FleetCarousel;
