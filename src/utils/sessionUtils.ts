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

export const addRequestToFirestore = async (doctorId: string, values: any) => {
    let fileUrl = "";
  
    // Upload file if it exists
    if (values.file) {
      const file = values.file[0].originFileObj;
      const storageRef = ref(storage, `files/${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }
  
    const requestData = {
      doctorId,
      messages: [
        {
          sender: "patient",
          name: values.name,
          surname: values.surname,
          email: values.email,
          about: values.about || "",
          date: {
            day: values.date.format("YYYY-MM-DD"),
            fromTime: values.fromTime,
            toTime: values.toTime,
          },
          fileUrl,
        },
      ],
      status: "new",
      createdAt: serverTimestamp(),
    };
  
    // Add document and return the ID + data
    const docRef = await addDoc(collection(db, "queries"), requestData);
  
    return {
      id: docRef.id,     // Firestore document ID
      ...requestData,    // Request data
    };
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
