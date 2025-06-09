// src/components/ArticleCard.tsx
import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { Article } from '@/models/article.model';

const { Paragraph } = Typography;

const ArticleCard = ({ article }: { article: Article }) => {
    return (
        <Link to={`/articles/${article.id}`}>
            <Card title={article.title} hoverable>
                {article.imageUrl && (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        style={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            marginBottom: 10,
                            borderRadius: 4,
                        }}
                    />
                )}
                <Paragraph ellipsis={{ rows: 3 }}>{article.content}</Paragraph>
            </Card>
        </Link>
    );
};

export default ArticleCard;
