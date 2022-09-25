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

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () =>{
    c('aside').style.left = '100vw';
});

function updateCard(){
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0 ){
        c('aside').classList.add('show');
        c('.cart').innerHTML ='';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            
            
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizaName;
            switch(cart[i].size){
                case 0:
                    pizzaSizaName = 'P'
                    break;
                case 1:
                    pizzaSizaName = 'M'
                    break;
                case 2:
                    pizzaSizaName = 'G'
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizaName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt --;
                }else{
                    cart.splice(i, 1);
                }
                updateCard()
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCard()
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}