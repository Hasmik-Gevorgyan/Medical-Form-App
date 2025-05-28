import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter

} from "firebase/firestore";
import {db} from "../firebase/config.ts";
import type {DoctorInfoModel, PaginatedDoctorsResponse} from "../models/doctor.model.ts";
import {COLLECTIONS} from "../constants/collections.ts";

export const DoctorService = () => {
    const DOCTOR_COLLECTION = collection(db, COLLECTIONS.DOCTORS);
    const NAME = "name";
    const DOCTOR_PAGE_SIZE = 5;
    const doctorPageCursors: any[] = [];

    const getDoctors = async (): Promise<DoctorInfoModel[]> => {
        try {
            const snapshot = await getDocs(DOCTOR_COLLECTION);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as DoctorInfoModel));
        } catch (error) {
            throw new Error(`Failed to fetch doctors`);
        }
    }

    const getDoctorsByPage = async (pageNumber: number): Promise<PaginatedDoctorsResponse> => {
        if (pageNumber < 1) throw new Error("Page number must be greater than or equal to 1");

        const cursor = pageNumber > 1 ? doctorPageCursors[pageNumber - 2] : null;
        const doctorQuery = query(
            DOCTOR_COLLECTION,
            orderBy(NAME),
            ...(cursor ? [startAfter(cursor)] : []),
            limit(DOCTOR_PAGE_SIZE)
        );

        try {
            const [snapshot, countSnapshot] = await Promise.all([
                getDocs(doctorQuery),
                getCountFromServer(DOCTOR_COLLECTION),
            ]);

            const doctors = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toISOString(),
            } as DoctorInfoModel));

            if (snapshot.docs.length > 0) {
                doctorPageCursors[pageNumber - 1] = snapshot.docs[snapshot.docs.length - 1];
            }

            return {
                total: countSnapshot.data().count,
                doctors,
            }
        } catch (error) {
            throw new Error(`Failed to fetch doctors`);
        }
    }

    const getDoctor = async (id: string): Promise<DoctorInfoModel | null> => {
        try {
            const doctorRef = doc(DOCTOR_COLLECTION, id);
            const snapshot = await getDoc(doctorRef);

            return snapshot.exists()
                ? { id: snapshot.id, ...snapshot.data() } as DoctorInfoModel
                : null;
        } catch (error) {
            throw new Error(`Failed to fetch doctor with ID ${id}`);
        }
    }

    return {
        getDoctors,
        getDoctor,
        getDoctorsByPage,
    };
}

export default DoctorService();