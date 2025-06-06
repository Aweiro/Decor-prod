
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
        fetchApprovedReviews(); // Оновлюємо список відгуків після додавання
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
        <p><strong>👤 Ім'я:</strong> ${review.name}</p>
        <p class="review-text"><strong>💬 Відгук:</strong> ${review.text}</p>
      `;
      reviewsContainer.appendChild(reviewElement);

      const reviewText = reviewElement.querySelector('.review-text');

      // Додаємо кнопку "Читати далі", якщо текст перевищує два рядки
      if (reviewText.scrollHeight > 60) { // "60" можна змінити на точне значення, що відповідає двом рядкам
        const readMoreButton = document.createElement('button');
        readMoreButton.classList.add('read-more-btn');
        readMoreButton.textContent = 'Читати далі';

        reviewElement.appendChild(readMoreButton);

        // Додаємо обробник події для кнопки "Читати далі"
        readMoreButton.addEventListener('click', function() {
          // Закриваємо всі інші розгорнуті відгуки
          document.querySelectorAll('.review-text.expanded').forEach(el => {
            if (el !== reviewText) {
              el.classList.remove('expanded');
              el.nextElementSibling.textContent = 'Читати далі';
            }
          });

          // Перемикаємо клас "expanded" для тексту
          reviewText.classList.toggle('expanded');

          // Змінюємо текст кнопки
          this.textContent = reviewText.classList.contains('expanded') ? 'Згорнути' : 'Читати далі';
        });
      }
    });
  } catch (error) {
    console.error('Помилка завантаження відгуків:', error);
  }
}

