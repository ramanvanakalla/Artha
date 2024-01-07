import './App.css'
import Headers from './components/header.tsx'
import TransactionContainer from './components/transactionContainer.jsx'
import 'semantic-ui-css/semantic.min.css'
import { Toaster } from "@/components/ui/sonner"
function App() {
  return (
    <>
      <Headers/>
      <TransactionContainer></TransactionContainer>
      <Toaster richColors/>
    </>
  )
}


export default App
