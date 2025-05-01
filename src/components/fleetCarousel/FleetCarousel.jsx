import React, { useState, useEffect } from "react";
import "./FleetCarousel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarSide,
  faUserFriends,
  faSuitcaseRolling,
  faGasPump,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalContext } from "../../context/LocalContext";

const cars = [
  {
    id: "car01",
    name: "Tata Nexon Dark Edition 2023",
    image: "https://www.bajajmall.in/emistore/media/catalog/product/t/a/tatanexonxzpluslux_376339_atlasblack_base.jpeg",
    details: {
      kilometer: "300/Day",
      extraKm: "5/Km",
      extraHr: "100/Hr",
      type: "SUV",
      seats: 5,
      luggage: 3,
      fuel: "Petrol",
      mt: "YES",
    },
  },
  {
    id: "car02",
    name: "Hyundai i20 Asta IVT 2024",
    image: "https://ackodrive-assets.ackodrive.com/media/test_QkNB2Ri.png",
    details: {
      kilometer: "280/Day",
      extraKm: "6/Km",
      extraHr: "90/Hr",
      type: "Hatchback",
      seats: 5,
      luggage: 2,
      fuel: "Petrol",
      mt: "NO",
    },
  },
  {
    id: "car03",
    name: "Jeep Compass Limited 2024",
    image: "https://images.dealer.com/autodata/us/color/2019/USC90JES152D0/PRM.jpg?impolicy=resize&w=414",
    details: {
      kilometer: "320/Day",
      extraKm: "7/Km",
      extraHr: "120/Hr",
      type: "SUV",
      seats: 5,
      luggage: 4,
      fuel: "Diesel",
      mt: "YES",
    },
  },
  {
    id: "car04",
    name: "Renault Kiger 2025",
    image: "https://www.carbike360.com/_next/image?url=https%3A%2F%2Fd2uqhpl0gyo7mc.cloudfront.net%2FRenault_Kiger_09a2720671.jpg&w=3840&q=75",
    details: {
      kilometer: "280/Day",
      extraKm: "5/Km",
      extraHr: "90/Hr",
      type: "Compact SUV",
      seats: 5,
      luggage: 3,
      fuel: "Petrol",
      mt: "YES",
    },
  },
  {
    id: "car05",
    name: "Maruti Swift 2025",
    image: "https://5.imimg.com/data5/VL/UP/GLADMIN-66493026/maruti-swift-500x500.png",
    details: {
      kilometer: "270/Day",
      extraKm: "5/Km",
      extraHr: "80/Hr",
      type: "Hatchback",
      seats: 5,
      luggage: 2,
      fuel: "Petrol",
      mt: "YES",
    },
  },
  {
    id: "car06",
    name: "Maruti Ertiga ZXI 2025",
    image: "https://www.carandbike.com/_next/image?url=https%3A%2F%2Fimages.carandbike.com%2Fcar-images%2Fcolors%2Fmaruti-suzuki%2Fertiga%2Fmaruti-suzuki-ertiga-splendid-silver.png%3Fv%3D1653313094&w=640&q=75",
    details: {
      kilometer: "300/Day",
      extraKm: "6/Km",
      extraHr: "110/Hr",
      type: "MPV",
      seats: 7,
      luggage: 4,
      fuel: "Petrol",
      mt: "YES",
    },
  },
  {
    id: "car07",
    name: "Hyundai Aura SX 2025",
    image: "https://media.zigcdn.com/media/model/2023/Mar/aura_600x400.jpg",
    details: {
      kilometer: "280/Day",
      extraKm: "5/Km",
      extraHr: "90/Hr",
      type: "Sedan",
      seats: 5,
      luggage: 3,
      fuel: "Petrol",
      mt: "YES",
    },
  },
  {
    id: "car08",
    name: "Maruti FRONX 2025",
    image: "https://www.cars24.com/new-cars/_next/image/?url=https%3A%2F%2Fcdn.cars24.com%2Fprod%2Fnew-car-cms%2FMaruti-Suzuki%2FFRONX%2F2024%2F05%2F15%2Ff0dacce0-2ba2-4a6c-ac0f-3e5670e23309-Fronx-Car-Image.png&w=828&q=30",
    details: {
      kilometer: "290/Day",
      extraKm: "6/Km",
      extraHr: "100/Hr",
      type: "Crossover",
      seats: 5,
      luggage: 3,
      fuel: "Petrol",
      mt: "YES",
    },
  },
];


const FleetCarousel = () => {

  const [currentPage, setCurrentPage] = useState(0);
  const { handleOrder } = useLocalContext();
  const itemsPerPage = 3;
  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const isCarsPage = location.pathname === "/cars";


  // Auto-slide every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 30000); // 15 seconds
    return () => clearInterval(interval);
  }, [totalPages]);

  const handleClick = (index) => {
    setCurrentPage(index);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const paginatedCars = cars.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleRent = (car) =>{
     handleOrder(car);
     navigate('/order');
  }

  return (
    <div className="fleet-container"
    style={{ paddingTop: isCarsPage ? "2rem" : "8rem" }}>
      <div className="fleet-div">
        <h4>THE CARS</h4>
        <h2>Our Impressive Fleet</h2>

        <div className="fleet-carousel-wrapper">
          <button className="carousel-arrow left" onClick={handlePrev}>
            &#8249;
          </button>

          <div className="fleet-cards">
            {paginatedCars.map((car, index) => {
              const absoluteIndex = currentPage * itemsPerPage + index;
              return (
                <div
                  key={absoluteIndex}
                  className="fleet-card"
                  onMouseEnter={() => setHoveredIndex(absoluteIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="fleet-card-top">
                    <img src={car.image} alt={car.name} />
                  </div>
                  <div className="fleet-card-bot">
                    <div className="fleet-card-bot-name">
                      <h3>{car.name}</h3>
                    </div>
                    <div className="fleet-card-bot-section">
                      <p>
                        Starting at <br /> <span>{car.price}</span>
                      </p>
                      <button onClick={()=>handleRent(car)}>Rent</button>
                    </div>
                  </div>

                  <div
                    className={`car-hover-info ${
                      hoveredIndex === absoluteIndex
                        ? "car-hover-info-show"
                        : ""
                    }`}
                  >
                    <div className="hover-top">
                      <div>
                        <span>
                          <strong>{car.details.kilometer}</strong>
                        </span>
                        <p>Kilometer</p>
                      </div>
                      <div>
                        <span>
                          <strong>{car.details.extraKm}</strong>
                        </span>
                        <p>Extra Km</p>
                      </div>
                      <div>
                        <span>
                          <strong>{car.details.extraHr}</strong>
                        </span>
                        <p>Extra Hr</p>
                      </div>
                    </div>
                    <div className="hover-bottom">
                      <div>
                        <FontAwesomeIcon icon={faCarSide} size="lg" />
                        <p>{car.details.type}</p>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faUserFriends} size="lg" />
                        <p>{car.details.seats}</p>
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faSuitcaseRolling}
                          size="lg"
                        />
                        <p>{car.details.luggage}</p>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faGasPump} size="lg" />
                        <p>{car.details.fuel}</p>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faCogs} size="lg" />
                        <p>{car.details.mt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-arrow right" onClick={handleNext}>
            &#8250;
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={i === currentPage ? "active" : ""}
              onClick={() => handleClick(i)}
            >
              {`0${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetCarousel;
