import React, { useState } from 'react';
import { useAppDispatch } from '@/app/hooks.ts';
import { addArticle } from '@/features/articleSlice.ts';
import { Button, Form, Input, Typography, Layout, message, Upload, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { storage } from '@/firebase/config.ts';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAuth from '@/hooks/useAuth';
import {useNavigate } from 'react-router';
import { ROUTE_PATHS } from '@/routes/paths';

const { Title } = Typography;
const { Content } = Layout;

const ArticleForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const { user, userId } = useAuth();
	const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        try {
            let imageUrl = '';

            if (image) {
                const imageRef = ref(storage, `articles/${Date.now()}-${image.name}`);
                const snapshot = await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            dispatch(
                addArticle({
                    authorId: userId || '',
                    authorName: `${user?.name || ''} ${user?.surname || ''}`,
                    content,
                    createdAt: new Date().toISOString(),
                    imageUrl: imageUrl || '',
                    title,
                })
            );

            message.success('Article submitted successfully');
            navigate('/my-articles'); // Redirect to My Articles page after submission
			setTitle('');
            setContent('');
            setImage(null);
        } catch (err) {
            console.error('Error uploading article:', err);
            message.error('Failed to submit article');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <Content
                style={{
                    width: 1000,
                    margin: 'auto',
                    padding: '40px 24px',
                }}
            >
                <Card
                    style={{
                        borderRadius: 16,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                       // backgroundColor: 'white',
                    }}
                >
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 32, fontWeight: 600 }}>
                        Add New Article
                    </Title>

                    <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: 'Please enter a title' }]}
                            style={{ marginBottom: 24 }}
                        >
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the article title"
                                size="large"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Content"
                            name="content"
                            rules={[{ required: true, message: 'Please enter some content' }]}
                            style={{ marginBottom: 24 }}
                        >
                            <Input.TextArea
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your article here"
                                size="large"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>

                        <Form.Item label="Upload Image (optional)" style={{ marginBottom: 32 }}>
                            <Upload
                                beforeUpload={(file) => {
                                    setImage(file);
                                    return false;
                                }}
                                showUploadList={{ showRemoveIcon: true }}
                                onRemove={() => setImage(null)}
                                accept="image/*"
                                maxCount={1}
                                listType="picture"
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    type="dashed"
                                    size="middle"
                                    style={{ borderRadius: 8, width: '100%' }}
                                >
                                    Select Image
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                style={{
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    letterSpacing: '0.03em',
                                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: 'var(--article-card-header)',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 18px rgba(24, 144, 255, 0.5)')}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)')}
                            >
                                Submit Article
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default ArticleForm;
