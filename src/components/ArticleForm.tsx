import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addArticle } from '../features/articleSlice';

const ArticleForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addArticle({
            title,
            content,
            authorId: 'user-id-placeholder', // replace with auth user ID
            createdAt: '',
        }));
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ArticleForm;
