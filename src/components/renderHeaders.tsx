import React from 'react';
import BGHeaders from './Bgheader';
import Headers from './header.tsx';
import { useUserContext } from './userContext.tsx'; // Import the correct path to your user context file

const RenderHeader: React.FC = () => {
  const { loggedIn } = useUserContext(); // Get the loggedIn state from the context

  const renderHeader = (): JSX.Element => {
    return loggedIn ? <Headers /> : <BGHeaders />;
  };

  console.log("headers", loggedIn);

  return <>{renderHeader()}</>;
};

export default RenderHeader;
