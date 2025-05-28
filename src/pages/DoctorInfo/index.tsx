import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getDoctor} from "../../features/doctorSlice.ts";
import {Card, Col, Row} from "antd";
import {Status} from "../../constants/enums.ts";
import {renderStatus} from "../../utils/checkStateStatus.tsx";
import type {DoctorStateModel} from "../../models/doctor.model.ts";
import type {AppDispatch, RootState} from "../../app/store.ts";

const DoctorInfo = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const {doctor, status, error} = useSelector<RootState, DoctorStateModel>(
        (state: RootState) => state.doctors
    );

    const stateStatus = renderStatus(status, error);

    useEffect(() => {
        if (id) {
            dispatch(getDoctor(id));
        }
    }, [id, dispatch]);

    if(stateStatus) {
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
                                    style={{height: "200px", objectFit: "cover"}}
                                />
                            }
                        >
                            <Card.Meta title={`${doctor.name} ${doctor.surname}`} description={doctor.email}/>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={16}>
                        <Card>
                            <h3>About</h3>
                            <p>{doctor.about}</p>
                            <h3>Contact</h3>
                            <p><strong>Phone:</strong> {doctor.phone}</p>
                            <p><strong>Email:</strong> {doctor.email}</p>
                            <h3>Specializations</h3>
                        </Card>
                    </Col>
                </Row>)
            }
        </div>
    );
};

export default DoctorInfo;
