// Importing necessary libraries and components
import {useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { Typography, Descriptions, Alert, Spin, Form, Input, Button } from 'antd';

const { Title } = Typography;

const ResponsePage = () => {
//   This page allows doctors to respond to patient requests
  const navigate = useNavigate();
  const { doctorId, requestId } = useParams();// получаем ID из URL
  const [isValid, setIsValid] : any = useState(null);
  const [patientData,setPatientData] : any = useState(null); // состояние для хранения данных пациента, если нужно
  
  useEffect(() => {
	// Getting the request document from Firestore
	const ref = doc(db, 'queries', requestId || '');
	
	// Checking if the request exists and if the doctorId matches
	getDoc(ref).then((docSnap) => {
		// If the document exists, check if the doctorId matches
		if (docSnap.exists()) {
			const data = docSnap.data();
			// If the doctorId from the request matches the one in the Request, set isValid to true
			if (data.doctorId === doctorId) {
				setIsValid(true);
				setPatientData(data.request); 
			} else {
				// If the doctorId does not match, set isValid to false
				setIsValid(false);
			}
		}
		// If the document does not exist, set isValid to false
		else
			setIsValid(false);
	})
  }, [doctorId, requestId]);

  // mail handler for sending response and updating the response object with status and response 
  const handleFinish = async () => {
	
   }

  
  if (isValid === null) {
	return (
		<Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />
	) 
	// waiting for validation
  }
  if (!isValid) {
	message.error('You do not have permission to view this request.');
	navigate("/"); // redirecting to home page if not valid
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Response to Request</Title>
	{/* Patient Info */}
      {patientData ? (
        <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="First Name">{patientData.name}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{patientData.surname}</Descriptions.Item>
          <Descriptions.Item label="Email">{patientData.email}</Descriptions.Item>
          <Descriptions.Item label="Request Date">{patientData.date}</Descriptions.Item>
          <Descriptions.Item label="Additional Info">{patientData.about || 'None'}</Descriptions.Item>
          {patientData.fileUrl && (
            <Descriptions.Item label="File">
              <a href={patientData.fileUrl} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <Alert type="warning" message="Patient data not found." />
      )}

	  {/* Response part */}
	<Form layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Your Message">
          <Input.TextArea
            rows={5}
            placeholder="Type your response here..."
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Send Response</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResponsePage;