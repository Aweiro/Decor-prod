



// Акордеон
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    // Toggle the 'active' class to change button style
    this.classList.toggle("accordion-active");
    var panel = this.nextElementSibling;

    // Toggle max-height to open/close panel
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null; // Close the panel
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px"; // Open the panel
    }
  });
}



// modal window for video
var videoCards = document.querySelectorAll('.video-card');
var modal = document.getElementById('videoModal');
var closeButton = modal.querySelector('.video-modal__close');

// Функція для відкриття відео в модальному вікні
function openModal(videoId) {
  modal.style.display = "flex"; // Відкриваємо модальне вікно
  var videoUrl = "https://www.youtube.com/embed/" + videoId; // Формуємо URL відео
  document.getElementById("videoFrame").src = videoUrl; // Вставляємо відео в iframe
}

// Додаємо обробник події для кожної відеокартки
videoCards.forEach(function(card) {
  // Якщо натискаємо на картку або на зображення
  card.querySelector('.video-thumbnail').addEventListener("click", function() {
    var videoId = card.getAttribute('data-video-id'); // Отримуємо ID відео з data-атрибута
    openModal(videoId); // Відкриваємо модальне вікно з відео
  });

  // Якщо натискаємо на кнопку play
  card.querySelector('.play-button').addEventListener("click", function() {
    var videoId = card.getAttribute('data-video-id'); // Отримуємо ID відео з data-атрибута
    openModal(videoId); // Відкриваємо модальне вікно з відео
  });
});

// Закриваємо модальне вікно
closeButton.addEventListener("click", function() {
  modal.style.display = "none"; // Приховуємо модальне вікно
  document.getElementById("videoFrame").src = ""; // Очищаємо src, щоб зупинити відео
});

// Закриття модального вікна при натисканні за межами вікна
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none"; // Приховуємо модальне вікно, якщо натиснуто за межами
    document.getElementById("videoFrame").src = ""; // Зупиняємо відео
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

