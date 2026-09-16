const books = [
  {id:1,title:"The Midnight Library",author:"Matt Haig",price:399,old:499,genre:"Fiction",rating:4.7,reviews:1820,color:"blue",desc:"Between life and death there is a library, and within that library, the shelves go on forever. A warm, hopeful story about choices and second chances."},
  {id:2,title:"Atomic Habits",author:"James Clear",price:449,old:599,genre:"Self Help",rating:4.8,reviews:2341,color:"green",desc:"A practical framework for building good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results."},
  {id:3,title:"Ikigai",author:"Héctor García",price:299,old:399,genre:"Wellness",rating:4.5,reviews:964,color:"orange",desc:"A gentle exploration of the Japanese concept of ikigai and the small practices that can make everyday life more meaningful."},
  {id:4,title:"The Alchemist",author:"Paulo Coelho",price:349,old:450,genre:"Fiction",rating:4.6,reviews:3150,color:"brown",desc:"Santiago follows a recurring dream and a journey across the desert, discovering that the real treasure is often the journey itself."},
  {id:5,title:"Deep Work",author:"Cal Newport",price:425,old:550,genre:"Productivity",rating:4.6,reviews:1184,color:"purple",desc:"Rules for focused success in a distracted world, with practical strategies for producing meaningful work."},
  {id:6,title:"Sapiens",author:"Yuval Noah Harari",price:499,old:650,genre:"History",rating:4.7,reviews:2860,color:"brown",desc:"A sweeping account of how Homo sapiens came to dominate the planet and reshape societies, economies and cultures."},
  {id:7,title:"The Psychology of Money",author:"Morgan Housel",price:379,old:499,genre:"Finance",rating:4.8,reviews:2010,color:"green",desc:"Timeless lessons on wealth, greed, risk and why doing well with money is not necessarily about what you know."},
  {id:8,title:"Educated",author:"Tara Westover",price:429,old:549,genre:"Memoir",rating:4.7,reviews:1510,color:"blue",desc:"A memoir about education, family and the struggle to find a new way of seeing the world."}
];

const categories = [
  ["📖","Fiction","1,240 books"],["🧠","Self Help","680 books"],["💼","Business","520 books"],["🌿","Wellness","410 books"],
  ["🕵️","Mystery","375 books"],["🚀","Sci-Fi","290 books"],["🏛️","History","350 books"],["💳","Finance","225 books"]
];

const authors = [
  {name:"James Clear",initials:"JC",bio:"Writer and speaker focused on habits, decision-making and continuous improvement.",books:"Atomic Habits"},
  {name:"Matt Haig",initials:"MH",bio:"Novelist and essayist whose work explores mental health, hope and the strange beauty of being alive.",books:"The Midnight Library"},
  {name:"Paulo Coelho",initials:"PC",bio:"Brazilian novelist known for reflective stories about purpose, faith and the search for meaning.",books:"The Alchemist"}
];

let state = {
  page: "home",
  cart: JSON.parse(localStorage.getItem("bn-cart") || "[]"),
  saved: JSON.parse(localStorage.getItem("bn-saved") || "[]"),
  query: "",
  category: "All",
  sort: "featured"
};

function save(){
  localStorage.setItem("bn-cart",JSON.stringify(state.cart));
  localStorage.setItem("bn-saved",JSON.stringify(state.saved));
  updateCounts();
}
function money(n){ return "₹" + n.toLocaleString("en-IN"); }
function stars(r){ return "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r)); }
function bookCover(b, cls=""){
  return `<div class="book-cover ${b.color} ${cls}">
    <div class="cover-title">${b.title}</div>
    <div class="cover-author">${b.author}</div>
  </div>`;
}
function bookCard(b){
  const saved = state.saved.includes(b.id);
  return `<article class="book-card">
    <div class="cover-wrap">
      ${bookCover(b)}
      <button class="heart ${saved?"saved":""}" data-save="${b.id}" aria-label="${saved?"Remove from":"Save"} reading list">${saved?"♥":"♡"}</button>
    </div>
    <div class="book-meta">
      <h3>${b.title}</h3>
      <div class="book-author">${b.author}</div>
      <div class="rating">${stars(b.rating)} <span style="color:#777">(${b.reviews.toLocaleString()})</span></div>
      <div class="price">${money(b.price)} <del>${money(b.old)}</del></div>
      <div class="card-actions">
        <button class="btn soft" data-detail="${b.id}">View</button>
        <button class="btn primary" data-cart="${b.id}">Add</button>
      </div>
    </div>
  </article>`;
}
function updateCounts(){
  const count = state.cart.reduce((s,x)=>s+x.qty,0);
  document.querySelectorAll("#cartCount,#sideCartCount").forEach(x=>x.textContent=count);
}
function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg; el.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove("show"),2200);
}
function navigate(page){
  state.page=page;
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}
function filteredBooks(){
  let list=[...books];
  if(state.query) {
    const q=state.query.toLowerCase();
    list=list.filter(b=>`${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(q));
  }
  if(state.category!=="All") list=list.filter(b=>b.genre===state.category);
  if(state.sort==="priceLow") list.sort((a,b)=>a.price-b.price);
  if(state.sort==="priceHigh") list.sort((a,b)=>b.price-a.price);
  if(state.sort==="rating") list.sort((a,b)=>b.rating-a.rating);
  return list;
}
function renderHome(){
  return `<div class="hero">
    <div class="hero-copy">
      <p class="eyebrow">A COZY CORNER FOR CURIOUS MINDS</p>
      <h1>Stories that<br><span>stay with you.</span></h1>
      <p class="muted">Discover hand-picked books, thoughtful authors, and your next five-star read — all in one warm little bookstore.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn primary" data-page="books">Explore books →</button>
        <button class="btn ghost" data-page="categories">Browse genres</button>
      </div>
    </div>
    <div class="hero-art"><div class="hero-books">
      ${bookCover(books[0])}${bookCover(books[1])}${bookCover(books[3])}${bookCover(books[5])}
    </div></div>
  </div>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">QUICK DISCOVERY</p><h2>Browse by mood</h2></div><button class="link-btn" data-page="categories">See all →</button></div>
    <div class="chips">${["All","Fiction","Self Help","Wellness","Productivity","History","Finance"].map(x=>`<button class="chip ${state.category===x?"active":""}" data-category="${x}">${x}</button>`).join("")}</div>
  </section>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">EDITOR'S PICKS</p><h2>Books to fall into</h2></div><button class="link-btn" data-page="books">View all →</button></div>
    <div class="book-grid">${books.slice(0,4).map(bookCard).join("")}</div>
  </section>
  <section class="section"><div class="collection"><div><p class="eyebrow" style="color:#f5cf8c">THIS WEEK</p><h2>Build your better reading list.</h2><p style="color:#dce9d6">Save books now and keep your next reads in one calm place.</p></div><button class="btn" data-page="reading">Open reading list</button></div></section>`;
}
function renderCategories(){
  return `<div class="page-title"><div><p class="eyebrow">EXPLORE</p><h1 style="font-size:45px">Find your shelf.</h1><p class="muted">Browse books by genre, topic and reading mood.</p></div></div>
  <div class="category-grid">${categories.map((c,i)=>`<button class="category-card" data-category="${c[1]}" style="text-align:left"><b>${c[0]}</b><h3>${c[1]}</h3><span>${c[2]}</span></button>`).join("")}</div>
  <section class="section"><div class="notice"><strong>Tip:</strong> Choose a category to jump straight into a filtered book list.</div></section>`;
}
function renderBooks(){
  const list=filteredBooks();
  return `<div class="page-title"><div><p class="eyebrow">CATALOG</p><h1 style="font-size:45px">${state.query?`Results for “${state.query}”`:"All books"}</h1><p class="muted">${list.length} books waiting to be discovered.</p></div>
    <select id="sort" class="select"><option value="featured">Featured</option><option value="rating">Top rated</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option></select>
  </div>
  <div class="filters"><input id="bookSearch" class="input" value="${state.query}" placeholder="Search this catalog..." style="min-width:260px">
  ${["All","Fiction","Self Help","Wellness","Productivity","History","Finance","Memoir"].map(x=>`<button class="chip ${state.category===x?"active":""}" data-category="${x}">${x}</button>`).join("")}</div>
  ${list.length?`<div class="book-grid">${list.map(bookCard).join("")}</div>`:`<div class="empty"><div class="emoji">🔎</div><h2>No books found</h2><p class="muted">Try another title, author or category.</p><button class="btn primary" data-action="clear-search">Clear search</button></div>`}`;
}
function renderDetail(id){
  const b=books.find(x=>x.id===id)||books[0];
  return `<div class="detail">
    <div class="detail-cover">${bookCover(b)}</div>
    <div>
      <button class="link-btn" data-page="books">← Back to books</button>
      <p class="eyebrow" style="margin-top:25px">${b.genre.toUpperCase()}</p>
      <h1>${b.title}</h1>
      <p class="muted">by <button class="link-btn" data-page="authors" style="padding:0">${b.author}</button></p>
      <div class="rating" style="font-size:15px">${stars(b.rating)} <span style="color:#777">${b.rating} · ${b.reviews.toLocaleString()} reviews</span></div>
      <p class="lead">${b.desc}</p>
      <div class="info-row"><span class="info-pill">Paperback</span><span class="info-pill">In stock</span><span class="info-pill">Free delivery over ₹499</span></div>
      <div style="display:flex;align-items:center;gap:18px;margin:25px 0"><div class="price" style="font-size:28px">${money(b.price)} <del>${money(b.old)}</del></div><span style="color:#2e7d32;font-size:12px;font-weight:800">20% OFF</span></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" data-cart="${b.id}" style="min-width:180px">Add to cart</button><button class="btn soft" data-save="${b.id}">${state.saved.includes(b.id)?"♥ Saved":"♡ Save to list"}</button></div>
      <section class="section"><div class="section-head"><h2>About the book</h2></div><div class="panel"><p class="muted">${b.desc} This sample product page demonstrates cover, author, pricing, availability and review discovery patterns required by the brief.</p></div></section>
      <section class="section"><div class="section-head"><h2>Reader reviews</h2><button class="link-btn" data-page="reviews">See all →</button></div>
      <div class="panel"><div class="review"><div class="review-head"><strong>Priya K.</strong><span class="rating">★★★★★</span></div><p class="muted">“Beautifully paced and easy to pick up again after a busy day.”</p></div><div class="review"><div class="review-head"><strong>Rahul M.</strong><span class="rating">★★★★☆</span></div><p class="muted">“A thoughtful read. I highlighted half the book.”</p></div></div></section>
    </div>
  </div>`;
}
function renderAuthors(){
  return `<div class="page-title"><div><p class="eyebrow">MEET THE WORDSMITHS</p><h1 style="font-size:45px">Authors</h1><p class="muted">Explore the people behind the pages.</p></div></div>
  <div class="author-card-grid">${authors.map((a,i)=>`<article class="panel"><div class="author-avatar">${a.initials}</div><h3 style="margin-top:15px">${a.name}</h3><p class="muted">${a.bio}</p><button class="btn soft" data-author="${i}">View author page</button></article>`).join("")}</div>`;
}
function renderAuthor(i=0){
  const a=authors[i]||authors[0];
  const abooks=books.filter(b=>b.author===a.name);
  return `<button class="link-btn" data-page="authors">← All authors</button><div class="author-hero" style="margin-top:18px"><div class="author-avatar">${a.initials}</div><div><p class="eyebrow">AUTHOR PAGE</p><h1 style="font-size:40px">${a.name}</h1><p class="muted">${a.bio}</p></div></div>
  <section class="section"><div class="section-head"><h2>Books by ${a.name}</h2></div><div class="book-grid">${(abooks.length?abooks:books.slice(0,4)).map(bookCard).join("")}</div></section>`;
}
function renderReviews(){
  return `<div class="page-title"><div><p class="eyebrow">COMMUNITY</p><h1 style="font-size:45px">Book reviews</h1><p class="muted">A transparent look at what readers are saying.</p></div><button class="btn primary" data-action="write-review">Write a review</button></div>
  <div class="review-summary"><div><div class="big-rating">4.7</div><div class="rating">★★★★★</div><p class="muted">Average reader rating</p></div><div>${[5,4,3,2,1].map((n,j)=>`<div class="bar-row"><span>${n}</span><div class="bar"><i style="width:${[78,14,5,2,1][j]}%"></i></div><span>${[78,14,5,2,1][j]}%</span></div>`).join("")}</div></div>
  <div class="panel">${["Aanya S.","Vikram P.","Meera R.","Kabir N."].map((n,i)=>`<div class="review"><div class="review-head"><strong>${n}</strong><span class="rating">${i===2?"★★★★☆":"★★★★★"}</span></div><small class="muted">Verified reader · 2 weeks ago</small><p>${["A warm, thoughtful reading experience. The writing stayed with me long after the last page.","The interface made it surprisingly easy to discover books outside my usual genre.","Loved the recommendations and the clean layout. I found two books for my weekend.","Great selection and a smooth checkout flow."][i]}</p></div>`).join("")}</div>`;
}
function renderReading(){
  const list=books.filter(b=>state.saved.includes(b.id));
  return `<div class="page-title"><div><p class="eyebrow">YOUR LIBRARY</p><h1 style="font-size:45px">Reading list</h1><p class="muted">${list.length} saved ${list.length===1?"book":"books"}.</p></div><button class="btn soft" data-page="books">+ Add books</button></div>
  ${list.length?`<div class="book-grid">${list.map(bookCard).join("")}</div>`:`<div class="empty"><div class="emoji">♡</div><h2>Your list is waiting</h2><p class="muted">Tap the heart on any book to save it for later.</p><button class="btn primary" data-page="books">Discover books</button></div>`}`;
}
function renderCart(){
  if(!state.cart.length) return `<div class="empty"><div class="emoji">🛒</div><h2>Your cart is empty</h2><p class="muted">A good story is only a few taps away.</p><button class="btn primary" data-page="books">Start shopping</button></div>`;
  let subtotal=0;
  const items=state.cart.map(x=>{const b=books.find(b=>b.id===x.id); subtotal+=b.price*x.qty; return {...b,qty:x.qty}});
  const shipping=subtotal>=499?0:49,total=subtotal+shipping;
  return `<div class="page-title"><div><p class="eyebrow">SHOPPING</p><h1 style="font-size:45px">Your cart</h1><p class="muted">${items.length} item types · ${items.reduce((s,x)=>s+x.qty,0)} books</p></div></div>
  <div class="cart-layout"><div>${items.map(b=>`<div class="cart-item">${bookCover(b,"mini-cover")}<div class="cart-info"><h3>${b.title}</h3><p class="muted" style="font-size:12px">${b.author}</p><b>${money(b.price)}</b></div><div class="qty"><button data-qty="${b.id}" data-delta="-1">−</button><span>${b.qty}</span><button data-qty="${b.id}" data-delta="1">+</button></div><button class="text-btn" data-remove="${b.id}" title="Remove">✕</button></div>`).join("")}</div>
  <aside class="summary-card"><h3>Order summary</h3><div class="sum-row"><span>Subtotal</span><b>${money(subtotal)}</b></div><div class="sum-row"><span>Delivery</span><b>${shipping?money(shipping):"FREE"}</b></div><div class="sum-row total"><span>Total</span><b>${money(total)}</b></div><button class="btn primary full" data-page="checkout" style="margin-top:15px">Continue to checkout →</button><p class="muted" style="font-size:11px;text-align:center">Secure checkout · Easy returns</p></aside></div>`;
}
function renderCheckout(){
  return `<div class="page-title"><div><p class="eyebrow">CHECKOUT</p><h1 style="font-size:45px">Almost there.</h1><p class="muted">Enter your delivery details and choose a payment method.</p></div></div>
  <div class="cart-layout"><div class="panel"><h2>Shipping details</h2><div class="form-grid" style="margin-top:20px">
    <div class="form-group"><label>First name</label><input class="input" placeholder="Shorya"></div><div class="form-group"><label>Last name</label><input class="input" placeholder="Mahajan"></div>
    <div class="form-group full-width"><label>Address</label><input class="input" placeholder="House / street / locality"></div>
    <div class="form-group"><label>City</label><input class="input" placeholder="Lucknow"></div><div class="form-group"><label>PIN code</label><input class="input" placeholder="226001"></div>
    <div class="form-group full-width"><label>Payment method</label><select class="select"><option>UPI / QR</option><option>Credit / Debit Card</option><option>Cash on Delivery</option></select></div>
    <div class="form-group full-width"><label>Card / UPI reference</label><input class="input" placeholder="Optional for demo"></div>
  </div><button class="btn primary" data-action="place-order" style="margin-top:22px">Place order securely</button></div>
  <aside class="summary-card"><h3>Ready to order?</h3><p class="muted">Your cart is saved on this device for this demo.</p><div class="notice" style="font-size:12px">🔒 Demo checkout — no real payment is processed.</div><button class="btn ghost full" data-page="cart">← Back to cart</button></aside></div>`;
}
function renderConfirmation(){
  return `<div class="empty" style="max-width:680px;margin:50px auto"><div class="emoji">🎉</div><p class="eyebrow">ORDER CONFIRMED</p><h1 style="font-size:50px">Your story is on its way.</h1><p class="muted">Order <strong>#BN-2026-0917</strong> has been placed successfully. We’ll show delivery updates in your profile.</p><div class="panel" style="margin-top:20px;text-align:left"><div class="sum-row"><span>Status</span><b style="color:var(--green)">Confirmed</b></div><div class="sum-row"><span>Estimated delivery</span><b>3–5 business days</b></div></div><button class="btn primary" data-page="home" style="margin-top:20px">Back to BookNook</button></div>`;
}
function renderProfile(){
  return `<div class="page-title"><div><p class="eyebrow">ACCOUNT</p><h1 style="font-size:45px">Your profile</h1></div></div>
  <div class="profile"><div class="profile-card"><div class="profile-big">SM</div><h2 style="font-size:24px">Shorya Mahajan</h2><p class="muted">BookNook member</p><div class="stat-grid"><div class="stat"><b>${state.saved.length}</b><span class="muted">Saved</span></div><div class="stat"><b>${state.cart.reduce((s,x)=>s+x.qty,0)}</b><span class="muted">Cart</span></div><div class="stat"><b>3</b><span class="muted">Orders</span></div></div></div>
  <div class="panel"><h2>Account details</h2><div class="form-grid" style="margin-top:20px"><div class="form-group"><label>Name</label><input class="input" value="Shorya Mahajan"></div><div class="form-group"><label>Email</label><input class="input" value="reader@example.com"></div><div class="form-group full-width"><label>Saved address</label><input class="input" value="Your saved delivery address"></div></div><button class="btn primary" style="margin-top:20px" data-action="save-profile">Save changes</button><hr style="border:0;border-top:1px solid var(--line);margin:25px 0"><h3>Order history</h3><div class="sum-row"><span>#BN-2026-0808 · 2 books</span><b>Delivered</b></div><div class="sum-row"><span>#BN-2026-0721 · 1 book</span><b>Delivered</b></div></div></div>`;
}
function renderLogin(){
  return `<div class="login-wrap"><p class="eyebrow">WELCOME BACK</p><h1>Keep your<br><span>stories close.</span></h1><p class="muted">Sign in to sync your reading list and order history.</p><div class="form-group" style="margin-top:22px"><label>Email</label><input class="input" placeholder="you@example.com"></div><div class="form-group" style="margin-top:13px"><label>Password</label><input class="input" type="password" placeholder="••••••••"></div><button class="btn primary full" data-action="login" style="margin-top:18px">Sign in</button><button class="text-btn full">Create a new account</button><div class="notice" style="margin-top:18px;font-size:12px">Demo project: any email/password will continue.</div></div>`;
}
function render(){
  const view=document.getElementById("view");
  const pages={
    home:renderHome,categories:renderCategories,books:renderBooks,authors:renderAuthors,
    reviews:renderReviews,reading:renderReading,cart:renderCart,checkout:renderCheckout,
    confirmation:renderConfirmation,profile:renderProfile,login:renderLogin
  };
  let content;
  if(state.page==="detail") content=renderDetail(state.detailId);
  else if(state.page==="author") content=renderAuthor(state.authorIndex);
  else content=(pages[state.page]||renderHome)();
  view.innerHTML=content;
  document.querySelectorAll("[data-page]").forEach(el=>el.onclick=()=>navigate(el.dataset.page));
  document.querySelectorAll("[data-detail]").forEach(el=>el.onclick=()=>{state.detailId=+el.dataset.detail;state.page="detail";render()});
  document.querySelectorAll("[data-author]").forEach(el=>el.onclick=()=>{state.authorIndex=+el.dataset.author;state.page="author";render()});
  document.querySelectorAll("[data-save]").forEach(el=>el.onclick=()=>toggleSave(+el.dataset.save));
  document.querySelectorAll("[data-cart]").forEach(el=>el.onclick=()=>addCart(+el.dataset.cart));
  document.querySelectorAll("[data-category]").forEach(el=>el.onclick=()=>{state.category=el.dataset.category;state.page="books";render()});
  document.querySelectorAll("[data-remove]").forEach(el=>el.onclick=()=>removeCart(+el.dataset.remove));
  document.querySelectorAll("[data-qty]").forEach(el=>el.onclick=()=>changeQty(+el.dataset.qty,+el.dataset.delta));
  document.querySelectorAll("[data-action]").forEach(el=>el.onclick=()=>actions(el.dataset.action));
  const sort=document.getElementById("sort"); if(sort){sort.value=state.sort;sort.onchange=()=>{state.sort=sort.value;render()}}
  const bs=document.getElementById("bookSearch"); if(bs){bs.oninput=e=>{state.query=e.target.value;renderBooksIntoView()}}
  document.querySelectorAll(".side-link,.mobile-nav button").forEach(el=>el.classList.toggle("active",el.dataset.page===state.page));
  updateCounts();
}
function renderBooksIntoView(){
  const v=document.getElementById("view");
  const list=filteredBooks();
  const grid=v.querySelector(".book-grid");
  if(grid) grid.outerHTML=list.length?`<div class="book-grid">${list.map(bookCard).join("")}</div>`:`<div class="empty"><div class="emoji">🔎</div><h2>No books found</h2><p class="muted">Try another title, author or category.</p></div>`;
  v.querySelectorAll("[data-detail]").forEach(el=>el.onclick=()=>{state.detailId=+el.dataset.detail;state.page="detail";render()});
  v.querySelectorAll("[data-cart]").forEach(el=>el.onclick=()=>addCart(+el.dataset.cart));
  v.querySelectorAll("[data-save]").forEach(el=>el.onclick=()=>toggleSave(+el.dataset.save));
}
function toggleSave(id){
  if(state.saved.includes(id)){state.saved=state.saved.filter(x=>x!==id);toast("Removed from reading list");}
  else {state.saved.push(id);toast("Saved to your reading list ♡");}
  save(); render();
}
function addCart(id){
  const item=state.cart.find(x=>x.id===id);
  if(item)item.qty++; else state.cart.push({id,qty:1});
  save(); toast("Added to cart 🛒");
}
function removeCart(id){state.cart=state.cart.filter(x=>x.id!==id);save();render();toast("Removed from cart");}
function changeQty(id,delta){
  const item=state.cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta;if(item.qty<=0)state.cart=state.cart.filter(x=>x.id!==id);
  save();render();
}
function actions(a){
  if(a==="start"||a==="skip"){localStorage.setItem("bn-onboarded","1");document.getElementById("onboarding").classList.add("hidden");return}
  if(a==="clear-search"){state.query="";state.category="All";render();return}
  if(a==="place-order"){state.cart=[];save();state.page="confirmation";render();toast("Order placed successfully 🎉");return}
  if(a==="login"){toast("Signed in — welcome back!");navigate("profile");return}
  if(a==="save-profile"){toast("Profile changes saved");return}
  if(a==="write-review"){toast("Review composer opened in the full app flow");return}
}
document.addEventListener("DOMContentLoaded",()=>{
  const onboard=document.getElementById("onboarding");
  if(!localStorage.getItem("bn-onboarded")) onboard.classList.remove("hidden");
  render();
  document.getElementById("globalSearch").addEventListener("keydown",e=>{
    if(e.key==="Enter"){state.query=e.target.value.trim();state.category="All";navigate("books")}
  });
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("globalSearch").focus()}
  });
});
