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