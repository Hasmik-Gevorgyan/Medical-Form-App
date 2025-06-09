// // // src/components/ArticleCard.tsx
// // import { Card, Typography } from 'antd';
// // import { Link } from 'react-router-dom';
// // import type { Article } from '@/models/article.model';
// //
// // const { Paragraph } = Typography;
// //
// // const ArticleCard = ({ article }: { article: Article }) => {
// //     return (
// //         <Link to={`/articles/${article.id}`}>
// //             <Card title={article.title} hoverable>
// //                 {article.imageUrl && (
// //                     <img
// //                         src={article.imageUrl}
// //                         alt={article.title}
// //                         style={{
// //                             width: '100%',
// //                             height: 150,
// //                             objectFit: 'cover',
// //                             marginBottom: 10,
// //                             borderRadius: 4,
// //                         }}
// //                     />
// //                 )}
// //                 <Paragraph ellipsis={{ rows: 3 }}>{article.content}</Paragraph>
// //             </Card>
// //         </Link>
// //     );
// // };
// //
// // export default ArticleCard;
// // src/components/ArticleCard.tsx
// import { Card, Typography, Button, Popconfirm, Space } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import type { Article } from '@/models/article.model';
//
// const { Paragraph } = Typography;
//
// interface ArticleCardProps {
//     article: Article;
//     editable?: boolean;
//     onEdit?: () => void;
//     onDelete?: () => void;
// }
//
// const ArticleCard = ({ article, editable = false, onEdit, onDelete }: ArticleCardProps) => {
//     const navigate = useNavigate();
//
//     const handleCardClick = () => {
//         navigate(`/articles/${article.id}`);
//     };
//
//     return (
//         <Card
//             hoverable
//             title={article.title}
//             onClick={handleCardClick}
//             style={{ cursor: 'pointer' }}
//             extra={
//                 editable && (
//                     <Space>
//                         <Button
//                             icon={<EditOutlined />}
//                             size="small"
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onEdit?.();
//                             }}
//                         />
//                         <Popconfirm
//                             title="Are you sure you want to delete this article?"
//                             onConfirm={(e) => {
//                                 e?.stopPropagation();
//                                 onDelete?.();
//                             }}
//                             onCancel={(e) => e?.stopPropagation()}
//                             okText="Yes"
//                             cancelText="No"
//                         >
//                             <Button
//                                 icon={<DeleteOutlined />}
//                                 danger
//                                 size="small"
//                                 onClick={(e) => e.stopPropagation()}
//                             />
//                         </Popconfirm>
//                     </Space>
//                 )
//             }
//         >
//             {article.imageUrl && (
//                 <img
//                     src={article.imageUrl}
//                     alt={article.title}
//                     style={{
//                         width: '100%',
//                         height: 150,
//                         objectFit: 'cover',
//                         marginBottom: 10,
//                         borderRadius: 4,
//                     }}
//                 />
//             )}
//             <Paragraph ellipsis={{ rows: 3 }}>{article.content}</Paragraph>
//         </Card>
//     );
// };
//
// export default ArticleCard;
// src/components/ArticleCard.tsx
import { Card, Typography, Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Article } from '@/models/article.model';

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
            title={article.title}
            onClick={handleCardClick}
            style={{
                borderRadius: 12,
                backgroundColor: 'var(--color-bg-container)',
                color: 'var(--color-text)',
            }}

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
                        height: 160,
                        objectFit: 'cover',
                        marginBottom: 12,
                        borderRadius: 10,
                    }}
                />
            )}
            <Paragraph
                ellipsis={{ rows: 3 }}
                style={{ marginBottom: 0, color: 'var(--color-text)' }}
            >
                {article.content}
            </Paragraph>
        </Card>
    );
};

export default ArticleCard;
