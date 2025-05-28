import { useState } from 'react';
import { Modal, Button, Input, List, Typography } from 'antd';
import { getJSONFromFirebase } from './getFirebasedata';
const { TextArea } = Input;

const AIChatModal = () => {
//   State for opening
  const [isModalOpen, setIsModalOpen] = useState(false);
//   state for history
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
//  state for user input 
  const [userInput, setUserInput] = useState('');

//   Get message from AI
  const handleSend = async () => {
    if (!userInput.trim()) return;
    setUserInput('');

	// Getting the json data for sending to AI
	const data = await getJSONFromFirebase(userInput);
	
	console.log('Data to send:', data);
	// const response  = await fetch('http://localhost:3001/api/chat', {
		// method: 'POST',
		// headers: {
			// 'Content-Type': 'application/json',
		// },
		// body: JSON.stringify({ message: data }),
	// });
	// console.log('Response:', response);
	}

  return (
    <>
	{/* Button for openning */}
      <Button type="default" onClick={() => setIsModalOpen(true)}>
        Open AI Assistant
      </Button>
	{/* Modal Elem of antd */}
      <Modal
        title="AI Assistant"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
          <List
            dataSource={chatLog}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.sender}:</Typography.Text> {item.text}
              </List.Item>
            )}
          />
        </div>
        <TextArea
          rows={4}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the assistant..."
        />
        <Button type="primary" onClick={handleSend} style={{ marginTop: 8 }}>
          Send
        </Button>
		<Button type='default' onClick={() => setChatLog([])} style={{ marginTop: 8, marginLeft: 8 }}>
			Clear
		</Button>
      </Modal>
    </>
  );
};

export default AIChatModal;
