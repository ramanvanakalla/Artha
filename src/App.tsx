import './App.css'
import Headers from './components/header.tsx'
import TransactionContainer from './components/transactionContainer.jsx'
import 'semantic-ui-css/semantic.min.css'
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home.tsx'
import SplitTransactionContainer from './components/splitTransactionContainer.tsx'


function App() {
  return (
    <>      
      <BrowserRouter>
        <Headers/>
        <Routes>
          <Route path="/" element={<TransactionContainer />}></Route>
            <Route path="transactions" element={<TransactionContainer />} />
            <Route path="categories" element={<Home />} />
            <Route path="friends" element={<Home />} />
            <Route path="splits" element={<SplitTransactionContainer />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors/>
    </>
  )
}


export default App
