// Ініціалізація Firebase для клієнтської сторони
const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Ініціалізація Firebase та Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



// Функція для відображення схвалених відгуків
async function displayApprovedReviews() {
  const reviewsSnapshot = await db.collection('reviews').where('approved', '==', true).get();
  const approvedReviewsContainer = document.getElementById('approvedReviews');
  
  approvedReviewsContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням

  reviewsSnapshot.forEach((doc) => {
    const reviewData = doc.data();
    const reviewItem = document.createElement('div');
    reviewItem.innerHTML = `<p><strong>${reviewData.name}</strong>: ${reviewData.text}</p>`;
    approvedReviewsContainer.appendChild(reviewItem);
  });
}

// Викликаємо функцію для відображення схвалених відгуків при завантаженні сторінки
displayApprovedReviews();

// Обробка форми для додавання нового відгуку
document.getElementById("reviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const reviewText = document.getElementById("reviewText").value;

  try {
    const response = await fetch('/api/reviews/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, text: reviewText })
    });

    if (response.ok) {
      alert("Відгук відправлено на перевірку!");
      document.getElementById("reviewForm").reset(); // Очистити форму після відправлення
      displayApprovedReviews(); // Оновити відображення відгуків
    } else {
      alert("Помилка при відправці відгуку, спробуйте ще раз.");
    }
  } catch (error) {
    console.error("Сталася помилка:", error);
    alert("Сталася помилка, спробуйте ще раз.");
  }
});
