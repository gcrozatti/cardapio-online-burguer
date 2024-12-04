const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//Abrir modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
    updateCartModal();
})

// Fechar modal quando clicar fora
cartModal.addEventListener("click", function(Event) {
    if(Event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

// Botão fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
})

// Adicionar item no carrinho
menu.addEventListener("click", function(Event){
    //console.log(Event.target); //Envia o evento do click do mouse dentro da div Menu
    let parentButton = Event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addtoCart(name, price)
    }
})

function addtoCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        //Se o item já existe aumenta apenas a quantidade+1
        existingItem.quantity += 1;
    }
    else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class ="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-from-cart-btn" data-name="${item.name}" >
                        Remover
                    </button>
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    }) //endForEach

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(Event){
    if(Event.target.classList.contains("remove-from-cart-btn")){
        const name = Event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        //console.log(item);
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

// Função para coletar o endereço de entrega

addressInput.addEventListener("input", function(Event){
    let inputValue = Event.target.value;

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }


})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    //const isOpen = false; Para testar a mensagem
    if (!isOpen) {

        Toastify({
            text: "Ops! O restaurante está fechado!",
            duration: 3000,
            //destination: "https://github.com/apvarun/toastify-js",
            //newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#EF4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")
    //console.log(cartItems)

    //Enviar o pedido para API Whats App
    const message = encodeURIComponent(cartItems)
    const phone = "1234567890"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    
    cart = [];
    updateCartModal();
})

//Verificar a hora e manipular o card horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    // true = restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

console.log(isOpen)

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}