import { Typography, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Panel } = Collapse;

const faqs = [
  {
    question: ' How do I find the right doctor for my symptoms?',
    answer: 'Our smart AI assistant can guide you based on your symptoms, or you can manually browse through our list of certified doctors by specialty and availability.',
  },
  {
    question: 'What happens after I pay?',
    answer: 'You’ll receive a confirmation email with your appointment details and a unique code that lets you track or start your consultation.',
  },
  {
    question: 'Where do I enter the unique code I received?',
    answer: 'To enter your code, go to the "My Appointment" tab in the app. There, you can paste your unique code. Once submitted, you’ll be redirected to your appointment details page where you can view or start the consultation.',
  },
  {
    question: 'Can I book an appointment without knowing which doctor I need?',
    answer: 'Yes! Just tell us your symptoms and our AI will match you with the most suitable doctor based on your condition and preferences.',
  },
  {
    question: 'How will I know if my booking is confirmed?',
    answer: 'AYou’ll receive an email confirmation immediately after payment. This includes your appointment details and a unique code to access your session.',
  },
];

const FAQ = () => {
  return (
    <section style={{ padding: '3rem 0' }}>
      <div style={{margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Frequently Asked Questions
        </Title>
        <Collapse accordion bordered={false} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
          {faqs.map((item, index) => (
            <Panel header={item.question} key={index}>
              <p>{item.answer}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </section>
  );
};

export default FAQ;
