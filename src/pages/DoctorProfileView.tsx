import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Button, Drawer, Spin, Typography, Row, Col, Image, Divider, Card } from 'antd';
import { db, storage } from '../firebase.ts';
import DrProfileEdit from './DrProfileEdit.tsx';
import styles from './DoctorProfileView.module.css'; // CSS-модуль
import { getDownloadURL, ref } from 'firebase/storage';

const { Title, Text } = Typography;

export interface InitialData {
  name: string;
  gender: string
  surname: string;
  email: string;
  phone: string;
  photoUrl: string;
  about: string;
  specifications: [
    {
      name: string
    }
  ]
}

const DoctorProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const [doctorData, setDoctorData] = useState<InitialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);

  const fetchDoctorData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'doctors', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as InitialData;
        if (!data.photoUrl) {
          const storageRef = ref(storage, `doctor_photos/default_photo/default_photo.jpg`);
          data.photoUrl = await getDownloadURL(storageRef);
        }
        setDoctorData(data);
      } else {
        setDoctorData(null);
      }
    } catch (error) {
      console.error('Failed to fetch doctor data:', error);
      setDoctorData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [id]);

  const openEdit = () => setEditVisible(true);
  const closeEdit = () => setEditVisible(false);
  const onProfileSaved = () => {
    closeEdit();
    fetchDoctorData();
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '40vh auto' }} />;
  if (!doctorData) return <div>Doctor not found</div>;

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle">
        <Title level={2}>Doctor Profile</Title>
        <Button type="primary" onClick={openEdit}>
          Edit
        </Button>
      </Row>

      <Divider />

      <Row gutter={32} align="top">
        <Col xs={24} sm={8} md={6}>
          {doctorData.photoUrl ? (
            <Image
              width={180}
              src={doctorData.photoUrl}
              alt="Doctor Photo"
              className={styles.image}
            />
          ) : (
            <div className={styles.noPhotoBox}>
              <Text type="secondary">No Photo</Text>
            </div>
          )}
        </Col>

        <Col xs={24} sm={16} md={18}>
          <Card variant="borderless" className={styles.card}>
            <p><b>Name:</b> {doctorData.name || '—'}</p>
            <p><b>Surname:</b> {doctorData.surname || '—'}</p>
            <p><b>Email:</b> {doctorData.email || '—'}</p>
            <p><b>Phone:</b> {doctorData.phone || '—'}</p>
            <p><b>Gender:</b> {doctorData.gender || '—'}</p>
            <p><b>Specifications:</b>
              {Array.isArray(doctorData.specifications)
                ? doctorData.specifications.join(', ')
                : doctorData.specifications || '—'}
            </p>
            <p><b>About:</b> {doctorData.about || '—'}</p>
          </Card>
        </Col>
      </Row>

      <Drawer
        title="Edit Profile"
        width={400}
        onClose={closeEdit}
        open={editVisible}
        destroyOnClose
      >
        <DrProfileEdit
          initialData={doctorData}
          onSave={onProfileSaved}
          doctorId={id!}
        />
      </Drawer>
    </div>
  );
};

export default DoctorProfileView;

