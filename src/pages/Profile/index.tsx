import React, { useEffect, useRef, useState } from 'react';
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
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { db } from '@/firebase/config';
import useAuth from '@/hooks/useAuth';
import SpecificationService from '@/services/specification.service';
import HospitalService from '@/services/hospitals.service';
import DrProfileEdit from './DrProfileEdit';
import styles from './DoctorProfileView.module.css';
import { useNavigate } from 'react-router';
import CertificateUpload from "@/components/CertificateUploader";

const { Title, Text } = Typography;

const DoctorProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [specs, setSpecs] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [isCertificationModalVisible, setIsCertificationModalVisible] = useState(false);
  const { userId: doctorId } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !doctorId) return;

    const storage = getStorage();
    const fileRef = ref(storage, `doctorPhotos/${doctorId}`);
    await uploadBytes(fileRef, file);
    const photoUrl = await getDownloadURL(fileRef);

    await updateDoc(doc(db, 'doctors', doctorId), { photoUrl });

    const updatedDoc = await getDoc(doc(db, 'doctors', doctorId));
    if (updatedDoc.exists()) {
      setDoctor(updatedDoc.data());
    }
  };

  if (!doctorId || loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin size="large" />
      </div>
    );
  }

  const showCertificationModal = () => {
    setIsCertificationModalVisible(true);
  }

  return (
    <div
      className={`${styles.profileContainer} ${mode === 'dark' ? styles.dark : ''}`}
    >
      <div className={styles.headerImage}>
        <div className={styles.headerOverlay}>
          <div className={styles.buttonGroupLeft}>
            <Button danger onClick={() => console.log('My Articles clicked')}>
              My Articles
            </Button>
            <Button type="default" onClick={() => navigate('/doctor-queries')}>
              My Queries
            </Button>
          </div>

          <Title level={1} className={styles.headerTitle}>
            PROFILE
          </Title>
          <div className={styles.buttonGroupRight}>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => setEditVisible(true)}
            >
              Edit
            </Button>
            <Button
              type="default"
              onClick={showCertificationModal}
            >
              Verification
            </Button>
            <CertificateUpload
                isCertificationModalVisible={isCertificationModalVisible}
                setIsCertificationModalVisible={setIsCertificationModalVisible}
            />
          </div>
        </div>
      </div>
      <Card className={styles.profileCard}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} className={styles.avatarColumn}>
            <Avatar
              size={180}
              src={doctor?.photoUrl || undefined}
              icon={!doctor?.photoUrl ? <UserOutlined /> : undefined}
              className={styles.avatar}
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer' }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
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
                <Text>
                  {getHospitalNames(doctor?.hospitalIds || []) || 'Не указано'}
                </Text>
              </Col>
              <Col xs={24} className={styles.infoItem}>
                <BookOutlined className={styles.icon} />{' '}
                <Text>
                  {getSpecNames(doctor?.specificationIds || []) || 'Не указано'}
                </Text>
              </Col>
              {doctor?.about?.trim() && (
                <Col xs={24} className={styles.infoItem}>
                  <InfoCircleOutlined className={styles.icon} />{' '}
                  <Text>{doctor.about}</Text>
                </Col>
              )}
              {doctor?.education?.length > 0 && (
                <Col xs={24} className={styles.educationSection}>
                  <Title level={4} className={styles.educationTitle}>
                    Education
                  </Title>
                  {doctor.education.map((edu: any, idx: number) => (
                    <div key={idx} className={styles.educationItem}>
                      🎓 {edu.institution} (
                      {dayjs(edu.startYear).format('YYYY')} –{' '}
                      {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'по наст.время'}
                      )
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
        title="Edit Profile"
      >
        <DrProfileEdit
          doctorId={doctorId}
          initialData={doctor}
          onSave={async () => {
            setEditVisible(false);
            const snap = await getDoc(doc(db, 'doctors', doctorId));
            if (snap.exists()) {
              setDoctor(snap.data());
            }
          }}
        />
      </Drawer>
    </div>
  );
};

export default DoctorProfileView;
