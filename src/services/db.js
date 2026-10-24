// Centralised local data service (localStorage). Replace this module with a Supabase adapter later.
import {useSyncExternalStore} from 'react';
const KEY='jk_demo_db_v2';
const pad=n=>String(n).padStart(2,'0');
export const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export const today=()=>iso(new Date());
const plus=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const uid=p=>p+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
const hash=s=>{let x=5381;for(const c of 'jk$'+s)x=(x*33)^c.charCodeAt(0);return 'h'+(x>>>0).toString(16)}; // DEMO ONLY, not secure
export const fmt=n=>'₹'+Number(n||0).toLocaleString('en-IN');
const now=()=>Date.now();

export const DEFAULT_HALL_IMAGES = {
  h1: '/images/halls/burhani.jpg',
  h2: '/images/halls/tayyebi.jpg',
  h3: '/images/halls/mohammedi.jpg',
  h4: '/images/halls/hakimi.jpg',
  h5: '/images/halls/tayyebi_2nd_floor.jpg',
};

function seed(){
  const halls=[
    ['Burhani Hall',500,18000,'Our grandest hall featuring double-height ceilings, crystal chandeliers, and opulent Dawoodi Bohra community banquet seating.'],
    ['Tayyebi Hall',350,15000,'Elegant mid-size hall with a spacious dining area, ambient lighting, and dedicated stage acoustics.'],
    ['Mohammedi Hall',300,12000,'Comfortable hall suited to family celebrations, festive nikah gatherings, and receptions.'],
    ['Hakimi Hall',200,10000,'Warm, intimate boutique hall for solemn nikah ceremonies, engagements, and private community dinners.'],
    ['Tayyebi 2nd Floor',150,8000,'Compact upper-floor hall for family majlis, milad dinners, and smaller celebrations.']
  ].map((h,i)=>({
    id:'h'+(i+1),
    name:h[0],
    capacity:h[1],
    description:h[3],
    enabled:true,
    image: DEFAULT_HALL_IMAGES['h'+(i+1)] || '/images/halls/burhani.jpg',
    amenities:['Central Air Conditioning','Spacious Thaali Dining Hall','Crystal Chandeliers & Lighting','Integrated High-Fidelity Audio','Bridal & Family Suite','Dedicated Valet & Parking'],
    prices:{morning:h[2],afternoon:h[2]+1000,evening:h[2]+2000}
  }));
  const names=['Mustafa Saifee','Fatema Bhaiji','Hussain Nagpurwala','Zainab Kapadia','Abbas Ladha'];
  const members=names.map((n,i)=>({id:'m'+(i+1),itsNumber:'4001000'+(i+1),name:n,contactNumber:'98765000'+pad(i+11),accountStatus:i===4?'Inactive':'Active'}));
  const creds={};members.forEach(m=>creds[m.id]=hash('member123'));
  const settings={advancePct:25,holdMinutes:10,
    slots:[{id:'morning',name:'Morning',start:'08:00',end:'12:00'},{id:'afternoon',name:'Afternoon',start:'12:30',end:'16:30'},{id:'evening',name:'Evening',start:'18:00',end:'23:00'}],
    policy:'Advance is refundable only if cancelled at least 30 days before the event (demo policy).',
    instructions:'Please carry your ITS card on the event day. Slots are held for a limited time during checkout.',
    contact:'Jamaat Office · +91 90000 00000 · office@jamaat.demo',adminName:'Demo Administrator'};
  const mk=(n,mi,hall,date,slot,st,pay,guests,ev)=>{const h=halls.find(x=>x.id===hall);const total=h.prices[slot];const adv=Math.round(total*.25);
    return {id:'b'+n,bookingReference:'JKB-'+(1000+n),memberId:'m'+mi,itsNumber:members[mi-1].itsNumber,hallId:hall,bookingDate:date,slotId:slot,eventType:ev,guestCount:guests,contactNumber:members[mi-1].contactNumber,notes:'',adminNotes:'',
      totalAmount:total,advanceAmount:adv,paidAmount:pay==='Paid'?adv:0,remainingAmount:total-(pay==='Paid'?adv:0),bookingStatus:st,paymentStatus:pay,createdAt:new Date(now()-n*864e5).toISOString(),holdExpiresAt:null}};
  const bookings=[mk(1,1,'h1',plus(5),'morning','Confirmed','Paid',400,'Wedding'),mk(2,2,'h1',plus(5),'afternoon','Confirmed','Paid',350,'Wedding'),mk(3,3,'h1',plus(5),'evening','Confirmed','Paid',300,'Reception'),
    mk(4,1,'h2',plus(8),'evening','Confirmed','Paid',250,'Wedding'),mk(5,2,'h3',plus(9),'morning','Confirmed','Paid',200,'Nikah'),mk(6,3,'h4',plus(12),'afternoon','Cancelled','Paid',120,'Engagement'),mk(7,4,'h1',plus(14),'morning','Expired','Unpaid',100,'Wedding')];
  const payments=bookings.filter(b=>b.paidAmount>0).map((b,i)=>({id:'p'+i,reference:'PAY-DEMO-'+(100+i),bookingId:b.id,bookingReference:b.bookingReference,memberName:members.find(m=>m.id===b.memberId).name,itsNumber:b.itsNumber,amount:b.paidAmount,method:'UPI',status:'Paid',type:'Simulated advance',createdAt:b.createdAt}));
  return {v:1,halls,members,creds,admin:{email:'admin@ameroids.demo',hash:hash('admin123')},bookings,payments,blocks:[{id:'bl1',hallId:'h2',date:plus(3),slotId:null,reason:'Maintenance'}],audit:[],settings,session:{member:null,admin:false}};
}
let state;const subs=new Set();
function load(){
  try{
    const s=JSON.parse(localStorage.getItem(KEY));
    if(s&&s.v===1&&s.halls&&s.bookings){
      // Ensure halls have modern authentic hall images
      s.halls.forEach((h, i) => {
        if(!h.image || h.image.includes('unsplash.com')) {
          h.image = DEFAULT_HALL_IMAGES[h.id] || DEFAULT_HALL_IMAGES['h'+((i%5)+1)];
        }
      });
      return s;
    }
  }catch{}
  return seed()
}
state=load();
const commit=()=>{state={...state};try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}subs.forEach(f=>f())};
commit();
export const useDB=()=>useSyncExternalStore(f=>{subs.add(f);return()=>subs.delete(f)},()=>state);
const audit=(a,d)=>state.audit.unshift({id:uid('A'),action:a,detail:d,at:new Date().toISOString()});

export function sweep(){let ch=false;state.bookings.forEach(b=>{if(b.bookingStatus==='Pending Payment'&&b.holdExpiresAt&&b.holdExpiresAt<now()){b.bookingStatus='Expired';ch=true}});if(ch)commit()}

export function memberLogin(its,pw){const m=state.members.find(x=>x.itsNumber===its.trim());
  if(!m||state.creds[m.id]!==hash(pw))throw new Error('Invalid ITS number or password.');
  if(m.accountStatus!=='Active')throw new Error('This account is inactive. Please contact the office.');
  state.session={...state.session,member:m.id};commit()}
export function adminLogin(email,pw){if(email.trim().toLowerCase()!==state.admin.email||hash(pw)!==state.admin.hash)throw new Error('Invalid admin credentials.');state.session={...state.session,admin:true};commit()}
export const logout=k=>{state.session={...state.session,[k]:k==='admin'?false:null};commit()};

export const slotStatus=(s,hallId,date,slotId)=>{
  const h=s.halls.find(x=>x.id===hallId);if(!h||!h.enabled||date<today())return'blocked';
  if(s.blocks.some(b=>b.hallId===hallId&&b.date===date&&(!b.slotId||b.slotId===slotId)))return'blocked';
  const b=s.bookings.find(b=>b.hallId===hallId&&b.bookingDate===date&&b.slotId===slotId&&(b.bookingStatus==='Confirmed'||(b.bookingStatus==='Pending Payment'&&b.holdExpiresAt>now())));
  return b?(b.bookingStatus==='Confirmed'?'booked':'held'):'free'};
export const dayStatus=(s,hallId,date)=>{if(date<today())return'grey';const st=s.settings.slots.map(x=>slotStatus(s,hallId,date,x.id));
  const free=st.filter(x=>x==='free').length;if(st.every(x=>x==='blocked'))return'grey';if(free===st.length)return'green';return free===0?'red':'yellow'};

export function startCheckout(memberId,f){sweep();const s=state,h=s.halls.find(x=>x.id===f.hallId),m=s.members.find(x=>x.id===memberId);
  if(!h||!m)throw new Error('Invalid request.');
  if(!(f.guestCount>=1)||f.guestCount>h.capacity)throw new Error(`Guest count must be between 1 and ${h.capacity}.`);
  const mine=s.bookings.find(b=>b.memberId===memberId&&b.hallId===f.hallId&&b.bookingDate===f.date&&b.slotId===f.slotId&&b.bookingStatus==='Pending Payment'&&b.holdExpiresAt>now());
  if(mine){mine.holdExpiresAt=now()+s.settings.holdMinutes*6e4;commit();return mine}
  if(slotStatus(s,f.hallId,f.date,f.slotId)!=='free')throw new Error('Sorry, this slot is no longer available. Please choose another.');
  const total=h.prices[f.slotId],adv=Math.round(total*s.settings.advancePct/100);
  const b={id:uid('b'),bookingReference:'JKB-'+Math.floor(10000+Math.random()*89999),memberId,itsNumber:m.itsNumber,hallId:h.id,bookingDate:f.date,slotId:f.slotId,eventType:f.eventType,guestCount:+f.guestCount,contactNumber:f.contact,notes:f.notes||'',adminNotes:'',
    totalAmount:total,advanceAmount:adv,paidAmount:0,remainingAmount:total,bookingStatus:'Pending Payment',paymentStatus:'Unpaid',createdAt:new Date().toISOString(),holdExpiresAt:now()+s.settings.holdMinutes*6e4};
  s.bookings.unshift(b);m.contactNumber=f.contact||m.contactNumber;commit();return b}
const addPay=(b,amount,method,status,type,customRef)=>{const m=state.members.find(x=>x.id===b.memberId);const p={id:uid('p'),reference:customRef||(type==='Offline'?'OFF-':'PAY-DEMO-')+Math.random().toString(36).slice(2,9).toUpperCase(),bookingId:b.id,bookingReference:b.bookingReference,memberName:m.name,itsNumber:b.itsNumber,amount,method,status,type,createdAt:new Date().toISOString()};state.payments.unshift(p);return p};
const recalc=b=>{b.remainingAmount=Math.max(0,b.totalAmount-b.paidAmount);b.paymentStatus=b.paidAmount>=b.advanceAmount?'Paid':b.paidAmount>0?'Partially Paid':b.paymentStatus==='Failed'?'Failed':'Unpaid'};
export function pay(id,method,ok,customRef){sweep();const b=state.bookings.find(x=>x.id===id);if(!b)throw new Error('Booking not found.');
  if(b.paymentStatus==='Paid'&&b.bookingStatus==='Confirmed')return b;
  if(b.bookingStatus!=='Pending Payment'||b.holdExpiresAt<now())throw new Error('Your slot hold expired. Please select a slot again.');
  if(state.bookings.some(x=>x.id!==b.id&&x.bookingStatus==='Confirmed'&&x.hallId===b.hallId&&x.bookingDate===b.bookingDate&&x.slotId===b.slotId))throw new Error('This slot was just booked by someone else.');
  const payType = customRef?.startsWith('pay_') ? 'Razorpay Test' : 'Simulated advance';
  if(!ok){addPay(b,b.advanceAmount,method,'Failed',payType,customRef);b.paymentStatus='Failed';commit();throw new Error('Payment was not completed. You can retry while your hold is valid.')}
  addPay(b,b.advanceAmount,method,'Paid',payType,customRef);b.paidAmount+=b.advanceAmount;b.bookingStatus='Confirmed';b.holdExpiresAt=null;recalc(b);commit();return b}
export function cancel(id,{refund=false,by='member'}={}){const b=state.bookings.find(x=>x.id===id);if(!b||['Cancelled','Expired'].includes(b.bookingStatus))return;
  b.bookingStatus='Cancelled';b.holdExpiresAt=null;
  if(refund&&b.paidAmount>0){addPay(b,-b.paidAmount,'—','Refunded','Refund');b.paidAmount=0;b.paymentStatus='Refunded';b.remainingAmount=0}
  audit('Booking cancelled',`${b.bookingReference} by ${by}${refund?' with refund':''}`);commit()}
export function offlinePay(id,amount){const b=state.bookings.find(x=>x.id===id);amount=+amount;if(!b||!(amount>0)||b.bookingStatus==='Cancelled')throw new Error('Cannot record this payment.');
  addPay(b,amount,'Offline','Paid','Offline');b.paidAmount+=amount;recalc(b);if(b.bookingStatus==='Pending Payment'&&b.paidAmount>=b.advanceAmount){b.bookingStatus='Confirmed';b.holdExpiresAt=null}
  audit('Offline payment',`${b.bookingReference} ${fmt(amount)}`);commit()}
export const setNote=(id,t)=>{const b=state.bookings.find(x=>x.id===id);b.adminNotes=t;audit('Note updated',b.bookingReference);commit()};

export const saveHall=h=>{const i=state.halls.findIndex(x=>x.id===h.id);if(i<0)state.halls.push(h);else state.halls[i]=h;audit('Hall saved',h.name);commit()};
export const newHall=()=>({id:uid('h'),name:'New Hall',capacity:100,description:'',enabled:true,image:'',amenities:[],prices:{morning:5000,afternoon:6000,evening:7000}});
export function saveMember(m){if(state.members.some(x=>x.id!==m.id&&x.itsNumber===m.itsNumber))throw new Error('ITS number must be unique.');
  const i=state.members.findIndex(x=>x.id===m.id);if(i<0){state.members.push(m);state.creds[m.id]=hash('member123')}else state.members[i]=m;audit('Member saved',m.itsNumber);commit()}
export const addBlock=b=>{state.blocks.push({id:uid('bl'),...b});audit('Slot blocked',`${b.hallId} ${b.date}`);commit()};
export const removeBlock=id=>{state.blocks=state.blocks.filter(b=>b.id!==id);commit()};
export const saveSettings=s=>{state.settings=s;audit('Settings saved','');commit()};
export const resetDemo=()=>{state=seed();commit()};
export const toCSV=rows=>{if(!rows.length)return'';const k=Object.keys(rows[0]);return[k.join(','),...rows.map(r=>k.map(c=>`"${String(r[c]??'').replace(/"/g,'""')}"`).join(','))].join('\n')};
export const download=(name,text)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download=name;a.click()};
export const updateContact=(id,c)=>{const m=state.members.find(x=>x.id===id);if(m){m.contactNumber=c;commit()}};
