import { Card, Avatar } from "antd";
import { Link } from "react-router";
import { ROUTE_PATHS } from "../../routes/paths.ts";
import type {FC} from "react";
import type {DoctorCardProps} from "../../models/doctor.model.ts";
import {getSpecializationByIds} from "../../utils/getSpecializationById.ts";

const DoctorCard: FC<DoctorCardProps> = ({
       doctor,
       specifications,
       stringToColor
   }) => {

    const doctorSpecializations = doctor.specificationIds
        ? getSpecializationByIds(doctor.specificationIds, specifications)
        : [];

    return (
        <Link to={`/${ROUTE_PATHS.DOCTORS}/${doctor.id}`}>
            <Card
                hoverable
                style={{
                    height: "350px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    overflow: "hidden",
                }}
                cover={
                    doctor.photoUrl ? (
                        <img
                            alt="doctor"
                            src={doctor.photoUrl}
                            style={{
                                height: "220px",
                                width: "100%",
                                objectFit: "cover",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                height: "220px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f2f5",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                            }}
                        >
                            <Avatar
                                size={80}
                                style={{
                                    backgroundColor: doctor.name ? stringToColor(doctor.name) : "#cccccc",
                                    fontSize: "28px",
                                    color: "#fff",
                                }}
                            >
                                {doctor.name?.charAt(0).toUpperCase()}
                                {doctor.surname?.charAt(0).toUpperCase()}
                            </Avatar>
                        </div>
                    )
                }
            >
                <div style={{ textAlign: "center" }}>
                    <p style={{ marginBottom: "6px", fontWeight: 600, fontSize: "16px" }}>
                        {doctor.name} {doctor.surname}
                    </p>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                        Specializations:{" "}
                        {doctorSpecializations.join(", ")}
                    </p>
                </div>
            </Card>
        </Link>
    )
}

export default DoctorCard;
