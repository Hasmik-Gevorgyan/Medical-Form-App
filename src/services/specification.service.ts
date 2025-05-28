import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase/config.ts";
import {COLLECTIONS} from "../constants/collections.ts";
import type {SpecificationModel} from "../models/specification.model.ts";

export const SpecificationService = () => {
    const SPECIFICATION_COLLECTION = collection(db, COLLECTIONS.SPECIFICATIONS);

    const getSpecifications = async (): Promise<SpecificationModel[]> => {
        try {
            const snapshot = await getDocs(SPECIFICATION_COLLECTION);
            return snapshot.docs.map(spec => ({
                id: spec.id,
                ...spec.data(),
            } as SpecificationModel));
        } catch (error) {
            throw new Error(`Failed to fetch specifications`);
        }
    }

    return {getSpecifications}
}

export default SpecificationService;