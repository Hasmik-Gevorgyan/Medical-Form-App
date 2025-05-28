import {Status} from "../constants/enums.ts";

export interface SpecificationModel {
    id: string;
    name: string;
}

export interface SpecificationStateModel {
    specifications: SpecificationModel[],
    status: Status,
    error: string | null
}

export interface SpecificationsProps {
    specifications: SpecificationModel[];
    selectedSpecificationId: string | null;
    showAllSpecs: boolean;
    onSpecificationClick: (specId: string | null) => void;
    onToggleShowAll: () => void;
}