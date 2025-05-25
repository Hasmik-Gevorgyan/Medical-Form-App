import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addArticle } from '../features/articleSlice';
import { Button, Form, Input, Typography, Layout } from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const ArticleForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        dispatch(
            addArticle({
                title,
                content,
                authorId: 'user-id-placeholder',
                createdAt: '',
            })
        );
        setTitle('');
        setContent('');
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <Content
                style={{
                    width: 700,
                    margin: 'auto',
                    padding: '40px 20px',
                    backgroundColor: '#ffffff',
                }}
            >
                <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                    Add New Article
                </Title>

                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter the article title"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please enter some content' }]}
                    >
                        <Input.TextArea
                            rows={8}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Write your article here"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Submit Article
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default ArticleForm;
