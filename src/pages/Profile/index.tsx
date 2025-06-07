// // import { useEffect, useState } from 'react';
// // import { Descriptions, Drawer, Button, Avatar, Spin, Card, Tag, Typography, Divider, Row, Col, } from 'antd';
// // import { getDoc, doc } from 'firebase/firestore';
// // import { db } from '@/firebase/config';
// // import dayjs from 'dayjs';
// // import DrProfileEdit from './DrProfileEdit';
// // import SpecificationService from '@/services/specification.service';
// // import HospitalService from '@/services/hospitals.service';

// // import DoctorQueriesTable from './DoctorQueriesTable';
// // import { UserOutlined } from '@ant-design/icons';
// // import useAuth from '@/hooks/useAuth';
// // import styles from './DoctorProfileView.module.css'; // Assuming you have a CSS module for styles
// // import Title from 'antd/es/skeleton/Title';

// // const DoctorProfileView: React.FC = () => {
// //   const [doctor, setDoctor] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [editVisible, setEditVisible] = useState(false);
// //   const [specs, setSpecs] = useState<any[]>([]);
// //   const [hospitals, setHospitals] = useState<any[]>([]);
// //   // const doctorId = 'test';
// //   const { userId:doctorId,  } = useAuth();
// //   console.log('Doctor ID:', doctorId);
// //   // const {id: doctorId} = useSelector((state: any) => state.auth.user);
// //   // const {user} = useSelector((state: any) => state.auth);

// //   // console.log('Doctor ID:', doctorId,user?.id, user);
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       if (!doctorId) return;
// // const docSnap = await getDoc(doc(db, 'doctors', doctorId!))
// //       if (docSnap.exists()) {
// //         setDoctor(docSnap.data());
// //       }
// //       const [specsData, hospitalsData] = await Promise.all([
// //         SpecificationService().getSpecifications(),
// //         HospitalService().getHospitals(),
// //       ]);
// //       setSpecs(specsData);
// //       setHospitals(hospitalsData);
// //       setLoading(false);
// //     };

// //     fetchData();
// //   }, [doctorId]);

// //   const getSpecNames = (ids: string[]) =>
// //     specs.filter((s) => ids?.includes(s.id)).map((s) => s.name).join(', ');

// //   const getHospitalNames = (ids: string[]) =>
// //     hospitals.filter((h) => ids?.includes(h.id)).map((h) => h.name).join(', ');

// //     if (!doctorId) {
// //     // можно показывать спиннер или сообщение о том, что профиль не загружен
// //     return <Spin />;
// //   }
// //   if (loading) return <Spin />;

// // //   return (
// // //     <>
// // //       {/* <Descriptions
// // //         title="Doctor Profile"
// // //         bordered
// // //         column={1}
// // //         extra={
// // //           <Button className={styles.editButton} onClick={() => setEditVisible(true)}>
// // //       Edit
// // //     </Button>
// // //         }
// // //       >
// // //        <Descriptions.Item label="Photo">
// // //   {doctor?.photoUrl ? (
// // //     <Avatar size={100} src={doctor.photoUrl} />
// // //   ) : (
// // //     <Avatar size={100} icon={<UserOutlined style={{ fontSize: 48 }} />} />
// // //   )
// // //   }
// // // </Descriptions.Item>
// // //         <Descriptions.Item label="Name">
// // //           {doctor?.name}
// // //         </Descriptions.Item>
// // //         <Descriptions.Item label="Surname">
// // //           {doctor?.surname}
// // //         </Descriptions.Item>
// // //         <Descriptions.Item label="Email">{doctor?.email}</Descriptions.Item>
// // //         <Descriptions.Item label="Phone">{doctor?.phone}</Descriptions.Item>
// // //         <Descriptions.Item label="Gender">{doctor?.gender}</Descriptions.Item>
// // //        <Descriptions.Item label="Birthdate">
// // //   {doctor?.birthdate
// // //     ? dayjs(
// // //         doctor.birthdate.seconds
// // //           ? new Date(doctor.birthdate.seconds * 1000)
// // //           : doctor.birthdate
// // //       ).format('YYYY-MM-DD')
// // //     : ''}
// // // </Descriptions.Item>
// // //         <Descriptions.Item label="Hospitals">
// // //           {getHospitalNames(doctor?.hospitalIds || [])}
// // //         </Descriptions.Item>
// // //         <Descriptions.Item label="Specifications">
// // //           {getSpecNames(doctor?.specificationIds || [])}
// // //         </Descriptions.Item>
// // //         {doctor?.about?.trim() !== '' && (
// // //           <Descriptions.Item label="About">{doctor.about}</Descriptions.Item>
// // //         )}
// // //        {doctor?.education && doctor.education.length > 0 && (
// // //   <Descriptions.Item label="Education">
// // //     {doctor.education.map((edu: any, idx: number) => (
// // //       <div key={idx} className={styles.educationItem}>
// // //         🎓 {edu.institution} (
// // //         {dayjs(edu.startYear).format('YYYY')} –{' '}
// // //         {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'Present'})
// // //       </div>
// // //     ))}
// // //   </Descriptions.Item>
// // // )}
// // //       </Descriptions> */}

// // //     <div style={{ display: 'flex', alignItems: 'flex-start' }}>
// // //   <Card
    
// // //     style={{ width: '300px', height: '300px' }}
// // //   >
// // //     <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
// // //       <Avatar
// // //         size={200}
// // //         icon={<UserOutlined />}
// // //         src={doctor.photoURL}
// // //       />
// // //       <div>
        
  
// // //       </div>
// // //     </div>
// // //     <Divider />
// // //   </Card>
// // // <Card>
// // //   <Typography.Title level={3}>
// // //           {doctor?.name} {doctor?.surname}
// // //         </Typography.Title>
// // //         <Typography.Text type="secondary">{doctor.email}</Typography.Text>
// // // </Card>
// // //   <Card>
// // // <Typography.Title level={5}>Hospitals</Typography.Title>
// // //     <Typography.Text>
// // //       {getHospitalNames(doctor?.hospitalIds || []) || 'Not specified'}
// // //     </Typography.Text>
// // //   </Card>
// // //   <Card>
// // // <Typography.Title level={5}>Specifications</Typography.Title>
// // //     <Typography.Text>
// // //       {getSpecNames(doctor?.specificationIds || []) || 'Not specified'}
// // //     </Typography.Text>
// // //   </Card>
// // //   <Card>
// // //     <Typography.Title level={5}>Phone</Typography.Title>
// // //     <Typography.Text>{doctor?.phone}</Typography.Text>
// // //   </Card>

// // //      {doctor?.education && doctor.education.length > 0 && (
// // //         <Card>
// // //       <>
// // //         <Typography.Title level={5}>Education</Typography.Title>
// // //         {doctor.education.map((edu: any, idx: number) => (
// // //           <div key={idx} className={styles.educationItem}>
// // //             🎓 {edu.institution} (
// // //             {dayjs(edu.startYear).format('YYYY')} –{' '}
// // //             {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'Present'})
// // //           </div>
// // //         ))}
// // //       </>
// // //       </Card>
// // //     )}


// // //    {doctor?.about?.trim() && (
// // //    <Card>
// // //      <>
// // //         <Typography.Title level={5}>About</Typography.Title>
// // //         <Typography.Text>{doctor.about}</Typography.Text>
// // //       </>
// // //    </Card>
     
// // //     )}

    

// // //     <Button
// // //       type="primary"
// // //       style={{ marginTop: '16px' }}
// // //       onClick={() => setEditVisible(true)}
// // //     >
// // //       Edit Profile
// // //     </Button>
  
// // // </div>

// // //       <Drawer
// // //         open={editVisible}
// // //         onClose={() => setEditVisible(false)}
// // //         width={720}
// // //         title="Edit Profile"
// // //       >
// // //         <DrProfileEdit
// // //           doctorId={doctorId}
// // //           initialData={doctor}
// // //           onSave={() => {
// // //             setEditVisible(false);
// // //             // refetch updated profile
// // //             getDoc(doc(db, 'doctors', doctorId!)).then((snap) => {
// // //               if (snap.exists()) {
// // //                 setDoctor(snap.data());
// // //               }
// // //             });
// // //           }}
// // //         />
// // //       </Drawer>
// // //       {/* <br />
// // //       <DoctorQueriesTable doctorId={doctorId} /> */}
 
// // //     </>
// // //   );
// // return (
// //   <>
// //     <div className={styles.container}>
// //       <Row gutter={[24, 24]} justify="center">
// //         <Col xs={24} md={8}>
// //           <Card className={styles.profileCard}>
// //             <div className={styles.avatarSection}>
// //               <Avatar
// //                 size={150}
// //                 src={doctor.photoUrl}
// //                 icon={<UserOutlined />}
// //                 className={styles.avatar}
// //               />
// //               <Typography.Title level={3} style={{ marginTop: 16 }}>
// //                 {doctor?.name} {doctor?.surname}
// //               </Typography.Title>
// //               <Typography.Text type="secondary">{doctor.email}</Typography.Text>
// //             </div>
// //           </Card>
// //         </Col>

// //         <Col xs={24} md={16}>
// //           <Card className={styles.detailsCard} title="Doctor Information" bordered>
// //             <Descriptions column={1} size="small">
// //               <Descriptions.Item label="Phone">{doctor?.phone || 'Not provided'}</Descriptions.Item>
// //               <Descriptions.Item label="Gender">{doctor?.gender || 'Not provided'}</Descriptions.Item>
// //               <Descriptions.Item label="Birthdate">
// //                 {doctor?.birthdate
// //                   ? dayjs(
// //                       doctor.birthdate.seconds
// //                         ? new Date(doctor.birthdate.seconds * 1000)
// //                         : doctor.birthdate
// //                     ).format('YYYY-MM-DD')
// //                   : 'Not provided'}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Hospitals">
// //                 {getHospitalNames(doctor?.hospitalIds || []) || 'Not specified'}
// //               </Descriptions.Item>
// //               <Descriptions.Item label="Specifications">
// //                 {getSpecNames(doctor?.specificationIds || []) || 'Not specified'}
// //               </Descriptions.Item>
// //               {doctor?.about?.trim() && (
// //                 <Descriptions.Item label="About">{doctor.about}</Descriptions.Item>
// //               )}
// //             </Descriptions>

// //             {doctor?.education?.length > 0 && (
// //               <>
// //                 <Divider />
// //                 <Typography.Title level={5}>Education</Typography.Title>
// //                 {doctor.education.map((edu: any, idx: number) => (
// //                   <div key={idx} className={styles.educationItem}>
// //                     🎓 {edu.institution} (
// //                     {dayjs(edu.startYear).format('YYYY')} –{' '}
// //                     {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'Present'})
// //                   </div>
// //                 ))}
// //               </>
// //             )}
// //             <Button type="primary" onClick={() => setEditVisible(true)} style={{ marginTop: 24 }}>
// //               Edit Profile
// //             </Button>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </div>

// //     <Drawer
// //       open={editVisible}
// //       onClose={() => setEditVisible(false)}
// //       width={720}
// //       title="Edit Profile"
// //     >
// //       <DrProfileEdit
// //         doctorId={doctorId}
// //         initialData={doctor}
// //         onSave={() => {
// //           setEditVisible(false);
// //           getDoc(doc(db, 'doctors', doctorId!)).then((snap) => {
// //             if (snap.exists()) {
// //               setDoctor(snap.data());
// //             }
// //           });
// //         }}
// //       />
// //     </Drawer>
// //   </>
// // );

// // };

// // export default DoctorProfileView;


// import { useEffect, useState } from 'react';
// import {
//   Descriptions,
//   Drawer,
//   Button,
//   Avatar,
//   Spin,
//   Card,
//   Typography,
//   Divider,
// } from 'antd';
// import { getDoc, doc } from 'firebase/firestore';
// import { db } from '@/firebase/config';
// import dayjs from 'dayjs';
// import DrProfileEdit from './DrProfileEdit';
// import SpecificationService from '@/services/specification.service';
// import HospitalService from '@/services/hospitals.service';
// import { UserOutlined, SettingOutlined } from '@ant-design/icons';
// import useAuth from '@/hooks/useAuth';
// import styles from './DoctorProfileView.module.css';

// const DoctorProfileView: React.FC = () => {
//   const [doctor, setDoctor] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [editVisible, setEditVisible] = useState(false);
//   const [specs, setSpecs] = useState<any[]>([]);
//   const [hospitals, setHospitals] = useState<any[]>([]);
//   const { userId: doctorId } = useAuth();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       if (!doctorId) return;

//       const docSnap = await getDoc(doc(db, 'doctors', doctorId));
//       if (docSnap.exists()) {
//         setDoctor(docSnap.data());
//       }

//       const [specsData, hospitalsData] = await Promise.all([
//         SpecificationService().getSpecifications(),
//         HospitalService().getHospitals(),
//       ]);
//       setSpecs(specsData);
//       setHospitals(hospitalsData);
//       setLoading(false);
//     };

//     fetchData();
//   }, [doctorId]);

//   const getSpecNames = (ids: string[]) =>
//     specs.filter((s) => ids?.includes(s.id)).map((s) => s.name).join(', ');

//   const getHospitalNames = (ids: string[]) =>
//     hospitals.filter((h) => ids?.includes(h.id)).map((h) => h.name).join(', ');

//   if (!doctorId || loading) return <Spin size="large" style={{ marginTop: 100 }} />;

//   return (
//     <>
//       <div className={styles.profileContainer}>
//         <Card className={styles.profileCard}>
//           <Avatar
//             size={120}
//             icon={<UserOutlined />}
//             src={doctor.photoUrl}
//             className={styles.avatar}
//           />
//           <Divider />
//           <Typography.Title level={3}>
//             {doctor?.name} {doctor?.surname}
//           </Typography.Title>
//           <Typography.Text type="secondary">{doctor.email}</Typography.Text>
//         </Card>

//         <Card className={styles.infoCard}>
//           <Typography.Title level={5}>Phone</Typography.Title>
//           <Typography.Text>{doctor?.phone || 'Not provided'}</Typography.Text>

//           <Divider />

//           <Typography.Title level={5}>Gender</Typography.Title>
//           <Typography.Text>{doctor?.gender || 'Not specified'}</Typography.Text>

//           <Divider />

//           <Typography.Title level={5}>Birthdate</Typography.Title>
//           <Typography.Text>
//             {doctor?.birthdate
//               ? dayjs(
//                   doctor.birthdate.seconds
//                     ? new Date(doctor.birthdate.seconds * 1000)
//                     : doctor.birthdate
//                 ).format('YYYY-MM-DD')
//               : 'Not specified'}
//           </Typography.Text>

//           <Divider />

//           <Typography.Title level={5}>Hospitals</Typography.Title>
//           <Typography.Text>
//             {getHospitalNames(doctor?.hospitalIds || []) || 'Not specified'}
//           </Typography.Text>

//           <Divider />

//           <Typography.Title level={5}>Specifications</Typography.Title>
//           <Typography.Text>
//             {getSpecNames(doctor?.specificationIds || []) || 'Not specified'}
//           </Typography.Text>

//           {doctor?.about?.trim() && (
//             <>
//               <Divider />
//               <Typography.Title level={5}>About</Typography.Title>
//               <Typography.Text>{doctor.about}</Typography.Text>
//             </>
//           )}

//           {doctor?.education?.length > 0 && (
//             <>
//               <Divider />
//               <Typography.Title level={5}>Education</Typography.Title>
//               {doctor.education.map((edu: any, idx: number) => (
//                 <div key={idx} className={styles.educationItem}>
//                   🎓 {edu.institution} (
//                   {dayjs(edu.startYear).format('YYYY')} –{' '}
//                   {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'Present'})
//                 </div>
//               ))}
//             </>
//           )}

//           <Button
//             type="primary"
//             icon={<SettingOutlined />}
//             onClick={() => setEditVisible(true)}
//             style={{ marginTop: 24 }}
//           >
//             Edit Profile
//           </Button>
//         </Card>
//       </div>

//       <Drawer
//         open={editVisible}
//         onClose={() => setEditVisible(false)}
//         width={720}
//         title="Edit Profile"
//       >
//         <DrProfileEdit
//           doctorId={doctorId}
//           initialData={doctor}
//           onSave={() => {
//             setEditVisible(false);
//             getDoc(doc(db, 'doctors', doctorId!)).then((snap) => {
//               if (snap.exists()) {
//                 setDoctor(snap.data());
//               }
//             });
//           }}
//         />
//       </Drawer>
//     </>
//   );
// };

// export default DoctorProfileView;
// import React, { useEffect, useState } from 'react';
// import {
//   Avatar,
//   Button,
//   Card,
//   Col,
//   Divider,
//   Drawer,
//   Row,
//   Spin,
//   Typography,
// } from 'antd';
// import {
//   SettingOutlined,
//   UserOutlined,
//   MailOutlined,
//   PhoneOutlined,
//   ManOutlined,
//   WomanOutlined,
//   CalendarOutlined,
//   EnvironmentOutlined,
//   BookOutlined,
//   InfoCircleOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import { getDoc, doc } from 'firebase/firestore';
// import { db } from '@/firebase/config';
// import useAuth from '@/hooks/useAuth';
// import SpecificationService from '@/services/specification.service';
// import HospitalService from '@/services/hospitals.service';
// import DrProfileEdit from './DrProfileEdit';
// import styles from './DoctorProfileView.module.css';

// const { Title, Text } = Typography;

// const DoctorProfileView: React.FC = () => {
//   const [doctor, setDoctor] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [editVisible, setEditVisible] = useState(false);
//   const [specs, setSpecs] = useState<any[]>([]);
//   const [hospitals, setHospitals] = useState<any[]>([]);
//   const { userId: doctorId } = useAuth();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       if (!doctorId) return;
//       const docSnap = await getDoc(doc(db, 'doctors', doctorId));
//       if (docSnap.exists()) {
//         setDoctor(docSnap.data());
//       }
//       const [specsData, hospitalsData] = await Promise.all([
//         SpecificationService().getSpecifications(),
//         HospitalService().getHospitals(),
//       ]);
//       setSpecs(specsData);
//       setHospitals(hospitalsData);
//       setLoading(false);
//     };

//     fetchData();
//   }, [doctorId]);

//   const getSpecNames = (ids: string[]) =>
//     specs.filter((s) => ids?.includes(s.id)).map((s) => s.name).join(', ');

//   const getHospitalNames = (ids: string[]) =>
//     hospitals.filter((h) => ids?.includes(h.id)).map((h) => h.name).join(', ');

//   if (!doctorId || loading) {
//     return (
//       <div className={styles.spinnerContainer}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className={styles.profileContainer}>
//       <div className={styles.headerImage}>
//         <Button
//           type="primary"
//           shape="circle"
//           icon={<SettingOutlined />}
//           className={styles.settingsButton}
//           onClick={() => setEditVisible(true)}
//         />
//       </div>
//       <Card className={styles.profileCard}>
//         <Row gutter={[24, 24]}>
//           <Col xs={24} md={8} className={styles.avatarColumn}>
//             <Avatar
//               size={180}
//               icon={<UserOutlined />}
//               src={doctor.photoURL}
//               className={styles.avatar}
//             />
//           </Col>
//           <Col xs={24} md={16}>
//             <Title level={2}>
//               {doctor?.name} {doctor?.surname}
//             </Title>
//             <Divider />
//             <Row gutter={[16, 16]}>
//               <Col xs={24} sm={12}>
//                 <MailOutlined /> <Text>{doctor?.email}</Text>
//               </Col>
//               <Col xs={24} sm={12}>
//                 <PhoneOutlined /> <Text>{doctor?.phone}</Text>
//               </Col>
//               <Col xs={24} sm={12}>
//                 {doctor?.gender === 'Male' ? <ManOutlined /> : <WomanOutlined />}
//                 <Text> {doctor?.gender === 'Male' ? 'Мужской' : 'Женский'}</Text>
//               </Col>
//               <Col xs={24} sm={12}>
//                 <CalendarOutlined />{' '}
//                 <Text>
//                   {doctor?.birthdate
//                     ? dayjs(
//                         doctor.birthdate.seconds
//                           ? new Date(doctor.birthdate.seconds * 1000)
//                           : doctor.birthdate
//                       ).format('YYYY-MM-DD')
//                     : ''}
//                 </Text>
//               </Col>
//               <Col xs={24}>
//                 <EnvironmentOutlined />{' '}
//                 <Text>
//                   {getHospitalNames(doctor?.hospitalIds || []) || 'Не указано'}
//                 </Text>
//               </Col>
//               <Col xs={24}>
//                 <BookOutlined />{' '}
//                 <Text>
//                   {getSpecNames(doctor?.specificationIds || []) || 'Не указано'}
//                 </Text>
//               </Col>
//               {doctor?.about?.trim() && (
//                 <Col xs={24}>
//                   <InfoCircleOutlined /> <Text>{doctor.about}</Text>
//                 </Col>
//               )}
//               {doctor?.education?.length > 0 && (
//                 <Col xs={24}>
//                   <Title level={4}>Образование</Title>
//                   {doctor.education.map((edu: any, idx: number) => (
//                     <div key={idx} className={styles.educationItem}>
//                       🎓 {edu.institution} (
//                       {dayjs(edu.startYear).format('YYYY')} –{' '}
//                       {edu.endYear
//                         ? dayjs(edu.endYear).format('YYYY')
//                         : 'по наст.время'}
//                       )
//                     </div>
//                   ))}
//                 </Col>
//               )}
//             </Row>
//           </Col>
//         </Row>
//       </Card>

//       <Drawer
//         open={editVisible}
//         onClose={() => setEditVisible(false)}
//         width={720}
//         title="Редактировать профиль"
//       >
//         <DrProfileEdit
//           doctorId={doctorId}
//           initialData={doctor}
//           onSave={() => {
//             setEditVisible(false);
//             getDoc(doc(db, 'doctors', doctorId)).then((snap) => {
//               if (snap.exists()) {
//                 setDoctor(snap.data());
//               }
//             });
//           }}
//         />
//       </Drawer>
//       </div>
   
//   );
// };

// export default DoctorProfileView;
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Row,
  Spin,
  Typography,
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  BookOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '@/firebase/config';
import useAuth from '@/hooks/useAuth';
import SpecificationService from '@/services/specification.service';
import HospitalService from '@/services/hospitals.service';
import DrProfileEdit from './DrProfileEdit';
import styles from './DoctorProfileView.module.css';

const { Title, Text } = Typography;

const DoctorProfileView: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [specs, setSpecs] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const { userId: doctorId } = useAuth();

  // Получаем текущий режим темы из Redux
  const mode = useSelector((state: any) => state.theme.mode);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!doctorId) return;
      const docSnap = await getDoc(doc(db, 'doctors', doctorId));
      if (docSnap.exists()) {
        setDoctor(docSnap.data());
      }
      const [specsData, hospitalsData] = await Promise.all([
        SpecificationService().getSpecifications(),
        HospitalService().getHospitals(),
      ]);
      setSpecs(specsData);
      setHospitals(hospitalsData);
      setLoading(false);
    };

    fetchData();
  }, [doctorId]);

  const getSpecNames = (ids: string[]) =>
    specs.filter((s) => ids?.includes(s.id)).map((s) => s.name).join(', ');

  const getHospitalNames = (ids: string[]) =>
    hospitals.filter((h) => ids?.includes(h.id)).map((h) => h.name).join(', ');

  if (!doctorId || loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className={`${styles.profileContainer} ${
        mode === 'dark' ? styles.dark : ''
      }`}
    >
      <div className={styles.headerImage}>
        <div className={styles.headerOverlay}>
          <Title level={1} className={styles.headerTitle}>
           PROFILE
          </Title>
        </div>
        <Button
          type="primary"
          shape="circle"
          icon={<SettingOutlined />}
          className={styles.settingsButton}
          onClick={() => setEditVisible(true)}
        />
      </div>

      <Card className={styles.profileCard}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} className={styles.avatarColumn}>
            <Avatar
              size={180}
              icon={<UserOutlined />}
              src={doctor.photoURL}
              className={styles.avatar}
            />
          </Col>
          <Col xs={24} md={16}>
            <Title level={2} className={styles.doctorName}>
              {doctor?.name} {doctor?.surname}
            </Title>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} className={styles.infoItem}>
                <MailOutlined className={styles.icon} /> <Text>{doctor?.email}</Text>
              </Col>
              <Col xs={24} sm={12} className={styles.infoItem}>
                <PhoneOutlined className={styles.icon} /> <Text>{doctor?.phone}</Text>
              </Col>
              <Col xs={24} sm={12} className={styles.infoItem}>
                {doctor?.gender === 'Male' ? (
                  <ManOutlined className={styles.icon} />
                ) : (
                  <WomanOutlined className={styles.icon} />
                )}
                <Text> {doctor?.gender === 'Male' ? 'Male' : 'Female'}</Text>
              </Col>
              <Col xs={24} sm={12} className={styles.infoItem}>
                <CalendarOutlined className={styles.icon} />{' '}
                <Text>
                  {doctor?.birthdate
                    ? dayjs(
                        doctor.birthdate.seconds
                          ? new Date(doctor.birthdate.seconds * 1000)
                          : doctor.birthdate
                      ).format('YYYY-MM-DD')
                    : ''}
                </Text>
              </Col>
              <Col xs={24} className={styles.infoItem}>
                <EnvironmentOutlined className={styles.icon} />{' '}
                <Text>{getHospitalNames(doctor?.hospitalIds || []) || 'Не указано'}</Text>
              </Col>
              <Col xs={24} className={styles.infoItem}>
                <BookOutlined className={styles.icon} />{' '}
                <Text>{getSpecNames(doctor?.specificationIds || []) || 'Не указано'}</Text>
              </Col>
              {doctor?.about?.trim() && (
                <Col xs={24} className={styles.infoItem}>
                  <InfoCircleOutlined className={styles.icon} /> <Text>{doctor.about}</Text>
                </Col>
              )}
              {doctor?.education?.length > 0 && (
                <Col xs={24} className={styles.educationSection}>
                  <Title level={4} className={styles.educationTitle}>
                    Образование
                  </Title>
                  {doctor.education.map((edu: any, idx: number) => (
                    <div key={idx} className={styles.educationItem}>
                      🎓 {edu.institution} (
                      {dayjs(edu.startYear).format('YYYY')} –{' '}
                      {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'по наст.время'})
                    </div>
                  ))}
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Card>

      <Drawer
        open={editVisible}
        onClose={() => setEditVisible(false)}
        width={720}
        title="Редактировать профиль"
      >
        <DrProfileEdit
          doctorId={doctorId}
          initialData={doctor}
          onSave={() => {
            setEditVisible(false);
            getDoc(doc(db, 'doctors', doctorId)).then((snap) => {
              if (snap.exists()) {
                setDoctor(snap.data());
              }
            });
          }}
        />
      </Drawer>
    </div>
  );
};

export default DoctorProfileView;
