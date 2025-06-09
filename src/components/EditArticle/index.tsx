// import React, { useState, useEffect } from 'react';
// import { Input, Button, Form, message } from 'antd';
// import { useAppDispatch, useAppSelector } from '@/app/hooks';
// import { updateArticle } from '@/features/articleSlice';
// import { useNavigate, useParams } from 'react-router-dom';
//
// const EditArticle: React.FC = () => {
//     const dispatch = useAppDispatch();
//     const { articles } = useAppSelector(state => state.articles);
//     const navigate = useNavigate();
//     const { id } = useParams<{ id: string }>();
//
//     const article = articles.find(a => String(a.id) === id);
//
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//
//     useEffect(() => {
//         if (article) {
//             setTitle(article.title);
//             setContent(article.content);
//         }
//     }, [article]);
//
//     useEffect(() => {
//         if (!article) {
//             navigate('/articles');
//         }
//     }, [article, navigate]);
//
//     if (!article) return null;
//
//     const handleSave = async () => {
//         if (!title.trim() || !content.trim()) {
//             message.error('Title and Content are required');
//             return;
//         }
//
//         try {
//             await dispatch(
//                 updateArticle({
//                     ...article!,
//                     title,
//                     content,
//                     imageUrl: article?.imageUrl,
//                 })
//             ).unwrap();
//             message.success('Article updated!');
//             navigate(`/articles/${id}`);
//         } catch (err) {
//             message.error('Failed to update article');
//         }
//     };
//
//     return (
//         <Form layout="vertical" style={{ maxWidth: 600, margin: 'auto' }}>
//             <Form.Item label="Title" required>
//                 <Input value={title} onChange={e => setTitle(e.target.value)} />
//             </Form.Item>
//             <Form.Item label="Content" required>
//                 <Input.TextArea rows={6} value={content} onChange={e => setContent(e.target.value)} />
//             </Form.Item>
//             <Form.Item>
//                 <Button type="primary" onClick={handleSave}>
//                     Save
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };
//
// export default EditArticle;

import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Form,
    Input,
    Button,
    Upload,
    Image,
    message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateArticle } from '@/features/articleSlice';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

const { Title } = Typography;
const { Content } = Layout;

const EditArticle: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { articles } = useAppSelector(state => state.articles);

    const article = articles.find(a => a.id === id);
    const [form] = Form.useForm();

    const [imageUrl, setImageUrl] = useState('');
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (article) {
            setImageUrl(article.imageUrl || '');
            form.setFieldsValue({
                title: article.title,
                content: article.content,
            });
        } else {
            navigate('/articles');
        }
    }, [article, form, navigate]);

    const handleSave = async (values: { title: string; content: string }) => {
        const { title, content } = values;

        try {
            let updatedImageUrl = imageUrl;

            if (newImageFile) {
                const imageRef = ref(storage, `articles/${Date.now()}-${newImageFile.name}`);
                const snapshot = await uploadBytes(imageRef, newImageFile);
                updatedImageUrl = await getDownloadURL(snapshot.ref);
            }

            await dispatch(
                updateArticle({
                    ...article!,
                    title,
                    content,
                    imageUrl: updatedImageUrl,
                })
            ).unwrap();

            message.success('Article updated successfully');
            navigate(`/articles/${id}`);
        } catch (err) {
            console.error('Failed to update article:', err);
            message.error('Failed to update article');
        }
    };

    if (!article) return null;

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
                    Edit Article
                </Title>

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSave}
                    initialValues={{
                        title: article.title,
                        content: article.content,
                    }}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input placeholder="Enter the article title" />
                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please enter content' }]}
                    >
                        <Input.TextArea rows={8} placeholder="Update the article content" />
                    </Form.Item>

                    <Form.Item label="Current Image">
                        {imageUrl ? (
                            <Image src={imageUrl} width={200} />
                        ) : (
                            <p>No image uploaded.</p>
                        )}
                    </Form.Item>

                    <Form.Item label="Change Image (optional)">
                        <Upload
                            beforeUpload={file => {
                                setNewImageFile(file);
                                return false;
                            }}
                            showUploadList={{ showRemoveIcon: true }}
                            onRemove={() => setNewImageFile(null)}
                            maxCount={1}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Select New Image</Button>
                        </Upload>
                        {newImageFile && <p>Selected: {newImageFile.name}</p>}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default EditArticle;
