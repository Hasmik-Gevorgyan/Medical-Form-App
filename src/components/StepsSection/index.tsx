import { Typography, Row, Col } from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  MailOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import bookAppointment from "@/assets/images/book-an-appointment.jpg";
import findDoctor from "@/assets/images/find-a-doctor.jpg";
import payOnline from "@/assets/images/pay-online.jpg";
import confirmCode from "@/assets/images/confirmation-code.jpg";
import chating from "@/assets/images/chatting-with-doctor.jpg";
import "@/assets/styles/stepsBanner.scss";

const { Title, Paragraph } = Typography;

const steps = [
  {
    icon: <SearchOutlined  />,
    title: 'Find the Right Doctor',
    description: 'Tell us about your symptoms or let our smart AI help you find the best doctor for your needs.',
    image: findDoctor
  },
  {
    icon: <CalendarOutlined  />,
    title: 'Book an Appointment',
    description: 'Choose your preferred doctor and time slot. Booking is quick and simple.',
    image: bookAppointment
  },
  {
    icon: <CreditCardOutlined  />,
    title: 'Secure Your Spot',
    description: "Pay online to confirm your appointment. It's safe, secure, and hassle-free.",
    image: payOnline
  },
  {
    icon: <MailOutlined  />,
    title: 'Get Confirmation & Code',
    description: 'Check your email for a confirmation with your unique code to track and access your consultation.',
    image: confirmCode
  },
  {
    icon: <MessageOutlined  />,
    title: 'Chat with Your Doctor',
    description: 'Use your code to start a secure chat with your doctor and get the care you need.',
    image: chating
  },
];

const StepsSection = () => {
  return (
    <section className='steps-section'>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Title level={2}>How Our Medical Consulting App Works</Title>
        <Paragraph className='description'>
          We connect you with <strong>certified doctors</strong> in minutes. Our platform uses <strong>AI technology</strong> to match you with the right medical expert based on your symptoms — fully online, without long waiting times.
        </Paragraph>
      </div>

      {steps.map((step, index) => (
        <Row
          gutter={[32, 32]}
          align="middle"
          justify="space-between"
          key={index}
          style={{
            marginBottom: '3rem',
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
          }}
        >
          <Col xs={24} md={12}>
            <div
              style={{
                textAlign: index % 2 === 0 ? 'right' : 'left',
                padding: '0 1rem',
              }}
            >
              <div style={{ marginBottom: 16 }}>{step.icon}</div>
              <Title level={4}>{step.title}</Title>
              <Paragraph>{step.description}</Paragraph>
            </div>
          </Col>
          <Col xs={24} md={10}>
            {/* Replace with image or animation if desired */}
            <div
              className='step-image'
              style={{backgroundImage: `url(${step.image})`}}
            />
          </Col>
        </Row>
      ))}
    </section>
  );
};

export default StepsSection;
