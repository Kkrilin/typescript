import AppRoutes from './component/Routes/AppRoutes.tsx'

import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <AppRoutes />
    </>
  )
}

export default App
