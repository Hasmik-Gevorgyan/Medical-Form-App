// Importing necessary libraries and components
import {useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Checkbox, message, Space } from 'antd';
import { db } from '@/firebase/config'; // Importing Firestore configuration
import { getDoc, doc,updateDoc, serverTimestamp, } from 'firebase/firestore';
import { Typography, Spin,  Input, Button } from 'antd';
import emailjs from '@emailjs/browser' // Importing emailjs for sending emails
import useAuth from '@/hooks/useAuth';

const ResponsePage = () => {
	const [searchParams] = useSearchParams(); // Using search params to get doctorId from URL
//   This page allows doctors to respond to patient requests
  const navigate = useNavigate();
  const requestId = searchParams.get('requestId'); // Getting requestId from URL
  const [isValid, setIsValid] : any = useState(null);
  const [patientData,setPatientData] : any = useState(null); // состояние для хранения данных пациента, если нужно
  const { user,userId: doctorId, isLoading } = useAuth(); // Getting the current user from the auth context
  const [completed, setCompleted] = useState(false); // состояние чекбокса


  useEffect(() => {
	if (isLoading) return; // If loading, do not proceed
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
				console.log('Request data:', data);
				setPatientData(data); 
			} else {
				// If the doctorId does not match, set isValid to false
				setIsValid(false);
			}
		}
		// If the document does not exist, set isValid to false
		else
			setIsValid(false);
	})
  }, [doctorId, requestId, isLoading]);

  const [m,setm] = useState('');

  // mail handler for sending response and updating the response object with status and response 
  const handleFinish = async (values : any) => {
  
	try {
		// Getting the patient data from the request
	  setIsValid(true); // setting isValid to true to allow response
	  const queryDocRef = doc(db, 'queries', requestId || '');
	  const status = completed ? 'completed' : 'in_progress'; // Setting status based on checkbox

	  //   Updating the response in Firestore
	  const docSnap = await getDoc(queryDocRef);

	  let ms = [];
	if (docSnap.exists()) {
		const data = docSnap.data();
		ms = data.messages; // ← this gets the `messages` field
	} 

	ms.push({
		sender: 'doctor',
		about: m,
	  });

	  //   Updating the document with the new message and status
	  await updateDoc(queryDocRef, {
		doctorId: doctorId,
		status: status,
		timestamp: serverTimestamp(),
		messages : ms,
	})



	//   Sending an email to the patient using emailjs
	  await emailjs.send(
		'service_bb7nlek',
		'template_vrnbuod',
		{
		  title : 'Response to your request',
		  name : ms[0].name, // Assuming the first message contains the patient's name
		  time : ms[0].timestamp?.toDate ? new Date(ms[0].timestamp.toDate()).toLocaleString() : '',
		  email: ms[0].email, // Assuming the first message contains the patient's email
		  doctor_name : `${user?.name} ${user?.surname}`, // Assuming user object has name and surname
		  status : status,
		  message: ms[ms.length - 1].about, // The last message is the doctor's response
		  replyTime: new Date().toLocaleString(),
		},
		'ooOyDWjTfU7j0PLn-'
	  );

	//   Displaying success message and redirecting to home page
	  message.success('Response sent and saved successfully!');
	   // Redirecting to home page after successful response
	} catch (error) {
		// Handling errors during the update and email sending process
	  console.error('Error updating response:', error);
	  message.error('Failed to send response. Please try again.');
	}
  };

  const { Text } = Typography;
  
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

return (<div className="chat-box-wrapper">
	<div className="chat-box">
	  {/* Chat part*/}
	  {patientData?.messages?.map((msg : any, index : number) => (
		  <div
		    key={index}
		    className={`chat-message ${msg.sender === 'doctor' ? 'doctor' : 'patient'}`}
		  >
		    <Text className="name">
		      {msg.sender === 'doctor' ? 'You:' : 'Patient:'}
		    </Text>
		    <div className="bubble">{msg.about}</div>
		    <div className="timestamp">
		      {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleString() : ''}
		    </div>
		  </div>
	))}


	{/* Input Area */}
	{patientData.status !== 'completed' && <Space.Compact className="chat-input" style={{ width: '100%' }}>
	  <Input
		placeholder="Type your message..."
		value={m}
		onChange={(e) => setm(e.target.value)}
		onPressEnter={handleFinish}
	  />
	  <Button type="primary" onClick={handleFinish}>
		Send
	  </Button>
	  <Checkbox 
        checked={completed} 
        onChange={(e) => setCompleted(e.target.checked)}
        style={{ marginBottom: 12 }}
      >
        Completed
      </Checkbox>
	</Space.Compact> }
  </div>
  </div>)
};

export default ResponsePage;