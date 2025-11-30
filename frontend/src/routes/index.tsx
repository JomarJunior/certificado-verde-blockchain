import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import HomePage from "../views/HomePage";
import NotFound from "../views/NotFound";
import ProductRegister from "../views/products/ProductRegister";
import ProductsOverview from "../views/products/ProductsOverview";
import UnauthorizedPage from "../views/UnauthorizedPage";


function AppRoutes() {
    return (
        <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsOverview />} />
            <Route path="/products/register" element={<ProductRegister />} />


            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/test-protected" element={
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            } />
            <Route path="/test-protected-admin" element={
                <ProtectedRoute requiredRoles={['admin']}>
                    <div>Protected Admin Content</div>
                </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes;
