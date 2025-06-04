// Imports
import { useNavigate} from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '@/features/doctorSlice';
import { Steps, Button, Form, Input, Select, DatePicker, Upload,Typography, Spin, Avatar, message, Flex, TimePicker } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, IdcardOutlined, LeftOutlined, LoadingOutlined, PushpinOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import "@/pages/style.css"
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import type { AppDispatch } from '@/app/store';
const { Title } = Typography;
const { Step } = Steps;

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

const addRequestToFirestore = async (doctorId: string, values: any) => {
	let fileUrl = '';
	
	// if there is a file, upload it to Firebase Storage and get the URL
	if (values.file) {
		let k = values.file.fileList[0].originFileObj;
		const storageRef = ref(storage, `files/${k.name}`);
		await uploadBytes(storageRef, k);
		fileUrl = await getDownloadURL(storageRef);
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
	const [currentStep, setCurrentStep] = useState(0);
	const [searchParams] = useSearchParams();
	const [form] = Form.useForm();
	const dispatch : AppDispatch = useDispatch();
	const doctors = useSelector((state: any) => state.doctors.doctors);
	// using useParams to get doctorId from the URL
	const [doctorId,setDoctorID] = useState(() => searchParams.get('doctorId') || '');
	// using useNavigate to navigate after form submission
	const navigate = useNavigate();
	// Array to store unavailable dates of the doctor
	let undates : string[] = [];

	
	// Getting unavailable days of doctor by array

	useEffect(() => {
		if (!doctors.length) {
			dispatch(getDoctors());
		}
	}, []);

	useEffect(() => {
		if (!doctorId) return;
		getDoctorUnavailableDates(doctorId).then((d) =>{ console.log(d); undates = d });
	}, [doctorId]);

	// util function for antd DatePicker to check each date for availability
	const disabledDate = (current: any): boolean => {
		return undates.includes(current.format('YYYY-MM-DD')) || current < new Date(); // disable dates that are in the unavailable dates array or in the past
	};


	// asynchron Function for backend after submitting
	const onFinish = async (values: FormValues) => {
		console.log('Form values:', values);
		setLoading(true);
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
	  
const [loading, setLoading] = useState(false);
const spinnerIcon = <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />;

const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

// Function to get initials from name and surname
function getInitials(name: string, surname: string) {
	return `${name[0] || ''}${surname[0] || ''}`.toUpperCase();
}

// Function to handle step change
const handleStepChange = async (step: number, action : number) => {
	if (step < 0 || step > 2) return; // Ensure step is within bounds

	// Validate the current step's form fields before proceeding
	if (action != -1) { 
	try {
		if (step === 0) 
			await form.validateFields(['doctorId', 'name', 'surname', 'email']);
		else if (step === 1)
			await form.validateFields(['about', 'date']);
		else if (step === 2) 
			await form.validateFields();
	}

	catch (error) {
		message.error('Please fill in all required fields before proceeding.');
		return;
	}
}
	setCurrentStep(step + action);
}

const [fromHour, setFromHour] = useState<number | null>(null);



// Render the component
return (
	<>
	  {loading ? (
		// Show loading overlay with spinner when loading
		<div className='loading-overlay'>
		  <Spin indicator={spinnerIcon} tip="Submitting your request..." />
		</div>
	  ) : (
		// Request part of page
		<div className='request-page'>

			{/* The title */}
		  <Title level={2} className='title-heading'>Request an Appointment</Title>

			{/* Steps */}
		  <Steps current={currentStep}>
			<Step title="Select Doctor" />
			<Step title="Fill Details" />
			<Step title="Review & Submit" />
		  </Steps>

			{/* The main form */}
		  <div className='form-container'>
			<Form
			  requiredMark={false} 
			  form={form}
			  layout="vertical"
			  onFinish={onFinish}
			  defaultValue={doctorId}
			>
				{/* Step 1: Select Doctor , name surname, and email */}
				<div style={{display : currentStep === 0 ? 'block' : 'none'}}>
					{/* Select */}
					<Form.Item name="doctorId" label="Select Doctor" rules={[{ required: true, message: 'Please select a doctor!' }]}>
						<Select placeholder="Select a doctor" onChange={(value) => setDoctorID(value)} value={doctorId} allowClear style={{ height: '50px' }}>
							{/* Rendering all doctors for options */}
							{doctors.map((doctor: any) => {
								return (<Select.Option key={doctor.id} value={doctor.id}>
									{/* Doctor option with avatar and name */}
									<div className='doctor-option'>

										<div className='doctor-avatar-wrapper'>
											{doctor.photoUrl && !imageLoaded[doctor.id] ? (
												<img src={doctor.photoUrl} className='doctor-avatar-image' onError={() => setImageLoaded((prev) => ({ ...prev, [doctor.id]: true }))}/>
											) : (
												<span className='doctor-avatar-initials'>
													{getInitials(doctor.name, doctor.surname)}
												</span>
											)}
										</div>
										{doctor.name} {doctor.surname}
									</div>
								</Select.Option>)
							})}
						</Select>
					</Form.Item>
					
					{/* Name */}
					<Form.Item  name="name" label={
						<span>
							<UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
							Your Name
					  </span>
					} rules={[{ required: true, message: 'Please enter your name!' }]}>
						<Input placeholder="Enter your name" />
					</Form.Item>
					{/* Surname */}
					<Form.Item name="surname" label={
						<span>
							<UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
							Your Surname
					  	</span>
					} rules={[{ required: true, message: 'Please enter your surname!' }]}>
						<Input placeholder="Enter your surname" />
					</Form.Item>
					{/* Email */}
					<Form.Item name="email" label={
						<span>
							<MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
							Your Email
					  </span>
					}  rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>
						<Input placeholder="Enter your email" />
					</Form.Item>
				</div>

				{/* Step 2: Fill Details, date and about */}
				<div style={{display : currentStep === 1 ? 'block' : 'none'}}>
					{/* About our Sympthomes */}
					<Form.Item name="about" label={
						<span>
							<IdcardOutlined style={{ marginRight: 8, color: '#1890ff' }} />
							About Your Request
					  </span>
					} rules={[{ required: true, message: 'Please tell us about your request!' }]}>
						<Input.TextArea rows={4} placeholder="Tell us about your request" />		
					</Form.Item>

					{/* Date by day */}
					<Form.Item name="date" label={
						<span>
							<PushpinOutlined style={{ marginRight: 8, color: '#1890ff' }} />
							Select Date
					  </span>
					} rules={[{ required: true, message: 'Please select a date!' }]}>
						<DatePicker 
							style={{ width: '100%' }} 
							disabledDate={disabledDate} 
							format="YYYY-MM-DD" 
							placeholder="Select a date" 
						/>
					</Form.Item>

					{/* From Time Picker */}
					<Form.Item
					  name="fromTime"
					  label={
					    <span>
					      <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
					      From Time
					    </span>
					  }
					  rules={[{ required: true, message: 'Please select a starting time!' }]}
					>
						<TimePicker
							format="HH"
							className="custom-picker"
							minuteStep={15}
							placeholder="Start time"
							onChange={(time) => {
							  if (time) {
								setFromHour(time.hour());
							  } else {
								setFromHour(null);
							  }
							}}
  						/>
					</Form.Item>
					
					{/* To Time Picker */}
					<Form.Item
					  name="toTime"
					  label={
					    <span>
					      <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
					      To Time
					    </span>
					  }
					  rules={[{ required: true, message: 'Please select an ending time!' }]}>
						  <TimePicker
    						format="HH"
    						className="custom-picker"
    						minuteStep={15}
    						placeholder="End time"
  						/>
					</Form.Item>

				</div>


				{/* Buttons for back next submitting */}
				<Form.Item>
					<div className="form-step-buttons">
					  {currentStep > 0 && (
					    <Button
					      onClick={() => handleStepChange(currentStep, -1)}
					      icon={<LeftOutlined />}
					    >
					      Back
					    </Button>
					  )}
					  {currentStep < 3 ? (
					    <Button

					      onClick={() => handleStepChange(currentStep, 1)}
					      icon={<RightOutlined />}
					    >
					      Next
					    </Button>
					  ) : (
					    <Button htmlType="submit" icon={<CheckCircleOutlined />}>
					      Submit
					    </Button>
					  )}
					</div>
				</Form.Item>


			</Form>
		  </div>
		</div>
	  )}
	</>
  );
}  