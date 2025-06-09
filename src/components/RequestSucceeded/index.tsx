import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/requestSucceeded.scss";
import { ROUTE_PATHS } from "@/routes/paths";

const { Title, Text } = Typography;

const RequestSucceeded: React.FC<{ requestId: string }> = ({ requestId }) => {
  const navigate = useNavigate();
  console.log(`${ROUTE_PATHS.RESPONSE}?requestId=${requestId}`)
  return (
    <Card className="request-succeeded-container">
      <Title level={3}>🎉 Booking Successful!</Title>
      <Text strong>
        Your private request code is:
      </Text>
      <Text className="request-id" copyable>{requestId}</Text>
      <Text type="secondary">
        Please save this code. It’s your private ID to track and view your response. Don’t share it with anyone.
      </Text>

      <div className="btn-container">
        <Button
          type="primary"
          onClick={() => navigate(ROUTE_PATHS.HOME)}
        >
          Go to Home
        </Button>
        <Button onClick={() => navigate(`/${ROUTE_PATHS.RESPONSE}?requestId=${requestId}`)}>
          View My Request
        </Button>
      </div>
    </Card>
  );
};

export default RequestSucceeded;