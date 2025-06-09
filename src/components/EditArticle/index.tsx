import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateArticle } from '@/features/articleSlice';
import { useNavigate, useParams } from 'react-router-dom';

const EditArticle: React.FC = () => {
    const dispatch = useAppDispatch();
    const { articles } = useAppSelector(state => state.articles);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const article = articles.find(a => a.id === id);

    const [title, setTitle] = useState(article?.title || '');
    const [content, setContent] = useState(article?.content || '');

    useEffect(() => {
        if (!article) {
            // Optionally fetch article or redirect if not found
            navigate('/articles');
        }
    }, [article, navigate]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            message.error('Title and Content are required');
            return;
        }

        try {
            //stex zgush
            await dispatch(updateArticle({ id: id!, title, content, imageUrl: article?.imageUrl })).unwrap();
            message.success('Article updated!');
           // navigate('/articles'); // Redirect back to articles list or detail
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            message.error('Failed to update article');
        }
    };

    return (
        <Form layout="vertical" style={{ maxWidth: 600, margin: 'auto' }}>
            <Form.Item label="Title" required>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Item>
            <Form.Item label="Content" required>
                <Input.TextArea rows={6} value={content} onChange={e => setContent(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={handleSave}>
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditArticle;
