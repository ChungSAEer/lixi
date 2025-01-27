export const formatCurrency = (amount: number) => {
    if (!amount) return "0 đ";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
};
