document.addEventListener('DOMContentLoaded', function() {
  // Форма відправки нового відгуку
  document.getElementById('reviewForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const reviewText = document.getElementById('review').value;

    try {
      const response = await fetch('/api/reviews/add', { // перевірте URL '/api/reviews/add' на сервері
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

  // Завантаження схвалених відгуків
  fetchApprovedReviews();
});

async function fetchApprovedReviews() {
  try {
    const response = await fetch('/api/reviews/approved'); // перевірте, що API маршрут '/api/reviews/approved' працює
    if (!response.ok) throw new Error('Failed to fetch approved reviews');
    
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
    // Додаємо обробник події для кнопки "Читати далі" для кожного відгуку
    const readMoreButton = reviewElement.querySelector('.read-more-btn');
    const reviewText = reviewElement.querySelector('.review-text');

    readMoreButton.addEventListener('click', function() {
      reviewText.classList.toggle('expanded');

      // Змінюємо текст кнопки
      if (reviewText.classList.contains('expanded')) {
        this.textContent = 'Згорнути';
      } else {
        this.textContent = 'Читати далі';
      }
    });
  
} catch (error) {
  console.error('Помилка завантаження відгуків:', error);
}
}