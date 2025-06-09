import React from 'react';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { registerUser } from '@/services/auth.service';

import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  Row,
  Col,
  Card,
  Typography,
  message,
  Tooltip
} from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { RootState } from '@/app/store';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormValues {
  name: string;
  surname: string;
  email: string;
  phone: string;
  prefix: string;
  gender: string;
  hospitalIds: string[];
  specificationIds: string[];
  password: string;
  confirm: string;
  birthdate: string | Date;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const specifications = useSelector((state: RootState) => state.specifications.specifications);
  const hospitals = useSelector((state: RootState) => state.hospitals.hospitals);

  const handleSignUp = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        ...values,
        phone: `${values.prefix}${values.phone}`,
        birthdate: dayjs(values.birthdate).toDate(),
      });

      form.resetFields();
      message.success('Successfully registered!');
      navigate('/login');
    } catch (err: any) {
      const msg = err.message || "An error occurred during registration.";
      if (msg.includes('email')) form.setFields([{ name: "email", errors: [msg] }]);
      else if (msg.includes('Password')) form.setFields([{ name: "password", errors: [msg] }]);
      else if (msg.includes('Phone')) form.setFields([{ name: "phone", errors: [msg] }]);
      else message.error(msg);
    }
  };

  const disabledBirthdate = (current: dayjs.Dayjs) => {
    return current && current > dayjs().subtract(24, 'year');
  };

  return (
    <Card className="register-card">
      <Title className='register-title' level={2}>Register</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSignUp}
        scrollToFirstError
        initialValues={{ prefix: '+374' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="First Name" rules={[{ required: true }]}>
              <Input placeholder="John" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="surname" label="Last Name" rules={[{ required: true }]}>
              <Input placeholder="Doe" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
          <Input placeholder="email@example.com" />
        </Form.Item>

        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="birthdate" label="Birthdate" rules={[{ required: true }]}>
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={disabledBirthdate}
            placeholder="Select your birthdate"
            defaultPickerValue={dayjs().subtract(24, 'year')}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="prefix" label="Prefix">
              <Select>
                <Option value="+374">+374</Option>
                <Option value="+86">+86</Option>
                <Option value="+87">+87</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="specificationIds" label="Specializations" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Choose specifications"
            optionFilterProp="label"
            options={specifications.map(spec => ({ label: spec.name, value: spec.id }))}
          />
        </Form.Item>

        <Form.Item name="hospitalIds" label="Hospitals" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Choose hospitals"
            optionFilterProp="label"
            options={hospitals.map(h => ({ label: h.name, value: h.id }))}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <span>
              Password&nbsp;
              <Tooltip title="Must be 6+ characters. Include upper/lowercase & numbers.">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true }]}
          hasFeedback
        >
          <Input.Password placeholder="Password" prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return value && value === getFieldValue('password')
                  ? Promise.resolve()
                  : Promise.reject(new Error('Passwords do not match.'));
              },
            }),
          ]}
        >
          <Input.Password onPaste={(e) => e.preventDefault()} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Text>Already have an account? <Link to="/login">Log in</Link></Text>
        </Form.Item>

        <Row justify="space-between">
          <Col>
            <Button type="default" onClick={() => navigate(-1)}>← Go Back</Button>
          </Col>
          <Col>
            <Button type="link" onClick={() => navigate('/')}>Go Home</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Register;
