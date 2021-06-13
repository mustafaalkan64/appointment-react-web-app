import React, { useEffect } from 'react';
import {
    useParams
} from "react-router-dom";

const SaloonPage = () => {
    let { saloonUrl } = useParams();
    return (
        <div>
            Saloon Detail: {saloonUrl}
        </div>
    );
};

export default SaloonPage;