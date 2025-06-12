import { collection,getDoc,getDocs,doc } from "firebase/firestore";
import { db } from "@/firebase/config";

// Getting all docs
const getAllDoctors = async () => {
	try {
		// Fetching all doctors from the "doctors" collection
	  const snapshot = await getDocs(collection(db, "doctors"));
	//   For each doctor, fetch their specifications and hospitals
	  const doctors = await Promise.all(
		snapshot.docs.map(async (document) => {
		  const data = document.data();
		  const specIds = data.specificationIds || [];
		  const hospitalIds = data.hospitalIds || [];
  
			//   Fetching specifications names
		  const specifications = await Promise.all(
			specIds.map(async (id: string) => {
				const d = doc(db, "specifications", id);
				const specDoc = await getDoc(d);
				return specDoc?.data()?.name;
			})
		  );
		  
		  // Fetching hospital names
		  const hospitals = await Promise.all(
			hospitalIds.map(async (id: string) => {
				const d = doc(db, "hospitals", id);
				const hospitalDoc = await getDoc(d);
				return hospitalDoc?.data()?.name;
			})
		  );

		  // Returning the doctor data with specifications and hospitals
		  return {
			id: document.id,
			name : data.name,
			surname: data.surname,
			phone : data.phone,
			email: data.email,

			specifications,
			hospitals,
			};
		})
	  );
	  // Returning the array of doctors
	  return doctors;
	} catch (error) {
	  console.error("Ошибка при получении докторов:", error);
	  return [];
	}
  };

// Function to get JSON data from Firebase its after will be used in AIComponent.tsx
export const getJSONFromFirebase = async () => {
	const data: {
	  doctors: { id: string; [key: string]: any }[];
	} = {
	  doctors: [],
	};
  
	const doctors = await getAllDoctors();
  
	data.doctors = doctors;
  
	return data;
};