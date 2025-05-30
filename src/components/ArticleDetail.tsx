import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const article = useAppSelector(state =>
        state.articles.articles.find(article => article.id === id)
    );

    if (!article) return <p>Article not found.</p>;

    return (
        <div style={{ padding: '2rem', backgroundColor: '#fff' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: '1rem' }}
            >
                Back to Articles
            </Button>

            <Title>{article.title}</Title>
            <Paragraph>{article.content}</Paragraph>
        </div>
    );
};

export default ArticleDetail;
