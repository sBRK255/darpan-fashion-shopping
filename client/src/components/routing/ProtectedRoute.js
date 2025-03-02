import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!userInfo) {
        // Redirect to login page with return url
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    return children;
};

export default ProtectedRoute; 