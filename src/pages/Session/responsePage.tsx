// Import necessary libraries and components
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Checkbox, message, Typography, Spin, Input, Button, Card, Avatar, Upload } from 'antd';
import { db, storage } from '@/firebase/config';
import { getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import useAuth from '@/hooks/useAuth';
import { UserOutlined, MedicineBoxOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const { Title, Text } = Typography;

// Define interfaces for message and chat data structures
interface Message {
	fileUrl?: string; // Optional for messages that don't have files
	sender: 'doctor' | 'patient';
	about: string;
	timestamp: any; // Consider using Firebase Timestamp or Date for better type safety
	name?: string;
	email?: string;
	surname?: string;
}

interface ChatData {
	userId: string;
	status: string;
	messages: Message[];
	doctorName: string;
	doctorSurname: string;
	doctorId: string;
}



export const ResponsePage = () => {

	// HOOKS
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const navigate = useNavigate();
  const { user, userId, isLoading,  } = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	// EFFECTS
  useEffect(() => {
	// Check if requestId is valid
    if (isLoading || !requestId) return;

	// Fetch chat data from Firestore
    const fetchData = async () => {
      try {
        const ref = doc(db, 'queries', requestId);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
			// If the document exists, setting the chat data
          const data = docSnap.data() as ChatData;
			console.log('Fetched chat data:', data);
            setChatData(data);
            setCompleted(data.status === 'completed');
            setIsButtonDisabled(data.status === 'completed');
			setIsValid(true);
        }
      } catch (error) {
		// Handle errors during data fetching
        console.error('Error fetching chat data:', error);
        setIsValid(false);
        message.error('Failed to load request data.');
      }
    };

    fetchData();
  }, [userId, requestId, isLoading]);

//   FINAL
  const handleFinish = async () => {
	// If the requestId is not valid or the message input is empty, do nothing
    if (!requestId || !messageInput.trim()) return;

    try {
		// Prepare the message to be sent
		setMessageInput(''); // Clear input after sending
		setSelectedFile(null); // Clear selected file after sending
      const queryDocRef = doc(db, 'queries', requestId);
      const status = completed ? 'completed' : 'in_progress';

	//   Fetch the existing chat data
      const docSnap = await getDoc(queryDocRef);
      let messages: Message[] = [];

	//   If the document exists, retrieve messages
      if (docSnap.exists()) {
        const data = docSnap.data() as ChatData;
        messages = data.messages || [];
      }

	  let fileUrl = '';

	  if (selectedFile) {
		// If a file is selected, upload it to Firebase Storage
			const storageRef = ref(storage, `files/${selectedFile.name}`);
			await uploadBytes(storageRef, selectedFile);
			fileUrl = await getDownloadURL(storageRef);
	}

	// Adding the new message to the messages array
      messages.push({
		fileUrl,
        sender: userId === chatData?.doctorId ? 'doctor' : 'patient',
        about: messageInput,
        timestamp: new Date(),
      });


	//   Update the Firestore document with the new message and status
	  await updateDoc(queryDocRef, {
        status,
        timestamp: serverTimestamp(),
        messages,
      });


	//   Update the local state with the new messages and status
	  setChatData((prev) => ({
        ...prev!,
        messages: [...messages],
        status,
      }));



	//   If the user is a doctor, send an email notification to the patient
      if (userId === chatData?.doctorId) {
        await emailjs.send(
          'service_bb7nlek',
          'template_vrnbuod',
          {
            title: 'Response to your request',
            name: messages[0]?.name || 'Patient',
            time: new Date().toISOString(),
            email: messages[0]?.email,
            doctor_name: `${user?.name} ${user?.surname}`,
            status,
            message: messages[messages.length - 1].about,
            replyTime: new Date().toISOString(),
          },
          'ooOyDWjTfU7j0PLn-'
        );
      }


	//   Show success message and update UI state
      if (completed) {
        setIsButtonDisabled(true); // Disable button after successful submission if marked completed
        setCompleted(true); // Ensure completed state is set
      } else {
        setCompleted(false); // Reset checkbox for in_progress submissions
      }
    } catch (error) {
      console.error('Error updating response:', error);
      message.error('Failed to send response. Please try again.');
    }
  };

//   The spinner is displayed while the data is being fetched
  if (isValid === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

//   If the user does not have permission to view the request, redirect them to the home page
  if (!isValid) {
    message.error('You do not have permission to view this request.');
    navigate('/');
    return null;
  }

//   Getting the file
  const handleFileChange = (file : any) => {
		setSelectedFile(file?.fileList[0].originFileObj);
	};

 
	// Getting the heading name based on the userId and chatData
  const headingName = userId === chatData?.doctorId
    ? `${chatData?.messages[0]?.name} ${chatData?.messages[0]?.surname || ''}`
    : `${chatData?.doctorName} ${chatData?.doctorSurname || ''}`;

  return (
    // Main container for the response page
	<div style={{width:'60vw', maxWidth: '100vw', margin: 'auto', maxHeight: '100vh' }} className='ll'>
      {/* Title part */}
	  <Title level={2} style={{ textAlign: 'center', marginBottom: 5, }}>
        {userId == chatData?.doctorId ? `Patient ${headingName}` : `Doctor ${headingName}`}
      </Title>
	  {/* Card for messages */}
      <Card style={{maxWidth : '80vw', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'}} className='ss'>
        <div className='ocean-scroll' style={{padding: 16, maxHeight: '55vh', overflowY: 'auto', scrollBehavior: 'smooth',}}>
          {/* Mapping */}
		  {chatData?.messages?.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 16,
                flexDirection: msg.sender === 'doctor' ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
              }}
            >
              <Avatar
          		onClick={() => {
					if (msg.sender === 'doctor') {
						navigate(`/doctors/${chatData?.doctorId}`);
					}
				}}
				className='oceanic-avatar'
				size="large"
                icon={msg.sender === 'doctor' ? <MedicineBoxOutlined type='primary' /> : <UserOutlined type='primary' />}
			  	style={{backgroundColor: msg.sender === 'doctor' ? '#1890ff' : 'rgba(100, 149, 237, 1)'	,
					color: '#fff',
					fontSize: 24,}}
			  />
			  {/* The name showing part depends on auth state */}
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: 'block', marginBottom: 4 }}>
                  {msg.sender === 'doctor'
                    ? `${chatData.doctorName} ${chatData.doctorSurname || ''}`
                    : `${chatData.messages[0].name || 'Patient'} ${chatData.messages[0].surname || ''}`}
                </Text>
                <div
                  style={{
                    padding: 12,
                    borderBottom: msg.sender === 'doctor' ? '1px solid #91d5ff' : '1px solid rgba(100, 149, 237, 1)',
                    maxWidth: '80%',
					boxShadow: msg.sender === 'doctor' ? '0 2px 4px rgba(145, 213, 255, 0.6)' : '0 2px 4px rgba(100, 149, 237, 0.6)'
                  }}
                >
                  <Text style={{ display: 'block', marginBottom: 4 }}>{msg.about}
					{/* If there is file attach it link too */}
				  {msg.fileUrl && <a
    				href={msg.fileUrl}
    				rel="noopener noreferrer"
					className='oceanic-link'
					>
						    <PaperClipOutlined style={{ fontSize: 16 }} />
    							View Attached File
					</a>}
				  </Text>
				  {/* Displaying time of response */}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {msg.timestamp?.toDate?.()
                      ? msg.timestamp.toDate().toLocaleString()
                      : ''}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>

		  {/* If the request is completed no space for message sending */}
        {!isButtonDisabled && (
			<>
			<div style={{ display: 'flex',flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop: 8, }}>
            <Input.TextArea
              rows={1}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your response here..."
              style={{ resize: 'vertical' }}
			  className='oceanic-textarea'
              aria-label="Message input"
			  onPressEnter={handleFinish}
            />
				<Button
            	  onClick={handleFinish}
            	  disabled={isButtonDisabled || !messageInput.trim()} // Disable after submission if completed
				  className='oceanic-button'
				  aria-label="Send response"
            	>
            	<SendOutlined />
            	</Button>
			</div>
			<div className='ff'>
				{/* Part for checking completed file uploading */}
            	{userId && (
            	  <Checkbox
            	    checked={completed}
            	    onChange={(e) => setCompleted(e.target.checked)}
					className='oceanic-checkbox'
            	  >
            	    Completed
            	  </Checkbox>
            	)}
				<Upload
				  beforeUpload={() => false} // prevent auto-upload
				  onChange={handleFileChange}
				  fileList={selectedFile ? [selectedFile] : []}
				  showUploadList={true}
				  multiple={false}
				  maxCount={1}
				>
				  <Button
				    className='send-button'
					icon={<PaperClipOutlined />}
				  >
				    Attach File
				  </Button>
				</Upload>
			</div>
			</>)}
      </Card>
    </div>
  );
};

export default ResponsePage;