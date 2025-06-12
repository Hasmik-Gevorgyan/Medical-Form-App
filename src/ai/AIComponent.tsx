// Import necessary libraries and components
import { useEffect, useRef, useState } from 'react';
import { Tooltip} from 'antd';
import { Modal, Button, Input, List} from 'antd';
import { getJSONFromFirebase } from './getFirebasedata';
import { CloseOutlined, RobotOutlined, SendOutlined} from '@ant-design/icons';
const { TextArea } = Input;


// Main AIChatModal component
const AIChatModal = () => {
	// Define frequently asked questions
	const faqs = [
		"What services do you offer through your medical consulting platform?",
		"Are your online consultations secure and confidential?",
		"Can I get prescriptions through your platform?",
		"Do you offer pediatric consultations?",
		"Can I consult with a specialist through your platform?",
		"Is insurance accepted for online consultations?",
	];
	  
	// state for opening modal, chat log, user input, and loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const send = useRef<any>(null); // Using useRef to store fetched data

//   Sending user message to the deployed firebase function
  const handleSend = async () => {
	// Prevent sending empty messages
    setUserInput('');
	setChatLog((prev) => [...prev, userMessage]); // Add user message
    setLoading(true);

	// If user input is empty, do not proceed
    if (!userInput.trim()) return;
    const userMessage = { sender: 'You', text: userInput };


    try {
    //   Send user input and data to the Firebase function getting the information about doctors and services from firebase
		const res = await fetch('https://us-central1-medical-project-2ba5d.cloudfunctions.net/askGpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			prompt:
			  `You are a helpful and professional medical assistant. Speak naturally and clearly to the patient, as a real assistant would. Don't mention that you're basing your response on data — just answer the question directly and kindly.\n\n` +
			  `Here is the patient's message:\n"${userInput}"\n\n` +
			  `Here is the data you have:\n${JSON.stringify(send)}`
		  })		  
      });

	//   Check if the response is ok
      const data = await res.json();

    //  If the response is not ok, throw an error 
	  const aiReply = {
        sender: 'AI',
        text: data.reply || 'Sorry, I did not understand that.',
      };

      setChatLog((prev) => [...prev, aiReply]); // Add AI reply
	  setLoading(false);
	} catch (error) {
		// If there is an error, set loading to false and add an error message to the chat log
      setChatLog((prev) => [
        ...prev,
        { sender: 'AI', text: 'Error: Failed to get a response.' },
      ]);
      console.error(error);
    }
  };

  useEffect(() => {

	// In first render, fetch data from Firebase and store it in useRef to avoid re-fetching on every render
	const fetchData = async () => {
		try {
			const data = await getJSONFromFirebase();
			send.current = data; // Store fetched data in useRef
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	fetchData();} ,[]);

  return (
    <>
	  {/* Floating button to open the modal */}
      <Tooltip title="AI Assistant" placement="left">
        <Button
          type="primary"
          shape="circle"
          icon={<RobotOutlined style={{ fontSize: 28 }} />}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1000,
            width: 60,
            height: 60,
            boxShadow: '0 6px 15px rgba(24, 144, 255, 0.3)',
            background: 'linear-gradient(135deg, #40a9ff 0%, #0050b3 100%)',
            border: 'none',
            transition: 'transform 0.2s ease-in-out',
          }}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
      </Tooltip>

		{/* Modal for AI chat */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 22, color: '#0050b3' }}>
            <RobotOutlined style={{ marginRight: 8 }} /> AI Assistant
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={620}
        bodyStyle={{ padding: 28 }}
        style={{ top: 40 }}
        centered
      >

{/* The part for main chat */}
<div
  style={{
    maxHeight: 300,
    overflowY: 'auto',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: chatLog.length === 0 ? 'center' : 'flex-start',
    alignItems: chatLog.length === 0 ? 'center' : 'stretch',
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  }}
>
	{/* Messages if not found showing FAQS */}
  {chatLog.length === 0 ? (
    userInput.trim() === "" ? (
      <div style={{ width: '100%' }}>
        <h4 style={{ marginBottom: 12, color: '#555' }}>Frequently Asked Questions</h4>
        <ul style={{ paddingLeft: 20, textAlign: 'left', color: '#1890ff' }}>
          {faqs.map((faq, i) => (
            <li
              key={i}
              style={{ cursor: 'pointer', marginBottom: 8, userSelect: 'none' }}
              onClick={() => setUserInput(faq)}
              onMouseEnter={e => (e.currentTarget.style.color = '#40a9ff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1890ff')}
            >
              {faq}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p style={{ marginTop: 40 }}>No messages yet. Type something and press Send!</p>
    )
  ) : (
	// Render chat messages
    <List
      dataSource={chatLog}
      renderItem={(item) => (
        <List.Item
          style={{
            display: 'flex',
            justifyContent: item.sender === 'You' ? 'flex-end' : 'flex-start',
            padding: '6px 0',
          }}
        >
          <div
            style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: 12,
              color: '#000',
              fontSize: 14,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {item.sender !== 'You' && (
              <RobotOutlined style={{ color: '#40a9ff', marginRight: 8, fontSize: 18 }} />
            )}
            {item.sender === 'You' && (
             <SendOutlined style={{ color: '#40a9ff', marginRight: 8, fontSize: 18 }} />
            )}
            <span>{item.text}</span>
          </div>
        </List.Item>
      )}
    />
  )}
</div>
        {/* Textarea input */}
        <TextArea
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the assistant..."
          style={{
            borderRadius: 16,
            padding: '14px 20px',
            fontSize: 16,
            boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.1)',
            resize: 'vertical',
            transition: 'box-shadow 0.3s ease',
            border: '1.5px solid #d9d9d9',
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow =
              '0 0 8px 2px rgba(24, 144, 255, 0.4)')
          }
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0, 0, 0, 0.1)')
          }
        />

        {/* Buttons */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <Button
            type="default"
            onClick={() => {
				setUserInput(''); setChatLog([])}}
				icon={<CloseOutlined />}
            style={{
              borderRadius: 20,
              padding: '8px 26px',
              fontWeight: 600,
              fontSize: 15,
              color: '#555',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '1.5px solid #d9d9d9',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.15)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)')
            }
          >
            Clear
          </Button>

          <Button
            type="primary"
            onClick={handleSend}
            loading={loading}
            disabled={loading || !userInput.trim()}
            icon={<SendOutlined />}
            style={{
              borderRadius: 20,
              padding: '8px 28px',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 6px 14px rgba(24, 144, 255, 0.45)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 10px 22px rgba(24, 144, 255, 0.75)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = '0 6px 14px rgba(24, 144, 255, 0.45)')
            }
          >
            Send
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default AIChatModal;
