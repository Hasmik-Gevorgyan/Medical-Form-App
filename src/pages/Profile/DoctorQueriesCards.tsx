import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Tag,
  Modal,
  Descriptions,
  Button,
  Spin,
  Input,
  Select,
} from 'antd';
import {
  collection,
  getDocs,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import './DoctorQueriesCards.css';

const { Search } = Input;
const { Option } = Select;

interface Message {
  timestamp: any;
  about: string;
  sender: string;
  email?: string;
  name?: string;
  surname?: string;
  fileUrl?: string;
  date?: {
    day: string;
    fromTime: string;
    toTime: string;
  };
}

interface QueryData {
  id: string;
  patientName: string;
  patientSurname: string;
  email: string;
  fileUrl?: string;
  about: string;
  date?: {
    day: string;
    fromTime: string;
    toTime: string;
  };
  status: string;
  response?: {
    message: string;
    replyTime: string;
  };
}

interface Props {
  doctorId: string;
}

const DoctorQueriesCards = ({ doctorId }: Props) => {
  const [queries, setQueries] = useState<QueryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<QueryData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const q = query(collection(db, 'queries'), where('doctorId', '==', doctorId));
        const snapshot = await getDocs(q);
        const data: QueryData[] = snapshot.docs.map((doc) => {
          const d = doc.data() as DocumentData;

          const messages: Message[] = d.messages || [];
          const firstMsg: Message = messages.find((msg) => msg.sender === 'patient') || {} as Message;
          const doctorReply = [...messages]
            .reverse()
            .find((msg) => msg.sender === 'doctor');

          const dateField = firstMsg.date && firstMsg.date.day
            ? {
                day: firstMsg.date.day,
                fromTime: firstMsg.date.fromTime,
                toTime: firstMsg.date.toTime,
              }
            : undefined;

          return {
            id: doc.id,
            patientName: firstMsg.name || '',
            patientSurname: firstMsg.surname || '',
            email: firstMsg.email || '',
            fileUrl: firstMsg.fileUrl || '',
            about: firstMsg.about || '',
            date: dateField,
            status: d.status || 'Unknown',
            response: doctorReply
              ? {
                  message: doctorReply.about || '',
                  replyTime: doctorReply.timestamp?.toDate().toLocaleString() || '',
                }
              : undefined,
          };
        });
        setQueries(data);
      } catch (error) {
        console.error('Error fetching doctor queries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchQueries();
  }, [doctorId]);

  const filteredQueries = queries.filter((query) => {
    const matchesStatus = statusFilter ? query.status === statusFilter : true;
    const matchesSearch =
      query.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.patientSurname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusTag = (status: string) => {
    const color =
      status === 'new'
        ? 'blue'
        : status === 'completed'
        ? 'green'
        : status === 'in_progress'
        ? 'red'
        : 'gray';
    return <Tag color={color} className="query-card-tag">{status.toUpperCase()}</Tag>;
  };

  return (
    <div className="queries-container">
      <div className="filter-search-bar">
        <Search
          placeholder="Search by name or surname"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250, marginRight: 16 }}
          className="query-search-input"
        />
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={(value) => setStatusFilter(value || '')}
          style={{ width: 180 }}
          value={statusFilter || undefined}
          className="query-status-select"
        >
          <Option value="new">New</Option>
          <Option value="completed">Completed</Option>
          <Option value="in_progress">In progress</Option>
        </Select>
      </div>

      {loading ? (
        <div className="query-loading">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className="query-cards-row">
          {filteredQueries.map((query) => (
            <Col key={query.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`${query.patientName} ${query.patientSurname}`}
                extra={getStatusTag(query.status)}
                onClick={() => {
                  setSelectedQuery(query);
                  setModalOpen(true);
                }}
                hoverable
                className="query-card"
              >
                <p className="query-card-email"><strong>Email:</strong> {query.email}</p>
                <p className="query-card-date">
                  <strong>Date:</strong>{' '}
                  {query.date
                    ? `${query.date.day} | ${query.date.fromTime} - ${query.date.toTime}`
                    : '—'}
                </p>
                <p className="query-card-about">
    <strong>About:</strong>{' '}
    {query.about.length > 100 ? query.about.slice(0, 10) + '...' : query.about}
  </p>
              </Card>
            </Col>
          ))}
          {filteredQueries.length === 0 && !loading && (
            <p className="no-queries-message">No queries found.</p>
          )}
        </Row>
      )}

      <Modal
        title="Query Details"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        className="query-modal"
      >
        {selectedQuery && (
          <div className="query-modal-content">
            <Descriptions column={1} bordered size="small" className="query-modal-descriptions">
              <Descriptions.Item label="Patient">{selectedQuery.patientName} {selectedQuery.patientSurname}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedQuery.email}</Descriptions.Item>
              <Descriptions.Item label="Date">
                {selectedQuery.date
                  ? `${selectedQuery.date.day} | ${selectedQuery.date.fromTime} - ${selectedQuery.date.toTime}`
                  : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">{selectedQuery.status}</Descriptions.Item>
              <Descriptions.Item label="About">{selectedQuery.about}</Descriptions.Item>
              <Descriptions.Item label="Response">
                {selectedQuery.response?.message || '—'}
                {selectedQuery.response?.replyTime && (
                  <>
                    <br />
                    <small>Reply Time: {selectedQuery.response.replyTime}</small>
                  </>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="File">
                {selectedQuery.fileUrl ? (
                  <a href={selectedQuery.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
                ) : '—'}
              </Descriptions.Item>
            </Descriptions>
            <div className="query-modal-footer">
              <Button
                type="primary"
                onClick={() => navigate(`/response?requestId=${selectedQuery.id}`)}
              >
                Go to Query Page
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorQueriesCards;
