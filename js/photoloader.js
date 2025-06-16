// Динамічне визначення базового URL для запитів
// const baseUrl = window.location.origin;
// const baseUrl = 'https://decor-prod-6iah.onrender.com';

fetch(`${baseUrl}/photos`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(photos => {
    const photosContainer = document.getElementById('photosContainer');

    photos.forEach(photo => {
      console.log('Фото:', photo);
    
      const photoCard = document.createElement('div');
      photoCard.className = 'photo-card';
    
     // Обгортаємо всю фотокартку в посилання це додали
     const link = document.createElement('a');
     link.href = `product.html?id=${photo.id}`;
     link.className = 'photo-link'; // додаємо клас для стилізації

     const imgWrapper = document.createElement('div');
     imgWrapper.className = 'photo-card-wrapper';
   
     const img = document.createElement('img');
     img.src = photo.url;
     img.alt = photo.name || 'Фото';

     imgWrapper.appendChild(img); // додаємо зображення в imgWrapper
   
    
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
      price.innerText = `Ціна: ${photo.price ? photo.price + ' UAH/m²' : 'Ціна відсутня'}`;


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

     // Обробник події для кнопки
callButton.onclick = (event) => {
  event.preventDefault(); // запобігає стандартній поведінці (перехід на нову сторінку)
  confirmCall('+380 95 716 87 47'); // ваш код для виклику телефону
};

      imgWrapper.appendChild(callButton);

      
      photoBody.appendChild(description);
      photoBody.appendChild(title);
      photoBody.appendChild(price);

      // Додаємо всю фотокартку в посилання
      link.appendChild(imgWrapper);
      link.appendChild(photoBody);
      photoCard.appendChild(link); // додаємо посилання в контейнер
      photosContainer.appendChild(photoCard);
        });
      })
      .catch(error => console.error('Error fetching photos:', error));


// обробка завантаження фото
	const uploadForm = document.getElementById('uploadForm');
	if (uploadForm) {
		uploadForm.addEventListener('submit', async function (e) {
			e.preventDefault();
	
			const formData = new FormData();
			formData.append('photo', document.getElementById('photo').files[0]);
			formData.append('description', document.getElementById('description').value);
			formData.append('decorName', document.getElementById('decorName').value);
			formData.append('price', document.getElementById('price').value);
	
			try {
				const response = await fetch(`${baseUrl}/upload`, {
					method: 'POST',
					body: formData,
				});
	
				if (!response.ok) {
					throw new Error('Не вдалося завантажити фото');
				}
	
				const result = await response.json();
				alert(result.message); // Повідомлення про успішне завантаження
				// Очистити форму після успішного завантаження
				uploadForm.reset();
				// Завантажити оновлений список фото (якщо у вас є функція для цього)
				loadPhotos();
			} catch (error) {
				console.error('Помилка завантаження фото:', error);
			}
		});
	}


// Завантаження фотографій
// Завантажуємо фото
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
				price.innerText = `Ціна: ${photo.price !== undefined ? photo.price + ' UAH/m²' : 'Ціна відсутня'}`;

				// Кнопка "Редагувати"
				const editButton = document.createElement('button');
				editButton.innerText = 'Редагувати';
				editButton.className = 'button';
				editButton.onclick = () => {
					openEditForm(photo);
				};

				const deleteButton = document.createElement('button');
				deleteButton.innerText = 'Видалити';
				deleteButton.className = 'card-delete-button button';
				deleteButton.onclick = () => deletePhoto(photo.name);

				// Кнопка "Додати інформацію"
				const addInfoButton = document.createElement('button');
				addInfoButton.innerText = 'Додати інформацію';
				addInfoButton.className = 'button';
				addInfoButton.onclick = () => {
					openAddInfoForm(photo.id);
				};

				// Додаємо кнопки до картки товару
				photoBody.appendChild(description);
				photoBody.appendChild(title);
				photoBody.appendChild(price);
				photoBody.appendChild(editButton);
				photoBody.appendChild(deleteButton);
				photoBody.appendChild(addInfoButton); // Додаємо кнопку "Додати інформацію"

				imgWrapper.appendChild(img);
				photoCard.appendChild(imgWrapper);
				photoCard.appendChild(photoBody);
				photoList.appendChild(photoCard);
			});
		})
		.catch(error => console.error('Error fetching photos:', error));
}



//редагування фото 
// Відкриття модального вікна для редагування
function openEditForm(photo) {
  const editForm = document.getElementById('editForm');
  const modal = document.getElementById('editFormModal');
  document.getElementById('editName').value = photo.decorName;
  document.getElementById('editDescription').value = photo.description;
  document.getElementById('editPrice').value = photo.price;

  // Зберігаємо ID фото, яке редагуємо
  editForm.dataset.photoId = photo.id;

  modal.classList.add('show'); // Відображаємо модальне вікно

  // Обробник події на формі для редагування
  editForm.onsubmit = async (e) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки

    const name = document.getElementById('editName').value;
    const description = document.getElementById('editDescription').value;
    const price = document.getElementById('editPrice').value;
    const photoId = editForm.dataset.photoId;

    const response = await fetch(`/photos/${photoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price })
    });

    if (response.ok) {
      alert('Інформація успішно оновлена');
      modal.classList.remove('show'); // Закриваємо модальне вікно
      loadPhotos(); // Оновлюємо список фото
    } else {
      alert('Не вдалося оновити інформацію');
    }
  };

 
}

// Закриття модального вікна при натисканні на кнопку закриття
const closeButton = document.querySelector('.close-btn');
closeButton.onclick = () => {
  document.getElementById('editFormModal').classList.remove('show');
};


// Функція для відкриття форми додавання інформації
function openAddInfoForm(productId) {
  const modal = document.getElementById('addInfoModal');
  const productIdInput = document.getElementById('productId');
  productIdInput.value = productId;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('addInfoModal');
  modal.style.display = 'none';
}

// Додавання нової характеристики
document.getElementById('add-characteristic-btn').addEventListener('click', function () {
  const container = document.getElementById('characteristics-container');

  const div = document.createElement('div');
  div.classList.add('form-group');

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'characteristic-name[]';
  nameInput.placeholder = 'Назва характеристики';

  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.name = 'characteristic-description[]';
  descInput.placeholder = 'Опис характеристики';

  div.appendChild(nameInput);
  div.appendChild(descInput);
  container.appendChild(div);
});

// Додавання поля для нових даних (data)

  // Створення нового елемента для введення даних
  document.getElementById('add-note-btn').addEventListener('click', function() {
    const noteContainer = document.getElementById('note-container');
    
    // Створення нового елемента для введення даних
    const noteItem = document.createElement('div');
    noteItem.classList.add('form-group', 'note-item');
    
    // Створення поля для введення даних
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.name = 'note[]';  // Масив для збереження кількох значень
    noteInput.placeholder = 'Введіть нові дані';
    
    // Додаємо поле до контейнера
    noteItem.appendChild(noteInput);
    noteContainer.appendChild(noteItem);
  });

// Обробник надсилання форми
document.getElementById('addInfoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const productId = document.getElementById('productId').value;
    const productImages = document.getElementById('productImages').files;

    const formData = new FormData();

    // Стандартні поля
    formData.append('speed', document.getElementById('speed').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('application', document.getElementById('application').value);

    // Характеристики
    const names = document.querySelectorAll('input[name="characteristic-name[]"]');
    const descriptions = document.querySelectorAll('input[name="characteristic-description[]"]');
    const characteristics = [];

    for (let i = 0; i < names.length; i++) {
      if (names[i].value || descriptions[i].value) {
        characteristics.push({
          name: names[i].value,
          description: descriptions[i].value,
        });
      }
    }
    formData.append('characteristics', JSON.stringify(characteristics));

    // Додаткові дані

    const noteInputs = document.querySelectorAll('input[name="note[]"]');
const noteValues = [];
noteInputs.forEach(input => {
  if (input.value) noteValues.push(input.value);
});
    noteValues.forEach(value => {
      formData.append('noteValues[]', value);
    });
    

    console.log('noteValues:', noteValues);

    // Зображення
    for (let i = 0; i < productImages.length; i++) {
      formData.append('productImages', productImages[i]);
    }

    // Відправка
    const response = await fetch(`/api/products/${productId}/add-info`, {
      method: 'PATCH',
      body: formData,
    });

    if (response.ok) {
      alert('Інформацію успішно додано!');
      closeModal();
      loadPhotos();
    } else {
      const errData = await response.json();
      alert('Помилка: ' + (errData.message || 'Не вдалося додати інформацію.'));
    }
  } catch (error) {
    console.error('Помилка при надсиланні:', error);
    alert('Сталася помилка. Спробуйте ще раз.');
  }
});







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
window.onload = function() {
  // Отримуємо ID товару з URL (текстовий параметр)
  const productId = new URLSearchParams(window.location.search).get('id');
  
  // Перевіряємо чи є ID, інакше вивести повідомлення
  if (!productId) {
    document.getElementById('product-detail').innerHTML = `<p>Товар не знайдений. Перевірте правильність ID.</p>`;
    return;
  }

};

// Завантажуємо фото при завантаженні сторінки
document.addEventListener('DOMContentLoaded', loadPhotos);
