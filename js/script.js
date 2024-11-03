

// Форма підтвердження дзвінка
function confirmCall(number) {
	const confirmMessage = `Ви впевнені, що хочете зателефонувати на номер ${number} - Володимир Ковалів?`;
	if (confirm(confirmMessage)) {
		window.location.href = `tel:${number}`;
	}
}

// Scroll to top

// Отримуємо кнопку
let mybutton = document.getElementById('myBtn');

// Перевіряємо наявність кнопки перед використанням
if (mybutton) {
	// Коли користувач скролить на 200px вниз від верху документа, показати кнопку
	window.onscroll = function () {
		scrollFunction();
	};

	function scrollFunction() {
		if (
			document.body.scrollTop > 200 ||
			document.documentElement.scrollTop > 200
		) {
			mybutton.style.display = 'block';
		} else {
			mybutton.style.display = 'none';
		}
	}

	// Коли користувач клікає на кнопку, прокрутити до верху документа
	function topFunction() {
		document.body.scrollTop = 0; // Для Safari
		document.documentElement.scrollTop = 0; // Для Chrome, Firefox, IE та Opera
	}
}

// Меню-гамбургер
const hamburgerBtn = document.getElementById('hamburgerBtn');
if (hamburgerBtn) {
	hamburgerBtn.addEventListener('click', function () {
		const navigationList = document.querySelector('.navigation-list');
		if (navigationList) {
			navigationList.classList.toggle('show');
		}
	});
}

// Карусель
let slideIndex = 0;
showSlides(slideIndex);

function changeSlide(n) {
	showSlides((slideIndex += n));
}

function showSlides(n) {
	let slides = document.getElementsByClassName('slide');

	if (slides.length > 0) {
		if (n >= slides.length) {
			slideIndex = 0;
		}
		if (n < 0) {
			slideIndex = slides.length - 1;
		}

		for (let i = 0; i < slides.length; i++) {
			slides[i].style.display = 'none';
		}

		slides[slideIndex].style.display = 'block';
	}
}

// Автоматичне перемикання слайдів кожні 3 секунди
setInterval(() => {
	changeSlide(1);
}, 3000);


// Відправлення даних у Telegram
const telegramToken = '7560368551:AAHxWrOZebiC-5-lcxRNF0P3QIxN2SXN-z0'; // Токен вашого Telegram бота
const chatId = '5772059243'; // Ваш Chat ID або ID вашого аккаунта

// Додаємо обробник події для форми
const consultationForm = document.getElementById('consultationForm');
const submitButton = document.getElementById('submitBtn');

if (consultationForm) {
	consultationForm.addEventListener('submit', function (e) {
		e.preventDefault(); // Зупиняємо стандартну поведінку форми (перенаправлення)

		// Отримуємо значення полів форми
		const name = document.getElementById('name').value.trim();
		const phone = document.getElementById('phone').value.trim();

		// Перевіряємо, чи заповнені поля
		if (!name || !phone) {
			alert('Заповніть всі поля!'); // Можна додати просте повідомлення через alert
			return;
		}

		// Блокуємо кнопку, щоб уникнути багаторазового надсилання
		submitButton.disabled = true;
		submitButton.innerText = 'Надсилаємо...';

		// Формуємо повідомлення
		const message = `Нове замовлення консультації:\nІм'я: ${name}\nТелефон: ${phone}`;

		// Відправляємо дані до Telegram через API
		fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: chatId, // ID чату
				text: message, // Текст повідомлення
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				// Якщо повідомлення успішно надіслано
				if (data.ok) {
					submitButton.innerText = 'Надіслано'; // Змінюємо текст кнопки
					submitButton.style.backgroundColor = '#262626';
					submitButton.style.color = '#ffffff';
					submitButton.disabled = true; // Блокуємо кнопку після успішного надсилання
				} else {
					// Якщо сталася помилка
					alert('Помилка при надсиланні повідомлення. Спробуйте ще раз.');
					submitButton.disabled = false; // Дозволяємо повторну спробу
					submitButton.innerText = 'Відправити'; // Повертаємо оригінальний текст
				}
			})
			.catch((error) => {
				// Відображаємо повідомлення про помилку у випадку, якщо запит не пройшов
				console.error('Помилка при відправці повідомлення:', error);
				alert('Сталася помилка при відправці. Спробуйте ще раз.');
				submitButton.disabled = false; // Дозволяємо повторну спробу
				submitButton.innerText = 'Відправити'; // Повертаємо оригінальний текст
			});
	});
}


