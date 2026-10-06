const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const KEYS = {
  products: 'afh2_admin_products',
  orders: 'afh2_admin_orders',
  content: 'afh2_admin_content',
  settings: 'afh2_admin_settings',
  session: 'afh2_admin_session'
};
const DEFAULT_PRODUCTS = [
  {id:'01',name:'The Everyday Shirt',category:'Clothing',price:1850,color:'Ivory',stock:18,image:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85'},
  {id:'02',name:'Soft Form Knit',category:'Clothing',price:2200,color:'Oat',stock:12,image:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85'},
  {id:'03',name:'City Denim',category:'Clothing',price:2650,color:'Blue',stock:4,image:'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85'},
  {id:'04',name:'The Weekend Tote',category:'Accessories',price:1250,color:'Natural',stock:21,image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85'},
  {id:'05',name:'Studio Overshirt',category:'Outerwear',price:3200,color:'Sand',stock:3,image:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85'},
  {id:'06',name:'Off-Duty Tee',category:'Clothing',price:950,color:'White',stock:32,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'},
  {id:'07',name:'Soft Structure Jacket',category:'Outerwear',price:3950,color:'Charcoal',stock:7,image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85'},
  {id:'08',name:'Everywhere Cap',category:'Accessories',price:850,color:'Olive',stock:2,image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85'}
];
const DEFAULT_ORDERS = [
  {id:'AFH-1024',customer:'Nusrat Jahan',email:'nusrat@example.com',date:'2026-10-02',total:4050,status:'Processing',items:'Everyday Shirt ×1, Soft Form Knit ×1'},
  {id:'AFH-1023',customer:'Rafi Ahmed',email:'rafi@example.com',date:'2026-10-01',total:2650,status:'Completed',items:'City Denim ×1'},
  {id:'AFH-1022',customer:'Maliha Sultana',email:'maliha@example.com',date:'2026-09-30',total:2200,status:'Shipped',items:'Soft Form Knit ×1'},
  {id:'AFH-1021',customer:'Tanvir Hasan',email:'tanvir@example.com',date:'2026-09-29',total:950,status:'Pending',items:'Off-Duty Tee ×1'},
  {id:'AFH-1020',customer:'Ayesha Karim',email:'ayesha@example.com',date:'2026-09-27',total:3950,status:'Cancelled',items:'Soft Structure Jacket ×1'}
];
const DEFAULT_CONTENT = {
  eyebrow:'CURATED FOR YOUR EVERYDAY',
  headline:'Wear your',
  italic:'own story.',
  description:'Modern essentials. Confident silhouettes. Pieces that feel like you — from the first coffee to the last plan of the day.',
  button:'Explore the collection',
  image:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85'
};
const DEFAULT_SETTINGS = {storeName:"Atik's Fashion House",email:'atik.cmttiu1001@gmail.com',currency:'BDT',status:'Open'};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch { return structuredClone(fallback); }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
let products = read(KEYS.products, DEFAULT_PRODUCTS);
let orders = read(KEYS.orders, DEFAULT_ORDERS);
let content = read(KEYS.content, DEFAULT_CONTENT);
let settings = read(KEYS.settings, DEFAULT_SETTINGS);
let currentView = 'overview';
const money = value => new Intl.NumberFormat('en-BD',{style:'currency',currency:settings.currency||'BDT',maximumFractionDigits:0}).format(value).replace('BDT','৳').replace('USD','$').replace(/\s/g,'');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
}
function persistProducts(){write(KEYS.products,products)}
function persistOrders(){write(KEYS.orders,orders)}
function setView(view) {
  currentView = view;
  $$('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
  $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  const titles = {overview:['YOUR STORE AT A GLANCE','Overview'],products:['YOUR CATALOGUE','Products'],orders:['CUSTOMER ACTIVITY','Orders'],content:['BRAND EXPERIENCE','Storefront content'],settings:['YOUR PREFERENCES','Store settings']};
  $('#topEyebrow').textContent = titles[view][0];
  $('#pageTitle').innerHTML = `${titles[view][1]} <span>✳</span>`;
  $('#sidebar').classList.remove('open');
  if (view === 'products') renderProducts();
  if (view === 'orders') renderOrders();
  if (view === 'content') fillContentForm();
  if (view === 'settings') fillSettingsForm();
}
function showApp(username) {
  $('#loginScreen').hidden = true; $('#adminApp').hidden = false;
  $('#adminName').textContent = username; $('#settingsAdminName').textContent = username;
  renderAll();
}
function login(username, password) {
  // Demo-only client-side credentials. Replace with server-side authentication before deployment.
  return username === 'admin' && password === 'Atik@2026';
}
async function signOut(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Clear the demo login first so logout still works if the API is offline.
  sessionStorage.removeItem(KEYS.session);

  // If server-side authentication is enabled, also destroy its session cookie.
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
  } catch (error) {
    // The local demo session is already cleared; the API may not be running.
  }

  // Reload to reset the dashboard state and reliably return to the login screen.
  window.location.replace('admin.html?loggedout=1');
}
$('#loginForm').addEventListener('submit', event => {
  event.preventDefault();
  const username = $('#username').value.trim();
  const password = $('#password').value;
  if (!login(username,password)) {
    $('#loginError').textContent = 'Incorrect demo username or password. Please try again.';
    return;
  }
  sessionStorage.setItem(KEYS.session, username);
  $('#loginError').textContent = '';
  showApp(username);
  toast('Welcome to Admin Studio');
});
$('#togglePassword').addEventListener('click', () => {
  const input = $('#password'); const show = input.type === 'password';
  input.type = show ? 'text' : 'password'; $('#togglePassword').textContent = show ? 'Hide' : 'Show';
});
$('#logoutButton').addEventListener('click', signOut);
$('#settingsLogout').addEventListener('click', signOut);
$('#sidebarToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$$('.nav-item').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
$$('[data-goto]').forEach(button => button.addEventListener('click', () => setView(button.dataset.goto)));

function renderAll() {
  $('#adminYear').textContent = new Date().getFullYear();
  $('#navProductCount').textContent = products.length;
  $('#navOrderCount').textContent = orders.filter(o => !['Completed','Cancelled'].includes(o.status)).length;
  $('#metricProducts').textContent = products.length;
  $('#productsHeadingCount').textContent = `(${products.length})`;
  $('#metricOrders').textContent = orders.length;
  $('#ordersHeadingCount').textContent = `(${orders.length})`;
  $('#metricRevenue').textContent = money(orders.filter(o => o.status === 'Completed').reduce((sum,o)=>sum+Number(o.total),0));
  $('#metricLowStock').textContent = products.filter(p => Number(p.stock) <= 5).length;
  renderRecentOrders();
  renderProducts();
  renderOrders();
  fillContentForm();
  fillSettingsForm();
}
function statusClass(status){return String(status).toLowerCase().replace(/\s+/g,'-')}
function renderRecentOrders() {
  const latest = [...orders].slice(0,5);
  $('#recentOrders').innerHTML = latest.length ? `<table class="data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>${latest.map(o=>`<tr><td><strong>${escapeHTML(o.id)}</strong></td><td>${escapeHTML(o.customer)}</td><td>${money(o.total)}</td><td><span class="status ${statusClass(o.status)}">${escapeHTML(o.status)}</span></td></tr>`).join('')}</tbody></table>` : '<p class="muted-note">No orders yet.</p>';
}
function renderProducts() {
  const query = ($('#productSearch')?.value || '').toLowerCase();
  const category = $('#productCategoryFilter')?.value || 'All';
  const filtered = products.filter(p => (`${p.name} ${p.category} ${p.color}`).toLowerCase().includes(query) && (category === 'All' || p.category === category));
  $('#productsTable').innerHTML = filtered.length ? `<table class="data-table"><thead><tr><th>PRODUCT</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>${filtered.map(p=>`<tr><td><div class="product-cell"><img class="product-thumb" src="${escapeHTML(p.image)}" alt=""><span><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.category)} · ${escapeHTML(p.color)}</small></span></div></td><td>${money(p.price)}</td><td>${p.stock}</td><td><span class="status ${Number(p.stock)<=5?'pending':''}">${Number(p.stock)<=5?'Low stock':'In stock'}</span></td><td><div class="row-actions"><button class="tiny-button" data-edit-product="${escapeHTML(p.id)}">Edit</button><button class="tiny-button" data-delete-product="${escapeHTML(p.id)}">Delete</button></div></td></tr>`).join('')}</tbody></table>` : '<table class="data-table"><tbody><tr><td class="empty-cell">No matching products.</td></tr></tbody></table>';
  $('#navProductCount').textContent = products.length;
}
$('#productSearch').addEventListener('input', renderProducts);
$('#productCategoryFilter').addEventListener('change', renderProducts);
function openProductModal(product=null) {
  $('#productForm').reset();
  $('#editProductId').value = product?.id || '';
  $('#productModalTitle').textContent = product ? 'Edit product' : 'Add product';
  $('#editName').value = product?.name || '';
  $('#editCategory').value = product?.category || 'Clothing';
  $('#editPrice').value = product?.price ?? '';
  $('#editColor').value = product?.color || '';
  $('#editStock').value = product?.stock ?? 0;
  $('#editImage').value = product?.image || '';
  $('#productModal').hidden = false;
  $('#editName').focus();
}
function closeProductModal(){$('#productModal').hidden=true}
$('#addProductButton').addEventListener('click',()=>openProductModal());
$$('[data-close-modal]').forEach(button=>button.addEventListener('click',closeProductModal));
$('#productModal').addEventListener('click',event=>{if(event.target===$('#productModal'))closeProductModal()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeProductModal()});
$('#productsTable').addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit-product]'); const del=event.target.closest('[data-delete-product]');
  if(edit){const product=products.find(p=>p.id===edit.dataset.editProduct);if(product)openProductModal(product)}
  if(del){const product=products.find(p=>p.id===del.dataset.deleteProduct);if(product&&confirm(`Delete "${product.name}" from the catalogue?`)){products=products.filter(p=>p.id!==product.id);persistProducts();renderAll();toast('Product deleted')}}
});
$('#productForm').addEventListener('submit',event=>{
  event.preventDefault();
  const id=$('#editProductId').value || `P${Date.now().toString(36).toUpperCase()}`;
  const product={id,name:$('#editName').value.trim(),category:$('#editCategory').value,price:Number($('#editPrice').value),color:$('#editColor').value.trim(),stock:Number($('#editStock').value),image:$('#editImage').value.trim()||'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85'};
  const index=products.findIndex(p=>p.id===id);
  if(index>=0)products[index]=product;else products.unshift(product);
  persistProducts();renderAll();closeProductModal();toast(index>=0?'Product updated':'Product added');
});

function renderOrders() {
  const query=($('#orderSearch')?.value||'').toLowerCase();
  const status=$('#orderStatusFilter')?.value||'All';
  const filtered=orders.filter(o=>(`${o.id} ${o.customer} ${o.email}`).toLowerCase().includes(query)&&(status==='All'||o.status===status));
  $('#ordersTable').innerHTML=filtered.length?`<table class="data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>TOTAL</th><th>STATUS</th><th>UPDATE STATUS</th></tr></thead><tbody>${filtered.map(o=>`<tr><td><strong>${escapeHTML(o.id)}</strong><small style="display:block;color:#77786f;margin-top:5px">${escapeHTML(o.items||'')}</small></td><td>${escapeHTML(o.customer)}<small style="display:block;color:#77786f;margin-top:5px">${escapeHTML(o.email||'')}</small></td><td>${escapeHTML(o.date)}</td><td>${money(o.total)}</td><td><span class="status ${statusClass(o.status)}">${escapeHTML(o.status)}</span></td><td><select class="tiny-button" data-order-status="${escapeHTML(o.id)}" aria-label="Update status for ${escapeHTML(o.id)}">${['Pending','Processing','Shipped','Completed','Cancelled'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table>`:'<table class="data-table"><tbody><tr><td class="empty-cell">No matching orders.</td></tr></tbody></table>';
  $('#navOrderCount').textContent=orders.filter(o=>!['Completed','Cancelled'].includes(o.status)).length;
}
$('#orderSearch').addEventListener('input',renderOrders);
$('#orderStatusFilter').addEventListener('change',renderOrders);
$('#ordersTable').addEventListener('change',event=>{
  const select=event.target.closest('[data-order-status]');if(!select)return;
  const order=orders.find(o=>o.id===select.dataset.orderStatus);if(!order)return;
  order.status=select.value;persistOrders();renderAll();toast(`Order ${order.id} updated`);
});
$('#exportOrders').addEventListener('click',()=>{
  const rows=[['Order ID','Customer','Email','Date','Total','Status','Items'],...orders.map(o=>[o.id,o.customer,o.email,o.date,o.total,o.status,o.items])];
  const csv=rows.map(row=>row.map(value=>`"${String(value??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='atik-fashion-house-orders.csv';a.click();URL.revokeObjectURL(url);toast('Orders CSV exported');
});

function fillContentForm() {
  $('#contentEyebrow').value=content.eyebrow;
  $('#contentHeadline').value=content.headline;
  $('#contentItalic').value=content.italic;
  $('#contentDescription').value=content.description;
  $('#contentButton').value=content.button;
  $('#contentImage').value=content.image||'';
  updatePreview();
}
function updatePreview() {
  $('#previewEyebrow').textContent=$('#contentEyebrow').value;
  $('#previewHeadline').textContent=$('#contentHeadline').value;
  $('#previewItalic').textContent=$('#contentItalic').value;
  $('#previewDescription').textContent=$('#contentDescription').value;
  $('#previewButton').textContent=$('#contentButton').value;
  const image=$('#contentImage').value.trim();
  $('#previewImage').hidden=!image;
  if(image)$('#previewImage').src=image;
}
$('#contentForm').addEventListener('input',updatePreview);
$('#contentForm').addEventListener('submit',event=>{
  event.preventDefault();
  content={eyebrow:$('#contentEyebrow').value.trim(),headline:$('#contentHeadline').value.trim(),italic:$('#contentItalic').value.trim(),description:$('#contentDescription').value.trim(),button:$('#contentButton').value.trim(),image:$('#contentImage').value.trim()};
  write(KEYS.content,content);$('#contentSaved').textContent='● Saved in this browser';toast('Homepage content saved in demo');
});
$('#resetContent').addEventListener('click',()=>{content=structuredClone(DEFAULT_CONTENT);write(KEYS.content,content);fillContentForm();$('#contentSaved').textContent='● Demo content restored';toast('Demo content restored')});
function fillSettingsForm() {
  $('#settingStoreName').value=settings.storeName;
  $('#settingEmail').value=settings.email;
  $('#settingCurrency').value=settings.currency;
  $('#settingStatus').value=settings.status;
}
$('#settingsForm').addEventListener('submit',event=>{
  event.preventDefault();
  settings={storeName:$('#settingStoreName').value.trim(),email:$('#settingEmail').value.trim(),currency:$('#settingCurrency').value,status:$('#settingStatus').value};
  write(KEYS.settings,settings);renderAll();toast('Settings saved in this browser');
});
$('#adminYear').textContent=new Date().getFullYear();
const session=sessionStorage.getItem(KEYS.session);
if(session)showApp(session);
