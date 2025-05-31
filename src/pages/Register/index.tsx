
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import {registerUser} from '@/services/auth.service';
import React from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Typography,
  message
} from 'antd';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const { Title } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const specifications = useSelector(
    (state: RootState) => state.specifications.specifications
  );

  const hospitals = useSelector(
    (state: RootState) => state.hospitals.hospitals
  );
  
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    handleSignUp({...values})
  };

  const handleSignUp = async ({ name, surname, email, gender, hospitalIds, password, phone, prefix, specificationIds, birthdate}: any) => {
    try {
      await registerUser({
        email,
        password,
        name,
        surname,
        phone: `${prefix}${phone}`,
        gender,
        hospitalIds,
        specificationIds,
        birthdate: dayjs(birthdate).toDate(),
      });

      message.success("Registration successful!");
      form.resetFields();

      navigate('/login');
    } catch (err: any) {

      console.error(err.message);
      const msg = err.message || "An error occurred during registration.";
      switch (err.code) {
        case msg.includes("email"):
          form.setFields([{ name: "email", errors: [msg] }]);
          break;
        case msg.includes("Password"):
          form.setFields([{ name: "password", errors: [msg] }]);
          break;
        case msg.includes("Phone"):
          form.setFields([{ name: "phone", errors: [msg] }]);
          break;
        default:
          message.error(msg);
      }
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 100 }}>
        <Option value="+86">+86</Option>
        <Option value="+87">+87</Option>
        <Option value="+374">+374</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Card
      style={{ width: 600, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", margin: '2rem auto' }}
    >
      <Title level={2} style={{ textAlign: "center", marginTop: 0 }}>
        Register
      </Title>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
        scrollToFirstError
        initialValues={{
          prefix: '+374',
        }}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Surname"
          rules={[
            {
              required: true,
              message: 'Please input your surname!',
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select your gender!' }]}
        >
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="Birthdate"
          rules={[{ required: true, message: 'Please select your birthdate!' }]}
        >
          <DatePicker style={{ width: '100%' }} maxDate={dayjs().subtract(18, "year")} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="specificationIds"
          label="Specification"
          rules={[{ required: true, message: 'Please select a specification!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select a specification"
            allowClear
            options={specifications.map(spec => ({
              label: spec.name,
              value: spec.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="hospitalIds"
          label="Hospital"
          rules={[{ required: true, message: 'Please select a hospital!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select a hospital"
            allowClear
            options={hospitals.map(hospital => ({
              label: hospital.name,
              value: hospital.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
        <Form.Item>
          Already have an account?
          <Link to="/login">
            Log in
          </Link>
        </Form.Item>
      </Form>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Button type="default" onClick={() => navigate(-1)}>
          ← Go Back
        </Button>

        <Button type="link" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Space>
    </Card>
  );
};

export default Register;