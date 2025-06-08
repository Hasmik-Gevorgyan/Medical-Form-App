import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, Typography, Card, Space } from 'antd';
import {loginUser} from '@/services/auth.service';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { fetchUser } from "@/features/authSlice"; 
import type { AppDispatch } from '@/app/store';
import { useState } from 'react';
import type { User } from 'firebase/auth';
import '@/assets/styles/auth.scss';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  const onFinish = (values: LoginFormValues) => {
    handleSignIn({...values})
  };

  const handleSignIn = async ({username, password, remember}: LoginFormValues) => {
    try {
      const logedUser: User = await loginUser({email: username, password, rememberMe: remember});

      dispatch(fetchUser(logedUser?.uid));
      navigate('/');
    } catch (err: { message?: string } | any) {
      const msg = err.message || "Something went wrong. Please try again.";
      
      if (msg.includes("auth/invalid-credential") || 
        msg.includes("auth/user-not-found") || 
        msg.includes("auth/wrong-password") || 
        msg.includes("auth/invalid-email")
      ) {
        setError("Invalid email or password");
      } else if (msg.includes("auth/too-many-requests")) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <Card className='login-card'>
      <Title className='login-title' level={2}>
        Login
      </Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        onValuesChange={() => {
          setError(null);
        }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        {error && <Text type="danger" style={{ textAlign: "center", marginBottom: 16 }}>{error}</Text>}
        <Form.Item>
          <Flex justify="right" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          or <Link to="/register">Register now!</Link>
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
  )
}

export default Login;
