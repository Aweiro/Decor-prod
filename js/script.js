//Форма підтвердження дзвінка

function confirmCall(number) {
	const confirmMessage = `Ви впевнені, що хочете зателефонувати на номер ${number} - Володимир Ковалів?`
	if (confirm(confirmMessage)) {
		window.location.href = `tel:${number}`
	}
}

// scroll to top

// Get the button:
let mybutton = document.getElementById('myBtn')

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function () {
	scrollFunction()
}

function scrollFunction() {
	if (
		document.body.scrollTop > 200 ||
		document.documentElement.scrollTop > 200
	) {
		mybutton.style.display = 'block'
	} else {
		mybutton.style.display = 'none'
		// mybutton.style.display = "block";
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0 // For Safari
	document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}


//hamburger menu
document.getElementById('hamburgerBtn').addEventListener('click', function() {
  const navigationList = document.querySelector('.navigation-list');
  navigationList.classList.toggle('show'); 
});


// carusel
let slideIndex = 0;
showSlides(slideIndex);

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");

    if (n >= slides.length) {
        slideIndex = 0;
    }
    if (n < 0) {
        slideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";
}

// Автоматичне перемикання слайдів кожні 3 секунд
setInterval(() => {
    changeSlide(1);
}, 3000);


