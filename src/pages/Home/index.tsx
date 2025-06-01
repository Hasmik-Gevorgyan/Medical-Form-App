import useAuth from "@/hooks/useAuth";

const Home = () =>{

  const { isLoggedIn, userId, user } = useAuth();
  console.log('isLoggedIn', isLoggedIn, user, userId);

  return (
    <div>
      <h1>Home Page</h1>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
  </div>
);
}

export default Home;