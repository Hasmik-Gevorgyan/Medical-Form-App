// Importing necessary libraries and components
import {useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Checkbox, message } from 'antd';
import { db } from '@/firebase/config'; // Importing Firestore configuration
import { getDoc, doc,updateDoc, serverTimestamp, } from 'firebase/firestore';
import { Typography, Descriptions, Alert, Spin, Form, Input, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import emailjs from '@emailjs/browser' // Importing emailjs for sending emails
const { Title } = Typography;

const ResponsePage = () => {
//   This page allows doctors to respond to patient requests
  const navigate = useNavigate();
  const { doctorId, requestId } = useParams();// получаем ID из URL
  const [isValid, setIsValid] : any = useState(null);
  const [patientData,setPatientData] : any = useState(null); // состояние для хранения данных пациента, если нужно
  const [isRejected, setIsRejected] = useState(false);
  const [form] = Form.useForm();

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
  const handleFinish = async (values : any) => {
  
	try {
		// Getting the patient data from the request
	  setIsValid(true); // setting isValid to true to allow response
	  const queryDocRef = doc(db, 'queries', requestId || '');
	  const status = isRejected ? 'rejected' : 'responded'; // setting status based on isRejected state

	  //   Updating the response in Firestore
	  await updateDoc(queryDocRef, {
		response: {
		  message : values.message,
		  replyTime: serverTimestamp(),
		},
		status: status,
	  });

	//   Sending an email to the patient using emailjs
	  await emailjs.send(
		'service_bb7nlek',
		'template_vrnbuod',
		{
		  title : 'Response to your request',
		  email: patientData.email,
		  message: values.message,
		  replyTime: new Date().toLocaleString(),
		},
		'ooOyDWjTfU7j0PLn-'
	  );

	//   Displaying success message and redirecting to home page
	  message.success('Response sent and saved successfully!');
	  navigate('/'); // Redirecting to home page after successful response
	} catch (error) {
		// Handling errors during the update and email sending process
	  console.error('Error updating response:', error);
	  message.error('Failed to send response. Please try again.');
	}
  };

  
  if (isValid === null) {
	return (
		<Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />
	) 
	// waiting for validation
  }
  
  // If isValid is false, show an error message and redirect to home page
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
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: '0 auto', paddingTop: '2rem' }}
    >
		{/* Message part by status */}
      <Form.Item
        label="Your Message"
        name="message"
        rules={[{ required: !isRejected, message: 'Please enter your response message' }]}
      >
        <Input.TextArea
          rows={5}
          placeholder={isRejected ? 'No message needed if rejected' : 'Type your response here...'}
        />
      </Form.Item>

	  {/* Checkbox to mark as rejected */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={isRejected}
          onChange={(e) => setIsRejected(e.target.checked)}
          style={{ fontWeight: 500 }}
        >
          <CloseCircleFilled style={{ color: '#ff4d4f', marginRight: 6 }} />
          Mark as Rejected
        </Checkbox>
      </div>

	  {/* Value for buttons */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isRejected ? 'Reject' : 'Send Response'}
        </Button>
      </Form.Item>
    </Form>
	</div>	
  );
};

export default ResponsePage;