import { useState, useRef, useEffect } from "react";

const COLORS = {
  blue: "#1FB6D6", blueDark: "#137A93", blueShadow: "#0E5A6E",
  yellow: "#FFD23F", yellowDark: "#C29A14",
  pink: "#FF7CA0", pinkDark: "#C25577",
  green: "#7FE0B1", greenDark: "#3DA876",
  bg: "#CDEEFB", ink: "#0B3956", inkMute: "#5D8AA8",
  white: "#FFFFFF",
};

const sticker = (shadow = "rgba(11,57,86,0.18)") => ({
  boxShadow: `0 4px 0 ${shadow}, 0 8px 18px rgba(11,57,86,0.10)`,
});

const CHARS = [
  { id:"david", name:"David", emoji:"🎵", color:"#1FB6D6", shadow:"#0E5A6E", bg:"#B8EEFA", desc:"El valiente pastor y rey", system:`Eres David, pastor y rey de la Biblia. Eres valiente, alegre y amas a Dios. Hablas con niños de forma cálida, sencilla y emocionante. Cuéntales sobre Goliat, ser pastor, los salmos. Termina siempre con un versículo o enseñanza bíblica. Responde en español. No inventes cosas fuera de la Biblia.` },
  { id:"moses", name:"Moisés", emoji:"🪨", color:"#FFD23F", shadow:"#C29A14", bg:"#FFF3B8", desc:"El líder del pueblo de Dios", system:`Eres Moisés, el líder que Dios usó para liberar a Israel. Eres sabio y obediente. Hablas con niños de forma sencilla y emocionante. Cuéntales sobre la zarza ardiente, el mar rojo, los 10 mandamientos. Termina siempre con un versículo o enseñanza bíblica. Responde en español.` },
  { id:"noah", name:"Noé", emoji:"🚢", color:"#7FE0B1", shadow:"#3DA876", bg:"#C8F5E2", desc:"Constructor del arca de Dios", system:`Eres Noé, el hombre justo que construyó el arca. Eres fiel y paciente. Hablas con niños de forma sencilla y divertida. Cuéntales el arca, los animales, el diluvio, el arcoíris. Termina siempre con un versículo o enseñanza bíblica. Responde en español.` },
  { id:"daniel", name:"Daniel", emoji:"🦁", color:"#B79EFF", shadow:"#7A5AE0", bg:"#EDE0FF", desc:"Fiel en el foso de los leones", system:`Eres Daniel, el joven hebreo que nunca dejó de orar. Eres valiente y fiel. Hablas con niños de forma sencilla y emocionante. Cuéntales el foso de los leones, tus oraciones, cómo Dios te protegió. Termina con un versículo o enseñanza bíblica. Responde en español.` },
  { id:"esther", name:"Ester", emoji:"👑", color:"#FF7CA0", shadow:"#C25577", bg:"#FFD6E3", desc:"La reina valiente de Dios", system:`Eres Ester, la valiente reina que salvó a su pueblo. Eres compasiva y obediente a Dios. Hablas con niños de forma cálida y sencilla. Cuéntales cómo fuiste reina, cómo salvaste a tu pueblo. Termina con un versículo o enseñanza bíblica. Responde en español.` },
  { id:"jesus", name:"Jesús", emoji:"✝️", color:"#FF9A7A", shadow:"#C25540", bg:"#FFE0D4", desc:"El Hijo de Dios", system:`Eres Jesús, el Hijo de Dios, lleno de amor y compasión. Hablas con niños de forma amorosa y sencilla. Cuéntales tus milagros, parábolas, el amor de Dios. Termina con una enseñanza o versículo. Responde en español.` },
];

const VERSES = [
  { text:"Todo lo puedo en Cristo que me fortalece.", ref:"Filipenses 4:13" },
  { text:"Dios es amor.", ref:"1 Juan 4:8" },
  { text:"El Señor es mi pastor, nada me faltará.", ref:"Salmo 23:1" },
  { text:"Confía en el Señor con todo tu corazón.", ref:"Proverbios 3:5" },
  { text:"Sé fuerte y valiente. No temas.", ref:"Josué 1:9" },
  { text:"Porque de tal manera amó Dios al mundo, que dio a su Hijo unigénito.", ref:"Juan 3:16" },
];

const PRAYERS = [
  { title:"Buenos días", emoji:"🌅", text:"Buenos días Señor, gracias por este nuevo día. Guíame, protégeme y ayúdame a ser bueno con todos. ¡Te amo Dios! Amén." },
  { title:"Buenas noches", emoji:"🌙", text:"Gracias Señor por este día. Perdóname si hice algo malo. Cuida a mi familia mientras dormimos. Amén." },
  { title:"Antes de comer", emoji:"🍽️", text:"Gracias Señor por los alimentos. Bendice esta comida y a quienes la prepararon. Amén." },
  { title:"Por mi familia", emoji:"👨‍👩‍👧", text:"Señor, cuida a mi mamá, mi papá y toda mi familia. Llénalos de tu amor y bendiciones. Amén." },
  { title:"Cuando tengo miedo", emoji:"🛡️", text:"Señor, a veces tengo miedo, pero sé que tú estás conmigo. Dame valentía y paz en mi corazón. Amén." },
];

const SUGG = {
  david:["¿Cómo venciste a Goliat?","¿Cómo eras de pastor?","Dame un salmo"],
  moses:["¿Cómo cruzaste el mar?","¿Hablaste con Dios?","¿Qué son los mandamientos?"],
  noah:["¿Cuántos animales había?","¿Cómo fue el diluvio?","¿Qué es el arcoíris de Dios?"],
  daniel:["¿Tenías miedo de los leones?","¿Por qué orabas tanto?","¿Cómo te protegió Dios?"],
  esther:["¿Cómo fuiste reina?","¿Cómo salvaste a tu pueblo?","¿Tenías miedo?"],
  jesus:["Cuéntame un milagro","Dame una parábola","¿Cómo es el cielo?"],
};

const FONT = '"Fredoka", "Quicksand", system-ui, sans-serif';

export default function App() {
  const [tab, setTab] = useState("home");
  const [char, setChar] = useState(null);
  const [age, setAge] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prayer, setPrayer] = useState(null);
  const [verse] = useState(VERSES[Math.floor(Math.random()*VERSES.length)]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const callAPI = async (character, history, userMsg, ageGroup) => {
    const ageNote = ageGroup === "3-5"
      ? "El niño tiene 3-5 años. Usa frases MUY cortas (máximo 3), palabras simples y emojis."
      : "El niño tiene 6-10 años. Sé detallado pero simple. Máximo 5 oraciones.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`${character.system}\n\n${ageNote}\nSé siempre positivo y apropiado para niños.`,
          messages:[...history,{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "¡Ups! Intenta de nuevo.";
    } catch { return "¡Ups! Hubo un problema. Intenta de nuevo."; }
  };

  const startChat = async (character, ageGroup) => {
    setChar(character); setAge(ageGroup); setMsgs([]); setLoading(true); setTab("chat");
    const ageDesc = ageGroup==="3-5" ? "muy pequeño (3-5 años), usa frases cortísimas con emojis" : "tiene 6-10 años";
    const greeting = await callAPI(character,[],`Saluda al niño emocionante y cálido. El niño ${ageDesc}. Preséntate brevemente y menciona algo interesante. Muy breve.`,ageGroup);
    setMsgs([{role:"assistant",content:greeting}]); setLoading(false);
  };

  const send = async (text) => {
    const msg=(text||input).trim(); if(!msg||loading) return;
    setInput("");
    const newMsgs=[...msgs,{role:"user",content:msg}]; setMsgs(newMsgs); setLoading(true);
    const reply = await callAPI(char, msgs.map(m=>({role:m.role,content:m.content})), msg, age);
    setMsgs([...newMsgs,{role:"assistant",content:reply}]); setLoading(false);
  };

  const Dots = () => (
    <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
      {[COLORS.blue,COLORS.yellow,COLORS.pink].map((c,i)=>(
        <div key={i} style={{width:8,height:8,borderRadius:"50%",background:c,...sticker(c)}}/>
      ))}
    </div>
  );

  const NavBar = () => (
    <div style={{display:"flex",background:COLORS.white,borderTop:`3px solid ${COLORS.bg}`,flexShrink:0}}>
      {[
        {id:"home",emoji:"🏠",label:"Inicio"},
        {id:"prayers",emoji:"🙏",label:"Oraciones"},
        {id:"verses",emoji:"📖",label:"Versículos"},
      ].map(({id,emoji,label})=>(
        <button key={id} onClick={()=>setTab(id)} style={{
          flex:1, padding:"10px 0 8px", border:"none",
          background: tab===id ? COLORS.bg : COLORS.white,
          cursor:"pointer", display:"flex", flexDirection:"column",
          alignItems:"center", gap:2, fontFamily:FONT,
          borderTop: tab===id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
          marginTop:-3,
        }}>
          <span style={{fontSize:22}}>{emoji}</span>
          <span style={{fontSize:11,fontWeight:600,color: tab===id ? COLORS.blue : COLORS.inkMute}}>{label}</span>
        </button>
      ))}
    </div>
  );

  // PRAYER DETAIL
  if (prayer) return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:COLORS.white,padding:"16px",display:"flex",alignItems:"center",gap:12,borderBottom:`3px solid ${COLORS.bg}`,flexShrink:0}}>
        <button onClick={()=>setPrayer(null)} style={{background:COLORS.bg,border:"none",borderRadius:12,width:40,height:40,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...sticker()}}>←</button>
        <span style={{fontWeight:600,fontSize:18,color:COLORS.ink}}>{prayer.emoji} {prayer.title}</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:80,marginBottom:24,filter:"drop-shadow(0 6px 0 rgba(11,57,86,0.15))"}}>{prayer.emoji}</div>
        <div style={{background:COLORS.white,borderRadius:28,padding:"28px 24px",...sticker(),maxWidth:360}}>
          <p style={{fontSize:18,lineHeight:1.8,color:COLORS.ink,margin:0,fontStyle:"italic"}}>"{prayer.text}"</p>
        </div>
        <button onClick={()=>setPrayer(null)} style={{marginTop:32,background:COLORS.blue,color:COLORS.white,border:"none",borderRadius:100,padding:"16px 36px",fontSize:18,cursor:"pointer",fontFamily:FONT,fontWeight:700,...sticker(COLORS.blueShadow)}}>🙏 Amén</button>
      </div>
    </div>
  );

  // AGE SELECT
  if (tab==="age" && char) return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:`radial-gradient(circle at 50% 20%, #FFF7C4 0%, ${COLORS.bg} 60%)`,fontFamily:FONT}}>
      <div style={{background:COLORS.white,padding:"16px",display:"flex",alignItems:"center",gap:12,borderBottom:`3px solid ${COLORS.bg}`,flexShrink:0}}>
        <button onClick={()=>setTab("home")} style={{background:COLORS.bg,border:"none",borderRadius:12,width:40,height:40,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...sticker()}}>←</button>
        <span style={{fontWeight:600,fontSize:18,color:COLORS.ink}}>¿Cuántos años tienes?</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:24}}>
        <div style={{width:110,height:110,borderRadius:32,background:char.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,...sticker(char.shadow)}}>
          {char.emoji}
        </div>
        <div style={{fontWeight:700,fontSize:24,color:COLORS.ink}}>¡Hola! Soy {char.name}</div>
        <div style={{display:"flex",gap:20,width:"100%",maxWidth:320}}>
          {["3-5","6-10"].map(a=>(
            <button key={a} onClick={()=>startChat(char,a)} style={{
              flex:1,background:COLORS.white,border:`3px solid ${char.color}`,
              borderRadius:24,padding:"24px 0",cursor:"pointer",textAlign:"center",
              fontFamily:FONT,transition:"transform 0.15s",...sticker(char.shadow),
            }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{fontSize:42,marginBottom:8}}>{a==="3-5"?"🌱":"⭐"}</div>
              <div style={{fontWeight:700,fontSize:26,color:char.color}}>{a}</div>
              <div style={{fontSize:12,color:COLORS.inkMute,marginTop:2}}>años</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // CHAT
  if (tab==="chat") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:"#f0faff",fontFamily:FONT}}>
      <div style={{background:char.color,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0,...sticker(char.shadow)}}>
        <button onClick={()=>setTab("home")} style={{background:"rgba(255,255,255,0.3)",border:"none",borderRadius:12,width:38,height:38,cursor:"pointer",fontSize:20,color:COLORS.white,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,...sticker("rgba(0,0,0,0.1)")}}>
          {char.emoji}
        </div>
        <div>
          <div style={{color:COLORS.white,fontWeight:700,fontSize:18}}>{char.name}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{age} años · Personaje bíblico</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.length===0 && loading && (
          <div style={{textAlign:"center",padding:"50px 0",color:COLORS.inkMute}}>
            <div style={{fontSize:60,marginBottom:12,filter:`drop-shadow(0 6px 0 ${char.shadow})`}}>{char.emoji}</div>
            <div style={{fontWeight:600,fontSize:16}}>{char.name} está listo para hablar...</div>
            <Dots/>
          </div>
        )}
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
            {m.role==="assistant" && (
              <div style={{width:40,height:40,borderRadius:12,background:char.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,...sticker(char.shadow)}}>{char.emoji}</div>
            )}
            <div style={{
              maxWidth:"74%",padding:"12px 16px",
              borderRadius:m.role==="user"?"20px 20px 4px 20px":"20px 20px 20px 4px",
              background:m.role==="user"?char.color:COLORS.white,
              color:m.role==="user"?COLORS.white:COLORS.ink,
              fontSize:15,lineHeight:1.55,
              ...sticker(m.role==="user"?char.shadow:"rgba(11,57,86,0.08)"),
              whiteSpace:"pre-wrap",
            }}>{m.content}</div>
            {m.role==="user" && (
              <div style={{width:36,height:36,borderRadius:"50%",background:COLORS.yellow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,...sticker(COLORS.yellowDark)}}>🧒</div>
            )}
          </div>
        ))}
        {loading && msgs.length>0 && (
          <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <div style={{width:40,height:40,borderRadius:12,background:char.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,...sticker(char.shadow)}}>{char.emoji}</div>
            <div style={{background:COLORS.white,borderRadius:"20px 20px 20px 4px",padding:"14px 18px",...sticker()}}>
              <div style={{display:"flex",gap:5}}>
                {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:char.color,opacity:0.7}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {msgs.length<=1 && !loading && (
        <div style={{padding:"8px 12px",display:"flex",gap:8,overflowX:"auto",background:"#f0faff",flexShrink:0}}>
          {SUGG[char.id].map((s,i)=>(
            <button key={i} onClick={()=>send(s)} style={{
              background:char.bg,border:`2px solid ${char.color}`,color:COLORS.ink,
              padding:"8px 14px",borderRadius:100,cursor:"pointer",fontSize:13,
              whiteSpace:"nowrap",fontFamily:FONT,fontWeight:600,flexShrink:0,
              ...sticker(char.shadow),
            }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{background:COLORS.white,borderTop:`3px solid ${COLORS.bg}`,padding:"12px 14px",display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder={`Pregúntale a ${char.name}...`}
          style={{flex:1,border:`2.5px solid ${char.color}`,borderRadius:100,padding:"12px 18px",fontSize:15,outline:"none",fontFamily:FONT,background:COLORS.bg,color:COLORS.ink,...sticker()}}
        />
        <button onClick={()=>send()} disabled={loading||!input.trim()} style={{
          width:50,height:50,borderRadius:"50%",background:loading||!input.trim()?COLORS.inkMute:char.color,
          border:"none",cursor:loading||!input.trim()?"not-allowed":"pointer",
          fontSize:22,opacity:loading||!input.trim()?0.4:1,
          ...sticker(loading||!input.trim()?"rgba(0,0,0,0.1)":char.shadow),
          transition:"opacity 0.2s",flexShrink:0,
        }}>🕊️</button>
      </div>
    </div>
  );

  // HOME
  if (tab==="home") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:`linear-gradient(160deg,${COLORS.blue},${COLORS.blueDark})`,padding:"20px 20px 24px",flexShrink:0,...sticker(COLORS.blueShadow)}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,...sticker("rgba(0,0,0,0.15)")}}>✝️</div>
          <div>
            <div style={{color:COLORS.white,fontWeight:700,fontSize:24,lineHeight:1}}>BibleKids AI</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginTop:2}}>¡Habla con la Biblia!</div>
          </div>
        </div>
        {/* Verse card */}
        <div style={{marginTop:16,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"14px 16px",...sticker("rgba(0,0,0,0.1)")}}>
          <div style={{fontSize:11,fontWeight:700,color:COLORS.yellow,letterSpacing:"0.06em",marginBottom:6}}>✨ VERSÍCULO DEL DÍA</div>
          <p style={{margin:"0 0 6px",fontSize:15,color:COLORS.white,fontStyle:"italic",lineHeight:1.5}}>"{verse.text}"</p>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{verse.ref}</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.inkMute,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14}}>¿Con quién quieres hablar?</div>
        {CHARS.map(c=>(
          <div key={c.id} onClick={()=>{setChar(c);setTab("age");}}
            style={{background:c.bg,borderRadius:24,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:14,cursor:"pointer",...sticker(c.shadow),transition:"transform 0.15s",border:`2px solid ${c.color}44`}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{width:62,height:62,borderRadius:18,background:COLORS.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0,...sticker(c.shadow)}}>
              {c.emoji}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:18,color:COLORS.ink}}>{c.name}</div>
              <div style={{fontSize:13,color:COLORS.inkMute,marginTop:2}}>{c.desc}</div>
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:c.color,display:"flex",alignItems:"center",justifyContent:"center",color:COLORS.white,fontSize:18,...sticker(c.shadow)}}>›</div>
          </div>
        ))}
        <div style={{height:8}}/>
      </div>
      <NavBar/>
    </div>
  );

  // PRAYERS
  if (tab==="prayers") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:`linear-gradient(160deg,${COLORS.green},${COLORS.greenDark})`,padding:"20px 20px 24px",flexShrink:0,...sticker(COLORS.greenDark)}}>
        <div style={{color:COLORS.white,fontWeight:700,fontSize:24}}>🙏 Oraciones</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:14,marginTop:2}}>Habla con Dios cada día</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        <div style={{height:4}}/>
        {PRAYERS.map((p,i)=>(
          <div key={i} onClick={()=>setPrayer(p)} style={{
            background:COLORS.white,borderRadius:22,padding:"16px 18px",marginBottom:12,
            display:"flex",alignItems:"center",gap:14,cursor:"pointer",
            ...sticker(),transition:"transform 0.15s",
          }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{width:58,height:58,borderRadius:16,background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,...sticker("rgba(11,57,86,0.1)")}}>{p.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:17,color:COLORS.ink}}>{p.title}</div>
              <div style={{fontSize:12,color:COLORS.inkMute,marginTop:3}}>Toca para orar 🙏</div>
            </div>
            <div style={{width:34,height:34,borderRadius:"50%",background:COLORS.green,display:"flex",alignItems:"center",justifyContent:"center",color:COLORS.ink,fontSize:18,...sticker(COLORS.greenDark)}}>›</div>
          </div>
        ))}
        <div style={{height:8}}/>
      </div>
      <NavBar/>
    </div>
  );

  // VERSES
  if (tab==="verses") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:`linear-gradient(160deg,${COLORS.yellow},${COLORS.yellowDark})`,padding:"20px 20px 24px",flexShrink:0,...sticker(COLORS.yellowDark)}}>
        <div style={{color:COLORS.ink,fontWeight:700,fontSize:24}}>📖 Versículos</div>
        <div style={{color:"rgba(11,57,86,0.7)",fontSize:14,marginTop:2}}>Aprende la Palabra de Dios</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        <div style={{height:4}}/>
        {VERSES.map((v,i)=>(
          <div key={i} style={{background:COLORS.white,borderRadius:22,padding:"20px 18px",marginBottom:12,...sticker()}}>
            <div style={{fontSize:11,fontWeight:700,color:COLORS.yellow,letterSpacing:"0.06em",marginBottom:8}}>✨ VERSÍCULO {i+1}</div>
            <p style={{margin:"0 0 12px",fontSize:17,color:COLORS.ink,lineHeight:1.6,fontStyle:"italic"}}>"{v.text}"</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:COLORS.bg,borderRadius:100,padding:"6px 14px",...sticker()}}>
              <span style={{fontSize:14,fontWeight:700,color:COLORS.blue}}>{v.ref}</span>
            </div>
          </div>
        ))}
        <div style={{height:8}}/>
      </div>
      <NavBar/>
    </div>
  );
}