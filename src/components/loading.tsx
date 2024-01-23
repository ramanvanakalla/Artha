import React, { useEffect } from 'react';
import { Triangle } from 'react-loader-spinner';

interface LoadingProps {
  loading: boolean;
}

const LoadingComponent: React.FC<LoadingProps> = ({ loading }) => {
  useEffect(() => {
    console.log('LoadingComponent is rendering...', loading);
  }, [loading]); // Empty dependency array ensures the effect runs only once during mount

  return (
    <>
      {loading && (
        <>
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="p-6 rounded">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#000000"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
        </>
        
      )}
    </>
  );
};

export default LoadingComponent;
