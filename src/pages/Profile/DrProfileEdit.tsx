import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  DatePicker,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { db, storage } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import SpecificationService from '@/services/specification.service';
import HospitalService from '@/services/hospitals.service';
import dayjs from 'dayjs';
import './drprofileedit.css'

const { Option } = Select;

interface Props {
  doctorId: string | null;
  initialData: any;
  onSave: () => void;
}

const DrProfileEdit: React.FC<Props> = ({ doctorId, initialData, onSave }) => {
  const [form] = Form.useForm();
  const [specs, setSpecs] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    SpecificationService()
      .getSpecifications()
      .then((data) => {
        if (Array.isArray(data)) {
          setSpecs(data.filter((item) => item?.name && item?.id));
        }
      });

    HospitalService()
      .getHospitals()
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data.filter((item) => item?.name && item?.id));
        }
      });

    if (initialData) {
      if (initialData.photoUrl) setCurrentPhotoUrl(initialData.photoUrl);

      form.setFieldsValue({
        ...initialData,
        birthdate: initialData.birthdate
          ? initialData.birthdate.toDate
            ? dayjs(initialData.birthdate.toDate())
            : dayjs(initialData.birthdate)
          : null,
        education:
          initialData.education?.map((e: any) => ({
            ...e,
            startYear: e.startYear ? dayjs(e.startYear) : null,
            endYear: e.endYear ? dayjs(e.endYear) : null,
          })) || [],
      });
    }
  }, [initialData, form]);

  const handleDeletePhoto = async () => {
    if (!doctorId || !currentPhotoUrl) return;

    try {
      const photoRef = ref(storage, currentPhotoUrl);
      await deleteObject(photoRef);
      await updateDoc(doc(db, 'doctors', doctorId), {
        photoUrl: '',
      });
      message.success('Photo deleted');
      setCurrentPhotoUrl(null);
    } catch (err) {
      console.error(err);
      message.error('Failed to delete photo');
    }
  };

  const handleSave = async (values: any) => {
    if (!doctorId) {
      message.error('Doctor ID is missing');
      return;
    }

    setLoading(true);

    try {
      const cleaned: any = {
        name: values.name?.trim(),
        surname: values.surname?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim(),
        gender: values.gender,
        birthdate: values.birthdate?.toDate()?.toISOString() || '',
        specificationIds: values.specificationIds || [],
        hospitalIds: values.hospitalIds || [],
        about: values.about?.trim() || '',
        education: (values.education || [])
          .map((e: any) => {
            const entry: any = {
              institution: e.institution?.trim(),
              startYear: e.startYear?.toDate()?.toISOString(),
            };
            if (e.endYear) {
              entry.endYear = e.endYear.toDate().toISOString();
            }
            return entry;
          })
          .filter((e: any) => e.institution && e.startYear),
      };

      if (
        !cleaned.name ||
        !cleaned.surname ||
        !cleaned.email ||
        !cleaned.phone ||
        !cleaned.gender ||
        !cleaned.birthdate ||
        !cleaned.specificationIds.length ||
        !cleaned.hospitalIds.length
      ) {
        message.error('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (photoFile) {
        const storageRef = ref(
          storage,
          `doctor_photos/${doctorId}/${photoFile.name}`
        );
        await uploadBytes(storageRef, photoFile);
        const downloadUrl = await getDownloadURL(storageRef);
        cleaned.photoUrl = downloadUrl;
      }

      const docRef = doc(db, 'doctors', doctorId);
      await updateDoc(docRef, cleaned);
      message.success('Profile updated successfully');
      onSave();
    } catch (error) {
      console.error(error);
      message.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      className="drprofile-form"
      form={form}
      layout="vertical"
      onFinish={handleSave}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Surname" name="surname" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
        <Select placeholder="Select gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Birthdate"
        name="birthdate"
        rules={[{ required: true, message: 'Please select your birthdate' }]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          placeholder="Select your birthdate"
          disabledDate={(current) => {
            const today = dayjs();
            return (
              current > today.subtract(18, 'year') ||
              current < today.subtract(100, 'year')
            );
          }}
          defaultPickerValue={dayjs().subtract(18, 'year')}
        />
      </Form.Item>

      <Form.List name="education">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'institution']}
                  rules={[{ required: true, message: 'Please input institution' }]}
                >
                  <Input placeholder="University" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'startYear']}
                  rules={[{ required: true, message: 'Start year required' }]}
                >
                  <DatePicker picker="year" placeholder="Start Year" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'endYear']}
                  rules={[{ required: true, message: 'End year required' }]}
                >
                  <DatePicker picker="year" placeholder="End Year" />
                </Form.Item>
                <Button onClick={() => remove(name)} danger>
                  Delete
                </Button>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Add Education
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        label="Hospitals"
        name="hospitalIds"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={
            Array.isArray(hospitals)
              ? hospitals.map((h) => ({
                  label: h.name,
                  value: h.id,
                }))
              : []
          }
        />
      </Form.Item>

      <Form.Item
        label="Specifications"
        name="specificationIds"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={
            Array.isArray(specs)
              ? specs.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))
              : []
          }
        />
      </Form.Item>

      <Form.Item label="About" name="about">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="Upload Photo">
        <Upload
          beforeUpload={(file) => {
            if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
              message.error('HEIC files are not supported');
              return Upload.LIST_IGNORE;
            }
            setPhotoFile(file);
            return false;
          }}
          showUploadList={{ showRemoveIcon: true }}
          maxCount={1}
          onRemove={() => setPhotoFile(null)}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {currentPhotoUrl && (
          <div style={{ marginTop: 8 }}>
            <img
              src={currentPhotoUrl}
              alt="Current"
              style={{ width: 100, marginRight: 16 }}
            />
            <Button danger onClick={handleDeletePhoto}>
              Delete Photo
            </Button>
          </div>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DrProfileEdit;
