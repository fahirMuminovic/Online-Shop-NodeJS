const deleteProduct = (btn) => {
	const productId = btn.parentNode.querySelector('[name=productId').value;
	const _csrf = btn.parentNode.querySelector('[name=_csrf').value;

    const productElement = btn.closest('article');

    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': _csrf
        }
    }).then((result) => {
       return result.json();
    })
    .then(data =>{
        console.log(data);
        //delete DOM element containing the product
        productElement.remove();
    })
    .catch((err) => {
        console.log(err);
    });
};