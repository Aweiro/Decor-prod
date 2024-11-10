document.getElementById('reviewForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const reviewText = document.getElementById('review').value;

  try {
    const response = await fetch('/addReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, reviewText }),
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
