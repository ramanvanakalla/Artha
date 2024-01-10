import './App.css'
import Headers from './components/header.tsx'
import TransactionContainer from './components/transactionContainer.jsx'
import 'semantic-ui-css/semantic.min.css'
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home.tsx'
import SplitTransactionContainer from './components/splitTransactionContainer.tsx'
import CategoryContainer from './components/categoriesContainer.tsx'
import Login from './components/login.tsx'
import BGHeaders from './components/Bgheader.tsx'
function App() {

  const renderHeaders = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      return <BGHeaders />; // Don't render Headers for the home path
    }
    return <Headers />;
  };

  return (
    <>      
      <BrowserRouter>
        {renderHeaders()}
        <Routes>
          <Route path="/" element={< Login /> }></Route>
            <Route path="transactions" element={<TransactionContainer />} />
            <Route path="categories" element={<CategoryContainer />} />
            <Route path="friends" element={<Home />} />
            <Route path="splits" element={<SplitTransactionContainer />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors/>
    </>
  )
}


export default App
