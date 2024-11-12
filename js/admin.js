// admin.js
async function fetchPendingReviews() {
  try {
    const response = await fetch('/api/reviews/pending'); // Запит на отримання несхвалених відгуків
    const reviews = await response.json();

    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням відгуків

    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
      reviewElement.innerHTML = `
        <p><strong>Ім'я:</strong> ${review.name}</p>
        <p><strong>Відгук:</strong> ${review.text}</p>
        <button onclick="approveReview('${review.id}')">Схвалити</button>
      `;
      reviewsContainer.appendChild(reviewElement);
    });
  } catch (error) {
    console.error('Помилка завантаження відгуків:', error);
  }
}

async function approveReview(reviewId) {
  try {
    const response = await fetch(`/api/reviews/approve/${reviewId}`, {
      method: 'PATCH',
    });

    if (response.ok) {
      alert('Відгук схвалено!');
      fetchPendingReviews(); // Оновлюємо список відгуків після схвалення
    } else {
      console.error('Помилка схвалення відгуку:', response.statusText);
    }
  } catch (error) {
    console.error('Помилка схвалення відгуку:', error);
  }
}


// Завантажуємо відгуки при завантаженні сторінки
document.addEventListener('DOMContentLoaded', fetchPendingReviews);