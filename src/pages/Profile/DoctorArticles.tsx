import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { fetchArticles, deleteArticle } from '@/features/articleSlice';
import { useEffect } from 'react';
import { Button, Card, Col, Row, Typography, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const MyArticles = () => {
    const dispatch = useAppDispatch();
    const { articles } = useAppSelector(state => state.articles);
    const currentUser = useAppSelector(state => state.auth.user); // Assuming auth state is available

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    const userArticles = articles.filter(article => article.authorId === currentUser?.id);

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteArticle(id)).unwrap();
            message.success('Article deleted');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error('Failed to delete article');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Title level={3}>My Articles</Title>

            <Row gutter={[16, 16]}>
                {userArticles.map(article => (
                    <Col xs={24} sm={12} key={article.id}>
                        <Card
                            title={article.title}
                            extra={<Link to={`/articles/edit/${article.id}`}>Edit</Link>}
                            actions={[
                                <Popconfirm
                                    title="Are you sure to delete this article?"
                                    onConfirm={() => handleDelete(article.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger type="text">Delete</Button>
                                </Popconfirm>
                            ]}
                        >
                            {article.imageUrl && (
                                <img
                                    src={article.imageUrl}
                                    alt="Thumbnail"
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        objectFit: 'cover',
                                        marginBottom: '10px',
                                        borderRadius: '4px'
                                    }}
                                />
                            )}
                            <Paragraph ellipsis={{ rows: 3 }}>{article.content}</Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default MyArticles;
