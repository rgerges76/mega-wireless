
const KEY='mw-approved-v3-3';let data,current='phones',editingIndex=null;
async function load(){
 const s=localStorage.getItem(KEY);
 if(s){
   try{data=JSON.parse(s)}catch(e){localStorage.removeItem(KEY)}
 }
 if(!data){
   data=await (await fetch('data.json',{cache:'no-store'})).json();
   localStorage.setItem(KEY,JSON.stringify(data));
 }
 render();
 if(sessionStorage.getItem('mw-admin-session')==='active'){
   document.getElementById('login').classList.remove('open');
 }
}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
async function sha256(text){
 const bytes=new TextEncoder().encode(text);
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function login(){
 const errorBox=document.getElementById('loginError');
 errorBox.textContent='';
 try{
   const email=document.getElementById('email').value.trim().toLowerCase();
   const password=document.getElementById('password').value;
   if(!email || !password){
     errorBox.textContent='Enter both email and password.';
     return;
   }
   if(!data.adminAuth || !data.adminAuth.email || !data.adminAuth.passwordHash){
     errorBox.textContent='Admin settings are missing. Upload the complete V3.3 package.';
     return;
   }
   const hash=await sha256(password);
   if(email===data.adminAuth.email.trim().toLowerCase() && hash===data.adminAuth.passwordHash){
     sessionStorage.setItem('mw-admin-session','active');
     document.getElementById('login').classList.remove('open');
   }else{
     errorBox.textContent='Incorrect email or password.';
   }
 }catch(err){
   console.error(err);
   errorBox.textContent='Login error. Refresh the page and try again.';
 }
}
function switchTab(tab,btn){current=tab;document.querySelectorAll('.sidebar button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');render()}
function tabRows(){return current==='ticker'?data.ticker:data[current]}
function render(){
 document.getElementById('title').textContent={phones:'Phones & Prices',offers:'Homepage Offers',announcement:'New Owner Banner',speakers:'Speakers',carriers:'Carrier Plans',repairs:'Repair Prices',repairPromotions:'HDMI Repair Promo',ticker:'Moving Ticker',store:'Store Information'}[current];
 if(current==='store'){renderStore();return} if(current==='announcement'){renderAnnouncementAdmin();return}
 const rows=tabRows();const headers=current==='ticker'?['text']:Object.keys(rows[0]||{}).filter(k=>k!=='id');
 document.getElementById('content').innerHTML=`<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${rows.map((r,i)=>`<tr>${headers.map(h=>`<td>${current==='ticker'?r:r[h]}</td>`).join('')}<td><button class="small edit" onclick="editRow(${i})">Edit</button> <button class="small delete" onclick="deleteRow(${i})">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}

function renderAnnouncementAdmin(){
 const a=data.announcement||{};
 document.getElementById('content').innerHTML=`<div class="card" style="padding:22px">
   <div class="form-grid">
     <label>Enabled<input id="an_enabled" value="${a.enabled!==false}"></label>
     <label>Title<input id="an_title" value="${a.title||''}"></label>
     <label style="grid-column:1/-1">Subtitle<textarea id="an_subtitle">${a.subtitle||''}</textarea></label>
     <label>Button Label<input id="an_button" value="${a.buttonLabel||''}"></label>
     <label>Button Target<input id="an_target" value="${a.target||'#why-us'}"></label>
   </div><br>
   <button class="btn" onclick="saveAnnouncement()">Save Banner</button>
 </div>`;
}
function saveAnnouncement(){
 data.announcement={
   enabled:document.getElementById('an_enabled').value==='true'||document.getElementById('an_enabled').value==='1',
   title:document.getElementById('an_title').value,
   subtitle:document.getElementById('an_subtitle').value,
   buttonLabel:document.getElementById('an_button').value,
   target:document.getElementById('an_target').value||'#why-us'
 };
 save();alert('New Owner banner saved');
}

function renderStore(){const s=data.store;document.getElementById('content').innerHTML=`<div class="card" style="padding:22px"><div class="form-grid"><label>Phone<input id="st_phone" value="${s.phone}"></label><label>Email<input id="st_email" value="${s.email}"></label><label>Address<input id="st_address" value="${s.address}"></label>${Object.entries(s.hours).map(([d,h])=>`<label>${d}<input id="h_${d}" value="${h}"></label>`).join('')}<label>Admin Email<input id="st_admin_email" value="${data.adminAuth.email}"></label><label>New Password<input id="st_admin_password" type="password" placeholder="Leave blank to keep current password"></label></div><br><button class="btn" onclick="saveStore()">Save Settings</button></div>`}
async function saveStore(){data.store.phone=st_phone.value;data.store.email=st_email.value;data.store.address=st_address.value;Object.keys(data.store.hours).forEach(d=>data.store.hours[d]=document.getElementById('h_'+d).value);data.adminAuth.email=st_admin_email.value.trim();
 const newPassword=st_admin_password.value;
 if(newPassword){data.adminAuth.passwordHash=await sha256(newPassword)}
 save();alert('Saved')}
function fields(){
 return {phones:['name','storage','price','oldPrice','image','visible'],offers:['title','subtitle','image','buttonLabel','target','visible'],speakers:['name','price','oldPrice','image','visible'],carriers:['name','price','image','visible'],repairs:['device','service','price','time','warranty','visible'],repairPromotions:['title','subtitle','price','image','buttonLabel','target','visible'],ticker:['text']}[current]
}
function addNew(){editingIndex=null;openEditor(current==='ticker'?{text:''}:{})}
function editRow(i){editingIndex=i;openEditor(current==='ticker'?{text:data.ticker[i]}:data[current][i])}
function deleteRow(i){if(confirm('Delete this item?')){if(current==='ticker')data.ticker.splice(i,1);else data[current].splice(i,1);save();render()}}
function openEditor(obj){const fs=fields();document.getElementById('editModal').classList.add('open');document.getElementById('form').innerHTML=`<div class="form-grid">${fs.map(f=>`<label>${f}<input id="f_${f}" value="${obj[f]??''}"></label>`).join('')}</div><br><button class="btn" onclick="saveRow()">Save</button>`}
function closeEditor(){document.getElementById('editModal').classList.remove('open')}
function saveRow(){let obj=current==='ticker'?{}:{id:editingIndex===null?'id'+Date.now():data[current][editingIndex].id};fields().forEach(f=>{let v=document.getElementById('f_'+f).value;if(['price','oldPrice'].includes(f))v=Number(v);if(f==='visible')v=v==='true'||v==='1';obj[f]=v});if(current==='ticker'){if(editingIndex===null)data.ticker.push(obj.text);else data.ticker[editingIndex]=obj.text}else{if(editingIndex===null)data[current].push(obj);else data[current][editingIndex]=obj}save();closeEditor();render()}
function exportBackup(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='mega-wireless-backup.json';a.click()}
function importBackup(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);save();render();alert('Backup imported')}catch{alert('Invalid JSON')}};r.readAsText(f)}
load();
