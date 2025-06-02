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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import SpecificationService from '@/services/specification.service';
import HospitalService from '@/services/hospitals.service';
import dayjs from 'dayjs';

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

  useEffect(() => {
    // console.log('initialData.birthdate:', initialData.birthdate);

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
      form.setFieldsValue({
        ...initialData,birthdate: initialData.birthdate
  ? initialData.birthdate.toDate
    ? dayjs(initialData.birthdate.toDate())
    : dayjs(initialData.birthdate) // если строка или Date
  : null,

        education:
          initialData.education?.map((e: any) => ({
            ...e,
            dateFrom: e.dateFrom ? dayjs(e.dateFrom) : null,
            dateTo: e.dateTo ? dayjs(e.dateTo) : null,
          })) || [],
      });
    }
  }, [initialData, form]);

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
              dateFrom: e.dateFrom?.toDate()?.toISOString(),
            };
            if (e.dateTo) {
              entry.dateTo = e.dateTo.toDate().toISOString();
            }
            return entry;
          })
          .filter((e: any) => e.institution && e.dateFrom),
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
    <Form form={form} layout="vertical" onFinish={handleSave}>
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
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
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
    // Ограничение: только от 100 до 18 лет назад
    disabledDate={(current) => {
      const today = dayjs();
      return (
        current > today.subtract(18, 'year') ||
        current < today.subtract(100, 'year')
      );
    }}
    // Открывать сразу на дате 18 лет назад (чтобы не листать)
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
                  rules={[
                    { required: true, message: 'Please input institution' },
                  ]}
                >
                  <Input placeholder="University" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'dateFrom']}
                  rules={[
                    { required: true, message: 'Start date required' },
                  ]}
                >
                  <DatePicker placeholder="Start Date" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'dateTo']}
                  rules={[{ required: true, message: 'End date required'}]}
                >
                  <DatePicker placeholder="End Date (optional)" />
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
    optionFilterProp="label" // чтобы фильтровать по label
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
    optionFilterProp="label" // чтобы фильтровать по label
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
          // Проверяем тип файла — HEIC
          if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            message.error('HEIC files are not supported');
            // Запрещаем загрузку файла
            return Upload.LIST_IGNORE;
          }
          // Разрешаем загрузку, сохраняем файл в состояние
          setPhotoFile(file);
          return false; // Чтобы не загружать автоматически, а управлять вручную
        }}
        showUploadList={{ showRemoveIcon: true }}
        maxCount={1}
        onRemove={() => setPhotoFile(null)}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
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
