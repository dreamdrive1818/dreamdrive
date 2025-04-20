import React, { useState, useEffect } from "react";
import "./FleetCarousel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCarSide, faChair, faCogs, faGasPump, faSuitcaseRolling, faUserFriends } from "@fortawesome/free-solid-svg-icons";

const cars = [
  {
    name: "BMW M4",
    price: "$89/day",
    image: "https://www.bmw.in/content/dam/bmw/common/all-models/3-series/sedan/2022/navigation/bmw-3-series-sedan-lci-modelfinder.png",
    details: {
      kilometer: "300/Day",
      extraKm: "7/Km",
      extraHr: "150/Hr",
      type: "Coupe",
      seats: 4,
      luggage: 2,
      fuel: "40L",
      mt: "YES",
    },
  },
  {
    name: "Audi R8",
    price: "$99/day",
    image: "https://mediaservice.audi.com/media/fast/H4sIAAAAAAAAAFvzloG1tIiBOTrayfuvpGh6-m1zJgaGigIGBgZGoDhTtNOaz-I_2DhCHsCEtzEwF-SlMwJZKUycmbmJ6an6QD4_I3taTmV-aUkxO0grT6IZW1LM5FXvttkx5OyX3LxWaWLSLgZWoC7GeUCCWQhI8KUBCU5VBjAJMm8-iLAD8ZksmRkYWCuAjEgGEODjKy3KKUgsSszVK89MKckQ1DAgEgizu7iGOHr6BAMAWEMXeOkAAAA",
    details: {
      kilometer: "250/Day",
      extraKm: "8/Km",
      extraHr: "180/Hr",
      type: "Coupe",
      seats: 2,
      luggage: 1,
      fuel: "50L",
      mt: "NO",
    },
  },
  {
    name: "Tesla Model S",
    price: "$109/day",
    image: "https://preview.thenewsmarket.com/Previews/NCAP/StillAssets/1920x1080/684698_v3.jpg",
    details: {
      kilometer: "350/Day",
      extraKm: "6/Km",
      extraHr: "120/Hr",
      type: "Sedan",
      seats: 5,
      luggage: 4,
      fuel: "Electric",
      mt: "NO",
    },
  },
  {
    name: "Lamborghini Huracan",
    price: "$129/day",
    image: "https://eminencesupercarhire.co.uk/wp-content/uploads/2024/01/KB9_6483-Edit-removebg-preview.png",
    details: {
      kilometer: "200/Day",
      extraKm: "10/Km",
      extraHr: "200/Hr",
      type: "Sport",
      seats: 2,
      luggage: 1,
      fuel: "60L",
      mt: "YES",
    },
  },
  {
    name: "Porsche 911",
    price: "$139/day",
    image: "https://di-uploads-pod15.dealerinspire.com/autobahnporsche/uploads/2021/10/530x390-Porsche-Images-911_Carrera-removebg-preview.png",
    details: {
      kilometer: "220/Day",
      extraKm: "9/Km",
      extraHr: "170/Hr",
      type: "Sport",
      seats: 2,
      luggage: 1,
      fuel: "50L",
      mt: "YES",
    },
  },
  {
    name: "Mercedes G-Wagon",
    price: "$149/day",
    image: "https://carindia.in/wp-content/uploads/2024/02/G-Diamonds-Web.jpg",
    details: {
      kilometer: "300/Day",
      extraKm: "7/Km",
      extraHr: "160/Hr",
      type: "SUV",
      seats: 7,
      luggage: 5,
      fuel: "80L",
      mt: "NO",
    },
  },
  {
    name: "Ford Mustang",
    price: "$79/day",
    image: "https://www.vdm.ford.com/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/Ford_Mustang_2025_101A_PYZ_882_89W_13A_CON_64F_99H_44U_EBST_DEFAULT_EXT_1.png",
    details: {
      kilometer: "280/Day",
      extraKm: "6/Km",
      extraHr: "140/Hr",
      type: "Muscle",
      seats: 4,
      luggage: 2,
      fuel: "60L",
      mt: "YES",
    },
  },
  {
    name: "Nissan GT-R",
    price: "$119/day",
    image: "https://imgd.aeplcdn.com/1056x594/n/63bjpra_1422362.jpg?q=80",
    details: {
      kilometer: "260/Day",
      extraKm: "7/Km",
      extraHr: "150/Hr",
      type: "Sport",
      seats: 4,
      luggage: 2,
      fuel: "62L",
      mt: "YES",
    },
  },
  {
    name: "Toyota Supra",
    price: "$99/day",
    image: "https://automania.co.in/wp-content/uploads/2024/12/SOLIDO-TOYOTA-SUPRA-MK-4-A90-BLACK-S1807606-.jpg",
    details: {
      kilometer: "270/Day",
      extraKm: "6/Km",
      extraHr: "130/Hr",
      type: "Sport",
      seats: 2,
      luggage: 1,
      fuel: "50L",
      mt: "YES",
    },
  },
  {
    name: "Chevrolet Camaro",
    price: "$89/day",
    image: "https://inv.assets.sincrod.com/RTT/Chevrolet/2024/6067833/default/ext_GAZ_deg02.jpg",
    details: {
      kilometer: "300/Day",
      extraKm: "6/Km",
      extraHr: "120/Hr",
      type: "Muscle",
      seats: 4,
      luggage: 2,
      fuel: "65L",
      mt: "YES",
    },
  },
  {
    name: "Jaguar F-Type",
    price: "$109/day",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC3y_GKQOQGDQ4BXxPX7W7UarshAZYI84NQ&s",
    details: {
      kilometer: "250/Day",
      extraKm: "7/Km",
      extraHr: "140/Hr",
      type: "Convertible",
      seats: 2,
      luggage: 1,
      fuel: "55L",
      mt: "YES",
    },
  },
  {
    name: "Rolls Royce Ghost",
    price: "$159/day",
    image: "https://carzillauae.com/wp-content/uploads/2023/08/Rolls-Royce-Repair-Service-1536x1020-removebg-preview.png",
    details: {
      kilometer: "300/Day",
      extraKm: "10/Km",
      extraHr: "200/Hr",
      type: "Luxury",
      seats: 5,
      luggage: 4,
      fuel: "90L",
      mt: "NO",
    },
  },
  {
    name: "Mazda MX-5 Miata",
    price: "$69/day",
    image: "https://www.mazdausa.com/siteassets/vehicles/2024/mx-5-miata/compare/2024-mazda-mx-5-miata-soul-red.png",
    details: {
      kilometer: "270/Day",
      extraKm: "6/Km",
      extraHr: "110/Hr",
      type: "Convertible",
      seats: 2,
      luggage: 1,
      fuel: "40L",
      mt: "YES",
    },
  },
  {
    name: "Kia EV6 GT",
    price: "$89/day",
    image: "https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicle/ev6/ev6-gt/ev6-gt-my22-exterior-01.png",
    details: {
      kilometer: "400/Day",
      extraKm: "5/Km",
      extraHr: "100/Hr",
      type: "Electric",
      seats: 5,
      luggage: 4,
      fuel: "Electric",
      mt: "NO",
    },
  },
  {
    name: "Hyundai Tucson",
    price: "$79/day",
    image: "https://imgd-ct.aeplcdn.com/664x415/n/cw/ec/115085/tucson-exterior-right-front-three-quarter.jpeg",
    details: {
      kilometer: "320/Day",
      extraKm: "6/Km",
      extraHr: "130/Hr",
      type: "SUV",
      seats: 5,
      luggage: 4,
      fuel: "60L",
      mt: "NO",
    },
  },
  {
    name: "Mini Cooper S",
    price: "$75/day",
    image: "https://www.mini.com/content/dam/mini/common/models/hatch/3-door/lci-2-models/3-door-mcs-header.png",
    details: {
      kilometer: "280/Day",
      extraKm: "7/Km",
      extraHr: "140/Hr",
      type: "Hatchback",
      seats: 4,
      luggage: 2,
      fuel: "45L",
      mt: "YES",
    },
  },
];


const FleetCarousel = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % Math.ceil(cars.length / itemsPerPage));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (index) => {
    setCurrentPage(index);
  };

  const paginatedCars = cars.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="fleet-container">
      <div className="fleet-div">
        <h4>THE CARS</h4>
        <h2>Our Impressive Fleet</h2>
        <div className="fleet-cards">
          {paginatedCars.map((car, index) => {

        const absoluteIndex = currentPage * itemsPerPage + index;

         return(
            <div key={absoluteIndex}
            className={`fleet-card`}
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
                  <button>Rent</button>
                </div>
              </div>

              {/* Hover Info */}
              <div className={`car-hover-info ${hoveredIndex === absoluteIndex ? "car-hover-info-show" : ""}`}>
                <div className="hover-top">
                  <div><strong>{car.details.kilometer}</strong><p>Kilometer</p></div>
                  <div><strong>{car.details.extraKm}</strong><p>Extra Km</p></div>
                  <div><strong>{car.details.extraHr}</strong><p>Extra Hr</p></div>
                </div>
                <div className="hover-bottom">
                <div><FontAwesomeIcon icon={faCarSide} size="lg" /><p>{car.details.type}</p></div>
    <div><FontAwesomeIcon icon={faUserFriends} size="lg" /><p>{car.details.seats}</p></div>
    <div><FontAwesomeIcon icon={faSuitcaseRolling} size="lg" /><p>{car.details.luggage}</p></div>
    <div><FontAwesomeIcon icon={faGasPump} size="lg" /><p>{car.details.fuel}</p></div>
    <div><FontAwesomeIcon icon={faCogs} size="lg" /><p>{car.details.mt}</p></div>
                </div>
              </div>
            </div>
         );
        })}
        </div>

        {/* Dots */}
        <div className="carousel-dots">
          {Array.from({ length: Math.ceil(cars.length / itemsPerPage) }).map((_, i) => (
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
