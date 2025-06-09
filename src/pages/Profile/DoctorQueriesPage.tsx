import DoctorQueriesCards from './DoctorQueriesCards';
import  useAuth  from '@/hooks/useAuth'; // если у тебя есть useAuth или аналог
import { Navigate } from 'react-router-dom';

const DoctorQueriesPage = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (!user.id) return null;

  return <DoctorQueriesCards doctorId={user.id} />;
};

export default DoctorQueriesPage;
