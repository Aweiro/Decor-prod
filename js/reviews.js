// reviews.js
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('reviewForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  const name = document.getElementById('name').value;
  const reviewText = document.getElementById('review').value;

  try {
    const response = await fetch('/api/reviews/add', { // змінено URL на правильний
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, text: reviewText }),
    });

    if (response.ok) {
      document.getElementById('successMessage').style.display = 'block';
      document.getElementById('reviewForm').reset();
    } else {
      console.error('Помилка при надсиланні відгуку:', response.statusText);
    }
  } catch (error) {
    console.error('Помилка при надсиланні відгуку:', error);
  }
});
});


// reviews.js
async function fetchApprovedReviews() {
  try {
    const response = await fetch('/api/reviews/approved'); // Запит на отримання схвалених відгуків
    const reviews = await response.json();

    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням відгуків

    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
      reviewElement.innerHTML = `
        <p><strong>Ім'я:</strong> ${review.name}</p>
        <p><strong>Відгук:</strong> ${review.text}</p>
      `;
      reviewsContainer.appendChild(reviewElement);
    });
  } catch (error) {
    console.error('Помилка завантаження відгуків:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchApprovedReviews);
