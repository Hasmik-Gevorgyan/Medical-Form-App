// Imports
import { Button, Form, Input, Upload } from 'antd';
import { DatePicker} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { doc,getDoc } from 'firebase/firestore';
import {db} from "../firebase";
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {useEffect} from "react";

// Type definition for form

type FormValues = {
	name: string;
	surname: string;
	email: string;
	about?: string;
	date: string; // YYYY-MM-DD
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


export const RequestPage = () => {
	const [form] = Form.useForm();
	const { doctorId } = useParams<{ doctorId: string }>();
	let undates : string[] = [];

	
	console.log('Doctor ID:', doctorId);
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

	const onFinish = async (values : FormValues) => {
		let fileUrl = '';

		// if (values.file && doctorId)
			// fileUrl = await uploadFileToStorage(values.file, doctorId);
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
  		label="Выберите дату"
  		rules={[{ required: true, message: 'Пожалуйста, выберите дату' }]}
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