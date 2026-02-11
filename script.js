/*fetch('data.json')//used to request data from a server or a local file
.then(response => response.json())
.then(data => {
  console.log(data);
});
*/

const products = [
  {
    image: {
      thumbnail: "./assets/images/image-waffle-thumbnail.jpg",
      mobile: "./assets/images/image-waffle-mobile.jpg",
      tablet: "./assets/images/image-waffle-tablet.jpg",
      desktop: "./assets/images/image-waffle-desktop.jpg",
    },
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.5,
    id: 1,
  },
  {
    image: {
      thumbnail: "./assets/images/image-creme-brulee-thumbnail.jpg",
      mobile: "./assets/images/image-creme-brulee-mobile.jpg",
      tablet: "./assets/images/image-creme-brulee-tablet.jpg",
      desktop: "./assets/images/image-creme-brulee-desktop.jpg",
    },
    name: "Vanilla Bean Crème Brûlée",
    category: "Crème Brûlée",
    price: 7.0,
    id: 2,
  },
  {
    image: {
      thumbnail: "./assets/images/image-macaron-thumbnail.jpg",
      mobile: "./assets/images/image-macaron-mobile.jpg",
      tablet: "./assets/images/image-macaron-tablet.jpg",
      desktop: "./assets/images/image-macaron-desktop.jpg",
    },
    name: "Macaron Mix of Five",
    category: "Macaron",
    price: 8.0,
    id: 3,
  },
  {
    image: {
      thumbnail: "./assets/images/image-tiramisu-thumbnail.jpg",
      mobile: "./assets/images/image-tiramisu-mobile.jpg",
      tablet: "./assets/images/image-tiramisu-tablet.jpg",
      desktop: "./assets/images/image-tiramisu-desktop.jpg",
    },
    name: "Classic Tiramisu",
    category: "Tiramisu",
    price: 5.5,
    id: 4,
  },
  {
    image: {
      thumbnail: "./assets/images/image-baklava-thumbnail.jpg",
      mobile: "./assets/images/image-baklava-mobile.jpg",
      tablet: "./assets/images/image-baklava-tablet.jpg",
      desktop: "./assets/images/image-baklava-desktop.jpg",
    },
    name: "Pistachio Baklava",
    category: "Baklava",
    price: 4.0,
    id: 5,
  },
  {
    image: {
      thumbnail: "./assets/images/image-meringue-thumbnail.jpg",
      mobile: "./assets/images/image-meringue-mobile.jpg",
      tablet: "./assets/images/image-meringue-tablet.jpg",
      desktop: "./assets/images/image-meringue-desktop.jpg",
    },
    name: "Lemon Meringue Pie",
    category: "Pie",
    price: 5.0,
    id: 6,
  },
  {
    image: {
      thumbnail: "./assets/images/image-cake-thumbnail.jpg",
      mobile: "./assets/images/image-cake-mobile.jpg",
      tablet: "./assets/images/image-cake-tablet.jpg",
      desktop: "./assets/images/image-cake-desktop.jpg",
    },
    name: "Red Velvet Cake",
    category: "Cake",
    price: 4.5,
    id: 7,
  },
  {
    image: {
      thumbnail: "./assets/images/image-brownie-thumbnail.jpg",
      mobile: "./assets/images/image-brownie-mobile.jpg",
      tablet: "./assets/images/image-brownie-tablet.jpg",
      desktop: "./assets/images/image-brownie-desktop.jpg",
    },
    name: "Salted Caramel Brownie",
    category: "Brownie",
    price: 4.5,
    id: 8,
  },
  {
    image: {
      thumbnail: "./assets/images/image-panna-cotta-thumbnail.jpg",
      mobile: "./assets/images/image-panna-cotta-mobile.jpg",
      tablet: "./assets/images/image-panna-cotta-tablet.jpg",
      desktop: "./assets/images/image-panna-cotta-desktop.jpg",
    },
    name: "Vanilla Panna Cotta",
    category: "Panna Cotta",
    price: 6.5,
    id: 9,
  },
];

// Function to load products with real-time exchange rate
async function loadProductsWithExchangeRate() {
  const dessertsContainer = document.querySelector("#desserts-list");

  // Clear existing content (if any)
  dessertsContainer.innerHTML = "";

  try {
    // Fetch exchange rate from API
    const response = await fetch(
      ` https://v6.exchangerate-api.com/v6/602b70b033413edbae07bc12/latest/USD`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    const exchangeRate = data.conversion_rates.KES;

    console.log(`Current exchange rate (USD to KES): ${exchangeRate}`);

    // Loop through products and create elements with real exchange rate
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productElement = document.createElement("li");
      productElement.classList.add("dessert-item");

      // Calculate price using real exchange rate
      const convertedPrice = (product.price * exchangeRate).toFixed(2);

      productElement.innerHTML = `
        <picture>
          <source media="(max-width: 480px)" srcset="${product.image.mobile}">
          <source media="(max-width: 768px)" srcset="${product.image.tablet}">
          <source media="(min-width: 768px)" srcset="${product.image.desktop}">
          <img src="${product.image.mobile}" alt="${product.name}">
        </picture>
        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
        <p class="category">${product.category}</p>
        <h3>${product.name}</h3>
        <p>Ksh. ${convertedPrice}</p>
      `;

      dessertsContainer.appendChild(productElement);
    }

    const cartList = [];
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn"); // we get a nodelist/array of all the buttons with the class .add-to-cart-btn
    console.log(addToCartButtons);

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-product-id");

        const existsInCart = cartList.some(
          (item) => item.id === parseInt(productId),
        );
        if (existsInCart) {
          //add counter to existing item in cart
          const existingItem = cartList.find(
            (item) => item.id === parseInt(productId),
          );
          existingItem.quantity += 1;
          document.querySelector("#cart-count").textContent = cartList.length;
          displayCartItems(cartList, exchangeRate);
          //cart total
          document.querySelector("#order-total").textContent =
            `Ksh. ${cartList.reduce((total, item) => total + item.price * item.quantity * exchangeRate, 0).toFixed(2)}`;
        } else {
          const productDetails = products.find(
            (product) => product.id === parseInt(productId),
          );
          cartList.push(productDetails);
          productDetails.quantity = 1; // Initialize quantity to 1
          document.querySelector("#cart-count").textContent = cartList.length;
          displayCartItems(cartList, exchangeRate);
          document.querySelector("#order-total").textContent =
            `Ksh. ${cartList.reduce((total, item) => total + item.price * item.quantity * exchangeRate, 0).toFixed(2)}`;
        }
      });
    });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    alert("Error fetching exchange rate.");
  }
}

document.addEventListener("DOMContentLoaded", loadProductsWithExchangeRate);

function displayCartItems(aCartList, exchangeRate) {
  const cartItemsContainer = document.querySelector("#cart-list");
  cartItemsContainer.innerHTML = ""; // Clear existing cart items
  aCartList.forEach((item) => {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
    <p>${item.name} <span style= "color: green;">x${item.quantity}</span></p>
    <p>Unit Price: Ksh. ${(item.price * exchangeRate).toFixed(2)}</p>
    <p>Ksh. ${(item.price * item.quantity * exchangeRate).toFixed(2)}</p>
  `;
    cartItemsContainer.appendChild(cartItem);
  });
}
