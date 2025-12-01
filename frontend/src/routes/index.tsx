import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AuditorRegister from "../views/auditors/AuditorRegister";
import AuditorsOverview from "../views/auditors/AuditorsOverview";
import IssueCertificate from "../views/certificates/IssueCertificate";
import PreCertificateRegister from "../views/certificates/PreCertificateRegister";
import PreCertificatesOverview from "../views/certificates/PreCertificatesOverview";
import VerifyCertificate from "../views/certificates/VerifyCertificate";
import CertifierRegister from "../views/certifiers/CertifierRegister";
import CertifiersOverview from "../views/certifiers/CertifiersOverview";
import HomePage from "../views/HomePage";
import NotFound from "../views/NotFound";
import ProducersRegister from "../views/producers/ProducerRegister";
import ProducersOverview from "../views/producers/ProducersOverview";
import ProductRegister from "../views/products/ProductRegister";
import ProductsOverview from "../views/products/ProductsOverview";
import UnauthorizedPage from "../views/UnauthorizedPage";


function AppRoutes() {
    return (
        <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsOverview />} />
            <Route path="/products/register" element={<ProductRegister />} />
            <Route path="/producers" element={<ProducersOverview />} />
            <Route path="/producers/register" element={<ProducersRegister />} />
            <Route path="/certifiers" element={<CertifiersOverview />} />
            <Route path="/certifiers/register" element={<CertifierRegister />} />
            <Route path="/auditors" element={<AuditorsOverview />} />
            <Route path="/auditors/register" element={<AuditorRegister />} />
            <Route path="/certificates/pre-issued" element={<PreCertificatesOverview />} />
            <Route path="/certificates/register" element={<PreCertificateRegister />} />
            <Route path="/certificates/verify" element={<VerifyCertificate />} />

            <Route path="/certificates/issue/:id" element={<IssueCertificate />} />

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
