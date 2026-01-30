// import React from 'react'
// import { BrowserRouter as Router } from 'react-router-dom'
// // import { AuthProvider } from './context/AuthContext.jsx'
// import AppRoutes from './routes/AppRoutes'
// import './App.css'

// function App() {
//   return (
//     <Router>
//       {/* <AuthProvider> */}
//         <div className="min-h-screen bg-gray-50">
//           <AppRoutes />
//         </div>
//       {/* </AuthProvider> */}
//     </Router>
//   )
// }

// export default App


import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
