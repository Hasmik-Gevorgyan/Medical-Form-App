import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Col, Row, Button, Typography } from 'antd';
import type { SpecificationStateModel } from '@/models/specification.model';
import type { DoctorInfoModel } from '@/models/doctor.model';
import { getDoctorsByPage } from '@/features/doctorSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchArticles } from '@/features/articleSlice';
import { stringToColor } from '@/utils/colorUtils';
import { RightOutlined } from '@ant-design/icons';
import HealthTipsRotator from '@/components/HealthTipsRotator';
import DoctorCard from '@/components/doctors/DoctorCard';
import StepsSection from '@/components/StepsSection';
import ArticleCard from '@/components/ArticleCard';
import Banner from '@/components/Banner';
import FAQ from '@/components/FAQ';
import "@/assets/styles/home.scss";

const { Title } = Typography;

const Home = () => {
  const dispatch: AppDispatch = useDispatch();
  const {specifications} = useSelector<RootState, SpecificationStateModel>((state: RootState) => state.specifications);
  const {articles} = useSelector((state: RootState) => state.articles);
  const {doctors} = useSelector((state: RootState) => state.doctors.doctorsByPage);

    useEffect(() => {
        if (!doctors.length) {
            dispatch(getDoctorsByPage({page: 1, specificationId: ''}));
        }
        if (!articles.length) {
            dispatch(fetchArticles({limit: 10, page: 1}));
        }
    }, []);


  return (
    <div className='home-container'>
      <Banner/>
      <StepsSection />
      <div className='content-container'> 
        <div className='title'>
          <Title level={3}>Featured Doctors</Title>
          <Link to="/doctors">
            <Button type="link" icon={<RightOutlined />} iconPosition='end'>
              See More
            </Button>
          </Link>
        </div>

        <Row gutter={[16, 16]} justify="start">
          {doctors.slice(0,4).map((doctor: DoctorInfoModel) => (
              <Col
                  key={doctor.id}
                  xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}
              >
                  <DoctorCard
                      doctor={doctor}
                      specifications={specifications}
                      stringToColor={stringToColor}
                  />
              </Col>
          ))}
        </Row>

      </div>
      <div className='content-container'>
        <div className='title'>
          <Title level={3}>Articles</Title>
          <Link to="/articles">
            <Button type="link" icon={<RightOutlined />} iconPosition='end'>
              See More
            </Button>
          </Link>
        </div>

        <Row gutter={[16, 16]} justify="start">
          {articles.slice(0,2).map((article) => (
            <Col xs={24} sm={12} key={article.id}>
              <ArticleCard article={article}/>
            </Col>
          ))}
        </Row>
      </div>
      <HealthTipsRotator />
      <FAQ />
    </div>
  );
}

export default Home;