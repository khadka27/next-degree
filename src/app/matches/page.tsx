"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

/* ─── Types ─── */
interface Form { country:string;degree:string;field:string;program:string;testType:string;testScore:string;budget:string;currency:string;scholarship:boolean;name:string;gpa:string; }
interface Match { id:string|number;name:string;location?:string;tuitionFee?:number;feeBand?:string|null;englishReq?:number;website?:string;admissionRate?:number;rankingWorld?:number;scholarships?:{name:string;value:string}[]; }

/* ─── Data ─── */
const COUNTRIES=[
  {code:"CA",flag:"🇨🇦",name:"Canada",     city:"Toronto",   c:"#ef4444"},
  {code:"USA",flag:"🇺🇸",name:"U.S.A.",     city:"New York",  c:"#3b82f6"},
  {code:"AU",flag:"🇦🇺",name:"Australia",  city:"Sydney",    c:"#10b981"},
  {code:"UK",flag:"🇬🇧",name:"U.K.",        city:"London",    c:"#8b5cf6"},
  {code:"DE",flag:"🇩🇪",name:"Germany",    city:"Berlin",    c:"#f59e0b"},
  {code:"IE",flag:"🇮🇪",name:"Ireland",    city:"Dublin",    c:"#06b6d4"},
  {code:"NL",flag:"🇳🇱",name:"Netherlands",city:"Amsterdam", c:"#ec4899"},
];
const DEGREES=[
  {v:"foundation",l:"Foundation",     s:"Pre-university prep",    e:"📖"},
  {v:"diploma",   l:"Diploma",        s:"Vocational training",    e:"📋"},
  {v:"bachelor",  l:"Bachelor's",     s:"3–4 yr undergraduate",   e:"📚"},
  {v:"master",    l:"Master's / PG",  s:"Postgraduate study",     e:"🎓"},
  {v:"phd",       l:"PhD / Doctorate",s:"Research programs",      e:"🔬"},
];
const FIELDS=["Business & Management","Computer Science & IT","Engineering","Medicine & Health Sciences","Law","Arts & Humanities","Data Science & Analytics","Architecture & Design","Social Sciences","Natural Sciences","Education","Other"];
const PROGRAMS:Record<string,string[]>={"Business & Management":["MBA","Finance","Marketing","Accounting","Economics"],"Computer Science & IT":["Software Engineering","Cybersecurity","AI & ML","Data Engineering","Web Dev"],"Engineering":["Mechanical","Civil","Electrical","Chemical","Aerospace"],"Medicine & Health Sciences":["Medicine","Nursing","Pharmacy","Public Health","Physiotherapy"],"Law":["LLB","LLM","Criminal Law","Corporate Law","International Law"],"Arts & Humanities":["English Lit","History","Philosophy","Fine Arts","Music"],"Data Science & Analytics":["Data Science","Business Analytics","Statistics","Machine Learning"],"Architecture & Design":["Architecture","Interior Design","Urban Planning","Graphic Design"],"Social Sciences":["Psychology","Sociology","Political Science","International Relations"],"Natural Sciences":["Biology","Chemistry","Physics","Environmental Science"],"Education":["Primary Education","Secondary Education","TESOL"],"Other":["Other / Not Listed"]};
const TESTS=["IELTS","TOEFL","PTE","Duolingo","Cambridge"];
const CURRENCIES=["USD","GBP","AUD","CAD","EUR","NPR"];
const STEPS=[
  {n:"01",label:"Destination",   title:"Where to\nstudy?",           grad:"135deg,#4f46e5,#7c3aed"},
  {n:"02",label:"Study Level",   title:"Your degree\nlevel?",         grad:"135deg,#0284c7,#4f46e5"},
  {n:"03",label:"Field",         title:"What will\nyou study?",       grad:"135deg,#059669,#0284c7"},
  {n:"04",label:"English",       title:"English\nproficiency?",       grad:"135deg,#d97706,#dc2626"},
  {n:"05",label:"Budget",        title:"Annual\nbudget?",             grad:"135deg,#7c3aed,#db2777"},
  {n:"06",label:"Profile",       title:"Final\ndetails!",             grad:"135deg,#0284c7,#059669"},
  {n:"07",label:"Results",       title:"Your\nmatches!",              grad:"135deg,#4f46e5,#7c3aed"},
];
const DEF:Form={country:"",degree:"",field:"",program:"",testType:"IELTS",testScore:"",budget:"",currency:"USD",scholarship:false,name:"",gpa:""};

/* ─── Helpers ─── */
const fmtCur=(n:number,c="USD")=>new Intl.NumberFormat("en-US",{style:"currency",currency:c,maximumFractionDigits:0}).format(n);
function getBand(s:string,t:string){const n=parseFloat(s);if(!n)return null;if(t==="IELTS"){if(n>=8)return{l:"Expert",c:"#10b981"};if(n>=7)return{l:"Good",c:"#3b82f6"};if(n>=6)return{l:"Competent",c:"#f59e0b"};return{l:"Developing",c:"#ef4444"};}if(t==="TOEFL"){if(n>=100)return{l:"Expert",c:"#10b981"};if(n>=87)return{l:"Good",c:"#3b82f6"};if(n>=72)return{l:"Competent",c:"#f59e0b"};return{l:"Developing",c:"#ef4444"};}return{l:"Submitted",c:"#8b5cf6"};}

/* ─── Compact Search Select ─── */
function SS({ph,opts,val,set}:{ph:string;opts:string[];val:string;set:(v:string)=>void}){
  const [q,setQ]=useState("");const [open,setOpen]=useState(false);
  const list=useMemo(()=>opts.filter(o=>o.toLowerCase().includes(q.toLowerCase())),[opts,q]);
  return(
    <div style={{position:"relative",zIndex:open?100:1}}>
      <div onClick={()=>{setOpen(true);setQ("");}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:12,border:`1.5px solid ${open||val?"#6366f1":"#e2e8f0"}`,background:val?"#f8f7ff":"#f8fafc",cursor:"pointer",transition:"all .2s"}}>
        <span style={{fontSize:13}}>{val?"✅":"🔍"}</span>
        <span style={{flex:1,fontSize:13,color:val?"#4f46e5":"#94a3b8",fontWeight:val?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{val||ph}</span>
        {val&&<button onMouseDown={e=>{e.stopPropagation();set("");}} style={{fontSize:12,color:"#94a3b8",background:"none",border:"none",padding:0,lineHeight:1,cursor:"pointer"}}>✕</button>}
        <span style={{fontSize:11,color:"#94a3b8",transform:open?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>▾</span>
      </div>
      {open&&<>
        <div style={{position:"fixed",inset:0,zIndex:98}} onClick={()=>setOpen(false)}/>
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",borderRadius:14,boxShadow:"0 16px 48px rgba(0,0,0,.15)",border:"1px solid #e8ecf4",zIndex:200,overflow:"hidden"}}>
          <div style={{padding:"8px 10px",borderBottom:"1px solid #f1f5f9"}}>
            <input autoFocus value={q} placeholder="Search..." onChange={e=>setQ(e.target.value)} style={{width:"100%",padding:"7px 12px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div style={{maxHeight:160,overflowY:"auto"}}>
            {list.slice(0,20).map(o=>(
              <button key={o} onMouseDown={()=>{set(o);setOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:val===o?"#eef2ff":"transparent",color:val===o?"#6366f1":"#374151",fontWeight:val===o?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit",borderBottom:"1px solid #fafafa"}}>
                {val===o&&"✓ "}{o}
              </button>
            ))}
            {list.length===0&&<p style={{padding:"10px 14px",color:"#94a3b8",fontSize:13,margin:0}}>No results</p>}
          </div>
        </div>
      </>}
    </div>
  );
}

/* ─── Match Card ─── */
function MC({m,c}:{m:Match;c:string}){
  return(
    <div style={{background:"#fff",borderRadius:16,border:"1.5px solid #e8ecf4",padding:"14px 16px",display:"flex",flexDirection:"column",gap:8,boxShadow:"0 2px 12px rgba(0,0,0,.05)",flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <p style={{margin:0,fontWeight:700,fontSize:13,color:"#0f172a",lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{m.name}</p>
          {m.location&&<p style={{margin:"2px 0 0",fontSize:11,color:"#94a3b8"}}>📍 {m.location}</p>}
        </div>
        <span style={{fontSize:10,fontWeight:700,color:"#059669",background:"#ecfdf5",border:"1px solid #6ee7b7",borderRadius:99,padding:"3px 8px",flexShrink:0}}>✓ Match</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap" as const,gap:5}}>
        {m.tuitionFee&&<span style={{fontSize:11,fontWeight:600,color:"#6366f1",background:"#eef2ff",borderRadius:6,padding:"3px 8px"}}>💰 {fmtCur(m.tuitionFee,c)}/yr</span>}
        {!m.tuitionFee&&m.feeBand&&<span style={{fontSize:11,fontWeight:600,color:"#6366f1",background:"#eef2ff",borderRadius:6,padding:"3px 8px",textTransform:"capitalize" as const}}>💰 {m.feeBand}</span>}
        {!!m.englishReq&&<span style={{fontSize:11,fontWeight:600,color:"#d97706",background:"#fffbeb",borderRadius:6,padding:"3px 8px"}}>📝 {m.englishReq}+</span>}
        {m.admissionRate!=null&&<span style={{fontSize:11,fontWeight:600,color:"#be185d",background:"#fdf2f8",borderRadius:6,padding:"3px 8px"}}>🎯 {Math.round(m.admissionRate*100)}%</span>}
        {m.rankingWorld&&<span style={{fontSize:11,fontWeight:600,color:"#059669",background:"#ecfdf5",borderRadius:6,padding:"3px 8px"}}>🏆 #{m.rankingWorld}</span>}
        {!!m.scholarships?.length&&<span style={{fontSize:11,fontWeight:600,color:"#b45309",background:"#fefce8",borderRadius:6,padding:"3px 8px"}}>🎓 {m.scholarships.length}</span>}
      </div>
      {m.website&&<a href={m.website} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#6366f1",fontWeight:600,textDecoration:"none"}}>Visit →</a>}
    </div>
  );
}

/* ─── Main ─── */
export default function MatchesPage(){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState<Form>(DEF);
  const [matches,setMatches]=useState<Match[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  function sf<K extends keyof Form>(k:K,v:Form[K]){setForm(p=>({...p,[k]:v}));}
  async function search(){
    setLoading(true);setError("");setMatches([]);
    try{const qs=new URLSearchParams({country:form.country,budget:form.budget||"0",englishScore:form.testScore||"0",degreeLevel:form.degree});const r=await fetch(`/api/matches?${qs}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);const d=await r.json();setMatches(d.matches||[]);}
    catch(e:unknown){setError((e as Error).message);}finally{setLoading(false);}
  }
  const ok=()=>[!!form.country,!!form.degree,!!form.field,!!form.testScore,!!form.budget,!!form.name][step]??true;
  function next(){if(step<5)setStep(s=>s+1);else{setStep(6);search();}}
  const s=STEPS[Math.min(step,6)];
  const band=getBand(form.testScore,form.testType);
  const progs=form.field?PROGRAMS[form.field]||[]:[];
  const selC=COUNTRIES.find(c=>c.code===form.country);

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *,::before,::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;height:100%;overflow:hidden;}
        @keyframes fadeSlide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .anim{animation:fadeSlide .25s ease both;}
        .cc{transition:all .15s;cursor:pointer;} .cc:hover{transform:translateY(-2px);border-color:#6366f1!important;box-shadow:0 6px 20px rgba(99,102,241,.15)!important;}
        .opt{transition:all .15s;cursor:pointer;} .opt:hover{background:#f0f4ff!important;border-color:#a5b4fc!important;}
        button{cursor:pointer;font-family:inherit;}
        input{font-family:inherit;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:#c7d2fe;border-radius:4px}
        @media(max-width:700px){.split{flex-direction:column!important;}.left-col{min-height:auto!important;max-height:170px!important;padding:20px!important;}.right-col{flex:1!important;}}
      `}</style>

      {/* ── Full viewport, no outer scroll ── */}
      <div className="split" style={{display:"flex",height:"100vh",width:"100vw",overflow:"hidden"}}>

        {/* ══ LEFT PANEL ══ */}
        <div className="left-col" style={{width:260,flexShrink:0,background:`linear-gradient(${s.grad})`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"28px 24px",position:"relative",overflow:"hidden"}}>
          {/* BG circles */}
          <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
          <div style={{position:"absolute",bottom:-60,left:-30,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>

          {/* Top: step label */}
          <div style={{position:"relative"}}>
            <span style={{fontSize:10,fontWeight:800,letterSpacing:"0.14em",color:"rgba(255,255,255,.6)",textTransform:"uppercase" as const}}>Step {s.n} / 07</span>
            {/* Progress pills */}
            <div style={{display:"flex",gap:3,marginTop:8}}>
              {STEPS.map((_,i)=>(
                <div key={i} style={{height:3,borderRadius:99,flex:i===step?2:1,background:i<=step?"rgba(255,255,255,.9)":"rgba(255,255,255,.2)",transition:"all .4s"}}/>
              ))}
            </div>
          </div>

          {/* Middle: title */}
          <div style={{position:"relative"}}>
            <p style={{margin:"0 0 4px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.55)",textTransform:"uppercase" as const,letterSpacing:"0.1em"}}>{s.label}</p>
            <h2 style={{margin:0,fontSize:26,fontWeight:900,color:"#fff",lineHeight:1.2,whiteSpace:"pre-line" as const}}>{s.title}</h2>
          </div>

          {/* Bottom: selected chips */}
          <div style={{position:"relative",display:"flex",flexDirection:"column",gap:6}}>
            {selC&&step>0&&<Chip>{selC.flag} {selC.name}</Chip>}
            {form.degree&&step>1&&<Chip>🎓 {DEGREES.find(d=>d.v===form.degree)?.l}</Chip>}
            {form.field&&step>2&&<Chip>📚 {form.field.split(" ")[0]}</Chip>}
            {form.testScore&&step>3&&<Chip>📝 {form.testType} {form.testScore}</Chip>}
            {form.budget&&step>4&&<Chip>💰 {form.currency} {Number(form.budget).toLocaleString()}</Chip>}
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="right-col" style={{flex:1,display:"flex",flexDirection:"column",background:"#fff",overflow:"hidden"}}>

          {/* ── HEADER ── */}
          <div style={{padding:"14px 24px 12px",borderBottom:"1px solid #f1f5f9",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            {/* Back / Home button — always visible */}
            {step===0
              ?<Link href="/" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:"#64748b",textDecoration:"none",padding:"6px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",transition:"all .2s"}} onMouseOver={e=>{const t=e.currentTarget;t.style.background="#eef2ff";t.style.color="#6366f1";t.style.borderColor="#a5b4fc";}} onMouseOut={e=>{const t=e.currentTarget;t.style.background="#f8fafc";t.style.color="#64748b";t.style.borderColor="#e2e8f0";}}>← Home</Link>
              :<button onClick={()=>setStep(p=>p-1)} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:"#64748b",padding:"6px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",transition:"all .2s"}} onMouseOver={e=>{const t=e.currentTarget;t.style.background="#eef2ff";t.style.color="#6366f1";t.style.borderColor="#a5b4fc";}} onMouseOut={e=>{const t=e.currentTarget;t.style.background="#f8fafc";t.style.color="#64748b";t.style.borderColor="#e2e8f0";}}>← Back</button>}
            <div style={{textAlign:"center" as const}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:800,color:"#0f172a"}}>{s.label}</h3>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:"#94a3b8",background:"#f1f5f9",borderRadius:99,padding:"3px 10px"}}>{step+1}/7</span>
          </div>

          {/* ── CONTENT (no outer scroll, each step is self-contained) ── */}
          <div className="anim" key={step} style={{flex:1,overflow:step===6?"auto":"hidden",padding:step===6?"16px 24px":"16px 24px 0",display:"flex",flexDirection:"column",gap:10,minHeight:0}}>

            {/* STEP 0 — Countries */}
            {step===0&&(
              <>
                <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:500}}>Pick your preferred study destination:</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,flex:1,alignContent:"start"}}>
                  {COUNTRIES.map(c=>{
                    const sel=form.country===c.code;
                    return(
                      <button key={c.code} className="cc" onClick={()=>sf("country",c.code)}
                        style={{background:sel?`${c.c}12`:"#f8fafc",border:`2px solid ${sel?c.c:"#e8ecf4"}`,borderRadius:16,padding:"14px 8px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,position:"relative",boxShadow:sel?`0 4px 16px ${c.c}30`:"0 1px 4px rgba(0,0,0,.04)"}}>
                        {sel&&<span style={{position:"absolute",top:-7,right:-7,width:18,height:18,borderRadius:"50%",background:c.c,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</span>}
                        <span style={{fontSize:26,lineHeight:1}}>{c.flag}</span>
                        <p style={{margin:0,fontSize:11,fontWeight:sel?700:600,color:sel?c.c:"#374151",textAlign:"center" as const,lineHeight:1.2}}>{c.name}</p>
                        <p style={{margin:0,fontSize:10,color:"#94a3b8"}}>{c.city}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* STEP 1 — Degree */}
            {step===1&&(
              <>
                <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:500}}>Choose your qualification level:</p>
                <div style={{display:"flex",flexDirection:"column",gap:7,flex:1,justifyContent:"center"}}>
                  {DEGREES.map(d=>{
                    const sel=form.degree===d.v;
                    return(
                      <button key={d.v} className="opt" onClick={()=>sf("degree",d.v)}
                        style={{background:sel?"#eef2ff":"#f8fafc",border:`1.5px solid ${sel?"#6366f1":"#e8ecf4"}`,borderRadius:14,padding:"11px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:sel?"0 2px 12px rgba(99,102,241,.12)":"none"}}>
                        <span style={{fontSize:20,flexShrink:0}}>{d.e}</span>
                        <div style={{flex:1,textAlign:"left" as const}}>
                          <p style={{margin:0,fontSize:13,fontWeight:sel?700:600,color:sel?"#4f46e5":"#1e293b"}}>{d.l}</p>
                          <p style={{margin:"1px 0 0",fontSize:11,color:"#94a3b8"}}>{d.s}</p>
                        </div>
                        <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${sel?"#6366f1":"#d1d5db"}`,background:sel?"#6366f1":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {sel&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2 2L8 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* STEP 2 — Field */}
            {step===2&&(
              <>
                <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:500}}>Select your field and specific program:</p>
                <SS ph="Select a field of study" opts={FIELDS} val={form.field} set={v=>{sf("field",v);sf("program","");}}/>
                {form.field&&<SS ph="Select a program (optional)" opts={progs} val={form.program} set={v=>sf("program",v)}/>}
                {!form.field&&(
                  <div>
                    <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 8px",fontWeight:600,textTransform:"uppercase" as const,letterSpacing:"0.06em"}}>Popular fields</p>
                    <div style={{display:"flex",flexWrap:"wrap" as const,gap:7}}>
                      {["Business","Computer Science","Engineering","Medicine","Law","Data Science"].map(t=>(
                        <button key={t} onClick={()=>sf("field",FIELDS.find(f=>f.toLowerCase().includes(t.toLowerCase()))||t)} style={{padding:"7px 13px",borderRadius:99,background:"#f0f4ff",border:"1.5px solid #e0e7ff",color:"#6366f1",fontWeight:600,fontSize:12,transition:"all .15s"}}>{t}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 3 — English */}
            {step===3&&(
              <>
                <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:500}}>Select test type and enter your score:</p>
                <div style={{display:"flex",flexWrap:"wrap" as const,gap:7}}>
                  {TESTS.map(t=>{const sel=form.testType===t;return<button key={t} onClick={()=>sf("testType",t)} style={{padding:"8px 16px",borderRadius:99,border:`2px solid ${sel?"#6366f1":"#e2e8f0"}`,background:sel?"#6366f1":"#f8fafc",color:sel?"#fff":"#64748b",fontWeight:sel?700:500,fontSize:13,transition:"all .15s",boxShadow:sel?"0 3px 10px rgba(99,102,241,.3)":"none"}}>{t}</button>;})}
                </div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>📝</span>
                  <input type="number" value={form.testScore} placeholder={form.testType==="IELTS"?"e.g. 6.5 (range 0–9)":"e.g. 90 (range 0–120)"} min="0" max={form.testType==="IELTS"?"9":"120"} step={form.testType==="IELTS"?"0.5":"1"} onChange={e=>sf("testScore",e.target.value)}
                    style={{width:"100%",padding:"12px 14px 12px 44px",borderRadius:12,border:"1.5px solid #e2e8f0",fontSize:14,color:"#0f172a",background:"#f8fafc",outline:"none",boxSizing:"border-box" as const,transition:"all .2s"}}
                    onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,.12)";e.target.style.background="#f8f7ff";}}
                    onBlur={e=>{e.target.style.borderColor="#e2e8f0";e.target.style.boxShadow="none";e.target.style.background="#f8fafc";}}
                  />
                </div>
                {band&&<span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:band.c,background:`${band.c}15`,border:`1.5px solid ${band.c}40`,borderRadius:99,padding:"5px 14px",width:"fit-content"}}><span style={{width:7,height:7,borderRadius:"50%",background:band.c,display:"inline-block",boxShadow:`0 0 6px ${band.c}`}}/>{band.l} proficiency</span>}
                <div style={{background:"#f8fafc",borderRadius:12,padding:"10px 14px",border:"1px solid #e8ecf4"}}>
                  <p style={{margin:0,fontSize:12,color:"#64748b",lineHeight:1.6}}>💡 <strong style={{color:"#374151"}}>No score yet?</strong> Enter your expected score — we'll still find matching universities.</p>
                </div>
              </>
            )}

            {/* STEP 4 — Budget */}
            {step===4&&(
              <>
                <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:500}}>Set your maximum annual tuition budget:</p>
                <div style={{display:"flex",flexWrap:"wrap" as const,gap:6}}>
                  {CURRENCIES.map(c=>{const sel=form.currency===c;return<button key={c} onClick={()=>sf("currency",c)} style={{padding:"6px 14px",borderRadius:99,border:`2px solid ${sel?"#6366f1":"#e2e8f0"}`,background:sel?"#6366f1":"#f8fafc",color:sel?"#fff":"#64748b",fontWeight:sel?700:500,fontSize:12,transition:"all .15s"}}>{c}</button>;})}
                </div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>💰</span>
                  <input type="number" value={form.budget} placeholder={`Enter max tuition in ${form.currency}`} min="0" onChange={e=>sf("budget",e.target.value)}
                    style={{width:"100%",padding:"12px 14px 12px 44px",borderRadius:12,border:"1.5px solid #e2e8f0",fontSize:14,color:"#0f172a",background:"#f8fafc",outline:"none",boxSizing:"border-box" as const,transition:"all .2s"}}
                    onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,.12)";e.target.style.background="#f8f7ff";}}
                    onBlur={e=>{e.target.style.borderColor="#e2e8f0";e.target.style.boxShadow="none";e.target.style.background="#f8fafc";}}
                  />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {["10000","20000","30000","50000"].map(p=>(
                    <button key={p} onClick={()=>sf("budget",p)} style={{padding:"9px 0",borderRadius:11,border:`2px solid ${form.budget===p?"#6366f1":"#e2e8f0"}`,background:form.budget===p?"#eef2ff":"#f8fafc",color:form.budget===p?"#6366f1":"#64748b",fontWeight:700,fontSize:13,transition:"all .15s"}}>
                      {parseInt(p)/1000}K
                    </button>
                  ))}
                </div>
                <div onClick={()=>sf("scholarship",!form.scholarship)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderRadius:14,border:`2px solid ${form.scholarship?"#6366f1":"#e2e8f0"}`,background:form.scholarship?"#f8f7ff":"#f8fafc",cursor:"pointer",transition:"all .2s"}}>
                  <div>
                    <p style={{margin:0,fontWeight:700,fontSize:13,color:"#1e293b"}}>Open to scholarships?</p>
                    <p style={{margin:"2px 0 0",fontSize:11,color:"#94a3b8"}}>Include scholarship-eligible programs</p>
                  </div>
                  <div style={{width:44,height:24,borderRadius:12,background:form.scholarship?"#6366f1":"#d1d5db",position:"relative",transition:"background .25s",flexShrink:0}}>
                    <span style={{position:"absolute",top:3,left:form.scholarship?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .25s",display:"block",boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}/>
                  </div>
                </div>
              </>
            )}

            {/* STEP 5 — Profile */}
            {step===5&&(
              <>
                <p style={{fontSize:12,color:"#64748b",margin:0,fontWeight:500}}>Final step — personalise your results:</p>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>👤</span>
                  <input value={form.name} placeholder="Your full name" onChange={e=>sf("name",e.target.value)}
                    style={{width:"100%",padding:"13px 14px 13px 44px",borderRadius:12,border:"1.5px solid #e2e8f0",fontSize:14,color:"#0f172a",background:"#f8fafc",outline:"none",boxSizing:"border-box" as const,transition:"all .2s"}}
                    onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,.12)";e.target.style.background="#f8f7ff";}}
                    onBlur={e=>{e.target.style.borderColor="#e2e8f0";e.target.style.boxShadow="none";e.target.style.background="#f8fafc";}}
                  />
                </div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>📊</span>
                  <input type="number" value={form.gpa} placeholder="GPA / Grade (optional)" onChange={e=>sf("gpa",e.target.value)}
                    style={{width:"100%",padding:"13px 14px 13px 44px",borderRadius:12,border:"1.5px solid #e2e8f0",fontSize:14,color:"#0f172a",background:"#f8fafc",outline:"none",boxSizing:"border-box" as const,transition:"all .2s"}}
                    onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,.12)";e.target.style.background="#f8f7ff";}}
                    onBlur={e=>{e.target.style.borderColor="#e2e8f0";e.target.style.boxShadow="none";e.target.style.background="#f8fafc";}}
                  />
                </div>
                <div style={{background:"linear-gradient(135deg,#eef2ff,#f0fdf4)",borderRadius:14,padding:"14px 16px",border:"1px solid #e0e7ff"}}>
                  <p style={{margin:0,fontSize:13,color:"#475569",lineHeight:1.6}}><strong style={{color:"#6366f1"}}>✓ No account needed.</strong> We match you instantly using live government & education APIs. Nothing is stored.</p>
                </div>
              </>
            )}

            {/* STEP 6 — Results (only step that scrolls internally) */}
            {step===6&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {/* Summary */}
                <div style={{background:"linear-gradient(135deg,#6366f1,#7c3aed)",borderRadius:20,padding:"20px 22px",position:"relative",overflow:"hidden",flexShrink:0}}>
                  <div style={{position:"absolute",top:-24,right:-24,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
                  <p style={{margin:"0 0 2px",fontSize:11,color:"rgba(255,255,255,.65)",fontWeight:700,textTransform:"uppercase" as const,letterSpacing:"0.1em",position:"relative"}}>Your Results</p>
                  <p style={{margin:"0 0 14px",fontWeight:900,fontSize:22,color:"#fff",position:"relative"}}>{loading?"Scanning databases…":error?"Search failed":matches.length===0?"No matches found":`${matches.length} universities found 🎉`}</p>
                  <div style={{display:"flex",flexWrap:"wrap" as const,gap:6,position:"relative"}}>
                    {[selC?.flag+" "+selC?.name,`${form.testType} ${form.testScore}`,form.budget?`${form.currency} ${Number(form.budget).toLocaleString()}`:null,form.field?.split(" ")[0]].filter(Boolean).map((t,i)=>(
                      <span key={i} style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.9)",background:"rgba(255,255,255,.18)",borderRadius:99,padding:"3px 10px"}}>{t}</span>
                    ))}
                  </div>
                </div>
                {loading&&<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{width:44,height:44,border:"4px solid #e8ecf4",borderTopColor:"#6366f1",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 14px"}}/><p style={{color:"#6366f1",fontWeight:700,fontSize:14,margin:"0 0 4px"}}>Finding your universities…</p><p style={{color:"#94a3b8",fontSize:12}}>Querying live databases</p></div>}
                {error&&!loading&&<div style={{background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:14,padding:14}}><p style={{margin:0,color:"#ef4444",fontWeight:700,fontSize:13}}>⚠️ {error}</p></div>}
                {!loading&&matches.map(m=><MC key={m.id} m={m} c={form.currency}/>)}
                {!loading&&!error&&matches.length===0&&<div style={{textAlign:"center",padding:"32px",background:"#f8fafc",borderRadius:18}}><p style={{fontSize:32,margin:"0 0 8px"}}>🔍</p><p style={{fontWeight:800,color:"#1e293b",fontSize:16,margin:"0 0 4px"}}>No matches found</p><p style={{fontSize:13,color:"#94a3b8"}}>Try increasing budget or adjusting score.</p></div>}
                {!loading&&<div style={{display:"flex",gap:10}}>
                  <button onClick={()=>{setStep(4);setMatches([]);}} style={{flex:1,padding:"12px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontWeight:700,fontSize:14}}>← Refine</button>
                  <button onClick={()=>{setStep(0);setForm(DEF);setMatches([]);}} style={{flex:1,padding:"12px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#6366f1,#7c3aed)",color:"#fff",fontWeight:700,fontSize:14,boxShadow:"0 4px 14px rgba(99,102,241,.4)"}}>Start Over</button>
                </div>}
              </div>
            )}
          </div>

          {/* ── CTA ── */}
          {step<6&&(
            <div style={{padding:"12px 24px 20px",borderTop:"1px solid #f1f5f9",flexShrink:0,background:"#fff"}}>
              <button onClick={next} disabled={!ok()}
                style={{width:"100%",padding:"15px 0",borderRadius:16,border:"none",background:ok()?"linear-gradient(135deg,#6366f1,#7c3aed)":"#e8ecf4",color:ok()?"#fff":"#94a3b8",fontWeight:800,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:ok()?"0 8px 24px rgba(99,102,241,.4)":"none",transition:"all .2s",cursor:ok()?"pointer":"not-allowed"}}>
                <span>{step===5?"🚀":"→"}</span>
                {step===5?"Find My Universities":"Continue"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Chip({children}:{children:React.ReactNode}){
  return<div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.18)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:600,color:"#fff",width:"fit-content"}}>{children}</div>;
}
