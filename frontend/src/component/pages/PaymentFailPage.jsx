import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../../style/checkout.css';

const PaymentFailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const errorCode = searchParams.get('code');
    const errorMessage = searchParams.get('message');

    return (
        <div className="checkout-page">
            <h1>결제 실패</h1>
            <p className="checkout-message">
                {errorMessage || '결제에 실패했습니다.'}
            </p>
            {errorCode && (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9em' }}>
                    오류 코드: {errorCode}
                </p>
            )}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="back-button" onClick={() => navigate('/checkout')}>
                    결제 페이지로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default PaymentFailPage;
