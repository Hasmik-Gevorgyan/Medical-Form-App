import { useState } from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; // adjust path to your Firebase config
import { ROUTE_PATHS } from '@/routes/paths';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CodeModal: React.FC<Props> = ({ open, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleCheckCode = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError('Please enter a code.');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'queries', trimmedCode); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        setError('');
        onClose();
        setCode('')
        navigate(`/${ROUTE_PATHS.RESPONSE}?requestId=${trimmedCode}`);
      } else {
        setError('Invalid appointment code. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
        setError('');
      }}
      title="Appointment Code"
      footer={null}
      centered
      className='code-modal'
    >
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code here"
        onPressEnter={handleCheckCode}
        style={{ marginBottom: 12 }}
      />
      {error && (
        <Typography.Text type="danger" style={{ display: 'block', marginTop: 8 }}>
          {error}
        </Typography.Text>
      )}
      <Button
        type="primary"
        loading={loading}
        block
        onClick={handleCheckCode}
      >
        Submit
      </Button>
    </Modal>
  );
};

export default CodeModal;
