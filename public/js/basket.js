const clearBasketBtn = document.querySelector('#clear-basket');
clearBasketBtn.addEventListener('click', () => {
  localStorage.removeItem('basket');
  itemCount = 0;
  itemCountSpan.innerText = itemCount;
  const orderItems = document.querySelector('#order-items');
  orderItems.innerHTML = '';
});
