// Imports
import { useNavigate} from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '@/features/doctorSlice';
import { Steps, Button, Form, Input, Select, DatePicker, Upload,Typography, Spin, Avatar, message, Flex, TimePicker, Modal } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, IdcardOutlined, LeftOutlined, LoadingOutlined, PushpinOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import "@/pages/Session/style.css"
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import type { AppDispatch } from '@/app/store';
import emailjs from '@emailjs/browser'; // Importing emailjs for sending emails
import e from 'cors';
import { wrap } from 'framer-motion';
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
	fromTime?: any; // HH:mm
	toTime?: any; // HH:mm
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
	  return [];
	}
};

const addRequestToFirestore = async (doctorId: string, values: any) => {
	let fileUrl = '';
	
	// if there is a file, upload it to Firebase Storage and get the URL
	if (values.file) {
		let k = values.file[0].originFileObj;
		const storageRef = ref(storage, `files/${k?.name}`);
		await uploadBytes(storageRef, k);
		fileUrl = await getDownloadURL(storageRef);
	}
	// adding request to Firestore


	await addDoc(collection(db, 'queries'), {
		doctorId, // doctorId from url param
		messages : [
				{
					sender : 'patient', // sender of the request
					name: values.name,
					surname: values.surname,
					email: values.email,
					about: values.about || '',
					date: {
						day: values.date.format('YYYY-MM-DD'), // formatted date
						fromTime: values.fromTime, // formatted from time
						toTime: values.toTime, // formatted to time
					},
					fileUrl, // URL of the uploaded file
				},
		],
		status : 'new', // status of the request
		createdAt: serverTimestamp(), // timestamp of request creation
	});
};

const generateTimeOptions = () => {
	const options = [];
	for (let hour = 8; hour <= 20; hour++) {
	  options.push({ value: `${hour}:00`, label: `${hour}:00` });
	  options.push({ value: `${hour}:30`, label: `${hour}:30` });
	}
	return options;
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
	const updatedDates = [...existingDates, selectedDate];

	console.log('Updated unavailable dates:', updatedDates);

  
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

	const undates = useRef<Array<{ day: string; fromTime: string; toTime: string }>>([]);


	
	// Getting unavailable days of doctor by array

	useEffect(() => {
		if (!doctors.length) {
			dispatch(getDoctors());
		}
	}, []);

	useEffect(() => {
		if (!doctorId) return;
		getDoctorUnavailableDates(doctorId).then((d) => {
			undates.current = d.map((date : any) => ({
				day: date.day,
				fromTime: date.fromTime,
				toTime: date.toTime,
			}));
		});
		console.log('Unavailable dates for doctor:', undates.current);
	}, [doctorId]);

	// util function for antd DatePicker to check each date for availability
	const disabledDate = (current: any): boolean => {
		return  current < new Date(); // disable dates that are in the unavailable dates array or in the past
	};

	

	// asynchron Function for backend after submitting
	const onFinish = async (values: FormValues) => {

		console.log(doctors.find((doc: any) => doc.id === doctorId));
		const date = {
			day : values.date.format('YYYY-MM-DD'),
			fromTime: values.fromTime || '',
			toTime: values.toTime || '',
		}

		const toSend = {
			doctorId,
			request: {
				name: values.name,
				surname: values.surname,
				email: values.email,
				about: values.about || '',
				date, // date object with formatted date and times
				fileUrl: values.file, // file URL if exists
				createdAt: serverTimestamp(),
			},
		}


		// if doctorId is not provided, do nothing
		if (!doctorId) return;
		try {
			const doctor = doctors.find((doc: any) => doc.id === doctorId);
		  	await updateDoctorUnavailableDates(doctorId, date);
			await addRequestToFirestore(doctorId, values);
			await emailjs.send(
				'service_bb7nlek',
				'template_9lcfm4f',
				{
					name : values.name,
					day : date.day,
					fromTime: date.fromTime,
					toTime: date.toTime,
					email : values.email,
					doctor : doctor.name + ' ' + doctor.surname,
					logo : '@/assets/logo.png',
				},
				'ooOyDWjTfU7j0PLn-'
			);
			message.success('Request submitted successfully!');
		} catch (error) {
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
	if (step < 0 || step > 4) return; // Ensure step is within bounds

	// Validate the current step's form fields before proceeding
	if (action != -1) { 
	try {
		if (step === 0) 
			await form.validateFields(['doctorId']);
		if (step === 1)
			await form.validateFields(['name', 'surname', 'email']);
		else if (step === 2)
			await form.validateFields(['about', 'date']);
		else if (step === 2) 
			await form.validateFields();
	}

	catch (error) {
		return;
	}
}
	setCurrentStep(step + action);
}

const timeOptions = () => {
	const selectedDate = form.getFieldValue('date');
	const selectedDateStr = selectedDate?.format('YYYY-MM-DD');
  

	const isTimeDisabled = (time: string): boolean => {
	  return undates.current.some((d) =>{
		return d.day === selectedDateStr && time >= d.fromTime && time <= d.toTime
	});
	};

	const options = [];
	for (let h = 8; h <= 18; h++) {
	  for (let m of [0, 30]) {
		const label = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
		options.push({
		  label,
		  value: label,
		  disabled: isTimeDisabled(label),
		});
	  }
	}
	return options;
};

const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
const aboutText = form.getFieldValue('about');
const ABOUT_PREVIEW_LIMIT = 150;

const handleReadMore = () => setIsAboutModalVisible(true);
const handleClose = () => setIsAboutModalVisible(false);

const [_, forceUpdate] = useState(0);
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
			<Step title="Select Doctor"/>
			<Step title="Personal Info" />
			<Step title="Fill Details" />
			<Step title="Review" />
			<Step title="Payment details" />
			<Step title="Token" />
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
					</div>
					
					{/* Step 2 : personal Info */}
					<div className='personal-data' style={{display : currentStep === 1 ? 'block' : 'none'}}>
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

				{/* Step 3: Fill Details, date and about */}
				<div style={{display : currentStep === 2 ? 'block' : 'none'}}>
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
							className="flat-date-picker"
							style={{ width: '100%' }} 
							disabledDate={disabledDate}
							onChange={() => {
								form.setFieldsValue({ fromTime: null, toTime: null });
								forceUpdate((prev) => prev + 1); // Force update to re-render time options
							}}
							format="YYYY-MM-DD" 
							placeholder="Select a date" 
						/>
					</Form.Item>

					{/* From Time Picker */}
					<Form.Item
					  name="fromTime"
					  label={
					    <span>
					      <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff', fontSize: 18 }} />
					      From Time
					    </span>
					  }
					  rules={[{ required: true, message: 'Please select a starting time!' }]}
					>
					  <Select
					    placeholder="Start time"
					    className="flat-time-picker"
					    options={timeOptions()}
					    dropdownClassName="flat-dropdown"
					  />
					</Form.Item>
					
					{/* To Time Picker */}
					<Form.Item
					  name="toTime"
					  label={
					    <span>
					      <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff', fontSize: 18 }} />
					      To Time
					    </span>
					  }
					  rules={[{ required: true, message: 'Please select a starting time!' }]}
					>
					  <Select
					    placeholder="End time"
					    className="flat-time-picker"
					    options={timeOptions()}
					    dropdownClassName="flat-dropdown"
					  />
					</Form.Item>
					<Form.Item
					  name="file"
					  label="Upload File"
					  valuePropName="file"
					  getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
					>
					  <Upload
					    beforeUpload={() => false}
					    maxCount={1}
					    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
					  >
					    <Button icon={<UploadOutlined />}>Select File</Button>
					  </Upload>
					</Form.Item>
				</div>

				{/* Step 3 */}
				<div className="modern-review-container" style={{display : currentStep === 3 ? 'block' : 'none'}}>
				  <h2 className="review-title">
					<IdcardOutlined style={{ marginRight: 8, color: '#1890ff',fontSize:'80px' }} />
				  </h2>
				  <div className="review-grid">
					<div className="review-item">
					  <strong>Doctor: </strong>
					  <span>{doctors.find((doc: any) => doc.id === doctorId)?.name} {doctors.find((doc: any) => doc.id === doctorId)?.surname}</span>
					</div>
					<div className="review-item">
					  <strong>Name: </strong>
					  <span>{form.getFieldValue('name')}</span>
					</div>
					<div className="review-item">
					  <strong>Surname: </strong>
					  <span>{form.getFieldValue('surname')}</span>
					</div>
					<div className="review-item">
					  <strong>Email: </strong>
					  <span>{form.getFieldValue('email')}</span>
					</div>
					<div className="review-item about">
						<strong>About:</strong>
						<p style={{
								display: 'flex',
							}
						}>
						  {form.getFieldValue('about')?.length > ABOUT_PREVIEW_LIMIT
						    ? (
								<>
						        {aboutText.slice(0, ABOUT_PREVIEW_LIMIT)}...
						        <span className="read-more" onClick={handleReadMore}> Read more</span>
								</>
							)
						    : aboutText}						
						</p>
						<Modal
						  title="About"
						  visible={isAboutModalVisible}
						  onCancel={handleClose}
						  footer={null}
						>
						  <p style={{ whiteSpace: 'pre-wrap' }}>{aboutText}</p>
						</Modal>
					</div>
					<div className="review-item date-group">
					  <div className="date-box">
					    <strong>Date:</strong>
					    <span>{form.getFieldValue('date')?.format("YYYY.MM.DD")}</span>
					  </div>
					  <div className="date-box">
					    <strong>From Time:</strong>
					    <span>{form.getFieldValue('fromTime')}</span>
					  </div>
					  <div className="date-box">
					    <strong>To Time:</strong>
					    <span>{form.getFieldValue('toTime')}</span>
					  </div>
					</div>
					
				  </div>
				</div>

				{/* Buttons for back next submitting */}
				<Form.Item>
					<div className="form-step-buttons">
					  {currentStep > 0 && (
					    <Button
					      onClick={() => handleStepChange(currentStep, -1)}
					      icon={<LeftOutlined />}
						  className='arrow-btn'
					    >
					    </Button>
					  )}
					  {currentStep < 4 ? (
					    <Button

					      onClick={() => handleStepChange(currentStep, 1)}
					      icon={<RightOutlined />}
						  className='arrow-btn'
					    >
					    </Button>
					  ) : (
					    <Button htmlType="submit" icon={<CheckCircleOutlined />} className='arrow-btn'> </Button>
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