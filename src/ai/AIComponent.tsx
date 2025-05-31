import { useState } from 'react';
import { Modal, Button, Input, List, Typography } from 'antd';
import { getJSONFromFirebase } from './getFirebasedata';


const { TextArea } = Input;

const AIChatModal = () => {
	
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
	const send = await getJSONFromFirebase();
    if (!userInput.trim()) return;

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

	  console.log(data);
      const aiReply = {
        sender: 'AI',
        text: data.reply || 'Sorry, I did not understand that.',
      };

      setChatLog((prev) => [...prev, aiReply]); // Add AI reply
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        { sender: 'AI', text: 'Error: Failed to get a response.' },
      ]);
      console.error(error);
    }

    setUserInput('');
    setLoading(false);
  };

  return (
    <>
      <Button type="default" onClick={() => setIsModalOpen(true)}>
        Open AI Assistant
      </Button>

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
