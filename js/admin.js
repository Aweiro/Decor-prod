
// async function fetchPendingReviews() {
//   try {
//     const response = await fetch('/api/reviews/pending'); // Запит на отримання несхвалених відгуків
//     const reviews = await response.json();

//     const reviewsContainer = document.getElementById('reviewsContainer');
//     reviewsContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням відгуків

//     reviews.forEach(review => {
//       const reviewElement = document.createElement('div');
//       reviewElement.classList.add('review');
//       reviewElement.innerHTML = `
//         <p><strong>Ім'я:</strong> ${review.name}</p>
//         <p><strong>Відгук:</strong> ${review.text}</p>
//         <button onclick="approveReview('${review.id}', this)" ${review.approved ? 'disabled' : ''}>
//           ${review.approved ? 'Схвалено' : 'Схвалити'}
//         </button>
//         <button onclick="deleteReview('${review.id}', this)">Видалити</button>
//       `;
//       reviewsContainer.appendChild(reviewElement);
//     });
//   } catch (error) {
//     console.error('Помилка завантаження відгуків:', error);
//   }
// }

// async function approveReview(reviewId, button) {
//   try {
//     const response = await fetch(`/api/reviews/approve/${reviewId}`, {
//       method: 'PATCH',
//     });

//     if (response.ok) {
//       alert('Відгук схвалено!');
//       button.textContent = 'Схвалено';
//       button.disabled = true; // Деактивуємо кнопку після схвалення
//     } else {
//       console.error('Помилка схвалення відгуку:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Помилка схвалення відгуку:', error);
//   }
// }

// async function deleteReview(reviewId, button) {
//   try {
//     const response = await fetch(`/api/reviews/${reviewId}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       alert('Відгук видалено!');
//       // Видаляємо елемент відгуку з DOM
//       button.parentElement.remove();
//     } else {
//       console.error('Помилка видалення відгуку:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Помилка видалення відгуку:', error);
//   }
// }

// // Завантажуємо відгуки при завантаженні сторінки
// document.addEventListener('DOMContentLoaded', fetchPendingReviews);


async function fetchAllReviews() {
  try {
    const response = await fetch('/api/reviews'); // Запит на отримання всіх відгуків (схвалених і несхвалених)
    const reviews = await response.json();

    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням відгуків

    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
      reviewElement.innerHTML = `
        <p><strong>Ім'я:</strong> ${review.name}</p>
        <p><strong>Відгук:</strong> ${review.text}</p>
         <button class="approve-button" onclick="approveReview('${review.id}', this)" ${review.approved ? 'disabled' : ''}>
          ${review.approved ? 'Схвалено' : 'Схвалити'}
        </button>
         <button class="delete-button" onclick="deleteReview('${review.id}', this)">Видалити</button>
      `;
      reviewsContainer.appendChild(reviewElement);
    });
  } catch (error) {
    console.error('Помилка завантаження відгуків:', error);
  }
}

async function approveReview(reviewId, button) {
  try {
    const response = await fetch(`/api/reviews/approve/${reviewId}`, {
      method: 'PATCH',
    });

    if (response.ok) {
      alert('Відгук схвалено!');
      button.textContent = 'Схвалено';
      button.disabled = true; // Деактивуємо кнопку після схвалення
    } else {
      console.error('Помилка схвалення відгуку:', response.statusText);
    }
  } catch (error) {
    console.error('Помилка схвалення відгуку:', error);
  }
}

async function deleteReview(reviewId, button) {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Відгук видалено!');
      // Видаляємо елемент відгуку з DOM
      button.parentElement.remove();
    } else {
      console.error('Помилка видалення відгуку:', response.statusText);
    }
  } catch (error) {
    console.error('Помилка видалення відгуку:', error);
  }
}

// Завантажуємо всі відгуки при завантаженні сторінки
document.addEventListener('DOMContentLoaded', fetchAllReviews);
