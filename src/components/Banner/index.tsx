import React from 'react';
import { Button, Carousel, Typography } from 'antd';
import { motion } from 'framer-motion';
import bannerImg from '@/assets/images/banner.jpg';
import doctorsBanner from  "@/assets/images/doctors-banner.jpg";
import articleBaneer from "@/assets/images/article-banner.jpg";

import '@/assets/styles/banner.scss'; 
import { ROUTE_PATHS } from '@/routes/paths';
import { NavLink } from 'react-router';

const { Title, Paragraph } = Typography;

const slides = [
  {
    key: 'slide-1',
    image: bannerImg,
    heading: 'Book Appointments Instantly',
    description: 'Schedule your visit with certified doctors anytime, anywhere.',
    button_label: 'Book Appointment',
    link: ROUTE_PATHS.REQUEST
  },
  {
    key: 'slide-2',
    image: doctorsBanner,
    heading: 'Find the Right Doctor',
    description: 'Browse through a network of verified specialists across various fields.',
    button_label: ' See Doctors',
    link: ROUTE_PATHS.DOCTORS
  },
  {
    key: 'slide-3',
    image: articleBaneer,
    heading: 'Stay Informed With Trusted Articles',
    description: 'Discover tips and advice written by medical professionals.',
    button_label: 'See Articles',
    link: ROUTE_PATHS.ARTICLES
  }
]
const Banner: React.FC = () => (
  <div className='banner-slider'>
    <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
      {slides.map(slide => (
        <div key={slide.key}>
          <motion.div
            className='slide-container'
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='shade'/>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '50rem', textAlign: 'center' }}>
              <Title style={{ color: "#fff", fontSize: '3rem' }}>
                {slide.heading}
              </Title>
              <Paragraph style={{ color: "#fff", fontSize: '1.25rem' }}>
                {slide.description}
              </Paragraph>
              <Button  size="large" className='banner-link'>
                <NavLink to={slide.link}>
                  {slide.button_label}
                </NavLink>
              </Button>
            </div>
          </motion.div>
        </div>
      ))}
    </Carousel>
  </div>
);

export default Banner;