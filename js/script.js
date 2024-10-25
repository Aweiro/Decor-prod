

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
if (consultationForm) {
	consultationForm.addEventListener('submit', function (e) {
		e.preventDefault(); // Зупиняємо стандартну поведінку форми (перенаправлення)

		// Отримуємо значення полів форми
		const name = document.getElementById('name').value;
		const phone = document.getElementById('phone').value;

		// Перевіряємо, чи заповнені поля
		if (!name || !phone) {
			document.getElementById('status').innerText = 'Заповніть всі поля!';
			return;
		}

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
					document.getElementById('status').innerText =
						'Повідомлення успішно надіслано!';
				} else {
					// Якщо сталася помилка
					document.getElementById('status').innerText =
						'Помилка при надсиланні повідомлення.';
				}
			})
			.catch((error) => {
				// Відображаємо повідомлення про помилку у випадку, якщо запит не пройшов
				document.getElementById('status').innerText =
					'Сталася помилка при відправці.';
			});
	});
}

//Адмін панель
// Запит на отримання фотографій
fetch('http://localhost:3000/photos')
  .then(response => {
    // Перевірка статусу відповіді
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(photos => {
      const photosContainer = document.getElementById('photosContainer');
      photos.forEach(photo => {
          console.log('Фото:', photo); // Лог для перевірки отриманих даних

          // Створення контейнера для картки
          const photoCard = document.createElement('div');
          photoCard.className = 'photo-card';

          // Обгортка для зображення
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'photo-card-wrapper';

          // Створення зображення
          const img = document.createElement('img');
          img.src = photo.url;
          img.alt = photo.name || 'Фото';

          // Тіло картки
          const photoBody = document.createElement('div');
          photoBody.className = 'photo-card-body';

          // Опис фотографії
          const description = document.createElement('p');
          description.className = 'photo-card-text';
          description.innerText = photo.description || 'Опис відсутній';

          const title = document.createElement('h3');
          title.className = 'card-testimonial__title';
          title.innerText = photo.decorName || 'Назва декору відсутня'; // Відображаємо назву декору


          // Ціна фотографії
          const price = document.createElement('p');
          price.className = 'photo-card-price';
          price.innerText = `Ціна: ${photo.price !== undefined ? photo.price + ' грн' : 'Ціна відсутня'}`; // Додайте ціну з вашої бази даних
          
          // Додаємо елементи до картки
          imgWrapper.appendChild(img);
          photoBody.appendChild(description);
          photoBody.appendChild(title); // Додаємо назву декору
          photoBody.appendChild(price);
          photoCard.appendChild(imgWrapper);
          photoCard.appendChild(photoBody);
          photosContainer.appendChild(photoCard); // Додаємо картку до контейнера
      });
  })
  .catch(error => console.error('Error fetching photos:', error));

// Завантаження фотографій
function loadPhotos() {
    fetch('http://localhost:3000/photos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(photos => {
            const photoList = document.getElementById('photoList');
            photoList.innerHTML = ''; // Очищуємо список перед заповненням
            photos.forEach(photo => {
                console.log('Отримане фото:', photo); // Лог для перевірки отриманих даних

                const photoCard = document.createElement('div');
                photoCard.className = 'card-testimonial';

                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'card-testimonial__img-wrapper';

                const img = document.createElement('img');
                img.src = photo.url;
                img.alt = photo.name;
                img.className = 'card-testimonial__img';

                const photoBody = document.createElement('div');
                photoBody.className = 'card-testimonial__body';

                const description = document.createElement('p');
                description.className = 'card-testimonial__text';
                description.innerText = photo.description || 'Опис відсутній';

                const title = document.createElement('h3');
                title.className = 'card-testimonial__title';
                title.innerText = photo.decorName || 'Назва декору відсутня'; // Відображаємо назву декору
                

                const price = document.createElement('p');
                price.className = 'card-testimonial__city';
                price.innerText = `Ціна: ${photo.price !== undefined ? photo.price + ' грн' : 'Ціна відсутня'}`;

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Видалити';
                deleteButton.onclick = () => deletePhoto(photo.name);

                imgWrapper.appendChild(img);
                photoBody.appendChild(description);
                photoBody.appendChild(title); // Додаємо назву декору
                photoBody.appendChild(price);
                photoBody.appendChild(deleteButton);
                photoCard.appendChild(imgWrapper);
                photoCard.appendChild(photoBody);
                photoList.appendChild(photoCard); // Додаємо картку до контейнера
            });
        })
        .catch(error => console.error('Error fetching photos:', error));
}

// Видалення фотографії
function deletePhoto(photoName) {
    fetch(`http://localhost:3000/photos/${photoName}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadPhotos(); // Оновлюємо список фото після видалення
    })
    .catch(error => {
        console.error('Error deleting photo:', error);
    });
}

document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('uploadMessage').innerText = data.message;
        loadPhotos(); // Оновлюємо список фото після завантаження
        this.reset(); // Очищуємо форму після успішного завантаження
    })
    .catch(error => {
        document.getElementById('uploadMessage').innerText = 'Помилка завантаження.';
        console.error('Error:', error);
    });
});

// Завантажуємо фото при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadPhotos);
