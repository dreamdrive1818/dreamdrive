import React from 'react'
import Hero from '../hero/Hero'
import FleetCarousel from '../fleetCarousel/FleetCarousel'
import WhyChoose from '../whychooseus/WhyChooseUs'
import HowItWorks from '../HowItWorks/HowItWorks'
import Achievements from '../Achievements/Achievements'
import DreamCarBanner from '../DreamCarBanner/DreamCarBanner'

const Home = () => {
  return (
    <div className='home'>
      <Hero />
      <FleetCarousel />
      <WhyChoose />
      <HowItWorks />
      <Achievements />
      {/* <DreamCarBanner /> */}
    </div>
  )
}
export default Home
