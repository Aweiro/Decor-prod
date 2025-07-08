
function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

document.addEventListener('click', function (e) {
  if (e.target.closest('.video-thumbnail') || e.target.closest('.play-button')) {
    const videoCard = e.target.closest('.video-card');
    const videoUrl = videoCard.getAttribute('data-video-url');
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      document.getElementById('videoModal').style.display = 'flex';
      document.getElementById('videoFrame').src = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  if (e.target.matches('.video-modal__close') || e.target.matches('#videoModal')) {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoFrame').src = '';
  }
});

// Зум фото товару
const smallImages = document.querySelectorAll('.product-information__photo-small');
const bigImage = document.querySelector('.product-information__photo-big');

// Ініціалізація першого фото як за замовчуванням
bigImage.src = smallImages[0].getAttribute('data-large');

if (smallImages.length > 0) {
  bigImage.src = smallImages[0].getAttribute('data-large');
  bigImage.alt = smallImages[0].alt || 'Основне фото';
}

// Додаємо обробник події для кожного малого фото (тепер на click)
smallImages.forEach(image => {
  image.addEventListener('click', (event) => {
      const largeSrc = event.target.getAttribute('data-large');
      bigImage.src = largeSrc; // Змінюємо src великого фото
      bigImage.alt = event.target.alt || 'Основне фото';
  });
});

