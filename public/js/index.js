const leftButtons = document.querySelectorAll('.left-button');
const rightButtons = document.querySelectorAll('.right-button');
const sliderA = document.querySelector('.slider');

leftButtons.forEach(item => {
    let slider = document.querySelector(`#${item.getAttribute('data-slider')}`);
    item.addEventListener('click', () => {
        slider.scrollBy({
          left: -200, // Adjust the scroll distance as needed
          behavior: 'smooth'
        });
    });
});


rightButtons.forEach(item => {
    let slider = document.querySelector(`#${item.getAttribute('data-slider')}`);
    item.addEventListener('click', () => {
        slider.scrollBy({
          left: 200, // Adjust the scroll distance as needed
          behavior: 'smooth'
        });
    });
});

