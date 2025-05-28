import {Status} from "../constants/enums.ts";

export interface HospitalModel {
    id: string;
    name: string;
}

export interface HospitalStateModel {
    hospitals: HospitalModel[],
    status: Status,
    error: string | null
}

export interface HospitalsProps {
    hospitals: HospitalModel[];
    selectedHospitalId: string | null;
    showAllHospitals: boolean;
    onHospitalClick: (hotelId: string | null) => void;
    onToggleShowAll: () => void;
}