import {useEffect, useMemo, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDoctor} from "@/features/doctorSlice.ts";
import {Button, Card, Col, Row, Tabs} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import {MessageOutlined} from "@ant-design/icons";
import {Status} from "@/constants/enums.ts";
import {renderStatus} from "../../utils/checkStateStatus.tsx";
import type {ActivityModel, DoctorStateModel, EducationModel} from "@/models/doctor.model.ts";
import type {AppDispatch, RootState} from "@/app/store.ts";
import {getSpecializationByIds} from "@/utils/getSpecializationById.ts";
import type {SpecificationStateModel} from "@/models/specification.model.ts";
import ReviewModal from "../../components/ReviewModal";
import type {ReviewStateModel} from "@/models/review.model.ts";
import {getReviews} from "@/features/reviewSlice.ts";
import {dateFormatting} from "@/utils/dateFormatting.ts";
import "./style.css";

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
    const stateStatus = renderStatus(status, error);

    useEffect(() => {
        if (id) {
            dispatch(getDoctor(id));
            dispatch(getReviews(id));
        }
    }, [id]);

    const doctorSpecifications = useMemo(() => {
        return doctor.specificationIds
            ? getSpecializationByIds(doctor.specificationIds, specifications)
            : [];
    }, [doctor.specificationIds, specifications]);

    const showModal = () => {
        setIsReviewModalVisible(true);
    };

    if (stateStatus) {
        return stateStatus;
    }


    return (
        <div style={{padding: "20px"}}>
            {status === Status.SUCCEEDED && (
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={doctor.name}
                                    src={doctor.photoUrl}
                                    style={{height: "300px", objectFit: "cover"}}
                                />
                            }
                        ></Card>
                    </Col>
                    <Col xs={24} sm={12} md={16}>
                        <Card>
                            <h3 style={{marginBottom: "50px", textAlign: "left"}}>
                                {doctor.name} {doctor.surname}
                            </h3>
                            <Row gutter={[16, 8]}>
                                <Col span={8} style={{textAlign: "left"}}>
                                    <strong>Phone</strong>
                                </Col>
                                <Col span={16} style={{textAlign: "left"}}>{doctor.phone}</Col>
                                <Col span={8} style={{textAlign: "left"}}>
                                    <strong>Email</strong>
                                </Col>
                                <Col span={16} style={{textAlign: "left"}}>{doctor.email}</Col>
                                <Col span={8} style={{textAlign: "left"}}>
                                    <strong>Hospital</strong>
                                </Col>
                                <Col span={16} style={{textAlign: "left"}}>{"N/A"}</Col>
                                <Col span={8} style={{textAlign: "left"}}>
                                    <strong>Specializations</strong>
                                </Col>
                                <Col span={16} style={{textAlign: "left"}}>{doctorSpecifications.join(", ")}</Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            <Tabs defaultActiveKey="1" style={{marginTop: "20px"}} className="tabs">
                <TabPane tab="Education" key="1">
                    {doctor.education?.map((education: EducationModel, index) => (
                        <Card
                            key={index}
                            style={{
                                marginBottom: "10px",
                                border: "none",
                                padding: "8px 0",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "4px",
                                    textAlign: "left",
                                }}
                            >
                                {education.endDate
                                    ? `${education.startDate} - ${education.endDate}`
                                    : `Since ${education.startDate}`}
                            </div>
                            <div style={{textAlign: "left"}}>
                                {education.place}
                                {education.profession && `, ${education.profession}`}
                            </div>
                        </Card>
                    ))}
                </TabPane>
                <TabPane tab="Activity" key="2">
                    {doctor.activity?.map((activity: ActivityModel, index) => (
                        <Card
                            key={index}
                            style={{
                                marginBottom: "10px",
                                border: "none",
                                padding: "8px 0",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "4px",
                                    textAlign: "left",
                                }}
                            >
                                {activity.endDate
                                    ? `${activity?.startDate} - ${activity.endDate}`
                                    : `Since ${activity.startDate}`}
                            </div>
                            <div style={{textAlign: "left"}}>
                                {activity.place}
                                {activity.profession && `, ${activity.profession}`}
                            </div>
                        </Card>
                    ))}
                </TabPane>
                <TabPane tab="Reviews" key="3">
                    <Button
                        type="default"
                        size="large"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 1,
                        }}
                        onClick={showModal}
                    >
                        Leave Review
                    </Button>
                    {reviews?.length > 0 ? (
                        reviews.map((review, index) => (
                            <Card
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    border: "none",
                                    padding: "8px 0",
                                }}
                            >
                                <div style={{fontWeight: "bold", textAlign: "left"}}>
                                    {review.name} {review.surname}
                                </div>
                                <div style={{marginBottom: "4px", textAlign: "left"}}>
                                    {review.comment}
                                </div>
                                <div style={{textAlign: "left", fontStyle: "italic"}}>
                                    {
                                        dateFormatting(review.createdAt)
                                    }
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div style={{textAlign: "center", margin: "20px 0"}}>
                            No reviews yet!
                        </div>
                    )}
                    <ReviewModal isModalVisible={isReviewModalVisible}
                                 setIsModalVisible={setIsReviewModalVisible} doctorId={id}/>
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
                        bottom: "60px",
                        right: "60px",
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

    );
};

export default DoctorInfo;
