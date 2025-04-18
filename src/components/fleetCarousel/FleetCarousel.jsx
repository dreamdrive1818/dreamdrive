import React, { useState, useEffect } from "react";
import "./FleetCarousel.css";


  
  const FleetCarousel = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    
    const cars = [
        {
          name: "BMW M4",
          price: "$89/day",
          image: "https://www.bmw.in/content/dam/bmw/common/all-models/3-series/sedan/2022/navigation/bmw-3-series-sedan-lci-modelfinder.png",
        },
        {
          name: "Audi R8",
          price: "$99/day",
          image: "https://mediaservice.audi.com/media/fast/H4sIAAAAAAAAAFvzloG1tIiBOTrayfuvpGh6-m1zJgaGigIGBgZGoDhTtNOaz-I_2DhCHsCEtzEwF-SlMwJZKUycmbmJ6an6QD4_I3taTmV-aUkxO0grT6IZW1LM5FXvttkx5OyX3LxWaWLSLgZWoC7GeUCCWQhI8KUBCU5VBjAJMm8-iLAD8ZksmRkYWCuAjEgGEODjKy3KKUgsSszVK89MKckQ1DAgEgizu7iGOHr6BAMAWEMXeOkAAAA",
        },
        {
          name: "Tesla Model S",
          price: "$109/day",
          image: "https://preview.thenewsmarket.com/Previews/NCAP/StillAssets/1920x1080/684698_v3.jpg",
        },
        {
          name: "Lamborghini Huracan",
          price: "$129/day",
          image: "https://eminencesupercarhire.co.uk/wp-content/uploads/2024/01/KB9_6483-Edit-removebg-preview.png",
        },
        {
          name: "Porsche 911",
          price: "$139/day",
          image: "https://di-uploads-pod15.dealerinspire.com/autobahnporsche/uploads/2021/10/530x390-Porsche-Images-911_Carrera-removebg-preview.png",
        },
        {
          name: "Mercedes G-Wagon",
          price: "$149/day",
          image: "https://carindia.in/wp-content/uploads/2024/02/G-Diamonds-Web.jpg",
        },
        {
          name: "Ford Mustang",
          price: "$79/day",
          image: "https://www.vdm.ford.com/content/dam/na/ford/en_us/images/mustang/2025/jellybeans/Ford_Mustang_2025_101A_PYZ_882_89W_13A_CON_64F_99H_44U_EBST_DEFAULT_EXT_1.png",
        },
        {
          name: "Nissan GT-R",
          price: "$119/day",
          image: "https://imgd.aeplcdn.com/1056x594/n/63bjpra_1422362.jpg?q=80",
        },
        {
          name: "Toyota Supra",
          price: "$99/day",
          image: "https://automania.co.in/wp-content/uploads/2024/12/SOLIDO-TOYOTA-SUPRA-MK-4-A90-BLACK-S1807606-.jpg",
        },
        {
          name: "Chevrolet Camaro",
          price: "$89/day",
          image: "https://inv.assets.sincrod.com/RTT/Chevrolet/2024/6067833/default/ext_GAZ_deg02.jpg",
        },
        {
          name: "Jaguar F-Type",
          price: "$109/day",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC3y_GKQOQGDQ4BXxPX7W7UarshAZYI84NQ&s",
        },
        {
          name: "Rolls Royce Ghost",
          price: "$159/day",
          image: "https://carzillauae.com/wp-content/uploads/2023/08/Rolls-Royce-Repair-Service-1536x1020-removebg-preview.png",
        },
        {
          name: "Toyota Supra",
          price: "$99/day",
          image: "https://automania.co.in/wp-content/uploads/2024/12/SOLIDO-TOYOTA-SUPRA-MK-4-A90-BLACK-S1807606-.jpg",
        },
        {
          name: "Chevrolet Camaro",
          price: "$89/day",
          image: "https://inv.assets.sincrod.com/RTT/Chevrolet/2024/6067833/default/ext_GAZ_deg02.jpg",
        },
        {
          name: "Jaguar F-Type",
          price: "$109/day",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC3y_GKQOQGDQ4BXxPX7W7UarshAZYI84NQ&s",
        },
        {
          name: "Rolls Royce Ghost",
          price: "$159/day",
          image: "https://carzillauae.com/wp-content/uploads/2023/08/Rolls-Royce-Repair-Service-1536x1020-removebg-preview.png",
        },
      ];
      

 
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(cars.length / itemsPerPage));
      }, 4000);
      return () => clearInterval(interval);
    }, [cars.length]);
  
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
            {paginatedCars.map((car, index) => (
              <div key={index} className="fleet-card">
                <div className="fleet-card-top">
                <img src={car.image} alt={car.name} />
                </div>
                <div className="fleet-card-bot">
                    <div className="fleet-card-bot-name">
                    <h3>{car.name}</h3>
                    </div>
                    <div className="fleet-card-bot-section">
                      <p>Starting at <br /> <span>{car.price}</span></p>
                       <button>Rent</button>
                    </div>
                </div>
                
              </div>
            ))}
          </div>
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
  
