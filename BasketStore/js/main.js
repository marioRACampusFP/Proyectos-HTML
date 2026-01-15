
const PRODUCTS = [
  { id: 1, name: "Nike Pro Court", price: 89.99, img: "img/zapas.jpg", desc: "Zapatillas de alto rendimiento para jugadores exigentes.", stock: 10 },
  { id: 2, name: "Camiseta HoopHouse", price: 29.5, img: "img/camiseta.jpg", desc: "Camiseta transpirable con logo oficial.", stock: 25 },
  { id: 3, name: "Balón Pro 7", price: 54.0, img: "img/balon.jpg", desc: "Balón oficial con agarre superior.", stock: 5 }
];


let CART = [];


const main = document.getElementById("main");


function renderHome() {
  main.innerHTML = `
    <section id="home">
      <h2>Bienvenido a HoopHouse</h2>
      <p>Tu tienda de baloncesto accesible. Encuentra zapatillas, camisetas y balones diseñados para todos los jugadores.</p>
      <button class="btn" onclick="renderCatalog()">Ver catálogo</button>
    </section>
  `;
}


function renderCatalog() {
  main.innerHTML = `
    <section id="catalog">
      <h2>Catálogo</h2>
      <div class="catalog">
        ${PRODUCTS.map(p => `
          <article class="card">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <p class="price">${p.price.toFixed(2)} €</p>
            <button class="btn" onclick="addToCart(${p.id})">Añadir al carrito</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}


function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = CART.find(item => item.id === id);
  if (existing) {
    if (existing.qty < product.stock) existing.qty++;
    else alert("No hay más stock disponible.");
  } else {
    CART.push({ ...product, qty: 1 });
  }

  updateCartBadge();
  announce(`${product.name} añadido al carrito`);
}


function announce(msg) {
  const live = document.getElementById("cart-live");
  if (live) live.textContent = msg;
}


function updateQty(id, qty) {
  const item = CART.find(p => p.id === id);
  if (item) {
    item.qty = parseInt(qty);
    if (item.qty <= 0) removeItem(id);
  }
  renderCart();
}


function removeItem(id) {
  CART = CART.filter(p => p.id !== id);
  updateCartBadge();
  renderCart();
}


function updateCartBadge() {
  const count = CART.reduce((acc, p) => acc + p.qty, 0);
  const cartLink = document.querySelector('[data-route="cart"]');
  if (cartLink) cartLink.textContent = `Carrito  (${count})`;
}


function renderCart() {
  if (CART.length === 0) {
    main.innerHTML = `
      <section id="cart">
        <h2>Carrito de compras</h2>
        <p>Tu carrito está vacío.</p>
        <button class="btn" onclick="renderCatalog()">Ir al catálogo</button>
      </section>
    `;
    updateCartBadge();
    return;
  }

  const total = CART.reduce((acc, p) => acc + p.price * p.qty, 0);

  main.innerHTML = `
    <section id="cart">
      <h2>Carrito de compras</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${CART.map(p => `
            <tr>
              <td>${p.name}</td>
              <td>
                <input type="number" min="1" max="${p.stock}" value="${p.qty}" 
                       onchange="updateQty(${p.id}, this.value)" aria-label="Cantidad de ${p.name}">
              </td>
              <td>${p.price.toFixed(2)} €</td>
              <td>${(p.price * p.qty).toFixed(2)} €</td>
              <td><button class="btn" onclick="removeItem(${p.id})">Eliminar</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <p><strong>Total: ${total.toFixed(2)} €</strong></p>

      <h3>Finalizar compra</h3>
      <form id="checkout-form" onsubmit="return handleCheckout(event)">
        <label>Nombre:
          <input type="text" name="nombre" required aria-required="true">
        </label>
        <label>Email:
          <input type="email" name="email" required aria-required="true">
        </label>
        <label>Dirección:
          <input type="text" name="direccion" required aria-required="true">
        </label>
        <button class="btn" type="submit">Confirmar pedido</button>
      </form>
    </section>
  `;
}


function handleCheckout(e) {
  e.preventDefault();
  alert("✅ Pedido confirmado. ¡Gracias por tu compra!");
  CART = [];
  updateCartBadge();
  renderHome();
  return false;
}


function renderContact() {
  main.innerHTML = `
    <section id="contact">
      <h2>Contacto</h2>
      <p>¿Tienes dudas o comentarios? Envíanos un mensaje y te responderemos pronto.</p>
      <form id="contact-form" onsubmit="return handleContact(event)">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>

        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" required>

        <label for="mensaje">Mensaje:</label>
        <textarea id="mensaje" name="mensaje" required></textarea>

        <button type="submit" class="btn">Enviar</button>
      </form>
      <p id="contact-success" aria-live="polite"></p>
    </section>
  `;
}

function handleContact(e) {
  e.preventDefault();
  document.getElementById("contact-success").textContent =
    "✅ Mensaje enviado correctamente. Gracias por contactarnos.";
  e.target.reset();
  return false;
}


document.querySelectorAll("[data-route]").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const route = e.target.dataset.route;
    if (route === "catalog") renderCatalog();
    else if (route === "cart") renderCart();
    else if (route === "contact") renderContact();
    else renderHome();
  });
});


const live = document.createElement("div");
live.id = "cart-live";
live.setAttribute("aria-live", "polite");
live.classList.add("visually-hidden");
document.body.appendChild(live);


renderHome();
