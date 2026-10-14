'use strict';
// Dữ liệu demo: giá tính bằng VND; không có thanh toán thật.
const books = [
  {id:1,title:'Nhà Giả Kim',author:'Paulo Coelho',category:'Văn học',price:89000,color:'#a76c40',label:'THE ALCHEMIST'},
  {id:2,title:'Atomic Habits',author:'James Clear',category:'Kỹ năng',price:159000,color:'#d1a74e',label:'ATOMIC HABITS'},
  {id:3,title:'Đắc Nhân Tâm',author:'Dale Carnegie',category:'Kỹ năng',price:99000,color:'#9c5b54',label:'HOW TO WIN FRIENDS'},
  {id:4,title:'Sapiens',author:'Yuval Noah Harari',category:'Khoa học',price:189000,color:'#455d66',label:'SAPIENS'},
  {id:5,title:'Tư Duy Nhanh Và Chậm',author:'Daniel Kahneman',category:'Khoa học',price:175000,color:'#527e72',label:'THINKING'},
  {id:6,title:'Cha Giàu Cha Nghèo',author:'Robert T. Kiyosaki',category:'Kinh doanh',price:119000,color:'#6c5984',label:'RICH DAD'},
  {id:7,title:'Đi Tìm Lẽ Sống',author:'Viktor E. Frankl',category:'Văn học',price:108000,color:'#b47a65',label:'MEANING'},
  {id:8,title:'Từ Tốt Đến Vĩ Đại',author:'Jim Collins',category:'Kinh doanh',price:149000,color:'#355c6d',label:'GOOD TO GREAT'}
];
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(n);
const cart = new Map();
function renderBooks(){
  const query=$('search').value.trim().toLocaleLowerCase('vi');
  const category=$('category').value;
  let result=books.filter(b=>(category==='all'||b.category===category)&&`${b.title} ${b.author}`.toLocaleLowerCase('vi').includes(query));
  if($('sort').value==='asc')result.sort((a,b)=>a.price-b.price);
  if($('sort').value==='desc')result.sort((a,b)=>b.price-a.price);
  $('bookGrid').replaceChildren(...result.map(b=>{
    const card=document.createElement('article');card.className='book-card';
    const area=document.createElement('div');area.className='cover-area';
    const cover=document.createElement('div');cover.className='cover';cover.style.backgroundColor=b.color;
    const coverTitle=document.createElement('span');coverTitle.textContent=b.label;
    const coverSub=document.createElement('small');coverSub.textContent='BOOKHAVEN';cover.append(coverTitle,coverSub);area.append(cover);
    const info=document.createElement('div');info.className='book-info';
    const tag=document.createElement('span');tag.className='category-tag';tag.textContent=b.category;
    const title=document.createElement('h3');title.textContent=b.title;
    const author=document.createElement('p');author.className='author';author.textContent=b.author;
    const price=document.createElement('span');price.className='price';price.textContent=money(b.price);
    const button=document.createElement('button');button.className='add-btn';button.type='button';button.textContent='+ Thêm vào giỏ';button.addEventListener('click',()=>addToCart(b.id));
    info.append(tag,title,author,price,button);card.append(area,info);return card;
  }));
  $('emptyState').hidden=result.length!==0;
}
let toastTimeout;
function notify(message){const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),2400);}
function addToCart(id){cart.set(id,(cart.get(id)||0)+1);updateCart();notify('Đã thêm sách vào giỏ hàng!');}
function updateCart(){let count=0,total=0;const rows=[];for(const [id,qty] of cart){const b=books.find(item=>item.id===id);count+=qty;total+=b.price*qty;const row=document.createElement('div');row.className='cart-row';const desc=document.createElement('span');desc.textContent=`${b.title} × ${qty} — ${money(b.price*qty)}`;const remove=document.createElement('button');remove.type='button';remove.textContent='Xóa';remove.setAttribute('aria-label',`Xóa ${b.title} khỏi giỏ`);remove.addEventListener('click',()=>{cart.delete(id);updateCart();});row.append(desc,remove);rows.push(row);} $('cartCount').textContent=count;$('cartItems').replaceChildren(...rows);if(!count)$('cartItems').textContent='Giỏ hàng đang trống.';$('cartTotal').textContent=`Tổng cộng: ${money(total)}`;}
for(const id of ['search','category','sort'])$(id).addEventListener(id==='search'?'input':'change',renderBooks);
const toggle=document.querySelector('.menu-toggle');const nav=$('main-nav');toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));toggle.setAttribute('aria-label',expanded?'Mở menu':'Đóng menu');nav.classList.toggle('open',!expanded);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Mở menu');}));
$('cartButton').addEventListener('click',()=>{$('cartDialog').showModal();});$('closeCart').addEventListener('click',()=>$('cartDialog').close());$('cartDialog').addEventListener('click',e=>{if(e.target===$('cartDialog'))$('cartDialog').close();});
$('subscribeForm').addEventListener('submit',e=>{e.preventDefault();$('formMessage').textContent='Cảm ơn bạn! Đây là biểu mẫu demo, email chưa được gửi tới máy chủ.';$('subscribeForm').reset();});
renderBooks();updateCart();
