import {Link} from "react-router";
import type {FC} from "react";
import type {DoctorCardProps} from "@/models/doctor.model.ts";
import {getNamesByIds} from "@/utils/getNamesById.ts";
import {useMemo} from "react";
import {ROUTE_PATHS} from "@/routes/paths.ts";
import {Card} from "antd";
import "@/assets/styles/doctors/doctorCard.scss";

const DoctorCard: FC<DoctorCardProps> = ({
     doctor,
     specifications
 }) => {

    const doctorSpecializations = useMemo(() => {
        return doctor.specificationIds
            ? getNamesByIds(doctor.specificationIds, specifications)
            : [];
    }, [doctor.specificationIds, specifications]);

    return (
        <>
            {doctor.certified ? (
                <Link to={`/${ROUTE_PATHS.DOCTORS}/${doctor.id}`}>
                    <Card className="card-wrapper">
                        {doctor.photoUrl ? (
                            <img
                                alt="doctor"
                                src={doctor.photoUrl}
                                className="doctor-image"
                            />
                        ) : (
                            <img src="https://firebasestorage.googleapis.com/v0/b/medical-project-2ba5d.firebasestorage.app/o/doctorAvatar.png?alt=media&token=e635981c-2c24-4f02-b794-85b89d341e9b" alt="avatar"
                                 className="doctor-avatar"
                            />
                        )}

                        <div>
                            <div style={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                  <span className="doctor-fullname">
                                    {doctor.name} {doctor.surname}
                                  </span>
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/medical-project-2ba5d.firebasestorage.app/o/certified.png?alt=media&token=38886bbe-8f9e-4261-93cf-4c0b7de7a975"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        position: "absolute",
                                        top: -200,
                                        right: 5,
                                        color: "#52c41a",
                                        borderRadius: "50%",
                                        padding: 2
                                    }}
                                    title="Certified Doctor"
                                   />
                            </div>

                            <p className="doctor-specialization">
                                {doctorSpecializations.length ? doctorSpecializations.join(', ') : 'N/A'}
                            </p>
                        </div>
                    </Card>
                </Link>) : ""}
        </>
    )
}

export default DoctorCard;
