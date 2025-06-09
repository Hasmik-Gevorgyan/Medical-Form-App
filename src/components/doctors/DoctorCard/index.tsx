import {Link} from "react-router";
import type {FC} from "react";
import type {DoctorCardProps} from "@/models/doctor.model.ts";
import {getNamesByIds} from "@/utils/getNamesById.ts";
import {useMemo} from "react";
import {ROUTE_PATHS} from "@/routes/paths.ts";
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
        <Link to={`/${ROUTE_PATHS.DOCTORS}/${doctor.id}`}>
            <div className="card-wrapper">
                {doctor.photoUrl ? (
                    <img
                        alt="doctor"
                        src={doctor.photoUrl}
                        className="doctor-image"
                    />
                ) : (
                    <img src="public/doctorAvatar.png" alt="avatar"
                         className="doctor-avatar"
                    />
                )}

                <div>
                    <div style={{position: "relative", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px"}}>
                      <span className="doctor-fullname">
                        {doctor.name} {doctor.surname}
                      </span>
                        {doctor.certified && (
                            <img
                                src="public/certified.png"
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
                        )}
                    </div>

                    <p className="doctor-specialization">
                        {doctorSpecializations.length ? doctorSpecializations.join(', ') : 'N/A'}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default DoctorCard;
