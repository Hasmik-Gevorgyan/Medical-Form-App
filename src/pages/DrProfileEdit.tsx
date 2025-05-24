import { useEffect, useState } from 'react';
import { db, storage } from '../firebase.ts'; // Импортируй firebase.ts
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { Button, Form, Input, Select, Upload, message } from 'antd';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadOutlined } from '@ant-design/icons';
import type { InitialData } from './DoctorProfileView.tsx'; // Импортируй типы из types.ts

const { Option } = Select;

interface DrProfileProps {
  initialData: InitialData;
  onSave: () => void;
  doctorId: string;
}

const DrProfileEdit = ({ initialData, onSave, doctorId }: DrProfileProps) => {
  const [form] = Form.useForm();
  const [specs, setSpecs] = useState<string[]>([]);
  const [fileList, setFileList] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchSpecifications = async () => {
    const snapshot = await getDocs(collection(db, 'specifications'));
    const names = snapshot.docs.map((doc) => doc.data().name);
    setSpecs(names);
  };

  useEffect(() => {
    fetchSpecifications();
    form.setFieldsValue(initialData);
  }, [initialData]);

  const handleFinish = async (values: any) => {
    setUploading(true);
    try {
      let photoURL = initialData.photoUrl || '';
      if (fileList && fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const storageRef = ref(storage, `doctor_photos/${doctorId}/profile_photo`);
        await uploadBytesResumable(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      const updatedData: InitialData = {
        ...initialData,
        ...values,
        photoUrl: photoURL,
      };

      await setDoc(doc(db, 'doctors', doctorId), updatedData, { merge: true });
      message.success('Profile updated successfully');
      onSave();
    } catch (error) {
      console.error('Error', error);
      message.error('Error updating profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Surname" name="surname">
        <Input />
      </Form.Item>
      <Form.Item label="Mail" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone">
        <Input />
      </Form.Item>
      <Form.Item label="Gender" name="gender">
        <Select>
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Specifications" name="specifications">
        <Select
          mode="multiple"
          placeholder="Select specializations"
          allowClear
        >
          {specs.map((spec) => (
            <Option key={spec} value={spec}>
              {spec}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="About" name="about">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="Photo" name="photoUrl">
        <Upload
          accept='image/*'
          listType="picture"
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList }) => {
            if (fileList.length > 0) {
              const isHeic = fileList[0].type === 'image/heic' || fileList[0].name.endsWith('.HEIC') || fileList[0].name.endsWith('.heic');
              if (isHeic) {
                alert('HEIC images are not supported. Please select JPG or PNG.');
              } else {
                setFileList(fileList)
              }


            } else {
              setFileList(fileList);
            }
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select Photo</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DrProfileEdit;

