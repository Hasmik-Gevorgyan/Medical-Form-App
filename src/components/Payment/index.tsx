import { createPaymentIntent } from "@/services/payment.service";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import {
  Input,
  Button,
  Alert,
  Typography,
  Col,
  Divider,
  Row,
  Card,
  Result,
} from "antd";
import "@/assets/styles/payment.scss";
import useThemeMode from "@/hooks/useThemeMode";

const { Title, Text } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);



const CheckoutForm = ({onPayment}:IPaymentComponentProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { theme } = useThemeMode();

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.");
      setProcessing(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card Number Element not found.");
      setProcessing(false);
      return;
    }

    try {
      const clientSecret = await createPaymentIntent(5000); // $50.00

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error.message);
        setError(result.error.message || "Payment failed.");
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true)
        onPayment()
      }
    } catch (err: any) {
      setError(err.message || "Payment error");
    } finally {
      setProcessing(false);
    }
  };


  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: theme=="dark" ? '#A3B1C2' : '#283353',
        '::placeholder': {
          color: theme=="dark" ? '#A3B1C2' : '#283353',
        },
      },
    },
  };

  return (
    <div className="payment-container">
      <Card className="payment-card ">
        {error && (
          <Alert
            type="error"
            message="Payment Failed"
            description={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Title level={3}>Payment</Title>

        <label>Cardholder Name</label>
        <Input
          placeholder="John Doe"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <label>Card Number</label>
        <div className="card-input">
          <CardNumberElement options={CARD_ELEMENT_OPTIONS}/>
        </div>

        <Row gutter={12} style={{ marginTop: 16 }}>
          <Col span={12}>
            <label>Expiration</label>
            <div className="card-input">
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS}/>
            </div>
          </Col>
          <Col span={12}>
            <label>CVC</label>
            <div className="card-input">
              <CardCvcElement options={CARD_ELEMENT_OPTIONS}/>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row style={{ marginTop: 12 }}>
          <Col span={12}>
            <Text strong>Total Amount</Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Text strong>$7.61</Text>
          </Col>
        </Row>

        <Button
          type="primary"
          block
          onClick={handlePayment}
          style={{ marginTop: 24 }}
          loading={processing}
          disabled={processing}
        >
          Checkout
        </Button>
      </Card>
      {paymentSuccess && (
        <div  className="success-overlay">
          <Result
          status="success"
          title="Successful!"
          style={{ marginTop: 48 }}
        />
        </div>
      )}
    </div>
  );
};

const cardInputStyle = {
  border: "1px solid #d9d9d9",
  borderRadius: 6,
  padding: 10,
  marginBottom: 16,
  color: "var(--color-text)"
};

interface IPaymentComponentProps {
  onPayment: () => void
}
const PaymentComponent = ({onPayment}:IPaymentComponentProps) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm  onPayment={onPayment}/>
  </Elements>
);

export default PaymentComponent;
