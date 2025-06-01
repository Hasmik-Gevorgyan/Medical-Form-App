import { useEffect, useState } from 'react';
import { Table, Tag, Modal, Descriptions,Button } from 'antd';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config.ts';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

export interface QueryData {
  id: string;
  date: string;
  request: string;
  about: string;
  email: string;
  fileUrl?: string;
  name: string;
  surname: string;
  status: string;
  response?: {
    message: string;
    replyTime?: string;
  };
}

interface Props {
  doctorId: string;
}

const DoctorQueriesTable = ({ doctorId }: Props) => {
  const [queries, setQueries] = useState<QueryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<QueryData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const q = query(
          collection(db, 'queries'),
          where('doctorId', '==', doctorId)
        );
        const snapshot = await getDocs(q);
        const data: QueryData[] = snapshot.docs.map((doc) => {
          const d = doc.data();

          // Безопасно преобразуем дату запроса
          let dateStr = '';
          if (d.request?.date) {
            if (d.request.date instanceof Timestamp) {
              dateStr = d.request.date.toDate().toLocaleString();
            } else {
              dateStr = String(d.request.date);
            }
          }

          // Безопасно преобразуем replyTime ответа
          let replyTimeStr = '';
          if (d.response?.replyTime) {
            if (d.response.replyTime instanceof Timestamp) {
              replyTimeStr = d.response.replyTime.toDate().toLocaleString();
            } else {
              replyTimeStr = String(d.response.replyTime);
            }
          }

          return {
            id: doc.id,
            date: dateStr,
            request: d.request?.request || '',
            about: d.request?.about || '',
            email: d.request?.email || '',
            fileUrl: d.request?.fileUrl || '',
            name: d.request?.name || '',
            surname: d.request?.surname || '',
            status: d.status || 'Unknown',
            response: d.response
              ? {
                  message: d.response.message,
                  replyTime: replyTimeStr || undefined,
                }
              : undefined,
          };
        });
        setQueries(data);
      } catch (err) {
        console.error('Error fetching queries:', err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchQueries();
    }
  }, [doctorId]);

  const columns: ColumnsType<QueryData> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => `${record.name} ${record.surname}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        ) : (
          '—'
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Responded', value: 'responded' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'grey';
        if (status === 'new') color = 'blue';
        else if (status === 'responded') color = 'green';
        else if (status === 'rejected') color = 'red';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const handleRowClick = (record: QueryData) => {
    setSelectedQuery(record);
    setModalOpen(true);
  };
  const navigate = useNavigate();

  return (
    <>
      <Table
        dataSource={queries}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Query Details"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {selectedQuery && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Patient">
              {selectedQuery.name} {selectedQuery.surname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedQuery.email}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {selectedQuery.date}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedQuery.status}
            </Descriptions.Item>
            <Descriptions.Item label="About">
              {selectedQuery.about}
            </Descriptions.Item>
            {selectedQuery.status === 'responded' || 'rejected' ? (
              <Descriptions.Item label="Response">
                {selectedQuery.response?.message || '—'}
                {selectedQuery.response?.replyTime && (
                  <>
                    <br />
                    <small>Reply Time: {selectedQuery.response.replyTime}</small>
                  </>
                )}
              </Descriptions.Item>
            ) : (
              <Descriptions.Item label="Response">
                {selectedQuery.response ? selectedQuery.response.message : '—'}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="File">
              {selectedQuery.fileUrl ? (
                <a href={selectedQuery.fileUrl} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              ) : (
                '—'
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
         <div style={{ marginTop: 16, textAlign: 'right' }}>
     <Button
  type="primary"
  onClick={() => {
    if (selectedQuery) {
      navigate(`/response?requestId=${selectedQuery.id}`);
    }
  }}
  disabled={!selectedQuery}
>
  Go to Query Page
</Button>
    </div>
      </Modal>
    </>
  );
};

export default DoctorQueriesTable;
