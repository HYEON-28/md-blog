import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useCart } from "../context/CartContext";
import '../../style/checkout.css';

const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY || "test_ck_YOUR_CLIENT_KEY_HERE";

const CheckoutPage = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const amountKRW = Math.round(totalPrice);

    const handleTossPayment = async () => {
        setIsProcessing(true);
        setMessage(null);

        try {
            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
            const payment = tossPayments.payment({ customerKey: ANONYMOUS });

            const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const orderItems = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            sessionStorage.setItem('pendingOrder', JSON.stringify({
                orderId,
                items: orderItems,
                totalPrice: amountKRW,
            }));

            const orderName = cart.length === 1
                ? cart[0].name
                : `${cart[0].name} 외 ${cart.length - 1}건`;

            await payment.requestPayment({
                method: "CARD",
                amount: { currency: "KRW", value: amountKRW },
                orderId,
                orderName,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                card: {
                    useEscrow: false,
                    flowMode: "DEFAULT",
                    useCardPoint: false,
                    useAppCardOnly: false,
                },
            });
        } catch (error) {
            if (error.code !== 'USER_CANCEL') {
                setMessage('결제 요청 중 오류가 발생했습니다: ' + (error.message || ''));
            }
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <p>장바구니가 비어 있습니다.</p>
                <button className="back-button" onClick={() => navigate('/cart')}>장바구니로 돌아가기</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1>결제</h1>
            {message && (
                <p className="checkout-message">{message}</p>
            )}

            <div className="checkout-container">
                {/* 주문 요약 */}
                <div className="order-summary">
                    <h2>주문 요약</h2>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">수량: {item.quantity}</span>
                                </div>
                                <span className="item-price">
                                    {(item.price * item.quantity).toLocaleString()}원
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="order-total">
                        <span>총 결제금액</span>
                        <span>{amountKRW.toLocaleString()}원</span>
                    </div>
                </div>

                {/* 결제 수단 */}
                <div className="payment-form">
                    <h2>결제 수단</h2>
                    <p style={{ color: '#666', marginBottom: '24px', fontSize: '0.95em' }}>
                        토스페이먼츠를 통해 안전하게 결제합니다.
                    </p>

                    <div className="checkout-actions">
                        <button
                            type="button"
                            className="back-button"
                            onClick={() => navigate('/cart')}
                            disabled={isProcessing}
                        >
                            장바구니로 돌아가기
                        </button>
                        <button
                            type="button"
                            className="pay-button"
                            onClick={handleTossPayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? '처리 중...' : `${amountKRW.toLocaleString()}원 결제하기`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
