// Imports
import { Button, Form, Input, message, Upload } from 'antd';
import { DatePicker} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {useEffect} from "react";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// Type definition for form

type FormValues = {
	name: string;
	surname: string;
	email: string;
	about?: string;
	date: any; // YYYY-MM-DD
	file?: File;
};


const getDoctorUnavailableDates = async (doctorId: string): Promise<string[]> => {
	
	// getting document from doctors by id in url param
	const doctorRef = doc(db, 'doctors', doctorId);
	const docSnap = await getDoc(doctorRef);
	
	// if we have that doctor getting unavailable dates
	if (docSnap.exists()) {
	  const data = docSnap.data();
	  return data.unavailableDates || [];
	} else {
	  console.error('Документ врача не найден');
	  return [];
	}
};

const addRequestToFirestore = async (doctorId: string, values: FormValues) => {
	let fileUrl = '';
	
	// if there is a file, upload it to Firebase Storage and get the URL
	if (values.file) {
	  const storageRef = ref(storage, `requests/${doctorId}/${values.file.name}`);
	  const snapshot = await uploadBytes(storageRef, values.file);
	  fileUrl = await getDownloadURL(snapshot.ref);
	}
	
	// adding request to Firestore

	await addDoc(collection(db, 'queries'), {
		doctorId, // doctorId from url param
		request : {
			name: values.name,
			surname: values.surname,
			email: values.email,
			about: values.about || '',
			date: values.date.format("YYYY-MM-DD"), // format date to string
			fileUrl, // URL of the uploaded file
		}, // request object with user data
		response : {}, // empty response object
		status : 'new', // status of the request
		createdAt: serverTimestamp(), // timestamp of request creation
	});
};

const updateDoctorUnavailableDates = async (doctorId: string, selectedDate: any) => {
	// getting document from doctors by id in url param
	const doctorRef = doc(db, 'doctors', doctorId);
	// getting asynchronously the document
	const doctorSnap = await getDoc(doctorRef);
  
	// if we have that doctor
	if (!doctorSnap.exists()) {
	  console.error('Doctor not found');
	  return;
	}
  
	// getting existing unavailable dates and adding the new one
	const existingDates = doctorSnap.data().unavailableDates || [];
	const updatedDates = Array.from(new Set([...existingDates, selectedDate.format("YYYY-MM-DD")])); // avoid duplicates and format date to string
  
	// updating the document with new unavailable dates
	await updateDoc(doctorRef, {
	  unavailableDates: updatedDates,
	});
  };

export const RequestPage = () => {
	const [form] = Form.useForm();
	// using useParams to get doctorId from the URL
	const { doctorId } = useParams<{ doctorId: string }>();
	// using useNavigate to navigate after form submission
	const navigate = useNavigate();
	// Array to store unavailable dates of the doctor
	let undates : string[] = [];

	
	// Getting unavailable days of doctor by array
	useEffect(() => {
		if (!doctorId) return;
		getDoctorUnavailableDates(doctorId).then((d) => undates = d);
	}, [doctorId]);

	// util function for antd DatePicker to check each date for availability
	const disabledDate = (current: any): boolean => {
		return undates.includes(current.format('YYYY-MM-DD'));
	};


	// asynchron Function for backend after submitting
	const onFinish = async (values: FormValues) => {
		// if doctorId is not provided, do nothing
		if (!doctorId) return;
		// if date is not selected, show error message
		try {
		  await updateDoctorUnavailableDates(doctorId, values.date);
		  await addRequestToFirestore(doctorId, values);
		  message.success('Request submitted successfully!');
			setTimeout(() => {
		  		navigate('/');
			}
		  , 1000);
		} catch (error) {
		  // if there is an error, log it and show error message	
		  console.error('Error submitting request:', error);
		  message.error('Failed to submit request.');
		}
};
	  


return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto', paddingTop: '2rem' }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input placeholder="Enter your name" />
      </Form.Item>

      <Form.Item
        label="Surname"
        name="surname"
        rules={[{ required: true, message: 'Please enter your surname' }]}
      >
        <Input placeholder="Enter your surname" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Invalid email format' },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item label="About" name="about">
        <Input.TextArea rows={4} placeholder="Tell us about yourself (optional)" />
      </Form.Item>

      <Form.Item label="Attach File" name="file">
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Click to Upload (optional)</Button>
        </Upload>
      </Form.Item>
	  <Form.Item
  		name="date"
  		label="Select Date"
  		rules={[{ required: true, message: 'select date' }]}
		>
  		<DatePicker disabledDate={disabledDate} format="YYYY-MM-DD" style={{ width: '100%' }} />
	</Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Request
        </Button>
      </Form.Item>
    </Form>
  );
};