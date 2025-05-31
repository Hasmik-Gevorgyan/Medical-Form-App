import React, { useState } from 'react';
import { useAppDispatch } from '@/app/hooks.ts';
import { addArticle } from '@/features/articleSlice.ts';
import {Button, Form, Input, Typography, Layout, message, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;
const { Content } = Layout;
import {storage} from "@/firebase/config.ts"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const ArticleForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    //const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleSubmit = async() => {
        //setLoading(true);
        try {
            let imageUrl = '';

            if (image) {
                const imageRef = ref(storage, `articles/${Date.now()}-${image.name}`);
                const snapshot = await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            dispatch(
                addArticle({
                    title,
                    content,
                    authorId: 'user-id-placeholder',
                    createdAt: new Date().toISOString(),
                    imageUrl,
                })
            );

            message.success('Article submitted successfully');
            setTitle('');
            setContent('');
            setImage(null);
        } catch (err) {
            console.error('Error uploading article:', err);
            message.error('Failed to submit article');
        }
        // } finally {
        //     setLoading(false);
        // }
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
                    <Form.Item label="Upload Image (optional)">
                        <Upload
                            beforeUpload={(file) => {
                                setImage(file);
                                return false;
                            }}
                            showUploadList={{ showRemoveIcon: true }}
                            onRemove={() => setImage(null)}
                            accept="image/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Select Image</Button>
                        </Upload>
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
