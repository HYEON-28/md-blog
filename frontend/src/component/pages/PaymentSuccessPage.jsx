import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import '../../style/checkout.css';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { dispatch } = useCart();
    const [status, setStatus] = useState('결제를 확인하는 중입니다...');
    const [success, setSuccess] = useState(false);
    const confirmed = useRef(false);

    useEffect(() => {
        if (confirmed.current) return;
        confirmed.current = true;

        const confirm = async () => {
            const paymentKey = searchParams.get('paymentKey');
            const orderId = searchParams.get('orderId');
            const amount = searchParams.get('amount');

            if (!paymentKey || !orderId || !amount) {
                setStatus('잘못된 결제 정보입니다.');
                return;
            }

            const pendingOrder = JSON.parse(sessionStorage.getItem('pendingOrder') || '{}');

            try {
                const response = await ApiService.confirmTossPayment({
                    paymentKey,
                    orderId,
                    amount: Number(amount),
                    items: pendingOrder.items || [],
                });

                if (response.status === 'success') {
                    sessionStorage.removeItem('pendingOrder');
                    dispatch({ type: 'CLEAR_CART' });
                    setSuccess(true);
                    setStatus('결제가 완료되었습니다! 주문이 등록되었습니다.');
                    setTimeout(() => navigate('/profile'), 2500);
                } else {
                    setStatus('결제 승인에 실패했습니다.');
                }
            } catch (error) {
                setStatus(error.response?.data?.error || '결제 처리 중 오류가 발생했습니다.');
            }
        };

        confirm();
    }, []);

    return (
        <div className="checkout-page">
            <h1>결제 처리</h1>
            <p className={`checkout-message ${success ? 'success' : ''}`}>{status}</p>
            {!success && status !== '결제를 확인하는 중입니다...' && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="back-button" onClick={() => navigate('/checkout')}>
                        결제 페이지로 돌아가기
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccessPage;
