import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const useAuth = () => {
  const { status, user } = useSelector((state: RootState) => state.auth);
  
  return {
    isLoggedIn: !!user,
    isLoading:  status === 'loading',
    user,
    userId: user?.id || null,
  };
};

export default useAuth;