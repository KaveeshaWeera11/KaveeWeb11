// File: js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkout-form");
    const confirmation = document.getElementById("confirmation");
    const deliveryDateEl = document.getElementById("delivery-date");
    const cartTableBody = document.querySelector("#cart-summary-table tbody");
    const checkoutTotal = document.getElementById("checkout-total");
  
    // 🛒 Load cart data from localStorage
    function loadCart() {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      let total = 0;
  
      cartItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${item.subtotal.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(row);
        total += item.subtotal;
      });
  
      checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }
  
    loadCart(); // Load the cart as soon as the page loads
  
    // 🧾 Form submission handler
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      // Super basic validation
      const isValid = [...form.elements].every(input => {
        if (input.type !== "submit") {
          return input.value.trim() !== "";
        }
        return true;
      });
  
      if (!isValid) {
        alert("Please fill in all fields correctly.");
        return;
      }
  
      // Calculate delivery date (5 days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const formattedDate = deliveryDate.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
  
      deliveryDateEl.textContent = formattedDate;
      form.style.display = "none";
      confirmation.style.display = "block";
    });
  });
  