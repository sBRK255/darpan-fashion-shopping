export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}; 