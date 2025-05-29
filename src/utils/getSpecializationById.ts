import type {SpecificationModel} from "../models/specification.model.ts";


export const getSpecializationByIds = (ids: string[], specs: SpecificationModel[]): string[] => {
    return ids
        ?.map(id => specs.find((s: SpecificationModel) => s.id === id)?.name)
        .filter((name): name is string => name != null);
};
