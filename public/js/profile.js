const links = document.querySelectorAll('.side-menu__list_item a');
const userInfoContainers = document.querySelectorAll('.user-info');

console.log(links);
console.log('-------------------');
console.log(userInfoContainers);


links.forEach((link) => {
	link.addEventListener('click', (e) => {
		e.preventDefault();

		console.log(link, 'link clicked');
	});
});
