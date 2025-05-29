import { useSelector } from "react-redux";
import type { RootState } from '../../app/store';

function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <h1>Home Page</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
  </div>
);
}

export default Home;