import type {Status} from "../constants/enums.ts";
import type {SpecificationModel} from "./specification.model.ts";
import type {ReviewModel} from "./review.model.ts";
import { Timestamp } from 'firebase/firestore';

export interface DoctorModel {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    birthdate: Timestamp;
    gender: string;
    specificationIds: string[];
    hospitalIds: string[];
}

export interface DoctorInfoModel extends Partial<DoctorModel> {
    about?: string;
    photoUrl?: string;
    unavailableDates?: Date[],
    education?: EducationModel[];
    activity?: ActivityModel[];
    reviews?: ReviewModel[]
}

export interface DoctorStateModel {
    doctors: DoctorInfoModel[],
    doctorsByPage: PaginatedDoctorsResponse,
    doctor: DoctorInfoModel,
    selectedSpecificationId: string,
    searchQuery: string;
    status: Status,
    error: string | null
}

export interface PaginatedDoctorsResponse {
    total: number;
    doctors: DoctorInfoModel[];
}

export interface EducationModel {
    place: string;
    startDate: string;
    endDate: string;
    profession: string;
}

export interface ActivityModel {
    place: string;
    startDate: string;
    endDate: string;
    profession: string;
}

export interface DoctorCardProps {
    doctor: DoctorInfoModel;
    specifications: SpecificationModel[];
    stringToColor: (str: string) => string;
}