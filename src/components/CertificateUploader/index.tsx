import {useRef, useState} from 'react';
import {Button, Upload, Progress, Alert, Spin, Input, message, Steps, Card, Typography, Modal} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type {FC} from 'react';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { CertificateService } from '@/services/certificate.service.ts';
import {Status} from "@/constants/enums.ts";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "@/app/store.ts";
import {updateConsultationPrice} from "@/features/doctorSlice.ts";
import useAuth from "@/hooks/useAuth.ts";
import "@/assets/styles/doctors/certificateUploader.scss"

const { Title, Paragraph } = Typography;
const { Step } = Steps;

interface FileStatus {
    percent: number;
    verifying: boolean;
    message?: string;
    status?: Status;
}

const certificateService = CertificateService();

const CertificateUpload: FC<
    {isCertificationModalVisible: boolean,
        setIsCertificationModalVisible: (value: boolean) => void}
> = ({isCertificationModalVisible, setIsCertificationModalVisible}) => {
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [statusMap, setStatusMap] = useState<Record<string, FileStatus>>({});
    const [price, setPrice] = useState("");
    const [hasValidCert, setHasValidCert] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const { userId: doctorId } = useAuth();

    const isUploadingRef = useRef(false);

    const handleUpload = async () => {
        if (!doctorId) {
            setFileList([]);
            return;
        }

        isUploadingRef.current = true;

        for (const file of fileList) {
            setStatusMap((prev) => ({
                ...prev,
                [file.name]: { percent: 0, verifying: true },
            }));

            try {
                const { uploadTask } = certificateService.uploadCertificate(file, doctorId);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setStatusMap((prev) => ({
                                ...prev,
                                [file.name]: { ...prev[file.name], percent },
                            }));
                        },
                        (error) => {
                            setStatusMap((prev) => ({
                                ...prev,
                                [file.name]: {
                                    percent: 0,
                                    verifying: false,
                                    message: "Upload failed.",
                                    status: Status.FAILED,
                                },
                            }));
                            reject(error);
                        },
                        () => resolve()
                    );
                });

                const result = await certificateService.verifyCertificate(doctorId, file.name);

                setStatusMap((prev) => ({
                    ...prev,
                    [file.name]: {
                        percent: 100,
                        verifying: false,
                        message: `${result.certified ? "Valid" : "Invalid"} — ${result.summary}`,
                        status: result.certified ? Status.SUCCEEDED : Status.FAILED,
                    },
                }));

                if (result.certified) {
                    setHasValidCert(true);
                }
            } catch (err) {
                setStatusMap((prev) => ({
                    ...prev,
                    [file.name]: {
                        percent: 100,
                        verifying: false,
                        message: "Verification failed.",
                        status: Status.FAILED,
                    },
                }));
            }
        }

        isUploadingRef.current = false;
    };

    const handleSavePrice = () => {
        if (hasValidCert && doctorId && price) {
            dispatch(updateConsultationPrice({ doctorId, price }));
            message.success("You're now listed as a verified doctor. Patients can find and book you!");
            setPrice("");
        }
    };

    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            setFileList((prev) => [...prev, file as RcFile]);
            return false;
        },
        multiple: true,
        fileList,
        onRemove: (file) => {
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
            setStatusMap((prev) => {
                const { [file.name]: _, ...rest } = prev;
                return rest;
            });
        },
        accept: ".pdf",
    }

    const isFileVerifying = Object.values(statusMap).some((s) => s.verifying);


    return (
        <Modal
            open={isCertificationModalVisible}
            onCancel={() => setIsCertificationModalVisible(false)}
            footer={null}
            destroyOnHidden
            width={720}
        >
            <Card style={{ padding: 24, border: "none", boxShadow: "none" }}>
                <Title level={3}>Get Verified to Offer Services</Title>
                <Paragraph type="secondary">
                    To start offering consultations, please complete the steps below. Your medical certificate
                    must be verified before patients can see your profile.
                </Paragraph>

                <Steps current={hasValidCert ? 1 : 0} style={{ marginBottom: 24 }}>
                    <Step title="Upload Certificate" description="Verification required" />
                    <Step title="Set Consultation Price" description="Become visible to patients" />
                </Steps>

                {!hasValidCert && (
                    <>
                        <Title level={4}>Step 1: Upload & Verify Certificates</Title>
                        <Paragraph>
                            Upload valid medical certificates in PDF format. We’ll verify them using AI. Once
                            verified, you can proceed to set your price.
                        </Paragraph>

                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Select Certificates</Button>
                        </Upload>

                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={fileList.length === 0 || isFileVerifying}
                            style={{ marginTop: 16 }}
                        >
                            Upload & Verify
                        </Button>

                        <div style={{ marginTop: 24 }}>
                            {fileList.map((file) => {
                                const status = statusMap[file.name];
                                return (
                                    <div key={file.name} style={{ marginBottom: 16 }}>
                                        <strong>{file.name}</strong>
                                        <Progress percent={Math.round(status?.percent || 0)} />
                                        {status?.verifying && <Spin size="small" />}
                                        {status?.message && (
                                            <Alert
                                                type={status.status === Status.SUCCEEDED ? "success" : "error"}
                                                message={status.message}
                                                showIcon
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {hasValidCert && (
                    <div style={{ marginTop: 40 }}>
                        <Title level={4}>Step 2: Set Consultation Price</Title>
                        <Paragraph>
                            Your certificate has been verified. Set your consultation price to be listed and
                            available for bookings by patients.
                        </Paragraph>

                        <Input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price (e.g., $50)"
                            style={{ width: 200, marginRight: 12 }}
                        />
                        <Button type="primary" onClick={handleSavePrice}>
                            Save Price
                        </Button>
                    </div>
                )}
            </Card>
        </Modal>
    )
}
export default CertificateUpload;
