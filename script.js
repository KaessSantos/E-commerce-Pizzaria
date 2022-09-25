let cart = [];
let modasQt = 1;
let modalKey = 0;


const c = (el) =>document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


// Listagem das pizzas 

pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modasQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;        
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        c('.pizzaInfo--qt').innerHTML = modasQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
});


// Eventos do MODAS

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modasQt > 1){
        modasQt --;
        c('.pizzaInfo--qt').innerHTML = modasQt;
    }
    
});

c('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modasQt ++;
    c('.pizzaInfo--qt').innerHTML = modasQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    })
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let indetifier = pizzaJson[modalKey].id+'@'+ size;

    let key = cart.findIndex((item)=> item.indetifier == indetifier);   

    if(key > -1){
        cart[key].qt += modasQt;
    }else{
        cart.push({
            indetifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modasQt
        });
    };

    updateCard();
    closeModal();
});

function updateCard(){
    if(cart.length > 0 ){
        c('aside').classList.add('show');
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            console.log(pizzaItem)
        }
    }else{
        c('aside').classList.remove('show');
    }
}