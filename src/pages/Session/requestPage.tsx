// Imports
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '@/features/doctorSlice';
import { Steps, Button, Form, Input, Select, DatePicker, Upload, Typography, Spin, message, Descriptions } from 'antd';
import { ClockCircleOutlined, IdcardOutlined, LeftOutlined, LoadingOutlined, PushpinOutlined, RightOutlined, UploadOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import "@/pages/Session/style.css"
import type { AppDispatch } from '@/app/store';
import emailjs from '@emailjs/browser';
import { getDoctorUnavailableDates, addRequestToFirestore, updateDoctorUnavailableDates, getInitials } from "@/utils/sessionUtils";
import PaymentComponent from "@/components/Payment";
import RequestSucceeded from "@/components/RequestSucceeded";
import "@/assets/styles/request.scss";
import useResponsive from "@/hooks/useResponsive";

const { Title } = Typography;
const { Step } = Steps;

// Form values type definition
type FormValues = {
	name: string;
	surname: string;
	email: string;
	about?: string;
	date: any;
	file?: File;
	fromTime?: any;
	toTime?: any;
};

// Steps titles for the request process
const stepsTitles = [
	"Select a Doctor",
	"Personal Information",
	"Fill in Details",
	"Review & Confirm",
	"Payment",
	"Confirmation" // Final step, completed
];

// Main component for the request page
export const RequestPage = () => {
	// State and hooks initialization
	const [currentStep, setCurrentStep] = useState(0);
	const [searchParams] = useSearchParams();
	const [form] = Form.useForm();
	const dispatch: AppDispatch = useDispatch();
	const doctors = useSelector((state: any) => state.doctors.doctors);
	const [doctorId, setDoctorID] = useState(() => searchParams.get('doctorId') || '');
	const [_, forceUpdate] = useState(0);
	const undates = useRef<Array<{ day: string; fromTime: string; toTime: string }>>([]);
	const [loading, setLoading] = useState(false);
	const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
	const [requestId, setrRquestId] = useState<null | string>(null);
	const { isMobile } = useResponsive();
	
	// Spinner icon for loading state
	const spinnerIcon = <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />;

	useEffect(() => {
		// On first render, check if our doctors stored in the Redux store
		if (!doctors.length) {
			dispatch(getDoctors());
		}
	}, []);


	useEffect(() => {
		// If doctorId is not set, return early
		if (!doctorId) return;
		// Fetch unavailable dates for the selected doctor
		getDoctorUnavailableDates(doctorId).then((d) => {
			undates.current = d.map((date: any) => ({
				day: date.day,
				fromTime: date.fromTime,
				toTime: date.toTime,
			}));
		});
	}, [doctorId]);

	// Effect to set the doctorId from search params if available
	const onFinish = async (values: FormValues) => {

		// creating date object from form values
		const date = {
			day: values.date.format('YYYY-MM-DD'),
			fromTime: values.fromTime || '',
			toTime: values.toTime || '',
		};
		if (!doctorId) return;
		try {
			// Finding the selected doctor from the list of doctors
			const doctor = doctors.find((doc: any) => doc.id === doctorId);
			const doctorName = doctor?.name || '';
			const doctorSurname = doctor?.surname || '';
			
			// Updating the days the doctor is unavailable
			await updateDoctorUnavailableDates(doctorId, date);
			// Adding the request to Firestore
			const result = await addRequestToFirestore(doctorName, doctorSurname, doctorId,values);

			// If the request was successful, set the requestId for user to get and use it for chat
			setrRquestId(result.id);

			// Sending an email notification using EmailJS about successful appointment request
			await emailjs.send(
				'service_bb7nlek',
				'template_9lcfm4f',
				{
					name: values.name,
					day: date.day,
					fromTime: date.fromTime,
					toTime: date.toTime,
					email: values.email,
					doctor: doctor.name + ' ' + doctor.surname,
					logo: '@/assets/logo.png',
				},
				'ooOyDWjTfU7j0PLn-'
			);
			// Resetting the form fields and step
			handleStepChange(currentStep, 1)

			message.success('Request submitted successfully!');
		} catch (error) {
			// If there was an error during the request submission, log it and show an error message
			console.error('Error submitting request:', error);
			message.error('Failed to submit request.');
		} finally {
			setLoading(false);
		}
	};

	// Function to handle step changes in the form
	const handleStepChange = async (step: number, action: number) => {
		// If the step is out of bounds, return early
		if (step < 0 || step > 4) return;

		// If the action is -1 (going back), just set the step
		if (action !== -1) {
			// Validate the current step's form fields before proceeding depending on the step
			try {
				if (step === 0)
					await form.validateFields(['doctorId']);
				if (step === 1)
					await form.validateFields(['name', 'surname', 'email']);
				if (step === 2)
					await form.validateFields(['about', 'date', 'fromTime', 'toTime']);
			} catch (error) {
				return;
			}
		}
		// If the action is -1, just set the step without validation
		setCurrentStep(step + action);
	};

	// Function to generate time options for the time selection dropdown
	const timeOptions = () => {
		const selectedDate = form.getFieldValue('date');
		const selectedDateStr = selectedDate?.format('YYYY-MM-DD');

		// Check if the selected date is valid
		const isTimeDisabled = (time: string): boolean => {
			return undates.current.some((d) => d.day === selectedDateStr && time >= d.fromTime && time <= d.toTime);
		};

		const options = [];
		for (let h = 8; h <= 18; h++) {
			for (let m of [0, 30]) {
				const label = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
				options.push({ label, value: label, disabled: isTimeDisabled(label) });
			}
		}
		return options;
	};

	// Function to handle payment submission
	const onPayment = () => {
		setTimeout(()=>{
			form.submit();
		}, 100)
	}
	
	return (
		<>
		{/* Loading overlay with spinner */}
			{loading ? (
				<div className='loading-overlay'>
					<Spin indicator={spinnerIcon} tip="Submitting your request..." />
				</div>
			) : (
				// Main request page content
				<div className='request-page'>
					{/* Title */}
					<Title level={2} className='title-heading'>Request an Appointment</Title>
					{/* Steps part */}
					<Steps current={currentStep} className="steps-wrapper" responsive>
						{stepsTitles.map((title, index) => (
							<Step key={index} title={isMobile || index === currentStep ? title : ""} />
						))}
					</Steps>
					{/* Form */}
					<div className='form-container'>
						<Form requiredMark={false} form={form} layout="vertical" onFinish={onFinish} initialValues={{ doctorId }}>
							{/* Rendering by step first comes doctor checking */}
							<div style={{display : currentStep === 0 ? 'block' : 'none'}}>
								<Form.Item name="doctorId" label="Select Doctor" rules={[{ required: true, message: 'Please select a doctor!' }]}>
									<Select
										placeholder="Select a doctor"
										onChange={(value) => setDoctorID(value)}
										value={doctorId}
										allowClear
										style={{ height: '50px' }}
									>
										{doctors.map((doctor: any) => {
											if (!doctor.certified) return null; // Skip unverified doctors
											return (
											<Select.Option key={doctor.id} value={doctor.id}>
												<div className='doctor-option'>
													<div className='doctor-avatar-wrapper'>
														{doctor.photoUrl && !imageLoaded[doctor.id] ? (
															<img src={doctor.photoUrl} className='doctor-avatar-image' onError={() => setImageLoaded((prev) => ({ ...prev, [doctor.id]: true }))} />
														) : (
															<span className='doctor-avatar-initials'>
																{getInitials(doctor.name, doctor.surname)}
															</span>
														)}
													</div>
													{doctor.name} {doctor.surname}
												</div>
											</Select.Option>);
										})}
									</Select>
								</Form.Item>
							</div>
							{/* Personal datas */}
							<div style={{display : currentStep === 1 ? 'block' : 'none'}}>
								<Form.Item name="name" label={<><UserOutlined /> Your Name</>} rules={[{ required: true, message: 'Please enter your name!' }]}>
									<Input placeholder="Enter your name" />
								</Form.Item>
								<Form.Item name="surname" label={<><UserOutlined /> Your Surname</>} rules={[{ required: true, message: 'Please enter your surname!' }]}>
									<Input placeholder="Enter your surname" />
								</Form.Item>
								<Form.Item name="email" label={<><MailOutlined /> Your Email</>} rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>
									<Input placeholder="Enter your email" />
								</Form.Item>
							</div>
							{/* Time and file pick option */}
							<div style={{display : currentStep === 2 ? 'block' : 'none'}}>
								<Form.Item name="about" label={<><IdcardOutlined /> About Your Request</>} rules={[{ required: true, message: 'Please tell us about your request!' }]}>
									<Input.TextArea rows={4} placeholder="Tell us about your request" />
								</Form.Item>
								<Form.Item name="date" label={<><PushpinOutlined /> Select Date</>} rules={[{ required: true, message: 'Please select a date!' }]}>
									<DatePicker
										className="flat-date-picker"
										style={{ width: '100%' }}
										disabledDate={(current: any) => current < new Date()}
										onChange={() => {
											form.setFieldsValue({ fromTime: null, toTime: null });
											forceUpdate((prev) => prev + 1);
										}}
										format="YYYY-MM-DD"
										placeholder="Select a date"
									/>
								</Form.Item>
								<Form.Item name="fromTime" label={<><ClockCircleOutlined /> From Time</>} rules={[{ required: true, message: 'Please select a starting time!' }]}>
									<Select placeholder="Start time" className="flat-time-picker" options={timeOptions()} dropdownClassName="flat-dropdown" />
								</Form.Item>
								<Form.Item name="toTime" label={<><ClockCircleOutlined /> To Time</>} rules={[{ required: true, message: 'Please select an ending time!' }]}>
									<Select placeholder="End time" className="flat-time-picker" options={timeOptions()} dropdownClassName="flat-dropdown" />
								</Form.Item>
								<Form.Item name="file" label="Upload File" valuePropName="file" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
									<Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg">
										<Button icon={<UploadOutlined />}>Select File</Button>
									</Upload>
								</Form.Item>
							</div>
							{/* Review part */}
							<div style={{display : currentStep === 3 ? 'block' : 'none'}}>
								<Descriptions
									className="review-table"
									title="Review Your Information"
									bordered
									size="middle"
									column={2} // Responsive columns
								>
									<Descriptions.Item label="Name">
										{form.getFieldValue('name') || '-'}
									</Descriptions.Item>

									<Descriptions.Item label="Surname">
										{form.getFieldValue('surname') || '-'}
									</Descriptions.Item>

									<Descriptions.Item label="Email">
										{form.getFieldValue('email') || '-'}
									</Descriptions.Item>

									<Descriptions.Item label="Doctor">
										{
										(() => {
											const selectedDoctor = doctors.find((doc: any) => doc.id === doctorId);
											return selectedDoctor
											? `${selectedDoctor.name} ${selectedDoctor.surname}`
											: '-';
										})()
										}
									</Descriptions.Item>

									<Descriptions.Item label="Appointment Date">
										{form.getFieldValue('date')?.format('YYYY-MM-DD') || '-'}
									</Descriptions.Item>
									<Descriptions.Item label="Appointment Time">
										{form.getFieldValue('fromTime') || '-'} - {form.getFieldValue('toTime') || '-'}
									</Descriptions.Item>

									<Descriptions.Item label="About" span={2}>
										{form.getFieldValue('about') || '-'}
									</Descriptions.Item>
								</Descriptions>
							</div>
							
							{/* Payment part */}
							{currentStep === 4 &&
								<div>
									<PaymentComponent onPayment={onPayment} consultationPrice={doctors.find((doc: any) => doc.id === form.getFieldValue("doctorId"))?.consultationPrice}/>
								</div>
							}
							{/* Querry Id getting */}
							{currentStep === 5 &&
								<div>
									<RequestSucceeded requestId={requestId || ''}/>
								</div>
							}
							

							{/* Step control buttons */}
							<div className="step-buttons">
								{(currentStep > 0 && currentStep < 4 )&& <Button icon={<LeftOutlined />} onClick={() => handleStepChange(currentStep, -1)}>Back</Button>}
								{currentStep < 3 && <Button type="primary" icon={<RightOutlined />} onClick={() => handleStepChange(currentStep, 1)}>Next</Button>}
								{currentStep === 3 && <Button type="primary" icon={<RightOutlined />} onClick={() => handleStepChange(currentStep, 1)}>Confirm</Button>}
								{/* {currentStep === 5 && <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>Submit</Button>} */}
							</div>
						</Form>
					</div>
				</div>
			)}
		</>
	);
};
