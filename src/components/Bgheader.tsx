import { Link, useLocation } from 'react-router-dom';

const BGHeaders = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="justify-center lg:my-12">
      <div className="flex justify-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Artha
        </h1>
      </div>

      <div className="flex justify-center my-1">
        {isRegisterPage ? (
          <>
            Already have an account? <Link to="/login" className="px-2 text-blue-500 hover:underline">Sign In</Link>
          </>
        ) : (
          <>
          New to Artha? <Link to="/register" className="px-2 text-blue-500 hover:underline">Create Account</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default BGHeaders;
