// // const baseUrl = 'https://decor-prod-6iah.onrender.com';
// //

const { db } = require("./firebase");

// function loadApprovedReviews() {
//   const reviewsContainer = document.getElementById('reviewsContainer');

//   // Перевірка наявності контейнера для відгуків
//   if (!reviewsContainer) {
//     console.error("Контейнер для відгуків 'reviewsContainer' не знайдено.");
//     return;
//   }

//   fetch(`${baseUrl}/api/reviews/approved`)
//       .then(response => {
//           if (!response.ok) {
//               throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           return response.json();
//       })
//       .then(reviews => {
//           reviewsContainer.innerHTML = ''; // Очистка контейнера перед завантаженням
//           reviews.forEach(review => {
//               const reviewCard = document.createElement('div');
//               reviewCard.className = 'review-card';
//               reviewCard.innerHTML = `<h3>${review.name}</h3><p>${review.text}</p>`;
//               reviewsContainer.appendChild(reviewCard);
//           });
//       })
//       .catch(error => {
//           console.error('Помилка завантаження відгуків:', error);
//           alert('Не вдалося завантажити відгуки. Спробуйте пізніше.');
//       });
// }



// const reviewForm = document.getElementById('reviewForm');
// if (reviewForm) {
//     reviewForm.addEventListener('submit', async function (e) {
//         e.preventDefault();
//         const name = document.getElementById('reviewerName').value;
//         const text = document.getElementById('reviewText').value;
//         try {
//             const response = await fetch(`${baseUrl}/api/reviews/add`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ name, text })
//             });
//             const result = await response.json();
//             alert(result.message);
//             reviewForm.reset();
//             loadApprovedReviews(); // Оновлення списку відгуків після додавання
//         } catch (error) {
//             console.error('Помилка надсилання відгуку:', error);
//         }
//     });
// }

// // Завантаження відгуків при завантаженні сторінки
// document.addEventListener('DOMContentLoaded', loadApprovedReviews);


async function displayApprovedReviews() {
  const reviews = await db.collection('reviews').where('approved', '==', true).get();
  const approvedReviews = document.getElementById('approvedReviews');

  reviews.forEach((doc) => {
    const reviewData = doc.data();
    const reviewItem = document.createElement('div');
    reviewItem.innerHTML = `<p><strong>${reviewData.name}</strong>: ${reviewData.review}</p>`;
    approvedReviews.appendChild(reviewItem);
  });
}

displayApprovedReviews();

document.getElementById("reviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const reviewText = document.getElementById("reviewText").value;

  try {
    await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, review: reviewText })
    });
    alert("Відгук відправлено на перевірку!");
  } catch (error) {
    alert("Сталася помилка, спробуйте ще раз.");
  }
});
