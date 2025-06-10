import { useEffect, useState } from "react";
import { Typography, Card } from "antd";
import "@/assets/styles/healthTips.scss";

const { Text } = Typography;

const healthTips = [
  "💧 Stay hydrated — drink at least 8 glasses of water a day.",
  "🥦 Eat a balanced diet rich in fruits, vegetables, and whole grains.",
  "🛌 Get at least 7–8 hours of quality sleep each night.",
  "🚶 Move more — aim for 30 minutes of moderate activity daily.",
  "😌 Take mental breaks — your mind needs rest too.",
  "🧴 Use sunscreen — protect your skin from harmful UV rays.",
  "🧼 Wash your hands regularly to avoid infections.",
  "💉 Don’t skip checkups — early detection saves lives.",
  "😷 If you’re sick, stay home to protect others.",
  "🧘 Practice mindfulness or meditation to reduce stress.",
];

const HealthTipsRotator = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="health-tips">
      <Card className="health-card">
        <Text strong style={{ fontSize: 16 }}>
          {healthTips[index]}
        </Text>
      </Card>
    </div>
  );
};

export default HealthTipsRotator;
