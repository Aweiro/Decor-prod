// Динамічне визначення базового URL для запитів
const baseUrl = window.location.origin;

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

if (mybutton) {
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

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
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
const telegramToken = 'YOUR_TELEGRAM_TOKEN';
const chatId = 'YOUR_CHAT_ID';

const consultationForm = document.getElementById('consultationForm');
const submitButton = document.getElementById('submitBtn');

if (consultationForm) {
    consultationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !phone) {
            alert('Заповніть всі поля!');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerText = 'Надсилаємо...';

        const message = `Нове замовлення консультації:\nІм'я: ${name}\nТелефон: ${phone}`;

        fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.ok) {
                    submitButton.innerText = 'Надіслано';
                    submitButton.disabled = true;
                } else {
                    alert('Помилка при надсиланні повідомлення. Спробуйте ще раз.');
                    submitButton.disabled = false;
                    submitButton.innerText = 'Відправити';
                }
            })
            .catch((error) => {
                console.error('Помилка при відправці повідомлення:', error);
                alert('Сталася помилка при відправці. Спробуйте ще раз.');
                submitButton.disabled = false;
                submitButton.innerText = 'Відправити';
            });
    });
}

// Завантаження фотографій
function loadPhotos() {
    fetch(`${baseUrl}/photos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(photos => {
            const photoList = document.getElementById('photoList');
            photoList.innerHTML = '';
            photos.forEach(photo => {
                console.log('Отримане фото:', photo);

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
                title.innerText = photo.decorName || 'Назва декору відсутня';

                const price = document.createElement('p');
                price.className = 'photo-card-price';
                price.innerText = `Ціна: ${photo.price !== undefined ? photo.price + ' грн' : 'Ціна відсутня'}`;

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Видалити';
                deleteButton.className = 'card-delete-button button';
                deleteButton.onclick = () => deletePhoto(photo.name);

                imgWrapper.appendChild(img);
                photoBody.appendChild(description);
                photoBody.appendChild(title);
                photoBody.appendChild(price);
                photoBody.appendChild(deleteButton);
                photoCard.appendChild(imgWrapper);
                photoCard.appendChild(photoBody);
                photoList.appendChild(photoCard);
            });
        })
        .catch(error => console.error('Error fetching photos:', error));
}

// Видалення фотографії
function deletePhoto(photoName) {
    fetch(`${baseUrl}/photos/${photoName}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadPhotos();
    })
    .catch(error => {
        console.error('Error deleting photo:', error);
    });
}

document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch(`${baseUrl}/upload`, {
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
        loadPhotos();
        this.reset();
    })
    .catch(error => {
        document.getElementById('uploadMessage').innerText = 'Помилка завантаження.';
        console.error('Error:', error);
    });
});

// Завантажуємо фото при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadPhotos);
