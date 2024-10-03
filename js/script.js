const form = document.querySelector('.form');
const input = document.querySelector('.form__input');

input.addEventListener('focus', function (){
    form.classList.add('form--active')
})

input.addEventListener('blur', function (){
    form.classList.remove('form--active')

})



function confirmCall(number) {
    const confirmMessage = `Ви впевнені, що хочете зателефонувати на номер ${number}?`;
    if (confirm(confirmMessage)) {
        window.location.href = `tel:${number}`;
    }
}
