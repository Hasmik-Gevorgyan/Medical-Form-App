import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase/config.ts";
import {COLLECTIONS} from "../constants/collections.ts";
import type {HospitalModel} from "../models/hospitals.model.ts";

export const HospitalsService = () => {
    const HOSPITALS_COLLECTION = collection(db, COLLECTIONS.HOSPITALS);

    const getHospitals = async (): Promise<HospitalModel[]> => {
        try {
            const snapshot = await getDocs(HOSPITALS_COLLECTION);
            return snapshot.docs.map(hospital => ({
                id: hospital.id,
                ...hospital.data(),
            } as HospitalModel));
        } catch (error) {
            throw new Error(`Failed to fetch hospitals`);
        }
    }

    return {getHospitals}
}

export default HospitalsService;