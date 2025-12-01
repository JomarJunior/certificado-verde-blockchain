import React from "react";
import { useSearchParams } from "react-router-dom";

const VerifyCertificate: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();



    return (
        <div>Verify Certificate</div>
    )
}

export default VerifyCertificate;
