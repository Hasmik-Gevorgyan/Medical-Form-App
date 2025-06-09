import { db, storage } from "@/firebase/config";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const getDoctorUnavailableDates = async (doctorId: string): Promise<string[]> => {
    
    // getting document from doctors by id in url param
    const doctorRef = doc(db, 'doctors', doctorId);
    const docSnap = await getDoc(doctorRef);
    
    // if we have that doctor getting unavailable dates
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.unavailableDates || [];
    } else {
      return [];
    }
};

export const addRequestToFirestore = async (doctorName : string, doctorSurname : string, doctorId: string, values: any) => {
	let fileUrl = '';
	// if there is a file, upload it to Firebase Storage and get the URL
	if (values.file) {
		let k = values.file[0].originFileObj;
		const storageRef = ref(storage, `files/${k?.name}`);
		await uploadBytes(storageRef, k);
		fileUrl = await getDownloadURL(storageRef);
	}
	// adding request to Firestore

	doctorId = values.doctorId
	const data = await addDoc(collection(db, 'queries'), {
		doctorId, // id of the doctor
		doctorName, // name of the doctor
		doctorSurname, // surname of the doctor
		messages : [
				{
					sender : 'patient', // sender of the request
					name: values.name,
					surname: values.surname,
					email: values.email,
					about: values.about || '',
					date: {
						day: values.date.format('YYYY-MM-DD'), // formatted date
						fromTime: values.fromTime, // formatted from time
						toTime: values.toTime, // formatted to time
					},
					fileUrl, // URL of the uploaded file
				},
		],
		status : 'new', // status of the request
		createdAt: serverTimestamp(), // timestamp of request creation
	});

	return {
		id: data.id, // id of the request
		doctorId, // id of the doctor
	}
};
  

export const updateDoctorUnavailableDates = async (doctorId: string, selectedDate: any) => {
    // getting document from doctors by id in url param
    const doctorRef = doc(db, 'doctors', doctorId);
    // getting asynchronously the document
    const doctorSnap = await getDoc(doctorRef);
  
    // if we have that doctor
    if (!doctorSnap.exists()) {
      console.error('Doctor not found');
      return;
    }
  
    // getting existing unavailable dates and adding the new one
    const existingDates = doctorSnap.data().unavailableDates || [];
    const updatedDates = [...existingDates, selectedDate];

    console.log('Updated unavailable dates:', updatedDates);

  
    // updating the document with new unavailable dates
    await updateDoc(doctorRef, {
      unavailableDates: updatedDates,
    });
};

// Function to get initials from name and surname
export const getInitials = (name: string, surname: string) => {
    return `${name[0] || ''}${surname[0] || ''}`.toUpperCase();
}
