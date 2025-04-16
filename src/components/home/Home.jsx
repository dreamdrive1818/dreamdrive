import React from 'react'
import Hero from '../hero/Hero'
import './Home.css'
import DealSection from '../DealSection/DealSection'
import Trending from '../Trending/Trending'
import TopSeller from '../TopSeller/TopSeller'
import Testimonial from '../Testimonial/Testimonial'
import CollectionSection from '../Collections/Collectionsection'
import Newsletter from '../Newsletter/Newsletter'

const Home = () => {
  return (
    <div className='home'>
        <Hero />
        <DealSection />
        <Trending />
        <TopSeller />
        <Testimonial />
        <CollectionSection />
        <Newsletter />
    </div>
  )
}

export default Home
