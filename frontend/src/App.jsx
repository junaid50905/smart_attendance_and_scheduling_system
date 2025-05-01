import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UpcomingClasses from "./pages/UpcomingClassess";
import MarkAttendance from "./pages/MarkAttendance";
import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

function App() {

   

    return (
        <Router>
            <Routes>
                {/* Public Route - Redirect if already logged in */}
                <Route
                    path="/login"
                    element={
                        localStorage.getItem("token") ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/upcoming-classes"
                        element={<UpcomingClasses />}
                    />
                    <Route
                        path="/mark-attendance"
                        element={<MarkAttendance />}
                    />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
