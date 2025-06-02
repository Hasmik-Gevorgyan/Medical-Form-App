import {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDoctor} from "@/features/doctorSlice.ts";
import {Avatar, Button, Card, Col, Rate, Row, Space, Tabs, Typography} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import {MessageOutlined, UserOutlined} from "@ant-design/icons";
import {Status} from "@/constants/enums.ts";
import {renderStatus} from "../../utils/checkStateStatus.tsx";
import type {ActivityModel, DoctorStateModel, EducationModel} from "@/models/doctor.model.ts";
import type {AppDispatch, RootState} from "@/app/store.ts";
import {getNamesByIds} from "@/utils/getSpecializationById.ts";
import type {SpecificationStateModel} from "@/models/specification.model.ts";
import ReviewModal from "../../components/doctors/ReviewModal";
import type {ReviewStateModel} from "@/models/review.model.ts";
import {getReviews} from "@/features/reviewSlice.ts";
import {dateFormatting} from "@/utils/dateFormatting.ts";
import type {HospitalStateModel} from "@/models/hospitals.model.ts";
import "./style.css";

const {Title, Text} = Typography;

const DoctorInfo = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isReviewModalVisible, setIsReviewModalVisible] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const {doctor, status, error} = useSelector<RootState, DoctorStateModel>(
        (state: RootState) => state.doctors
    );
    const {reviews} = useSelector<RootState, ReviewStateModel>(
        (state: RootState) => state.reviews
    );
    const {specifications} = useSelector<RootState, SpecificationStateModel>(
        (state: RootState) => state.specifications
    );
    const {hospitals} = useSelector<RootState, HospitalStateModel>(
        (state: RootState) => state.hospitals
    );
    const stateStatus = renderStatus(status, error);

    useEffect(() => {
        if (id) {
            dispatch(getDoctor(id));
            dispatch(getReviews(id));
        }
    }, [id]);

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    }, [reviews]);

    const doctorSpecifications = useMemo(() => {
        return doctor.specificationIds
            ? getNamesByIds(doctor.specificationIds, specifications)
            : [];
    }, [doctor.specificationIds, specifications]);

    const doctorHospitals = useMemo(() => {
        return doctor.hospitalIds ? getNamesByIds(doctor.hospitalIds, hospitals) : [];
    }, [doctor.hospitalIds, hospitals]);


    const showModal = () => {
        setIsReviewModalVisible(true);
    };

    if (stateStatus) {
        return stateStatus;
    }

    return (
        <div style={{padding: "20px"}}>
            {status === Status.SUCCEEDED && (
                <Row gutter={[24, 24]} style={{width: '100%'}}>
                    <Col xs={24} sm={10} md={8}
                         style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        {doctor.photoUrl ? (
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={`${doctor.name} ${doctor.surname}`}
                                        src={doctor.photoUrl}
                                        style={{
                                            width: '300px',
                                            height: 300,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                }
                                style={{
                                    height: 300,
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    overflow: 'hidden',
                                }}
                            />
                        ) : (
                            <Card
                                hoverable
                                style={{
                                    width: 350,
                                    height: 300,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <Avatar size={120} icon={<UserOutlined/>}/>
                            </Card>
                        )}
                    </Col>

                    <Col xs={24} sm={14} md={16}>
                        <Row
                            style={{
                                height: 300,
                                borderRadius: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Title level={3} style={{marginBottom: 16, textAlign: 'left'}}>
                                {doctor.name} {doctor.surname}
                            </Title>

                            <Space direction="vertical" size="middle" style={{width: '100%'}}>
                                <Row>
                                    <Col span={8}>
                                        <Text strong>Phone</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctor.phone || 'N/A'}</Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={8}>
                                        <Text strong>Email</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctor.email || 'N/A'}</Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={8}>
                                        <Text strong>Hospitals</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text><Text>{doctorHospitals.length ? doctorHospitals.join(', ') : 'N/A'}</Text></Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={8}>
                                        <Text strong>Specializations</Text>
                                    </Col>
                                    <Col span={16}>
                                        <Text>{doctorSpecifications.length ? doctorSpecifications.join(', ') : 'N/A'}</Text>
                                    </Col>
                                </Row>

                                {reviews.length > 0 && (
                                    <Row align="middle" style={{marginTop: 16}}>
                                        <Col>
                                            <Rate allowHalf disabled defaultValue={averageRating}/>
                                        </Col>
                                    </Row>
                                )}
                            </Space>
                        </Row>
                    </Col>
                </Row>
            )}

            <Tabs defaultActiveKey="1" style={{margin: "20px"}} className="tabs">
                <TabPane tab="Education" key="1">
                    {doctor.education?.length ? (
                        <Card
                            style={{
                                marginBottom: "10px",
                                border: "none",
                                padding: "16px 20px"
                            }}
                        >
                            {doctor.education?.map((education: EducationModel, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: "12px",
                                        textAlign: "left",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {education.endYear
                                            ? `${education.startYear} - ${education.endYear}`
                                            : `Since ${education.startYear}`}
                                    </div>
                                    <div>
                                        {education.institution}
                                        {education.profession && `, ${education.profession}`}
                                    </div>
                                    {doctor.education && index < doctor.education.length - 1 && (
                                        <hr
                                            style={{
                                                border: "none",
                                                borderTop: "1px solid #f0f0f0",
                                                margin: "12px 0",
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </Card>) : ''}
                </TabPane>

                <TabPane tab="Activity" key="2">
                    {doctor.activity?.length ? (
                        <Card
                            style={{
                                marginBottom: "10px",
                                border: "none",
                                padding: "16px 20px"
                            }}
                        >
                            {doctor.activity?.map((activity: ActivityModel, index) => (
                                <>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            marginBottom: "4px",
                                            textAlign: "left",
                                        }}
                                    >
                                        {activity.endYear
                                            ? `${activity?.startYear} - ${activity.endYear}`
                                            : `Since ${activity.startYear}`}
                                    </div>
                                    <div style={{textAlign: "left"}}>
                                        {activity.organization}
                                        {activity.profession && `, ${activity.profession}`}
                                    </div>
                                    {doctor.activity && index < doctor.activity.length - 1 && (
                                        <hr
                                            style={{
                                                border: "none",
                                                borderTop: "1px solid #f0f0f0",
                                                margin: "12px 0",
                                            }}
                                        />
                                    )}
                                </>
                            ))}
                        </Card>) : ''}

                </TabPane>
                <TabPane tab="Reviews" key="3" style={{position: 'relative'}}>
                    <Row justify="end" style={{margin: '20px'}}>
                        <Button type="primary"
                                size="large"
                                variant="outlined"
                                onClick={showModal}
                                ghost
                        >
                            Leave Review
                        </Button>
                    </Row>

                    {reviews?.length > 0 ? (
                        reviews.map((review, index) => (
                            <Card
                                key={index}
                                variant={"outlined"}
                                style={{
                                    marginBottom: "15px",
                                    padding: "30px 25px",
                                    boxShadow: "rgba(0, 0, 0, 0.01) 0px 1px 2px 0px, rgba(27, 31, 35, 0.1) 0px 0px 0px 1px",
                                    borderRadius: "8px",
                                    backgroundColor: "#fff",
                                    textAlign: "left"
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 8
                                }}>
                                    <div style={{fontWeight: "bold", fontSize: 16}}>
                                        {review.name} {review.surname}
                                    </div>
                                    <Rate disabled defaultValue={review.rating}/>
                                </div>
                                <div style={{marginBottom: "10px", fontSize: 14, color: "#444"}}>
                                    {review.comment}
                                </div>
                                <div style={{fontStyle: "italic", fontSize: 12, color: "#888"}}>
                                    {dateFormatting(review.createdAt)}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div style={{textAlign: "center", margin: "20px 0", color: "#999", fontStyle: "italic"}}>
                            No reviews yet!
                        </div>
                    )}
                    <ReviewModal isModalVisible={isReviewModalVisible}
                                 setIsModalVisible={setIsReviewModalVisible} doctorId={id ?? ''}/>
                </TabPane>
            </Tabs>

            <div style={{position: "relative"}}>
                <Button
                    type="primary"
                    icon={<MessageOutlined/>}
                    size="large"
                    style={{
                        padding: "22px 30px",
                        position: "fixed",
                        bottom: "24px",
                        right: "40px",
                        zIndex: 1000,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => {
                        navigate(`/request/doctor?doctorId=${doctor.id}`)
                    }}
                >
                    Chat Now
                </Button>
            </div>
        </div>
    )
}

export default DoctorInfo;
