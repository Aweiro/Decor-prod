document.addEventListener('DOMContentLoaded', function () {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

  if (isAdminLoggedIn === 'true') {
      // Якщо адмін увійшов, показати адмін панель та завантажити фотографії
      document.getElementById('authSection').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      loadPhotos(); // Завантажуємо фотографії
  } else {
      // Якщо адмін не увійшов, показати форму входу
      document.getElementById('authSection').style.display = 'block';
      document.getElementById('adminPanel').style.display = 'none';
      document.getElementById('photosContainer').style.display = 'none'; // Сховати контейнер з фото
  }
});

document.getElementById('loginButton').addEventListener('click', async function () {
  const password = document.getElementById('password').value;
  console.log('Введений пароль:', password);

  try {
      const response = await fetch('/check-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
      });

      const result = await response.json();
      console.log('Результат запиту:', result);

      if (result.success) {
          localStorage.setItem('isAdminLoggedIn', 'true');
          document.getElementById('authSection').style.display = 'none';
          document.getElementById('adminPanel').style.display = 'block';
          // document.getElementById('photosContainer').style.display = 'block';
          loadPhotos();
      } else {
          document.getElementById('authMessage').innerText = 'Невірний пароль.';
      }
  } catch (error) {
      console.error('Помилка під час запиту:', error);
      document.getElementById('authMessage').innerText = 'Сталася помилка. Спробуйте пізніше.';
  }
});