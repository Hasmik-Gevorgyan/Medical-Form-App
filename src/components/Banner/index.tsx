// components/Banner.tsx
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import '@/assets/styles/banner.scss'; // SCSS for styling
import bannerImg from '@/assets/images/banner.jpg';

const Banner = () => {
  return (
    <div className="medical-banner" style={{ backgroundImage: `url(${bannerImg})` }}>
      <div className="overlay">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Your Health Comes First
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Trusted doctors. Easy appointments. Better care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/doctors">
            <Button type="primary" size="large">Find a Doctor</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
