import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import '../../style/checkout.css';

const CheckoutPage = () => {
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [paymentInfo, setPaymentInfo] = useState({
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const digits = value.replace(/\D/g, '').slice(0, 16);
            const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
            setPaymentInfo(prev => ({ ...prev, cardNumber: formatted }));
            return;
        }

        if (name === 'expiry') {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            const formatted = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
            setPaymentInfo(prev => ({ ...prev, expiry: formatted }));
            return;
        }

        if (name === 'cvv') {
            const digits = value.replace(/\D/g, '').slice(0, 3);
            setPaymentInfo(prev => ({ ...prev, cvv: digits }));
            return;
        }

        setPaymentInfo(prev => ({ ...prev, [name]: value }));
    };

    const validatePayment = () => {
        const { cardHolder, cardNumber, expiry, cvv } = paymentInfo;
        if (!cardHolder.trim()) return '카드 소유자 이름을 입력해주세요.';
        if (cardNumber.replace(/\s/g, '').length !== 16) return '카드 번호를 올바르게 입력해주세요.';
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return '유효기간을 올바르게 입력해주세요. (MM/YY)';
        if (cvv.length !== 3) return 'CVV를 올바르게 입력해주세요.';
        return null;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        const validationError = validatePayment();
        if (validationError) {
            setMessage(validationError);
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setIsProcessing(true);
        setMessage('결제를 처리 중입니다...');

        // 결제 처리 시뮬레이션 (1.5초 딜레이)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
        }));

        const orderRequest = {
            totalPrice,
            items: orderItems,
        };

        try {
            const response = await ApiService.createOrder(orderRequest);
            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' });
                setMessage('결제가 완료되었습니다! 주문이 등록되었습니다.');
                setTimeout(() => {
                    navigate('/profile');
                }, 2500);
            } else {
                setMessage(response.message || '주문 등록에 실패했습니다.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || '주문 등록에 실패했습니다.');
        } finally {
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
                <p className={`checkout-message ${message.includes('완료') ? 'success' : ''}`}>
                    {message}
                </p>
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
                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="order-total">
                        <span>총 결제금액</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* 결제 정보 입력 */}
                <form className="payment-form" onSubmit={handlePayment}>
                    <h2>결제 정보</h2>

                    <div className="form-group">
                        <label>카드 소유자 이름</label>
                        <input
                            type="text"
                            name="cardHolder"
                            value={paymentInfo.cardHolder}
                            onChange={handleInputChange}
                            placeholder="홍길동"
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="form-group">
                        <label>카드 번호</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>유효기간</label>
                            <input
                                type="text"
                                name="expiry"
                                value={paymentInfo.expiry}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                disabled={isProcessing}
                            />
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

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
                            type="submit"
                            className="pay-button"
                            disabled={isProcessing}
                        >
                            {isProcessing ? '처리 중...' : `$${totalPrice.toFixed(2)} 결제하기`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
