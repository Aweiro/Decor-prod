

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
          
					// Call button 
					const callButton = document.createElement('button');
					callButton.className = 'card-testimonial__btn-play';
					// Створення SVG
					const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svg.setAttribute('class', 'card-testimonial__btn-svg');
					svg.setAttribute('version', '1.0');
					svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					svg.setAttribute('width', '50');
					svg.setAttribute('height', '50');
					svg.setAttribute('viewBox', '0 0 1280 1280');
					svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
					// Додаємо коло
					const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					circle.setAttribute('cx', '640');
					circle.setAttribute('cy', '640');
					circle.setAttribute('r', '640');
					svg.appendChild(circle);
					// Створення групи з шляхами
					const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
					g.setAttribute('transform', 'translate(0.000000,1280.000000) scale(0.100000,-0.100000)');
					g.setAttribute('fill', '#000000');
					g.setAttribute('stroke', 'none');

					// Додаємо шляхи
					const pathsData = [
							"M6145 12794 c-216 -13 -391 -28 -530 -45 -995 -122 -1927 -467 -2760 -1022 -907 -604 -1648 -1433 -2146 -2402 -395 -769 -615 -1549 -690 -2450 -17 -193 -17 -757 0 -950 75 -901 295 -1681 690 -2450 610 -1187 1579 -2156 2766 -2766 769 -395 1549 -615 2450 -690 193 -17 757 -17 950 0 901 75 1681 295 2450 690 1187 610 2156 1579 2766 2766 395 769 615 1549 690 2450 17 193 17 757 0 950 -75 901 -295 1681 -690 2450 -610 1187 -1579 2156 -2766 2766 -753 387 -1531 610 -2390 684 -164 15 -666 27 -790 19z m739 -779 c1310 -112 2518 -670 3465 -1599 979 -963 1558 -2205 1672 -3591 16 -193 16 -657 0 -850 -114 -1385 -693 -2628 -1672 -3591 -961 -943 -2169 -1494 -3524 -1605 -193 -16 -657 -16 -850 0 -1385 114 -2628 693 -3591 1672 -943 961 -1494 2169 -1605 3524 -16 193 -16 657 0 850 114 1385 693 2628 1672 3591 878 862 1988 1408 3189 1568 416 55 832 66 1244 31z",
							"M5060 10738 c-55 -15 -679 -379 -716 -418 -85 -87 -103 -206 -47 -315 67 -129 1153 -2002 1181 -2035 57 -68 178 -105 267 -81 46 12 662 365 715 409 71 59 108 190 78 277 -8 22 -276 495 -596 1050 -471 817 -591 1018 -628 1052 -68 64 -164 87 -254 61z",
							"M3942 9868 c-216 -132 -322 -210 -434 -317 -341 -326 -432 -664 -362 -1346 165 -1616 1352 -3892 2728 -5232 360 -351 731 -631 1033 -779 191 -94 332 -132 523 -141 257 -12 504 61 877 261 113 60 151 85 147 96 -5 13 -1156 2013 -1190 2068 l-15 22 -39 -20 c-69 -35 -183 -69 -275 -80 -215 -27 -466 49 -712 216 -587 397 -1121 1268 -1263 2059 -81 448 -20 809 175 1038 33 39 144 132 166 139 7 2 -220 406 -591 1049 -331 574 -605 1047 -609 1052 -4 4 -75 -35 -159 -85z",
							"M8220 5330 c-55 -8 -74 -18 -428 -222 -156 -90 -299 -179 -319 -198 -72 -71 -101 -183 -71 -271 17 -50 1155 -2025 1197 -2078 71 -90 212 -117 326 -62 86 41 614 347 655 380 56 45 90 120 90 202 0 37 -5 81 -12 96 -34 80 -1175 2043 -1206 2075 -61 64 -141 91 -232 78z"
					];
					pathsData.forEach(data => {
							const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
							path.setAttribute('d', data);
							g.appendChild(path);
					});
					svg.appendChild(g);
					callButton.appendChild(svg);

					callButton.onclick = () => confirmCall('+380 95 716 87 47');

          // Додаємо елементи до картки
          imgWrapper.appendChild(img);
          imgWrapper.appendChild(callButton); // call button
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
                photoCard.className = 'photo-card';

                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'photo-card-wrapper';

                const img = document.createElement('img');
                img.src = photo.url;
                img.alt = photo.name;

                const photoBody = document.createElement('div');
                photoBody.className = 'photo-card-body';

                const description = document.createElement('p');
                description.className = 'photo-card-text';
                description.innerText = photo.description || 'Опис відсутній';

                const title = document.createElement('h3');
                title.className = 'card-testimonial__title';
                title.innerText = photo.decorName || 'Назва декору відсутня'; // Відображаємо назву декору
                

                const price = document.createElement('p');
                price.className = 'photo-card-price';
                price.innerText = `Ціна: ${photo.price !== undefined ? photo.price + ' грн' : 'Ціна відсутня'}`;

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Видалити';
								deleteButton.className = 'card-delete-button button'
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
