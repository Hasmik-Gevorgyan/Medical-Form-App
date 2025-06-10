import { Card, Typography, Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Article } from '@/models/article.model';
import "@/assets/styles/articles.scss";

const { Paragraph } = Typography;

interface ArticleCardProps {
    article: Article;
    editable?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ArticleCard = ({ article, editable = false, onEdit, onDelete }: ArticleCardProps) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/articles/${article.id}`);
    };

    return (
        <Card
            hoverable
            onClick={handleCardClick}
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                transition: 'box-shadow 0.3s',
                cursor: 'pointer',
            }}
            styles={{
                body: {
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                },
                header: {
                    backgroundColor: 'var(--article-card-header)',
                    minHeight: 80,
                },
            }}

            title={
                <div
                    style={{
                        color: 'var(--article-card-header-text)',
                        fontWeight: 600,
                        fontSize: '20px',
                        lineHeight: '1.4',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 90, // fixed height for consistency (adjust as needed)
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                        }}
                    >
                        {article.title}
                    </div>
                    <div
                        style={{
                            fontSize: '13px',
                            fontWeight: 400,
                            color: 'var(--color-text-secondary, #ccc)',
                            marginTop: 4,
                        }}
                    >
                        By {article.authorName ?? 'Unknown'}
                    </div>
                </div>
            }




            extra={
                editable && (
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.();
                            }}
                        />
                        <Popconfirm
                            title="Are you sure you want to delete this article?"
                            onConfirm={(e) => {
                                e?.stopPropagation();
                                onDelete?.();
                            }}
                            onCancel={(e) => e?.stopPropagation()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Popconfirm>
                    </Space>
                )
            }
        >
            {article.imageUrl && (
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    style={{
                        width: '100%',
                        aspectRatio: '3/2',
                        objectFit: 'cover',
                        marginBottom: 12,
                        borderRadius: 10,
                    }}
                />
            )}

            {/* Separator line */}
            <div
                style={{
                    height: 1,
                    backgroundColor: 'var(--color-border, #e8e8e8)',
                    marginBottom: 12,
                    marginTop: 4,
                }}
            />

            <Paragraph
                ellipsis={{ rows: 3 }}
                style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary, #595959)',
                    margin: 0,
                    padding: '4px 0',
                    flexGrow: 1,
                }}
            >
                {article.content}
            </Paragraph>
        </Card>
    );
};

export default ArticleCard;
