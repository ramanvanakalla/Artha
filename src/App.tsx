import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import FriendsContainer from './components/friendsContainer.tsx';
import CategoryContainer from './components/categoriesContainer.tsx'
import Login from './components/login.tsx'
import Register from './components/register.tsx'
import RenderHeader from './components/renderHeaders.tsx'
import { useUserContext } from './components/userContext.tsx'; 
import { Toaster } from "@/components/ui/sonner"
import 'semantic-ui-css/semantic.min.css'

function App() {
  const { loggedIn: contextLoggedIn } = useUserContext();
  const [loggedIn, setLoggedIn] = useState<boolean>(contextLoggedIn);

  useEffect(() => {
    setLoggedIn(contextLoggedIn);
  }, [contextLoggedIn]);
  console.log("logged in ", loggedIn)
  return (
    <>      
      <Toaster richColors position="top-center" className="block sm:hidden md:hidden lg:hidden" />
      <BrowserRouter>
      <RenderHeader></RenderHeader>
      <div className='pt-36 lg:pt-20 md:pt-20'>
      <Routes>          
          {
            loggedIn ? (
              <>
                <Route path="/" element={<Navigate to="/transactions" />} />
                <Route path="/login" element={<Navigate to="/transactions" />} />
                <Route path="/register" element={<Navigate to="/transactions" />} />
                <Route path="transactions" element={<CategoryContainer/>} />
                <Route path="splits" element={<FriendsContainer />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="transactions" element={<Navigate to="/login" />}/>
                <Route path="splits" element={<Navigate to="/login" />} />
              </>
            )
          }
        </Routes>
      </div>
        
        <Toaster richColors className="hidden lg:block" />
      </BrowserRouter>
    </>
  )
}

export default App
