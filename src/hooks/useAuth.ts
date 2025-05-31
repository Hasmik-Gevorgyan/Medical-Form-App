import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return {
    isLoggedIn: !!user,
    user,
    userId: user?.id || null,
  };
};

export default useAuth;