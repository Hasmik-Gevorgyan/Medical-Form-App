import { useState } from 'react';
import { Tooltip} from 'antd';
import { Modal, Button, Input, List, Typography } from 'antd';
import { getJSONFromFirebase } from './getFirebasedata';
import { RobotOutlined } from '@ant-design/icons';
const { TextArea } = Input;

const AIChatModal = () => {
	
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
	const send = await getJSONFromFirebase();
    if (!userInput.trim()) return;


    setUserInput('');
    const userMessage = { sender: 'You', text: userInput };
    setChatLog((prev) => [...prev, userMessage]); // Add user message
    setLoading(true);

    try {
      const res = await fetch('https://askgpt-d2hus5cjwa-uc.a.run.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "Youre our medical assistant give response to our patients depends the provided data . this is the message :" + userInput + "this is our data ." + JSON.stringify(send) }),
      });

      const data = await res.json();

      const aiReply = {
        sender: 'AI',
        text: data.reply || 'Sorry, I did not understand that.',
      };

      setChatLog((prev) => [...prev, aiReply]); // Add AI reply
	  setLoading(false);
	} catch (error) {
      setChatLog((prev) => [
        ...prev,
        { sender: 'AI', text: 'Error: Failed to get a response.' },
      ]);
      console.error(error);
    }
  };

  return (
    <>
	  <Tooltip title="AI Assistant" placement="left">
		<Button
		  type="primary"
		  icon={<RobotOutlined />}
		  style={{
			position: 'fixed',
			bottom: 24,
			left: 24,
			zIndex: 1000,
			width: 50,           // Larger width
			height: 50,          // Larger height
			fontSize: 24,        // Larger icon
		  }}
		  onClick={() => setIsModalOpen(true)}
		/>
	</Tooltip>	

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
                <Typography.Text strong>{item.sender}:</Typography.Text>{' '}
                {item.text}
              </List.Item>
            )}
          />
        </div>

        <TextArea
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
			if (loading || !userInput.trim()) return;
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the assistant..."
        />

        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="primary"
            onClick={handleSend}
            loading={loading}
            disabled={loading || !userInput.trim()}
          >
            Send
          </Button>
          <Button
            type="default"
            onClick={() => setChatLog([])}
            style={{ marginLeft: 8 }}
          >
            Clear
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AIChatModal;
