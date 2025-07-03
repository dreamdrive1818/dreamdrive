import React from 'react'
// import Hero from '../hero/Hero'
import FleetCarousel from '../fleetCarousel/FleetCarousel'
import WhyChoose from '../whychooseus/WhyChooseUs'
import HowItWorks from '../HowItWorks/HowItWorks'
import Achievements from '../Achievements/Achievements'
import Contact from '../contact/Contact'
import Hero2 from '../hero/Hero2/Hero2'
import "./Home.css"
import Testimonial from '../Testimonial/Testimonial'

const Home = () => {
  return (
    <div className='home'>
      {/* <Hero /> */}
      <Hero2 />
      <FleetCarousel />
      <WhyChoose />
      <HowItWorks />
      <Achievements />
      {/* <DreamCarBanner /> */}
      <Contact />
        <Testimonial />
      
    </div>
  )
}
export default Home
