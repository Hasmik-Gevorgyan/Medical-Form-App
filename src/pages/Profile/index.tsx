import { useEffect, useState } from 'react';
import { Descriptions, Drawer, Button, Avatar, Spin, } from 'antd';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import dayjs from 'dayjs';
import DrProfileEdit from './DrProfileEdit';
import SpecificationService from '@/services/specification.service';
import HospitalService from '@/services/hospitals.service';
import { useSelector } from 'react-redux';
import DoctorQueriesTable from './DoctorQueriesTable';
import { UserOutlined } from '@ant-design/icons';



const DoctorProfileView: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [specs, setSpecs] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const doctorId = 'test';
  // const {id: doctorId} = useSelector((state: any) => state.auth.user);
  const {user} = useSelector((state: any) => state.auth);

  console.log('Doctor ID:', doctorId,user?.id, user);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

  if (loading) return <Spin />;

  return (
    <>
      <Descriptions
        title="Doctor Profile"
        bordered
        column={1}
        extra={
          <Button type="primary" onClick={() => setEditVisible(true)}>
            Edit
          </Button>
        }
      >
       <Descriptions.Item label="Photo">
  {doctor?.photoUrl ? (
    <Avatar size={100} src={doctor.photoUrl} />
  ) : (
    <Avatar size={100} icon={<UserOutlined style={{ fontSize: 48 }} />} />
  )
  }
</Descriptions.Item>
        <Descriptions.Item label="Name">
          {doctor?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Surname">
          {doctor?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{doctor?.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{doctor?.phone}</Descriptions.Item>
        <Descriptions.Item label="Gender">{doctor?.gender}</Descriptions.Item>
        <Descriptions.Item label="Birthdate">
          {doctor?.birthdate ? dayjs(doctor.birthdate).format('YYYY-MM-DD') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Hospitals">
          {getHospitalNames(doctor?.hospitalIds || [])}
        </Descriptions.Item>
        <Descriptions.Item label="Specifications">
          {getSpecNames(doctor?.specificationIds || [])}
        </Descriptions.Item>
        {doctor.about.trim() !== '' && (
          <Descriptions.Item label="About">{doctor.about}</Descriptions.Item>
        )}
        <Descriptions.Item label="Education">
          {(doctor?.education || []).map((edu: any, idx: number) => (
            <div key={idx}>
              🎓 {edu.institution} (
              {dayjs(edu.dateFrom).format('YYYY-MM')} –{' '}
              {edu.dateTo ? dayjs(edu.dateTo).format('YYYY-MM') : 'Present'})
            </div>
          ))}
        </Descriptions.Item>
      </Descriptions>

      <Drawer
        open={editVisible}
        onClose={() => setEditVisible(false)}
        width={720}
        title="Edit Profile"
      >
        <DrProfileEdit
          doctorId={doctorId}
          initialData={doctor}
          onSave={() => {
            setEditVisible(false);
            // refetch updated profile
            getDoc(doc(db, 'doctors', doctorId)).then((snap) => {
              if (snap.exists()) {
                setDoctor(snap.data());
              }
            });
          }}
        />
      </Drawer>
      <DoctorQueriesTable doctorId={doctorId} />
    </>
  );
};

export default DoctorProfileView;
