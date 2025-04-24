// File: order.js

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input[type='number']");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const totalPriceEl = document.getElementById("total-price");
  const buyNowBtn = document.getElementById("buy-now");
  const saveFavBtn = document.getElementById("save-fav");
  const applyFavBtn = document.getElementById("apply-fav");

  // Restrict invalid input (like minus sign or letters)
  inputs.forEach(input => {
    input.addEventListener("keydown", e => {
      if (["e", "E", "-", "+"].includes(e.key)) e.preventDefault();
    });
  });

  // Check for saved cart
  const savedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (savedCart) {
    // Restore values from saved cart
    savedCart.forEach(item => {
      const input = [...inputs].find(i => i.dataset.name === item.name);
      if (input) input.value = item.qty;
    });
  } else {
    // If no saved cart, default all inputs to 0
    inputs.forEach(input => input.value = 0);
  }

  updateCart();

  function updateCart() {
    cartTableBody.innerHTML = "";
    let total = 0;
    const cartItems = [];

    inputs.forEach(input => {
      let qty = parseInt(input.value);
      if (isNaN(qty) || qty < 0) {
        qty = 0;
        input.value = 0;
      }

      if (qty > 0) {
        const name = input.dataset.name;
        const price = parseFloat(input.dataset.price);
        const subtotal = qty * price;
        total += subtotal;

        cartItems.push({ name, price, qty, subtotal });

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${name}</td>
          <td>${qty}</td>
          <td>$${price.toFixed(2)}</td>
          <td>$${subtotal.toFixed(2)}</td>
        `;
        row.classList.add("cart-row");
        cartTableBody.appendChild(row);
      }
    });

    totalPriceEl.textContent = `$${total.toFixed(2)}`;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  // Live update cart as user types
  inputs.forEach(input => {
    input.addEventListener("input", updateCart);
  });

  // Save to favourites
  saveFavBtn.addEventListener("click", () => {
    const favourite = Array.from(inputs).map(input => ({
      name: input.dataset.name,
      price: parseFloat(input.dataset.price),
      value: input.value
    }));
    localStorage.setItem("favouriteOrder", JSON.stringify(favourite));
    saveFavBtn.textContent = "Saved!";
    setTimeout(() => saveFavBtn.textContent = "Add to Favourites", 1500);
  });

  // Apply favourites
  applyFavBtn.addEventListener("click", () => {
    const favourite = JSON.parse(localStorage.getItem("favouriteOrder"));
    if (!favourite) {
      alert("No favourite order found.");
      return;
    }

    favourite.forEach(item => {
      const input = [...inputs].find(i => i.dataset.name === item.name);
      if (input) input.value = item.value;
    });

    updateCart();
  });

  // Checkout button logic
  buyNowBtn.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add some items before checking out.");
      return;
    }

    if (confirm("Are you sure you want to proceed to checkout?")) {
      window.location.href = "checkout.html";
    }
  });
});
