import React from 'react'
import Hero from '../hero/Hero'
import FleetCarousel from '../fleetCarousel/FleetCarousel'
import WhyChoose from '../whychooseus/WhyChooseUs'
import HowItWorks from '../HowItWorks/HowItWorks'
import Achievements from '../Achievements/Achievements'
import DreamCarBanner from '../DreamCarBanner/DreamCarBanner'
import Contact from '../contact/Contact'

const Home = () => {
  return (
    <div className='home'>
      <Hero />
      <FleetCarousel />
      <WhyChoose />
      <HowItWorks />
      <Achievements />
      {/* <DreamCarBanner /> */}
      <Contact />
    </div>
  )
}
export default Home
