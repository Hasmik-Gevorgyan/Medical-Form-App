import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where
} from "firebase/firestore";
import {db, storage} from "../firebase/config.ts";
import type {DoctorInfoModel, PaginatedDoctorsResponse} from "../models/doctor.model.ts";
import {COLLECTIONS} from "../constants/collections.ts";
import {convertFirestoreTimestampToDate} from "@/utils/dateFormatting.ts";
import {getDownloadURL, listAll, ref} from "firebase/storage";

export const DoctorService = () => {
    const DOCTOR_COLLECTION = collection(db, COLLECTIONS.DOCTORS);
    const NAME = "name";
    const DOCTOR_PAGE_SIZE = 8;
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

    const getDoctorsByPage = async (
        pageNumber: number,
        specificationId?: string,
        searchQuery?: string
    ): Promise<PaginatedDoctorsResponse> => {
        if (pageNumber < 1) {
            throw new Error("Page number must be greater than or equal to 1");
        }

        const cursor = pageNumber > 1 ? doctorPageCursors[pageNumber - 2] : null;

        try {
            const filters: any[] = [where("certified", "==", true)];

            if (searchQuery) {
                filters.push(where(NAME, "==", searchQuery));
            }

            if (specificationId) {
                filters.push(where("specificationIds", "array-contains", specificationId));
            }

            const constraints = [
                ...filters,
                orderBy(NAME),
                ...(cursor ? [startAfter(cursor)] : []),
                limit(DOCTOR_PAGE_SIZE),
            ];

            const countQuery = query(DOCTOR_COLLECTION, ...filters);

            const [snapshot, countSnapshot] = await Promise.all([
                getDocs(query(DOCTOR_COLLECTION, ...constraints)),
                getCountFromServer(countQuery),
            ]);

            const doctors: DoctorInfoModel[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    birthdate: convertFirestoreTimestampToDate(data.birthdate, true),
                    createdAt: convertFirestoreTimestampToDate(data.createdAt, true),
                } as DoctorInfoModel;
            });

            // Save cursor for next page
            if (snapshot.docs.length > 0) {
                doctorPageCursors[pageNumber - 1] = snapshot.docs[snapshot.docs.length - 1];
            }

            return {
                total: countSnapshot.data().count,
                doctors,
            };
        } catch(error) {
            throw new Error("Failed to fetch doctors");
        }
    };

    const getDoctor = async (id: string): Promise<DoctorInfoModel | null> => {
        try {
            const doctorRef = doc(DOCTOR_COLLECTION, id);
            const snapshot = await getDoc(doctorRef);

            return snapshot.exists()
                ? {
                    id: snapshot.id,
                    ...snapshot.data(),
                    birthdate: convertFirestoreTimestampToDate(snapshot.data().birthdate, true),
                    createdAt: convertFirestoreTimestampToDate(snapshot.data().createdAt, true),
                } as DoctorInfoModel
                : null;
        } catch (error) {
            throw new Error(`Failed to fetch doctor with ID ${id}`);
        }
    }

    const updateConsultationPrice = async (
        doctorId: string,
        price: string
    ): Promise<DoctorInfoModel | null> => {
        const numericPrice = parseFloat(price.replace(/[^0-9.-]/g, ''));

        if (isNaN(numericPrice) || numericPrice <= 0) {
            throw new Error('Consultation price must be a number');
        }

        if (!/^\$?\d+(\.\d{1,2})?$/.test(price.trim())) {
            throw new Error('Consultation price must be a number with up to 2 decimal places');
        }

        try {
            const doctorRef = doc(DOCTOR_COLLECTION, doctorId);

            await updateDoc(doctorRef, {
                consultationPrice: price
            });

            const updatedDoc = await getDoc(doctorRef);

            if (!updatedDoc.exists()) return null;

            return {
                id: updatedDoc.id,
                ...updatedDoc.data(),
                createdAt: convertFirestoreTimestampToDate(updatedDoc.data().createdAt, true)
            } as DoctorInfoModel;
        } catch (error) {
            throw new Error('Failed to update consultation price for doctor');
        }
    };

    const getDoctorCertificates = async (doctorId: string): Promise<string[]> => {
        const certFolderRef = ref(storage, `certificates/${doctorId}/`);
        const listResult = await listAll(certFolderRef);

        return await Promise.all(
            listResult.items.map((itemRef) => getDownloadURL(itemRef))
        );
    }

    return {
        getDoctors,
        getDoctor,
        getDoctorsByPage,
        updateConsultationPrice,
        getDoctorCertificates
    };
}

export default DoctorService;