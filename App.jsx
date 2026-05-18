import { useState, useRef, useEffect } from "react";

const COLORS = {
  blue:"#1FB6D6", blueDark:"#137A93", blueShadow:"#0E5A6E",
  yellow:"#FFD23F", yellowDark:"#C29A14",
  pink:"#FF7CA0", pinkDark:"#C25577",
  green:"#7FE0B1", greenDark:"#3DA876",
  purple:"#B79EFF", purpleDark:"#7A5AE0",
  bg:"#CDEEFB", ink:"#0B3956", inkMute:"#5D8AA8",
  white:"#FFFFFF",
};

const sticker = (shadow="rgba(11,57,86,0.18)") => ({
  boxShadow:`0 4px 0 ${shadow}, 0 8px 18px rgba(11,57,86,0.10)`,
});

const FONT = '"Fredoka","Quicksand",system-ui,sans-serif';

const CHARS = [
  {id:"david",name:"David",emoji:"🎵",color:"#1FB6D6",shadow:"#0E5A6E",bg:"#B8EEFA",desc:"El valiente pastor y rey",system:`Eres David, pastor y rey de la Biblia. Eres valiente, alegre y amas a Dios. Hablas con niños de forma cálida, sencilla y emocionante. Cuéntales sobre Goliat, ser pastor, los salmos. Termina siempre con un versículo o enseñanza bíblica. Responde en español.`},
  {id:"moses",name:"Moisés",emoji:"🪨",color:"#FFD23F",shadow:"#C29A14",bg:"#FFF3B8",desc:"El líder del pueblo de Dios",system:`Eres Moisés, el líder que Dios usó para liberar a Israel. Eres sabio y obediente. Hablas con niños de forma sencilla y emocionante. Cuéntales sobre la zarza ardiente, el mar rojo, los 10 mandamientos. Termina siempre con un versículo o enseñanza bíblica. Responde en español.`},
  {id:"noah",name:"Noé",emoji:"🚢",color:"#7FE0B1",shadow:"#3DA876",bg:"#C8F5E2",desc:"Constructor del arca de Dios",system:`Eres Noé, el hombre justo que construyó el arca. Eres fiel y paciente. Hablas con niños de forma sencilla y divertida. Cuéntales el arca, los animales, el diluvio, el arcoíris. Termina siempre con un versículo o enseñanza bíblica. Responde en español.`},
  {id:"daniel",name:"Daniel",emoji:"🦁",color:"#B79EFF",shadow:"#7A5AE0",bg:"#EDE0FF",desc:"Fiel en el foso de los leones",system:`Eres Daniel, el joven hebreo que nunca dejó de orar. Eres valiente y fiel. Hablas con niños de forma sencilla y emocionante. Cuéntales el foso de los leones, tus oraciones, cómo Dios te protegió. Termina con un versículo o enseñanza bíblica. Responde en español.`},
  {id:"esther",name:"Ester",emoji:"👑",color:"#FF7CA0",shadow:"#C25577",bg:"#FFD6E3",desc:"La reina valiente de Dios",system:`Eres Ester, la valiente reina que salvó a su pueblo. Eres compasiva y obediente a Dios. Hablas con niños de forma cálida y sencilla. Cuéntales cómo fuiste reina, cómo salvaste a tu pueblo. Termina con un versículo o enseñanza bíblica. Responde en español.`},
  {id:"jesus",name:"Jesús",emoji:"✝️",color:"#FF9A7A",shadow:"#C25540",bg:"#FFE0D4",desc:"El Hijo de Dios",system:`Eres Jesús, el Hijo de Dios, lleno de amor y compasión. Hablas con niños de forma amorosa y sencilla. Cuéntales tus milagros, parábolas, el amor de Dios. Termina con una enseñanza o versículo. Responde en español.`},
  {id:"abraham",name:"Abraham",emoji:"⭐",color:"#FFD23F",shadow:"#C29A14",bg:"#FFF3B8",desc:"El padre de la fe",system:`Eres Abraham, el padre de la fe. Eres fiel y confiado en Dios. Hablas con niños de forma sencilla y emocionante. Cuéntales sobre cómo dejaste tu tierra, la promesa de Dios, las estrellas, Isaac. Termina con un versículo o enseñanza bíblica. Responde en español.`},
  {id:"joseph",name:"José",emoji:"🌈",color:"#B79EFF",shadow:"#7A5AE0",bg:"#EDE0FF",desc:"El soñador de colores",system:`Eres José, el hijo de Jacob que tenía sueños de Dios. Eres perseverante y perdonador. Hablas con niños de forma sencilla y emocionante. Cuéntales sobre tu túnica de colores, tus sueños, Egipto, y cómo perdonaste a tus hermanos. Termina con un versículo bíblico. Responde en español.`},
];

const VERSES = [
  {text:"Todo lo puedo en Cristo que me fortalece.",ref:"Filipenses 4:13",emoji:"💪"},
  {text:"Dios es amor.",ref:"1 Juan 4:8",emoji:"❤️"},
  {text:"El Señor es mi pastor, nada me faltará.",ref:"Salmo 23:1",emoji:"🐑"},
  {text:"Confía en el Señor con todo tu corazón.",ref:"Proverbios 3:5",emoji:"🙏"},
  {text:"Sé fuerte y valiente. No temas.",ref:"Josué 1:9",emoji:"🦁"},
  {text:"De tal manera amó Dios al mundo, que dio a su Hijo unigénito.",ref:"Juan 3:16",emoji:"✝️"},
  {text:"El amor es paciente, es bondadoso.",ref:"1 Corintios 13:4",emoji:"💛"},
  {text:"Pon en manos del Señor todas tus obras.",ref:"Proverbios 16:3",emoji:"🌟"},
];

const PRAYERS = [
  {title:"Buenos días",emoji:"🌅",text:"Buenos días Señor, gracias por este nuevo día. Guíame, protégeme y ayúdame a ser bueno con todos. ¡Te amo Dios! Amén."},
  {title:"Buenas noches",emoji:"🌙",text:"Gracias Señor por este día. Perdóname si hice algo malo. Cuida a mi familia mientras dormimos. Amén."},
  {title:"Antes de comer",emoji:"🍽️",text:"Gracias Señor por los alimentos. Bendice esta comida y a quienes la prepararon. Amén."},
  {title:"Por mi familia",emoji:"👨‍👩‍👧",text:"Señor, cuida a mi mamá, mi papá y toda mi familia. Llénalos de tu amor y bendiciones. Amén."},
  {title:"Cuando tengo miedo",emoji:"🛡️",text:"Señor, a veces tengo miedo, pero sé que tú estás conmigo. Dame valentía y paz en mi corazón. Amén."},
  {title:"Por mis amigos",emoji:"🤝",text:"Señor, bendice a mis amigos. Ayúdame a ser un buen amigo y a tratarlos con amor. Amén."},
  {title:"Cuando estoy triste",emoji:"🌈",text:"Señor, hoy estoy triste. Llena mi corazón de tu alegría y recuérdame que siempre estás conmigo. Amén."},
];

const SUGG = {
  david:["¿Cómo venciste a Goliat?","¿Cómo eras de pastor?","Dame un salmo"],
  moses:["¿Cómo cruzaste el mar?","¿Hablaste con Dios?","¿Qué son los mandamientos?"],
  noah:["¿Cuántos animales había?","¿Cómo fue el diluvio?","¿Qué es el arcoíris de Dios?"],
  daniel:["¿Tenías miedo de los leones?","¿Por qué orabas tanto?","¿Cómo te protegió Dios?"],
  esther:["¿Cómo fuiste reina?","¿Cómo salvaste a tu pueblo?","¿Tenías miedo?"],
  jesus:["Cuéntame un milagro","Dame una parábola","¿Cómo es el cielo?"],
  abraham:["¿Cuándo escuchaste a Dios?","¿Qué es la fe?","Cuéntame de las estrellas"],
  joseph:["¿Qué soñaste?","¿Cómo perdonaste a tus hermanos?","¿Cómo llegaste a Egipto?"],
};

// Floating decorative elements for splash
const floaters = [
  {emoji:"⭐",top:"8%",left:"8%",size:32,rot:-15,delay:0},
  {emoji:"✝️",top:"12%",right:"10%",size:28,rot:10,delay:0.3},
  {emoji:"🌟",top:"30%",left:"5%",size:24,rot:5,delay:0.6},
  {emoji:"🌈",top:"28%",right:"6%",size:28,rot:-8,delay:0.2},
  {emoji:"❤️",bottom:"28%",left:"8%",size:26,rot:12,delay:0.5},
  {emoji:"🕊️",bottom:"24%",right:"8%",size:28,rot:-5,delay:0.1},
  {emoji:"⭐",bottom:"15%",left:"20%",size:20,rot:20,delay:0.4},
  {emoji:"✨",top:"55%",right:"5%",size:22,rot:-12,delay:0.7},
];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [tab, setTab] = useState("home");
  const [char, setChar] = useState(null);
  const [age, setAge] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prayer, setPrayer] = useState(null);
  const [verse] = useState(VERSES[Math.floor(Math.random()*VERSES.length)]);
  const [splashAnim, setSplashAnim] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, loading]);
  useEffect(() => { setTimeout(()=>setSplashAnim(true), 100); }, []);

  const callAPI = async (character, history, userMsg, ageGroup) => {
    const ageNote = ageGroup==="3-5"
      ? "El niño tiene 3-5 años. Usa frases MUY cortas (máximo 3), palabras simples y emojis."
      : "El niño tiene 6-10 años. Sé detallado pero simple. Máximo 5 oraciones.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`${character.system}\n\n${ageNote}\nSé siempre positivo y apropiado para niños.`,
          messages:[...history,{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text || "¡Ups! Intenta de nuevo.";
    } catch { return "¡Ups! Hubo un problema. Intenta de nuevo."; }
  };

  const startChat = async (character, ageGroup) => {
    setChar(character); setAge(ageGroup); setMsgs([]); setLoading(true); setScreen("chat");
    const ageDesc = ageGroup==="3-5" ? "muy pequeño (3-5 años), usa frases cortísimas con emojis" : "tiene 6-10 años";
    const greeting = await callAPI(character,[],`Saluda al niño de forma muy emocionante. El niño ${ageDesc}. Preséntate brevemente y menciona algo interesante de tu historia. Muy breve.`,ageGroup);
    setMsgs([{role:"assistant",content:greeting}]); setLoading(false);
  };

  const send = async (text) => {
    const msg=(text||input).trim(); if(!msg||loading) return;
    setInput("");
    const newMsgs=[...msgs,{role:"user",content:msg}]; setMsgs(newMsgs); setLoading(true);
    const reply = await callAPI(char, msgs.map(m=>({role:m.role,content:m.content})), msg, age);
    setMsgs([...newMsgs,{role:"assistant",content:reply}]); setLoading(false);
  };

  const NavBar = () => (
    <div style={{display:"flex",background:COLORS.white,borderTop:`3px solid ${COLORS.bg}`,flexShrink:0}}>
      {[{id:"home",emoji:"🏠",label:"Inicio"},{id:"prayers",emoji:"🙏",label:"Oraciones"},{id:"verses",emoji:"📖",label:"Versículos"}].map(({id,emoji,label})=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"10px 0 8px",border:"none",background:tab===id?COLORS.bg:COLORS.white,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontFamily:FONT,borderTop:tab===id?`3px solid ${COLORS.blue}`:"3px solid transparent",marginTop:-3}}>
          <span style={{fontSize:22}}>{emoji}</span>
          <span style={{fontSize:11,fontWeight:600,color:tab===id?COLORS.blue:COLORS.inkMute}}>{label}</span>
        </button>
      ))}
    </div>
  );

  // ── SPLASH ──────────────────────────────────────────────────
  if (screen==="splash") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:`linear-gradient(160deg,#1FB6D6 0%,#0E5A6E 100%)`,fontFamily:FONT,position:"relative",overflow:"hidden"}}>
      <style>{`
        @keyframes float {0%,100%{transform:translateY(0) rotate(var(--r))}50%{transform:translateY(-10px) rotate(var(--r))}}
        @keyframes bounceIn {0%{opacity:0;transform:scale(0.3) translateY(60px)}60%{transform:scale(1.1) translateY(-10px)}80%{transform:scale(0.95)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes slideUp {0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes pulse {0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        .floater{animation:float 3s ease-in-out infinite}
        .bounce-in{animation:bounceIn 0.8s cubic-bezier(0.36,0.07,0.19,0.97) forwards}
        .slide-up{animation:slideUp 0.6s ease forwards}
        .pulse-btn{animation:pulse 2s ease-in-out infinite}
      `}</style>

      {/* Círculos decorativos de fondo */}
      <div style={{position:"absolute",top:-80,right:-80,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
      <div style={{position:"absolute",bottom:-100,left:-60,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
      <div style={{position:"absolute",top:"40%",left:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>

      {/* Elementos flotantes */}
      {floaters.map((f,i)=>(
        <div key={i} className="floater" style={{
          position:"absolute",top:f.top,bottom:f.bottom,left:f.left,right:f.right,
          fontSize:f.size,userSelect:"none",
          "--r":`${f.rot}deg`,
          animationDelay:`${f.delay}s`,
          filter:"drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
        }}>{f.emoji}</div>
      ))}

      {/* Contenido principal */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",position:"relative",zIndex:2}}>

        {/* Mascota / Logo */}
        <div className={splashAnim?"bounce-in":""} style={{opacity:0,marginBottom:24,position:"relative"}}>
          <div style={{width:160,height:160,borderRadius:48,background:COLORS.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:90,...sticker("rgba(0,0,0,0.2)"),position:"relative"}}>
            ✝️
            {/* Badge brillante */}
            <div style={{position:"absolute",top:-10,right:-10,width:40,height:40,borderRadius:"50%",background:COLORS.yellow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,...sticker(COLORS.yellowDark)}}>⭐</div>
          </div>
        </div>

        {/* Título */}
        <div className={splashAnim?"slide-up":""} style={{opacity:0,animationDelay:"0.3s",textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:44,fontWeight:700,color:COLORS.white,lineHeight:1,textShadow:"0 4px 0 rgba(0,0,0,0.15)"}}>BibleKids</div>
          <div style={{fontSize:28,fontWeight:600,color:COLORS.yellow,lineHeight:1,textShadow:"0 3px 0 rgba(0,0,0,0.15)"}}>AI ✨</div>
        </div>

        {/* Subtítulo */}
        <div className={splashAnim?"slide-up":""} style={{opacity:0,animationDelay:"0.5s",textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:17,color:"rgba(255,255,255,0.9)",lineHeight:1.5,maxWidth:260}}>
            ¡Aprende la Biblia de forma<br/>
            <span style={{fontWeight:700,color:COLORS.yellow}}>divertida e interactiva!</span>
          </div>
        </div>

        {/* Botones */}
        <div className={splashAnim?"slide-up":""} style={{opacity:0,animationDelay:"0.7s",width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:14}}>
          <button className="pulse-btn" onClick={()=>setScreen("main")} style={{
            background:COLORS.yellow,color:COLORS.ink,border:"none",
            borderRadius:100,padding:"18px 0",fontSize:20,fontWeight:700,
            cursor:"pointer",fontFamily:FONT,width:"100%",
            ...sticker(COLORS.yellowDark),
          }}>
            ¡Empezar aventura! 🚀
          </button>
          <button onClick={()=>setScreen("main")} style={{
            background:"rgba(255,255,255,0.15)",color:COLORS.white,
            border:"2px solid rgba(255,255,255,0.4)",
            borderRadius:100,padding:"14px 0",fontSize:16,fontWeight:600,
            cursor:"pointer",fontFamily:FONT,width:"100%",
          }}>
            Ya tengo cuenta 👋
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:"0 0 24px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Para niños de 3 a 10 años 🌟</div>
      </div>
    </div>
  );

  // ── PRAYER DETAIL ────────────────────────────────────────────
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
        <button onClick={()=>setPrayer(null)} style={{marginTop:32,background:COLORS.green,color:COLORS.ink,border:"none",borderRadius:100,padding:"16px 36px",fontSize:18,cursor:"pointer",fontFamily:FONT,fontWeight:700,...sticker(COLORS.greenDark)}}>🙏 Amén</button>
      </div>
    </div>
  );

  // ── AGE SELECT ───────────────────────────────────────────────
  if (screen==="age" && char) return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:`radial-gradient(circle at 50% 20%,#FFF7C4 0%,${COLORS.bg} 60%)`,fontFamily:FONT}}>
      <div style={{background:COLORS.white,padding:"16px",display:"flex",alignItems:"center",gap:12,borderBottom:`3px solid ${COLORS.bg}`,flexShrink:0}}>
        <button onClick={()=>setScreen("main")} style={{background:COLORS.bg,border:"none",borderRadius:12,width:40,height:40,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...sticker()}}>←</button>
        <span style={{fontWeight:600,fontSize:18,color:COLORS.ink}}>¿Cuántos años tienes?</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:24}}>
        <div style={{width:110,height:110,borderRadius:32,background:char.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,...sticker(char.shadow)}}>{char.emoji}</div>
        <div style={{fontWeight:700,fontSize:24,color:COLORS.ink,textAlign:"center"}}>¡Hola! Soy {char.name} 👋</div>
        <div style={{fontSize:15,color:COLORS.inkMute,textAlign:"center"}}>Dime cuántos años tienes para poder hablar mejor contigo</div>
        <div style={{display:"flex",gap:20,width:"100%",maxWidth:320}}>
          {["3-5","6-10"].map(a=>(
            <button key={a} onClick={()=>startChat(char,a)} style={{flex:1,background:COLORS.white,border:`3px solid ${char.color}`,borderRadius:24,padding:"24px 0",cursor:"pointer",textAlign:"center",fontFamily:FONT,...sticker(char.shadow)}}
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

  // ── CHAT ─────────────────────────────────────────────────────
  if (screen==="chat") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:"#f0faff",fontFamily:FONT}}>
      <div style={{background:char.color,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button onClick={()=>setScreen("main")} style={{background:"rgba(255,255,255,0.3)",border:"none",borderRadius:12,width:38,height:38,cursor:"pointer",fontSize:20,color:COLORS.white,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,...sticker("rgba(0,0,0,0.1)")}}>{char.emoji}</div>
        <div>
          <div style={{color:COLORS.white,fontWeight:700,fontSize:18}}>{char.name}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{age} años · Personaje bíblico</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.length===0 && loading && (
          <div style={{textAlign:"center",padding:"50px 0",color:COLORS.inkMute}}>
            <div style={{fontSize:60,marginBottom:12}}>{char.emoji}</div>
            <div style={{fontWeight:600,fontSize:16}}>{char.name} está listo...</div>
          </div>
        )}
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
            {m.role==="assistant" && <div style={{width:40,height:40,borderRadius:12,background:char.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,...sticker(char.shadow)}}>{char.emoji}</div>}
            <div style={{maxWidth:"74%",padding:"12px 16px",borderRadius:m.role==="user"?"20px 20px 4px 20px":"20px 20px 20px 4px",background:m.role==="user"?char.color:COLORS.white,color:m.role==="user"?COLORS.white:COLORS.ink,fontSize:15,lineHeight:1.55,...sticker(m.role==="user"?char.shadow:"rgba(11,57,86,0.08)"),whiteSpace:"pre-wrap"}}>{m.content}</div>
            {m.role==="user" && <div style={{width:36,height:36,borderRadius:"50%",background:COLORS.yellow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,...sticker(COLORS.yellowDark)}}>🧒</div>}
          </div>
        ))}
        {loading && msgs.length>0 && (
          <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <div style={{width:40,height:40,borderRadius:12,background:char.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,...sticker(char.shadow)}}>{char.emoji}</div>
            <div style={{background:COLORS.white,borderRadius:"20px 20px 20px 4px",padding:"14px 18px",...sticker()}}>
              <div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:char.color,opacity:0.7}}/>)}</div>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1 && !loading && (
        <div style={{padding:"8px 12px",display:"flex",gap:8,overflowX:"auto",background:"#f0faff",flexShrink:0}}>
          {SUGG[char.id].map((s,i)=>(
            <button key={i} onClick={()=>send(s)} style={{background:char.bg,border:`2px solid ${char.color}`,color:COLORS.ink,padding:"8px 14px",borderRadius:100,cursor:"pointer",fontSize:13,whiteSpace:"nowrap",fontFamily:FONT,fontWeight:600,flexShrink:0,...sticker(char.shadow)}}>{s}</button>
          ))}
        </div>
      )}
      <div style={{background:COLORS.white,borderTop:`3px solid ${COLORS.bg}`,padding:"12px 14px",display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={`Pregúntale a ${char.name}...`}
          style={{flex:1,border:`2.5px solid ${char.color}`,borderRadius:100,padding:"12px 18px",fontSize:15,outline:"none",fontFamily:FONT,background:COLORS.bg,color:COLORS.ink,...sticker()}}
        />
        <button onClick={()=>send()} disabled={loading||!input.trim()} style={{width:50,height:50,borderRadius:"50%",background:loading||!input.trim()?COLORS.inkMute:char.color,border:"none",cursor:loading||!input.trim()?"not-allowed":"pointer",fontSize:22,...sticker(char.shadow),opacity:loading||!input.trim()?0.4:1,flexShrink:0}}>🕊️</button>
      </div>
    </div>
  );

  // ── MAIN APP ─────────────────────────────────────────────────
  const mainTab = tab;

  if (mainTab==="home") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:`linear-gradient(160deg,${COLORS.blue},${COLORS.blueDark})`,padding:"20px 20px 24px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:46,height:46,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,...sticker("rgba(0,0,0,0.15)")}}>✝️</div>
            <div>
              <div style={{color:COLORS.white,fontWeight:700,fontSize:22,lineHeight:1}}>BibleKids AI</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>¡Habla con la Biblia!</div>
            </div>
          </div>
          <div style={{background:COLORS.yellow,borderRadius:100,padding:"6px 14px",display:"flex",alignItems:"center",gap:5,...sticker(COLORS.yellowDark)}}>
            <span style={{fontSize:16}}>⭐</span>
            <span style={{fontWeight:700,fontSize:15,color:COLORS.ink}}>0</span>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"14px 16px",...sticker("rgba(0,0,0,0.1)")}}>
          <div style={{fontSize:11,fontWeight:700,color:COLORS.yellow,letterSpacing:"0.06em",marginBottom:6}}>✨ VERSÍCULO DEL DÍA</div>
          <p style={{margin:"0 0 6px",fontSize:15,color:COLORS.white,fontStyle:"italic",lineHeight:1.5}}>"{verse.text}"</p>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:600}}>{verse.ref}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.inkMute,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14}}>¿Con quién quieres hablar?</div>
        {CHARS.map(c=>(
          <div key={c.id} onClick={()=>{setChar(c);setScreen("age");}}
            style={{background:c.bg,borderRadius:24,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:14,cursor:"pointer",...sticker(c.shadow),transition:"transform 0.15s",border:`2px solid ${c.color}44`}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{width:62,height:62,borderRadius:18,background:COLORS.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0,...sticker(c.shadow)}}>{c.emoji}</div>
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

  if (mainTab==="prayers") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:`linear-gradient(160deg,${COLORS.green},${COLORS.greenDark})`,padding:"20px 20px 24px",flexShrink:0}}>
        <div style={{color:COLORS.white,fontWeight:700,fontSize:24}}>🙏 Oraciones</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:14,marginTop:2}}>Habla con Dios cada día</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        {PRAYERS.map((p,i)=>(
          <div key={i} onClick={()=>setPrayer(p)} style={{background:COLORS.white,borderRadius:22,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:14,cursor:"pointer",...sticker(),transition:"transform 0.15s"}}
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

  if (mainTab==="verses") return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:COLORS.bg,fontFamily:FONT}}>
      <div style={{background:`linear-gradient(160deg,${COLORS.yellow},${COLORS.yellowDark})`,padding:"20px 20px 24px",flexShrink:0}}>
        <div style={{color:COLORS.ink,fontWeight:700,fontSize:24}}>📖 Versículos</div>
        <div style={{color:"rgba(11,57,86,0.7)",fontSize:14,marginTop:2}}>Aprende la Palabra de Dios</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        {VERSES.map((v,i)=>(
          <div key={i} style={{background:COLORS.white,borderRadius:22,padding:"20px 18px",marginBottom:12,...sticker()}}>
            <div style={{fontSize:28,marginBottom:10}}>{v.emoji}</div>
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

  return null;
}