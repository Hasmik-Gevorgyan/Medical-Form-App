import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { Typography, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import { fetchArticleById } from '@/features/articleSlice.ts';
import "@/assets/styles/articles.scss"


const { Title, Paragraph, Text } = Typography;

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const articleRef = useRef<HTMLDivElement>(null);

    const { articles, loading } = useAppSelector(state => state.articles);

    const articleFromList = articles.find(article => article.id === id);
    const currentArticle = useAppSelector(state => state.articles.currentArticle);
    const article = articleFromList || currentArticle;


    useEffect(() => {
        if (id && !articleFromList) {
            dispatch(fetchArticleById(id));
        }
    }, [id, articleFromList, dispatch]);


    if (!article && loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <Spin size="large" tip="Loading article..." />
            </div>
        );
    }

    if (!article) return <p>Article not found.</p>;

    const handleDownloadPDF = async () => {
        if (!articleRef.current) return;

        try {
            const images = articleRef.current.getElementsByTagName('img');
            await Promise.all(
                Array.from(images).map(img => {
                    if (!img.complete) {
                        return new Promise<void>((resolve, reject) => {
                            img.onload = () => resolve();
                            img.onerror = () => reject();
                        });
                    }
                    return Promise.resolve();
                })
            );

            const canvas = await html2canvas(articleRef.current, {
                useCORS: true,
                allowTaint: false,
                scale: 2,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${article?.title || 'article'}.pdf`);
        } catch (err) {
            message.error("Failed to download PDF.");
            console.error(err);
        }
    };

    return (
        <div className="article-detail">
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="back-button"
            >
                Back to Articles
            </Button>

            <div ref={articleRef}>
                <Title level={2} className="article-title">{article.title}</Title>

                {article.imageUrl && (
                    <img src={article.imageUrl} alt="Article" className="article-image" />
                )}

                <Paragraph className="article-content">{article.content}</Paragraph>

                <div className="article-meta">
                    <Text type="secondary">
                        By <strong>{article.authorName}</strong> •{' '}
                        {dayjs(article.createdAt).format('MMMM D, YYYY')}
                    </Text>
                </div>
            </div>

            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadPDF}
                className="download-button"
            >
                Download as PDF
            </Button>
        </div>
    );
};

export default ArticleDetail;
