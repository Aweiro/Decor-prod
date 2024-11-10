
document.getElementById('reviewForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const reviewText = document.getElementById('review').value;

  try {
    await addDoc(collection(db, 'reviews'), {
      name: name,
      review: reviewText,
      approved: false,
      timestamp: new Date()
    });

    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('reviewForm').reset();
  } catch (error) {
    console.error('Помилка при надсиланні відгуку:', error);
  }
});
