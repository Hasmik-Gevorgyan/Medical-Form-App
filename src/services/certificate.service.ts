import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {STORAGE_FILE_NAMES} from "@/constants/collections.ts";
import axios from 'axios';

export const CertificateService = ()=> {
    const API_URL = `http://127.0.0.1:5001/medical-project-2ba5d/us-central1/verifyCertificate`;

    const uploadCertificate = (file: File, doctorId: string) => {
        const storage = getStorage();
        const storageRef = ref(storage, `${STORAGE_FILE_NAMES.CERTIFICATES}/${doctorId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return { uploadTask, storageRef };
    }

    const verifyCertificate = async (doctorId: string, fileName: string) => {
        const response = await axios.post(
            API_URL,
            { doctorId, fileName },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    }

    return {uploadCertificate, verifyCertificate}
}