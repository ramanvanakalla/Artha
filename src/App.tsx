import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import TransactionContainer from './components/transactionContainer.jsx'
import SplitTransactionContainer from './components/splitTransactionContainer.tsx'
import CategoryContainer from './components/categoriesContainer.tsx'
import Login from './components/login.tsx'
import Register from './components/register.tsx'
import RenderHeader from './components/renderHeaders.tsx'
import { useUserContext } from './components/userContext.tsx'; 
import { Toaster } from "@/components/ui/sonner"
import Home from './components/home.tsx'
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
      <BrowserRouter>
      <RenderHeader></RenderHeader>
        <Routes>          
          {
            loggedIn ? (
              <>
                <Route path="/" element={<Navigate to="/transactions" />} />
                <Route path="/login" element={<Navigate to="/transactions" />} />
                <Route path="/register" element={<Navigate to="/transactions" />} />
                <Route path="transactions" element={<TransactionContainer/>} />
                <Route path="categories" element={<CategoryContainer />} />
                <Route path="friends" element={<Home />} />
                <Route path="splits" element={<SplitTransactionContainer />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="transactions" element={<Navigate to="/login" />}/>
                <Route path="categories" element={<Navigate to="/login" />} />
                <Route path="friends" element={<Navigate to="/login" />}/>
                <Route path="splits" element={<Navigate to="/login" />} />
              </>
            )
          }
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </>
  )
}

export default App
