/* =========================================================================
           SUPER STUM — Edición Equipo (2 a 6 jugadores, P2P)

           ARQUITECTURA DE RED: el anfitrión (host) es la única autoridad de la
           partida y actúa como relé en topología estrella. Cada invitado se
           conecta únicamente al host. El host envía a cada jugador SOLO lo que
           ese jugador puede ver (no se filtran las cartas de los demás).
           ========================================================================= */

const MAX_PLAYERS = 6; // máximo de jugadores por sala
const MIN_PLAYERS = 2;
const CODE_PREFIX = "SS-";

/* ---------------------------------------------------------------------- */
/* CONFIGURACIÓN — edita aquí sin tocar el motor                            */
/* ---------------------------------------------------------------------- */
const CONFIG = {
  titulo: "SUPER STUM",
  // Todas las cartas deben sumar exactamente estos puntos: así­ nadie es
  // "mejor" que otra persona, solo distinto. (Ver validarEquipo)
  presupuestoPuntos: 600,
  statMin: 55,
  statMax: 99,
  // A quién escribir para retirar una carta (se muestra en la pantalla de inicio)
  contactoRetiro: "al organizador del juego",
  // Segundos para elegir fortaleza antes de que se juegue una al azar
  turnSeconds: 30,
  // Milisegundos de pausa para ver el resultado de cada ronda
  resolveMs: 5200,
  // Retraso de los rivales virtuales (modo práctica)
  botDelayMs: 1500,
};

/* Solo FORTALEZAS (superpoderes). No hay atributos "malos" ni ranking. */
const STAT_KEYS = [
  "creatividad",
  "colaboracion",
  "cafeina",
  "iniciativa",
  "humor",
  "aguante",
  "conocimiento",
  "calma",
];

const STAT_LABELS = {
  creatividad:  "💡 Creatividad",
  colaboracion: "🤝 Colaboración",
  cafeina: "⚡ Cafeína",
  iniciativa: "🚀 Iniciativa",
  humor: "😄 Buen humor",
  aguante: "🎯 aguante",
  conocimiento: "🧠 Conocimiento",
  calma: "🌿 Calma bajo presión",
};
/* ---------------------------------------------------------------------- */
/* LA LIGA DEL CAFÉ: CREANDO SOFT — Una carta por sobreviviente           */
/* ---------------------------------------------------------------------- */
const EQUIPO = [
  {
    id: 1,
    nombre: "Carla",
    area: "Interacción",
    avatar: "🦊",
    foto: "./assets/carla.png",
    participa: true,
    superpoder:
      "Alquimia de wireframes (convierte garabatos en oro interactivo)",
    frase: "¿Que no se puede? Quítame el café y mira cómo lo invento.",
    stats: {
      creatividad: 92,
      colaboracion: 78,
      cafeina: 70,
      iniciativa: 66,
      humor: 80,
      aguante: 60,
      conocimiento: 84,
      calma: 70,
    },
  },
  {
    id: 2,
    nombre: "Jesús David",
    area: "Estrategia",
    avatar: "🦁",
    foto: "./assets/jesus.png",
    participa: true,
    superpoder:
      "Pastor de gatos (hace que todo el equipo reme hacia el mismo lado)",
    frase: "Solos vamos rápido... pero juntos nos reímos de los bugs.",
    stats: {
      creatividad: 60,
      colaboracion: 95,
      cafeina: 72,
      iniciativa: 70,
      humor: 66,
      aguante: 88,
      conocimiento: 75,
      calma: 74,
    },
  },
  {
    id: 3,
    nombre: "Jaider",
    area: "Estrategia",
    avatar: "🦄",
    foto: "./assets/jaider.png",
    participa: true,
    superpoder: "Defibrilador de reuniones aburridas",
    frase: "Una sonrisa en el sprint ahorra tres días de terapia.",
    stats: {
      creatividad: 70,
      colaboracion: 74,
      cafeina: 90,
      iniciativa: 62,
      humor: 92,
      aguante: 66,
      conocimiento: 60,
      calma: 86,
    },
  },
  {
    id: 4,
    nombre: "Withman",
    area: "Desarrollo",
    avatar: "🐢",
    foto: "./assets/withman.png",
    participa: true,
    superpoder:
      "Inmunidad al pánico (mantiene el zen mientras la base de datos explota)",
    frase: "Todo está bajo control. El humo negro es parte del diseño.",
    stats: {
      creatividad: 66,
      colaboracion: 70,
      cafeina: 60,
      iniciativa: 94,
      humor: 62,
      aguante: 84,
      conocimiento: 78,
      calma: 86,
    },
  },
  {
    id: 5,
    nombre: "Francys",
    area: "Producto",
    avatar: "🦉",
    foto: "./assets/francy.png",
    participa: true,
    superpoder: "Visión de rayos X para bugs invisibles",
    frase: "Los números no mienten, pero a veces lloran si los miras fijo.",
    stats: {
      creatividad: 84,
      colaboracion: 88,
      cafeina: 76,
      iniciativa: 60,
      humor: 74,
      aguante: 90,
      conocimiento: 64,
      calma: 64,
    },
  },
  {
    id: 6,
    nombre: "Freddy Motta",
    area: "Producto",
    avatar: "🐬",
    foto: "./assets/freddy.png",
    participa: true,
    superpoder: "Amortiguador de lunes por la mañana",
    frase: "No hay mal feedback si lo dices con un sticker divertido.",
    stats: {
      creatividad: 60,
      colaboracion: 66,
      cafeina: 68,
      iniciativa: 78,
      humor: 96,
      aguante: 70,
      conocimiento: 82,
      calma: 80,
    },
  },
  {
    id: 7,
    nombre: "Laura",
    area: "Interacción",
    avatar: "🌻",
    foto: "./assets/laura.png",
    participa: true,
    superpoder:
      "Telepatía con el usuario (adivina lo que quieren antes de que lo sepan)",
    frase: "Menos clics, más felicidad... y más café por favor.",
    stats: {
      creatividad: 78,
      colaboracion: 82,
      cafeina: 62,
      iniciativa: 88,
      humor: 60,
      aguante: 74,
      conocimiento: 90,
      calma: 66,
    },
  },
  {
    id: 8,
    nombre: "Luis",
    area: "Desarrollo",
    avatar: "🚀",
    foto: "./assets/luis.png",
    participa: true,
    superpoder:
      "Iniciador en frío (escribe código antes de que hierva el agua)",
    frase: "Mejor subido a producción hoy, que perfecto el próximo año.",
    stats: {
      creatividad: 88,
      colaboracion: 60,
      cafeina: 94,
      iniciativa: 72,
      humor: 70,
      aguante: 78,
      conocimiento: 66,
      calma: 72,
    },
  },
  {
    id: 9,
    nombre: "Rafael",
    area: "Desarrollo",
    avatar: "🐝",
    foto: "./assets/rafael.png",
    participa: true,
    superpoder: "Imán de networking (conecta personas más rápido que una API)",
    frase: "Si no conozco a la persona que necesitas, dame cinco minutos.",
    stats: {
      creatividad: 72,
      colaboracion: 92,
      cafeina: 66,
      iniciativa: 74,
      humor: 84,
      aguante: 62,
      conocimiento: 70,
      calma: 80,
    },
  },
  {
    id: 10,
    nombre: "Carlos",
    area: "Desarrollo",
    avatar: "🦋",
    foto: "./assets/carlos.png",
    participa: true,
    superpoder: "Fábrica espontánea de ideas disruptivas",
    frase: "Si el código es aburrido, la culpa es del compilador.",
    stats: {
      creatividad: 90,
      colaboracion: 64,
      cafeina: 80,
      iniciativa: 68,
      humor: 76,
      aguante: 72,
      conocimiento: 88,
      calma: 62,
    },
  },
  {
    id: 11,
    nombre: "Juan Camilo",
    area: "Desarrollo",
    avatar: "🐜",
    foto: "./assets/camilo.png",
    participa: true,
    superpoder:
      "Persistencia nivel Terminator (no suelta la tarea hasta verla completada)",
    frase: "Un commit al día mantiene al jefe en la lejanía.",
    stats: {
      creatividad: 64,
      colaboracion: 80,
      cafeina: 74,
      iniciativa: 82,
      humor: 68,
      aguante: 96,
      conocimiento: 72,
      calma: 64,
    },
  },
  {
    id: 12,
    nombre: "Fredy Alberto",
    area: "Producto",
    avatar: "🐙",
    foto: "./assets/alberto.png",
    participa: true,
    superpoder:
      "Multitasking caótico-efectivo (ocho brazos para resolver chicharrones)",
    frase: "¿Solo un problema a la vez? Qué aburrido, dame tres más.",
    stats: {
      creatividad: 76,
      colaboracion: 72,
      cafeina: 84,
      iniciativa: 64,
      humor: 78,
      aguante: 68,
      conocimiento: 80,
      calma: 78,
    },
  },
];

/* Revisa que cada carta sea justa y válida. Devuelve la lista de problemas. */
function validarEquipo(lista) {
  const problemas = [];
  const ids = new Set();
  lista.forEach((p) => {
    const tag = "Carta #" + p.id + " (" + p.nombre + ")";
    if (ids.has(p.id)) problemas.push(tag + ": id repetido");
    ids.add(p.id);
    let suma = 0;
    STAT_KEYS.forEach((k) => {
      const v = p.stats && p.stats[k];
      if (!Number.isFinite(v)) {
        problemas.push(tag + ": falta el atributo " + k);
        return;
      }
      if (v < CONFIG.statMin || v > CONFIG.statMax)
        problemas.push(
          tag + ": " + k + " fuera de " + CONFIG.statMin + "–" + CONFIG.statMax,
        );
      suma += v;
    });
    if (suma !== CONFIG.presupuestoPuntos)
      problemas.push(
        tag + ": suma " + suma + " en vez de " + CONFIG.presupuestoPuntos,
      );
  });
  return problemas;
}
const PROBLEMAS_EQUIPO = validarEquipo(EQUIPO);
if (PROBLEMAS_EQUIPO.length)
  console.warn(
    "[SUPER STUM] Revisa las cartas:\n" + PROBLEMAS_EQUIPO.join("\n"),
  );

/* ---------------------------------------------------------------------- */
/* Utilidades                                                             */
/* ---------------------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

function h(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sanitizeName(raw) {
  return String(raw == null ? "" : raw)
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .trim()
    .slice(0, 18);
}

//const PALETA = ["#ff7a29", "#17e3a6", "#9b7bff", "#ffc857", "#3cd2ff", "#ff6b9a", "#8bd450"];
const PALETA = [
  "#0d4f91",
  "#f0c900",
  "#7f8790",
  "#174f82",
  "#d2b300",
  "#5d7184",
];
function hashStr(s) {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x;
}
function hexColorFor(id) {
  return PALETA[hashStr(String(id)) % PALETA.length];
}

/* Adaptador: convierte una persona de EQUIPO en la carta que consume el motor. */
function personaToCarta(p) {
  const initial = (p.nombre || "?").trim().charAt(0).toUpperCase();
  return {
    id: "p" + p.id,
    name: p.nombre,
    element: p.area || "Equipo",
    color: hexColorFor(p.area || p.nombre),
    glyph: p.avatar || initial,
    image: p.foto || null,
    superpoder: p.superpoder || "",
    frase: p.frase || "",
    stats: { ...p.stats },
  };
}

function cartaValida(p) {
  return (
    p &&
    p.participa !== false &&
    p.stats &&
    STAT_KEYS.every((k) => Number.isFinite(p.stats[k]))
  );
}

function getDeckForGame() {
  return EQUIPO.filter(cartaValida).map(personaToCarta);
}

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 3400);
}

function randomCode(len = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres ambiguos
  let s = "";
  for (let i = 0; i < len; i++) s += chars[randInt(0, chars.length - 1)];
  return CODE_PREFIX + s;
}

function readMyName() {
  myName =
    sanitizeName($("input-name").value) || "Jugador " + randInt(100, 999);
  // Se guarda para que no haya que escribirlo en cada partida
  try {
    localStorage.setItem("superstum-name", myName);
  } catch (e) {}
  return myName;
}

/* Imagen con respaldo: si la foto no carga, se muestra el avatar. */
function fillMedia(container, card) {
  container.innerHTML = "";
  const fallback = () => {
    container.innerHTML = "";
    container.appendChild(h("div", "glyph-fallback avatar", card.glyph));
  };
  if (card.image) {
    const img = document.createElement("img");
    img.decoding = "async";
    img.alt = card.name;
    img.onerror = fallback;
    img.src = card.image;
    container.appendChild(img);
  } else {
    fallback();
  }
}

function makeHex(id, card, fallbackText) {
  const hex = h("div", "hex");
  hex.style.setProperty("--hex-color", hexColorFor(id));
  if (card && card.image) {
    const img = document.createElement("img");
    img.alt = card.name;
    img.onerror = () => {
      hex.innerHTML = "";
      hex.textContent = card.glyph;
    };
    img.src = card.image;
    hex.appendChild(img);
  } else if (card) {
    hex.textContent = card.glyph;
  } else {
    hex.textContent = fallbackText;
  }
  return hex;
}

/* ---------------------------------------------------------------------- */
/* Estado de red                                                          */
/* ---------------------------------------------------------------------- */

/* Carga diferida de PeerJS: la única librería externa, necesaria para la
   conexión P2P entre jugadores. Solo se descarga al crear o unirse a una
   sala (el modo práctica funciona 100% sin conexión ni librerías).
   Si un CDN falla, se intenta automáticamente con el respaldo. */
const PEERJS_URLS = [
  "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js",
  "https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js",
];
let peerJsPromise = null;

function loadPeerJS() {
  if (typeof Peer !== "undefined") return Promise.resolve();
  if (!peerJsPromise) {
    peerJsPromise = new Promise((resolve, reject) => {
      let i = 0;
      const tryNext = () => {
        if (i >= PEERJS_URLS.length) {
          peerJsPromise = null;
          reject(new Error("peerjs-unavailable"));
          return;
        }
        const s = document.createElement("script");
        s.src = PEERJS_URLS[i++];
        s.async = true;
        s.onload = () => {
          typeof Peer !== "undefined" ? resolve() : tryNext();
        };
        s.onerror = tryNext;
        document.head.appendChild(s);
      };
      tryNext();
    });
  }
  return peerJsPromise;
}

let peer = null;
const PEER_OPTS = {
  debug: 0,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478" },
    ],
  },
};
let conns = new Map(); // solo host: peerId -> DataConnection
let conn = null; // solo invitado: conexión con el host
let role = null; // 'host' | 'guest'
let myId = null; // 'host' para el anfitrión; peer.id para invitados
let myName = "";
let hostCode = null;
let game = null; // estado autoritativo (host) o copia recibida (guest)
let resolveTimer = null;

/* ---------------------------------------------------------------------- */
/* Crear partida (host)                                                   */
/* ---------------------------------------------------------------------- */
async function startHostFlow() {
  readMyName();
  showScreen("screen-waiting");
  $("waiting-title").textContent = "Creando salá…";
  $("waiting-code-block").classList.add("hidden");
  $("waiting-status").textContent = "Cargando el módulo de conexión…";
  $("waiting-spinner").classList.remove("hidden");
  $("btn-start-game").classList.add("hidden");
  $("lobby-roster").innerHTML = "";

  try {
    await loadPeerJS();
  } catch (e) {
    $("waiting-title").textContent = "Sin conexión";
    $("waiting-status").textContent =
      "No se pudo cargar el módulo de conexión. Revisa tu internet e inténtalo de nuevo.";
    $("waiting-spinner").classList.add("hidden");
    return;
  }

  $("waiting-status").textContent = "Generando código de sala…";
  attemptCreatePeer(0);
}

function attemptCreatePeer(tries) {
  if (tries > 5) {
    $("waiting-status").textContent =
      "No se pudo crear la sala. Revisa tu conexión e inténtalo de nuevo.";
    $("waiting-spinner").classList.add("hidden");
    return;
  }
  const code = randomCode();
  if (peer) {
    try {
      peer.destroy();
    } catch (e) {}
  }
  conns = new Map();
  peer = new Peer(code, PEER_OPTS);

  peer.on("open", (id) => {
    hostCode = id;
    role = "host";
    myId = "host";
    game = {
      phase: "lobby",
      players: [
        {
          id: "host",
          name: myName,
          hand: [],
          current: null,
          eliminated: false,
          connected: true,
        },
      ],
      turn: null,
      pot: [],
      lastStat: null,
      roundWinner: null,
      chooser: null,
      tiedPlayers: null,
      log: "Sala creada. Esperando jugadores…",
      winner: null,
      totalCards: 0,
    };
    $("host-code").textContent = id;
    $("waiting-code-block").classList.remove("hidden");
    $("waiting-title").textContent = "Sala creada";
    $("waiting-spinner").classList.add("hidden");
    renderLobby();
  });

  peer.on("connection", (c) => {
    if (!game) return;
    if (game.phase !== "lobby" || game.players.length >= MAX_PLAYERS) {
      const reason = game.phase !== "lobby" ? "started" : "full";
      const sendErr = () => {
        try {
          c.send({ type: "joinError", reason });
        } catch (e) {}
        setTimeout(() => {
          try {
            c.close();
          } catch (e) {}
        }, 500);
      };
      if (c.open) sendErr();
      else c.on("open", sendErr);
      return;
    }
    conns.set(c.peer, c);
    c.on("data", (msg) => handleHostMessage(c.peer, msg));
    c.on("close", () => hostHandleDisconnect(c.peer));
    c.on("error", () => hostHandleDisconnect(c.peer));
  });

  // Si se pierde el contacto con el servidor de seÃ±alización, intenta reconectar
  peer.on("disconnected", () => {
    try {
      if (peer && !peer.destroyed) peer.reconnect();
    } catch (e) {}
  });

  peer.on("error", (err) => {
    if (err && err.type === "unavailable-id") {
      attemptCreatePeer(tries + 1);
    } else {
      toast(
        "Error de conexión: " + (err && err.type ? err.type : "desconocido"),
      );
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Unirse a partida (guest)                                               */
/* ---------------------------------------------------------------------- */
async function startJoinFlow() {
  const codeRaw = $("input-join-code")
    .value.trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!codeRaw) {
    toast("Ingresa un código válido");
    return;
  }
  const code = codeRaw.startsWith(CODE_PREFIX)
    ? codeRaw
    : CODE_PREFIX + codeRaw.replace(/^[A-Z]{2}-?/, "");
  readMyName();

  showScreen("screen-waiting");
  $("waiting-title").textContent = "Conectando…";
  $("waiting-code-block").classList.add("hidden");
  $("waiting-status").textContent = "Cargando el módulo de conexión…";
  $("waiting-spinner").classList.remove("hidden");
  $("btn-start-game").classList.add("hidden");
  $("lobby-roster").innerHTML = "";

  try {
    await loadPeerJS();
  } catch (e) {
    $("waiting-title").textContent = "Sin conexión";
    $("waiting-status").textContent =
      "No se pudo cargar el módulo de conexión. Revisa tu internet e inténtalo de nuevo.";
    $("waiting-spinner").classList.add("hidden");
    return;
  }

  $("waiting-status").textContent = "Buscando la sala " + code + "…";

  role = "guest";
  if (peer) {
    try {
      peer.destroy();
    } catch (e) {}
  }
  peer = new Peer(undefined, PEER_OPTS);

  const notFound = () => {
    $("waiting-title").textContent = "Sin conexión";
    $("waiting-status").textContent =
      "No se encontró la sala. Verifica el código.";
    $("waiting-spinner").classList.add("hidden");
  };

  peer.on("open", (id) => {
    myId = id;
    conn = peer.connect(code, { reliable: true });
    setupGuestConnection(notFound);
    // si en 12 s no abre la conexión, avisar
    setTimeout(() => {
      if (conn && !conn.open && role === "guest" && !game) notFound();
    }, 12000);
  });

  peer.on("error", (err) => {
    notFound();
    toast("Error: " + (err && err.type ? err.type : "no se pudo conectar"));
  });
}

function setupGuestConnection(notFound) {
  conn.on("open", () => {
    conn.send({ type: "join", name: myName });
    $("waiting-title").textContent = "Conectado";
    $("waiting-status").textContent =
      "Esperando a que el anfitrión inicie la partida…";
    $("waiting-spinner").classList.add("hidden");
  });
  conn.on("data", (msg) => handleGuestMessage(msg));
  conn.on("close", () => onHostLeft());
  conn.on("error", () => notFound());
}

function onHostLeft() {
  if (role !== "guest") return;
  toast("El anfitrión cerró la sala");
  resetToLobby();
}

/* ---------------------------------------------------------------------- */
/* Mensajería del host (autoridad de la partida)                          */
/* ---------------------------------------------------------------------- */

/* Vista que recibe cada jugador: sin manos ajenas ni cartas sin revelar. */
function stateFor(viewerId) {
  const revealed = game.phase === "resolved" || game.phase === "gameover";
  return {
    ...game,
    pot: game.pot.map(() => null),
    players: game.players.map((p) => ({
      ...p,
      hand: p.hand.map(() => null),
      current: p.id === viewerId || revealed ? p.current : null,
    })),
  };
}

function broadcastState() {
  if (!game) return;
  conns.forEach((c, id) => {
    if (c.open) c.send({ type: "state", game: stateFor(id) });
  });
}

function handleHostMessage(fromId, msg) {
  if (!msg || typeof msg.type !== "string" || !game) return;
  if (msg.type === "join") {
    handleJoin(fromId, msg.name);
  } else if (msg.type === "chooseStat") {
    if (game.turn === fromId && STAT_KEYS.includes(msg.stat))
      hostResolveChoice(msg.stat);
  } else if (msg.type === "rematchRequest") {
    if (game.phase === "gameover") beginNewGame();
  } else if (msg.type === "leave") {
    hostHandleDisconnect(fromId);
  }
}

function handleJoin(fromId, name) {
  if (game.players.some((p) => p.id === fromId)) return;
  if (game.phase !== "lobby" || game.players.length >= MAX_PLAYERS) {
    const c = conns.get(fromId);
    if (c && c.open)
      c.send({
        type: "joinError",
        reason: game.phase !== "lobby" ? "started" : "full",
      });
    return;
  }
  let cleanName = sanitizeName(name) || "Jugador";
  // evitar nombres repetidos
  const base = cleanName;
  let n = 2;
  while (game.players.some((p) => p.name === cleanName))
    cleanName = base.slice(0, 15) + " " + n++;
  game.players.push({
    id: fromId,
    name: cleanName,
    hand: [],
    current: null,
    eliminated: false,
    connected: true,
  });
  game.log = cleanName + " se unió a la sala.";
  renderLobby();
  broadcastState();
}

function hostHandleDisconnect(id) {
  conns.delete(id);
  if (!game) return;
  const idx = game.players.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const p = game.players[idx];

  if (game.phase === "lobby") {
    game.players.splice(idx, 1);
    game.log = p.name + " salió de la sala.";
    renderLobby();
    broadcastState();
    return;
  }

  if (p.connected === false) return; // ya procesado (leave + close)
  p.connected = false;

  if (game.phase === "gameover") {
    // Marcado como ausente: no entrará en la revancha
    broadcastState();
    return;
  }

  p.eliminated = true;

  // Sus cartas NO se pierden: se reparten entre quienes siguen jugando
  const rest = game.players.filter((x) => !x.eliminated);
  const cards = p.hand.splice(0);
  p.current = null;
  if (rest.length)
    shuffle(cards).forEach((c, i) => rest[i % rest.length].hand.push(c));

  if (game.tiedPlayers)
    game.tiedPlayers = game.tiedPlayers.filter((x) => x !== id);
  game.log =
    p.name + " salió de la partida; sus cartas se repartieron entre el resto.";

  const active = game.players.filter((x) => !x.eliminated && x.hand.length > 0);
  if (active.length <= 1) {
    finishGame();
  } else if (game.phase === "choosing") {
    if (game.turn === id) game.turn = nextActivePlayerId(id);
    hostStartRound(); // recalcula quiÃ©n juega carta (y resuelve empates rotos)
    if (game.phase === "choosing") {
      const t = game.players.find((x) => x.id === game.turn);
      if (!t || t.eliminated || !t.current) {
        const c = game.players.find((x) => !x.eliminated && x.current);
        if (c) game.turn = c.id;
      }
    }
  }
  broadcastState();
  renderGame();
  if (game.phase === "gameover") showGameOver();
}

/* ---------------------------------------------------------------------- */
/* Lógica de partida â el HOST es autoridad                               */
/* ---------------------------------------------------------------------- */
function backToLobbyPhase(msg) {
  game.phase = "lobby";
  game.players = game.players.filter((p) => p.connected !== false);
  game.players.forEach((p) => {
    p.hand = [];
    p.current = null;
    p.eliminated = false;
  });
  game.log = msg;
  renderLobby();
  showScreen("screen-waiting");
  broadcastState();
  toast(msg);
}

function beginNewGame() {
  clearTimeout(resolveTimer);
  clearTimeout(turnWatchdog);
  clearTimeout(botTimer);
  const active = game.players.filter((p) => p.connected !== false);
  const n = active.length;
  const deck = shuffle(getDeckForGame());

  if (n < MIN_PLAYERS) {
    backToLobbyPhase(
      "Faltan jugadores: se necesitan al menos " + MIN_PLAYERS + ".",
    );
    return;
  }
  if (deck.length < n) {
    if (game.phase === "gameover")
      backToLobbyPhase("Hay pocas cartas para tantos jugadores.");
    else
      toast("Hay pocas cartas (" + deck.length + ") para " + n + " jugadores.");
    return;
  }

  game.players = active;
  game.players.forEach((p) => {
    p.hand = [];
    p.current = null;
    p.eliminated = false;
  });
  deck.forEach((card, i) => {
    game.players[i % n].hand.push(card);
  });

  game.turn = game.players[randInt(0, n - 1)].id;
  game.pot = [];
  game.phase = "choosing";
  game.lastStat = null;
  game.roundWinner = null;
  game.chooser = null;
  game.tiedPlayers = null;
  game.winner = null;
  game.totalCards = deck.length;
  game.round = 0;
  game.log =
    "Â¡Comienza la partida! " +
    n +
    " jugadores se reparten " +
    deck.length +
    " cartas.";

  hostStartRound();
  broadcastState();
  renderGame();
  showScreen("screen-game");
}

function hostStartRound() {
  const active = game.players.filter((p) => !p.eliminated && p.hand.length > 0);
  if (active.length <= 1) {
    finishGame();
    return;
  }

  // Si venimos de un empate, solo los empatados vuelven a jugar carta.
  let contenders = active;
  if (game.tiedPlayers) {
    contenders = active.filter((p) => game.tiedPlayers.includes(p.id));

    // Si queda 0 o 1 contendiente, el bote no puede quedar huérfano.
    if (contenders.length <= 1) {
      const receiver = contenders[0] || active[0];
      receiver.hand.push(...game.pot);
      game.pot = [];
      game.log = receiver.name + " se lleva el bote del empate.";
      game.tiedPlayers = null;
      hostStartRound();
      return;
    }
  }

  game.players.forEach((p) => {
    p.current = null;
  });
  contenders.forEach((p) => {
    p.current = p.hand[0];
  });
  game.phase = "choosing";
  game.turnDeadline = Date.now() + CONFIG.turnSeconds * 1000;
  scheduleTurnWatchdog();
  maybeScheduleBot();
}

function finishGame() {
  clearTimeout(resolveTimer);
  clearTimeout(turnWatchdog);
  clearTimeout(botTimer);
  game.phase = "gameover";
  const active = game.players.filter((p) => !p.eliminated && p.hand.length > 0);
  if (active.length >= 1) {
    game.winner = active[0].id;
  } else {
    const ranked = game.players
      .slice()
      .sort((a, b) => b.hand.length - a.hand.length);
    game.winner = ranked.length ? ranked[0].id : null;
  }
}

function nextActivePlayerId(fromId) {
  const n = game.players.length;
  const idx = game.players.findIndex((p) => p.id === fromId);
  for (let step = 1; step <= n; step++) {
    const cand = game.players[(idx + step + n) % n];
    if (cand && !cand.eliminated) return cand.id;
  }
  return fromId;
}

function hostResolveChoice(stat) {
  clearTimeout(turnWatchdog);
  clearTimeout(botTimer);
  if (role !== "host" || !game || game.phase !== "choosing") return;
  if (!STAT_KEYS.includes(stat)) return;
  const chooser = game.turn;
  const chooserPlayer = game.players.find((p) => p.id === chooser);
  if (!chooserPlayer || !chooserPlayer.current) return;

  const active = game.players.filter((p) => !p.eliminated && p.current);
  const values = active.map((p) => ({
    id: p.id,
    name: p.name,
    val: p.current.stats[stat],
  }));
  const maxVal = Math.max(...values.map((v) => v.val));
  const winners = values.filter((v) => v.val === maxVal);

  const roundCards = active.map((p) => p.current).concat(game.pot);
  active.forEach((p) => p.hand.shift());

  let roundWinner;
  if (winners.length > 1) {
    roundWinner = "tie";
    game.pot = roundCards;
    game.tiedPlayers = winners.map((w) => w.id);
    game.log =
      STAT_LABELS[stat] +
      ": empate a " +
      maxVal +
      " entre " +
      winners.map((w) => w.name).join(", ") +
      " → " +
      roundCards.length +
      " cartas quedan en juego. Solo " +
      winners.map((w) => w.name).join(" y ") +
      " seguirán hasta desempatar.";
  } else {
    roundWinner = winners[0].id;
    game.pot = [];
    game.tiedPlayers = null;
    const winnerPlayer = game.players.find((p) => p.id === roundWinner);
    const winnerCard = winnerPlayer.current;
    winnerPlayer.hand.push(...roundCards);
    // Solo se destaca la carta ganadora (en positivo); nunca se nombra a las demás.
    const whoLabel =
      roundWinner === chooser
        ? "¡" + winnerPlayer.name + " gana la ronda!"
        : winnerPlayer.name + " se lleva la ronda";
    game.log =
      STAT_LABELS[stat] +
      ": ✨ " +
      winnerCard.name +
      " brilla con " +
      maxVal +
      " → " +
      whoLabel +
      " (+" +
      roundCards.length +
      " cartas)";
  }

  game.players.forEach((p) => {
    if (!p.eliminated && p.hand.length === 0) p.eliminated = true;
  });

  game.phase = "resolved";
  game.lastStat = stat;
  game.roundWinner = roundWinner;
  game.chooser = chooser;
  game.round = (game.round || 0) + 1;
  game.resolveKey = (game.resolveKey || 0) + 1;
  game.turnDeadline = null;

  broadcastState();
  renderGame();

  // tras una pausa para mostrar el resultado, se decide el siguiente turno
  const thisGame = game;
  clearTimeout(resolveTimer);
  resolveTimer = setTimeout(() => {
    if (game !== thisGame || !game || game.phase !== "resolved") return;
    const active2 = game.players.filter((p) => !p.eliminated);
    if (active2.length <= 1) {
      finishGame();
    } else {
      let preferred;
      if (roundWinner === "tie") {
        const tiedActive = (game.tiedPlayers || []).filter((id) => {
          const pl = game.players.find((p) => p.id === id);
          return pl && !pl.eliminated;
        });
        preferred = tiedActive.includes(chooser)
          ? chooser
          : tiedActive[0] || chooser;
      } else {
        preferred = roundWinner;
      }
      const preferredPlayer = game.players.find((p) => p.id === preferred);
      game.turn =
        preferredPlayer && !preferredPlayer.eliminated
          ? preferred
          : nextActivePlayerId(preferred);
      hostStartRound();
      // garantía: quien tiene el turno debe tener carta en mesa
      if (game.phase === "choosing") {
        const t = game.players.find((p) => p.id === game.turn);
        if (!t || !t.current) {
          const c = game.players.find((p) => !p.eliminated && p.current);
          if (c) game.turn = c.id;
        }
      }
    }
    broadcastState();
    renderGame();
    if (game.phase === "gameover") showGameOver();
  }, CONFIG.resolveMs);
}

function chooseStat(stat) {
  if (!game || game.phase !== "choosing") return;
  if (game.turn !== myId) return;
  if (!STAT_KEYS.includes(stat)) return;

  SFX.play("click");

  if (role === "host") {
    hostResolveChoice(stat);
  } else if (conn && conn.open) {
    conn.send({ type: "chooseStat", stat });
  } else {
    toast("Sin conexión con el anfitrión");
  }
}

/* ---------------------------------------------------------------------- */
/* Mensajería del invitado                                                */
/* ---------------------------------------------------------------------- */
function handleGuestMessage(msg) {
  if (!msg || !msg.type) return;
  if (msg.type === "state" && msg.game) {
    game = msg.game;
    if (game.phase === "lobby") {
      renderLobby();
      showScreen("screen-waiting");
    } else {
      renderGame();
      showScreen("screen-game");
      if (game.phase === "gameover") showGameOver();
    }
  } else if (msg.type === "joinError") {
    toast(
      msg.reason === "full"
        ? "La sala está llena (máx. " + MAX_PLAYERS + ")"
        : "La partida ya había comenzado",
    );
    resetToLobby();
  }
}

/* ---------------------------------------------------------------------- */
/* Render - sala de espera                                                */
/* ---------------------------------------------------------------------- */
function renderLobby() {
  if (!game) return;
  const roster = $("lobby-roster");
  roster.innerHTML = "";
  if (!game.players.length) {
    roster.appendChild(h("div", "roster-empty", "Nadie se ha unido todavía…"));
  }
  game.players.forEach((p) => {
    const row = h("div", "roster-row" + (p.id === myId ? " me" : ""));
    const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
    const info = h("div", "roster-info");
    info.appendChild(
      h("div", "roster-name", p.name + (p.id === myId ? " (tú)" : "")),
    );
    info.appendChild(
      h("div", "roster-tag", p.id === "host" ? "Anfitrión" : "Jugador"),
    );
    row.appendChild(makeHex(p.id, null, initial));
    row.appendChild(info);
    row.appendChild(
      h("span", "roster-dot" + (p.connected === false ? " off" : "")),
    );
    roster.appendChild(row);
  });

  $("waiting-status").textContent =
    role === "host"
      ? "Jugadores conectados: " + game.players.length + " / " + MAX_PLAYERS
      : "Jugadores conectados: " +
        game.players.length +
        " / " +
        MAX_PLAYERS +
        " — esperando al anfitrión…";

  const startBtn = $("btn-start-game");
  if (role === "host") {
    startBtn.classList.remove("hidden");
    startBtn.disabled = game.players.length < MIN_PLAYERS;
    startBtn.textContent =
      game.players.length < MIN_PLAYERS
        ? "Se necesitan al menos " + MIN_PLAYERS + " jugadores"
        : "▶ Iniciar partida (" + game.players.length + " jugadores)";
  } else {
    startBtn.classList.add("hidden");
  }
}

/* ---------------------------------------------------------------------- */
/* Render — partida                                                       */
/* ---------------------------------------------------------------------- */
function renderGame() {
  if (!game) return;
  const me = game.players.find((p) => p.id === myId);
  if (!me) return;
  const others = game.players.filter((p) => p.id !== myId);

  $("hud-room-code").textContent =
    hostCode || (conn && conn.peer) || (soloMode ? "PRÁCTICA" : "â");
  $("hud-player-count").textContent = game.players.filter(
    (p) => p.connected !== false,
  ).length;
  $("hud-round").textContent = game.round || 0;
  $("hud-my-cards").textContent = me.hand.length;

  const potInfo = $("pot-tag");
  if (game.pot && game.pot.length) {
    potInfo.textContent =
      "🔥 " + game.pot.length + " cartas en juego por el empate";
    potInfo.classList.remove("hidden");
  } else {
    potInfo.classList.add("hidden");
  }

  const banner = $("turn-banner");
  const isMyTurn =
    game.turn === myId && game.phase === "choosing" && !!me.current;
  banner.classList.remove("mine", "theirs");
  const isFrozenByTie =
    game.phase === "choosing" &&
    game.tiedPlayers &&
    game.tiedPlayers.length &&
    !game.tiedPlayers.includes(myId) &&
    !me.eliminated;

  if (game.phase === "gameover") {
    banner.textContent = "Partida finalizada";
  } else if (isMyTurn) {
    banner.textContent = "🎯 Tu turno — elige un atributo";
    banner.classList.add("mine");
  } else if (isFrozenByTie) {
    const tiedNames = game.tiedPlayers
      .map((id) => (game.players.find((p) => p.id === id) || {}).name)
      .filter(Boolean)
      .join(" y ");
    banner.textContent =
      "🔥 Empate entre " + tiedNames + " — espera a que se resuelva";
    banner.classList.add("theirs");
  } else {
    const turnPlayer = game.players.find((p) => p.id === game.turn);
    banner.textContent =
      turnPlayer && turnPlayer.isBot
        ? "🤖 " + turnPlayer.name + " está pensando…"
        : "⏳ Turno de " + (turnPlayer ? turnPlayer.name : "…") + "…";
    banner.classList.add("theirs");
  }

  // Pista, temporizador y sonido solo cuando toca (evita repetir en cada actualización)
  const turnKey =
    game.phase +
    ":" +
    game.turn +
    ":" +
    (game.round || 0) +
    ":" +
    (game.resolveKey || 0);
  const hint = $("turn-hint");
  if (isMyTurn) {
    hint.classList.remove("hidden");
    if (lastTurnKey !== turnKey) {
      lastTurnKey = turnKey;
      SFX.play("turn");
      if (navigator.vibrate) {
        try {
          navigator.vibrate(80);
        } catch (e) {}
      }
      startTurnTimerBar();
    }
  } else {
    hint.classList.add("hidden");
    stopTurnTimerBar();
  }

  if (game.phase === "resolved" && lastResolveKey !== (game.resolveKey || 0)) {
    lastResolveKey = game.resolveKey || 0;
    if (game.roundWinner === me.id) SFX.play("win");
    else if (game.roundWinner === "tie") SFX.play("tie");
    else SFX.play("lose");
  }
  updateResolveProgressBar();

  renderOpponents(others);
  renderMyCard(me, isMyTurn);
  $("log-box").textContent = game.log || "";
}

function renderOpponents(others) {
  const strip = $("opponents-strip");
  strip.innerHTML = "";
  const revealed = game.phase === "resolved" || game.phase === "gameover";
  others.forEach((p) => {
    const chip = h(
      "div",
      "opp-chip" +
        (p.id === game.turn && game.phase === "choosing"
          ? " active-turn"
          : "") +
        (p.eliminated ? " eliminated" : ""),
    );
    const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
    chip.appendChild(
      makeHex(p.id, revealed && p.current ? p.current : null, initial),
    );
    chip.appendChild(h("div", "roster-name", p.name));
    chip.appendChild(
      h(
        "div",
        "opp-count",
        p.eliminated
          ? p.connected === false
            ? "Salió"
            : "Sin cartas"
          : p.hand.length + " cartas",
      ),
    );

    if (revealed && game.lastStat && p.current) {
      const val = p.current.stats[game.lastStat];
      let cls = "tie";
      if (game.roundWinner !== "tie")
        cls = game.roundWinner === p.id ? "win" : "lose";
      const icon = (STAT_LABELS[game.lastStat] || "").split(" ")[0] || "•";
      chip.appendChild(h("span", "opp-stat-result " + cls, icon + " " + val));
    }
    if (revealed && game.roundWinner === p.id)
      chip.appendChild(h("div", "opp-crown", "👑"));
    strip.appendChild(chip);
  });
}

function renderMyCard(me, isMyTurn) {
  const myCard = me.current;
  const cardMineEl = $("card-mine");
  cardMineEl.style.setProperty("--el-color", myCard ? myCard.color : "#ff7a29");
  cardMineEl.querySelector(".el-tag").textContent = myCard
    ? myCard.element
    : "—";
  cardMineEl.querySelector(".card-name").textContent = myCard
    ? myCard.name
    : me.eliminated
      ? "Te quedaste sin cartas"
      : "—";
  $("power-mine").textContent =
    myCard && myCard.superpoder ? "✨ Superpoder: " + myCard.superpoder : "";
  $("quote-mine").textContent =
    myCard && myCard.frase ? "”" + myCard.frase + "”" : "";

  if (myCard) {
    fillMedia($("media-mine"), myCard);
  } else {
    $("media-mine").innerHTML = "";
    $("media-mine").appendChild(h("div", "glyph-fallback", "🂠"));
  }

  const statsBox = $("stats-mine");
  statsBox.innerHTML = "";
  if (myCard) {
    const others = game.players.filter(
      (p) => p.id !== me.id && !p.eliminated && p.current,
    );
    STAT_KEYS.forEach((k) => {
      const row = h("div", "stat-row");
      row.style.setProperty(
        "--pct",
        Math.max(0, Math.min(100, myCard.stats[k])) + "%",
      );
      if (isMyTurn) row.classList.add("clickable");

      let gauge = null;
      if (game.phase === "resolved" && game.lastStat === k) {
        row.classList.add("chosen");
        if (game.roundWinner === me.id) row.classList.add("win");
        else if (game.roundWinner !== "tie") row.classList.add("lose");
        const bestOpp = others.reduce(
          (max, p) => Math.max(max, p.current.stats[k]),
          0,
        );
        const myVal = myCard.stats[k];
        const total = Math.max(1, myVal + bestOpp);
        gauge = h("div", "duel-gauge");
        const gm = h("span", "g-mine");
        gm.style.width = Math.round((myVal / total) * 100) + "%";
        const go = h("span", "g-opp");
        go.style.width = Math.round((bestOpp / total) * 100) + "%";
        gauge.appendChild(gm);
        gauge.appendChild(go);
      }

      row.appendChild(h("span", "k", STAT_LABELS[k]));
      row.appendChild(h("span", "v", String(myCard.stats[k])));
      if (gauge) row.appendChild(gauge);
      if (isMyTurn) row.addEventListener("click", () => chooseStat(k));
      statsBox.appendChild(row);
    });
  }

  cardMineEl.classList.toggle("facedown", !myCard);

  // animación de entrada solo cuando cambia la carta (no en cada actualización)
  const cid = myCard ? myCard.id : "none";
  if (cardMineEl.dataset.cid !== cid) {
    cardMineEl.dataset.cid = cid;
    cardMineEl.classList.remove("card-in");
    void cardMineEl.offsetWidth;
    cardMineEl.classList.add("card-in");
  }
}

function showGameOver() {
  const iWon = game.winner === myId;
  if (iWon) {
    launchConfetti();
    SFX.play("gameover");
  }
  $("go-trophy").textContent = iWon ? "🏆" : "🎉";
  const title = $("go-title");
  const winnerPlayer = game.players.find((p) => p.id === game.winner);
  title.textContent = iWon
    ? "¡Ganaste la partida!"
    : winnerPlayer
      ? winnerPlayer.name + " gana la partida"
      : "Fin de la partida";
  title.className = iWon ? "win" : "lose";
  const total = (game && game.totalCards) || getDeckForGame().length;
  $("go-sub").textContent = iWon
    ? "Reuniste las " + total + " cartas del equipo."
    : winnerPlayer
      ? winnerPlayer.name +
        " reunió las " +
        total +
        " cartas del equipo. ¡Buena partida!"
      : "";

  const standings = $("final-standings");
  standings.innerHTML = "";
  game.players
    .slice()
    .sort((a, b) => b.hand.length - a.hand.length)
    .forEach((p, i) => {
      const row = h("div", "roster-row" + (p.id === myId ? " me" : ""));
      const hex = makeHex(p.id, null, ["🥇", "🥈", "🥉"][i] || String(i + 1));
      const info = h("div", "roster-info");
      info.appendChild(
        h("div", "roster-name", p.name + (p.id === myId ? " (tú)" : "")),
      );
      row.appendChild(hex);
      row.appendChild(info);
      row.appendChild(h("div", "opp-count", p.hand.length + " cartas"));
      standings.appendChild(row);
    });

  showScreen("screen-gameover");
}

/* Reglas de juego limpio visibles en el inicio (se llenan desde CONFIG) */
function renderReglas() {
  const ul = $("respect-list");
  if (!ul) return;
  const items = [
    "Cada carta fue aprobada por su dueño o dueña. Nadie aparece sin haber dicho que sí.",
    "Todas las cartas suman los mismos " +
      CONFIG.presupuestoPuntos +
      " puntos: nadie es «mejor» que otra persona, solo distinto.",
    "Solo hay fortalezas y superpoderes. No existen atributos negativos ni rankings de personas.",
    "Si prefieres no aparecer, avísale " +
      CONFIG.contactoRetiro +
      " y tu carta se retira.",
  ];
  ul.innerHTML = "";
  items.forEach((t) => ul.appendChild(h("li", null, t)));
  $("app-subtitle").textContent = "Edición Equipo · Cartas de superpoderes";
  $("footer-version").textContent =
    CONFIG.titulo + " · Edición Equipo • v2.1.0";
}

/* ---------------------------------------------------------------------- */
/* Reset / navegación                                                     */
/* ---------------------------------------------------------------------- */
function resetToLobby() {
  clearTimeout(resolveTimer);
  clearTimeout(turnWatchdog);
  clearTimeout(botTimer);
  soloMode = false;
  stopTurnTimerBar();
  try {
    if (conn) conn.close();
  } catch (e) {}
  try {
    if (peer) peer.destroy();
  } catch (e) {}
  conn = null;
  peer = null;
  role = null;
  myId = null;
  game = null;
  hostCode = null;
  conns = new Map();
  $("input-join-code").value = "";
  showScreen("screen-lobby");
}

/* ---------------------------------------------------------------------- */
/* Identidad visual â modo claro / oscuro                                 */
/* ---------------------------------------------------------------------- */
function applyTheme(theme, persist) {
  const root = document.documentElement;
  const mode = theme === "light" ? "light" : "dark";
  root.setAttribute("data-theme", mode);
  if (persist) {
    try {
      localStorage.setItem("superstum-theme", mode);
    } catch (e) {}
  }

  const metaTheme = $("meta-theme-color");
  if (metaTheme)
    metaTheme.setAttribute("content", mode === "dark" ? "#080b10" : "#f3f6f9");

  const icon = $("theme-icon");
  const label = $("theme-label");
  if (icon) icon.textContent = mode === "dark" ?  "☀" : "☾";
  if (label) label.textContent = mode === "dark" ? "Modo claro" : "Modo oscuro";
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("superstum-theme");
  } catch (e) {}
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
    return;
  }
  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");
}

/* =====================================================================
   MEJORAS v2.1 â sonidos (WebAudio, sin archivos), confeti, modo
   práctica con rivales virtuales, temporizador de turno y barras.
   ===================================================================== */
let soloMode = false;
let turnWatchdog = null;
let botTimer = null;
let lastTurnKey = null;
let lastResolveKey = 0;
let lastProgressKey = 0;
let timerRAF = null;

/* ------------------- Sonidos (WebAudio, sin descargas) --------------- */
let audioCtx = null;
let soundOn = true;

function initSound() {
  try {
    soundOn = localStorage.getItem("superstum-sound") !== "off";
  } catch (e) {}
  updateSoundBtn();
}

function updateSoundBtn() {
  const b = $("btn-sound");
  if (b) b.textContent = soundOn ? "🔊" : "🔇";
}

function toggleSound() {
  soundOn = !soundOn;
  try {
    localStorage.setItem("superstum-sound", soundOn ? "on" : "off");
  } catch (e) {}
  updateSoundBtn();
  if (soundOn) SFX.play("click");
}

function ensureAudio() {
  if (!soundOn) return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    try {
      audioCtx.resume();
    } catch (e) {}
  }
  return audioCtx;
}

function sfxTone(freq, delay, dur, type, vol) {
  const ctx = ensureAudio();
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch (e) {}
}

const SFX = {
  play(name) {
    if (!soundOn) return;
    if (name === "click") sfxTone(660, 0, 0.06, "triangle", 0.05);
    else if (name === "turn") {
      sfxTone(784, 0, 0.09, "sine", 0.07);
      sfxTone(1175, 0.09, 0.12, "sine", 0.07);
    } else if (name === "win") {
      [523, 659, 784, 1047].forEach((f, i) =>
        sfxTone(f, i * 0.07, 0.12, "triangle", 0.06),
      );
    } else if (name === "lose") {
      sfxTone(392, 0, 0.14, "sine", 0.05);
      sfxTone(311, 0.13, 0.2, "sine", 0.05);
    } else if (name === "tie") {
      sfxTone(587, 0, 0.1, "sine", 0.06);
      sfxTone(587, 0.13, 0.1, "sine", 0.06);
    } else if (name === "gameover") {
      [523, 659, 784, 1047, 1319].forEach((f, i) =>
        sfxTone(f, i * 0.09, 0.18, "triangle", 0.07),
      );
    }
  },
};

/* ------------------- Confeti al ganar ------------------------------- */
function launchConfetti() {
  const cv = $("confetti");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.max(1, window.innerWidth * dpr);
  cv.height = Math.max(1, window.innerHeight * dpr);
  cv.classList.add("show");
  const colors = [
    "#ffc857",
    "#17e3a6",
    "#ff7a29",
    "#9b7bff",
    "#3cd2ff",
    "#ffffff",
  ];
  const parts = [];
  for (let i = 0; i < 140; i++) {
    parts.push({
      x: Math.random() * cv.width,
      y: -Math.random() * cv.height * 0.4,
      w: (6 + Math.random() * 6) * dpr,
      h: (8 + Math.random() * 8) * dpr,
      vy: (1.6 + Math.random() * 2.6) * dpr,
      vx: (Math.random() - 0.5) * 1.6 * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      c: colors[randInt(0, colors.length - 1)],
    });
  }
  const t0 = performance.now();
  const frame = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (performance.now() - t0 < 4200) requestAnimationFrame(frame);
    else {
      ctx.clearRect(0, 0, cv.width, cv.height);
      cv.classList.remove("show");
    }
  };
  requestAnimationFrame(frame);
}

/* ------------------- Temporizador de turno (visual) ----------------- */
function startTurnTimerBar() {
  const wrap = $("turn-timer"),
    fill = $("turn-timer-fill");
  if (!wrap || !fill) return;
  wrap.classList.remove("hidden");
  cancelAnimationFrame(timerRAF);
  const deadline = game && game.turnDeadline;
  if (!deadline) {
    fill.style.width = "100%";
    return;
  }
  const total = CONFIG.turnSeconds * 1000;
  const tick = () => {
    if (!game || game.phase !== "choosing" || game.turn !== myId) {
      stopTurnTimerBar();
      return;
    }
    const remain = Math.max(0, deadline - Date.now());
    fill.style.width = Math.max(0, Math.min(100, (remain / total) * 100)) + "%";
    if (remain <= 0) {
      stopTurnTimerBar();
      return;
    }
    timerRAF = requestAnimationFrame(tick);
  };
  tick();
}

function stopTurnTimerBar() {
  cancelAnimationFrame(timerRAF);
  timerRAF = null;
  const wrap = $("turn-timer");
  if (wrap) wrap.classList.add("hidden");
}

/* Barra dentro del log mientras se muestra el resultado de la ronda */
function updateResolveProgressBar() {
  const box = $("log-box");
  if (!box) return;
  if (game.phase === "resolved") {
    const key = game.resolveKey || 0;
    if (lastProgressKey !== key) {
      lastProgressKey = key;
      box.classList.remove("resolving");
      void box.offsetWidth;
      box.style.setProperty("--resolve-ms", CONFIG.resolveMs + "ms");
      box.classList.add("resolving");
    }
  } else {
    lastProgressKey = 0;
    box.classList.remove("resolving");
  }
}

/* ------------------- Reloj del host: si nadie elige, se juega al azar */
function scheduleTurnWatchdog() {
  clearTimeout(turnWatchdog);
  if (!game || game.phase !== "choosing") return;
  const t = game.players.find((p) => p.id === game.turn);
  if (!t || t.isBot) return; // los bots tienen su propio temporizador
  turnWatchdog = setTimeout(
    () => {
      if (!game || game.phase !== "choosing") return;
      const chooser = game.players.find((p) => p.id === game.turn);
      if (!chooser || !chooser.current) return;
      const stat = STAT_KEYS[randInt(0, STAT_KEYS.length - 1)];
      toast("⏱️ Tiempo agotado: se jugó " + STAT_LABELS[stat] + " al azar");
      hostResolveChoice(stat);
    },
    CONFIG.turnSeconds * 1000 + 800,
  );
}

/* ------------------- Modo práctica: rivales virtuales ----------------- */
const BOT_NAMES = ["🤖 Bot Turbo", "👾 Bot Nova", "🦾 Bot Byte"];

function startSoloGame() {
  readMyName();
  soloMode = true;
  role = "host";
  myId = "host";
  conns = new Map();
  hostCode = null;
  game = {
    phase: "lobby",
    players: [
      {
        id: "host",
        name: myName,
        hand: [],
        current: null,
        eliminated: false,
        connected: true,
      },
      ...BOT_NAMES.map((n, i) => ({
        id: "bot" + i,
        name: n,
        hand: [],
        current: null,
        eliminated: false,
        connected: true,
        isBot: true,
      })),
    ],
    turn: null,
    pot: [],
    lastStat: null,
    roundWinner: null,
    chooser: null,
    tiedPlayers: null,
    log: "",
    winner: null,
    totalCards: 0,
    round: 0,
  };
  beginNewGame();
}

function botPickStat(bot) {
  const card = bot.current;
  if (!card) return STAT_KEYS[randInt(0, STAT_KEYS.length - 1)];
  // Casi siempre juega su mejor fortaleza; a veces sorprende
  if (Math.random() < 0.78) {
    let best = STAT_KEYS[0];
    STAT_KEYS.forEach((k) => {
      if (card.stats[k] > card.stats[best]) best = k;
    });
    return best;
  }
  return STAT_KEYS[randInt(0, STAT_KEYS.length - 1)];
}

function maybeScheduleBot() {
  clearTimeout(botTimer);
  if (!soloMode || !game || game.phase !== "choosing") return;
  const t = game.players.find((p) => p.id === game.turn);
  if (!t || !t.isBot || !t.current) return;
  botTimer = setTimeout(
    () => {
      if (!soloMode || !game || game.phase !== "choosing") return;
      const bot = game.players.find((p) => p.id === game.turn);
      if (!bot || !bot.isBot) return;
      hostResolveChoice(botPickStat(bot));
    },
    CONFIG.botDelayMs + randInt(0, 700),
  );
}

/* ---------------------------------------------------------------------- */
/* Eventos de UI                                                          */
/* ---------------------------------------------------------------------- */
$("btn-goto-host").addEventListener("click", startHostFlow);
$("btn-join").addEventListener("click", startJoinFlow);
$("btn-solo").addEventListener("click", startSoloGame);
$("btn-help").addEventListener("click", () => showScreen("screen-help"));
/* Cierra la ayuda volviendo a la pantalla donde estabas */
function closeHelp() {
  try {
    localStorage.setItem("superstum-seen-help", "1");
  } catch (e) {}
  if (!game) {
    showScreen("screen-lobby");
    return;
  }
  if (game.phase === "choosing" || game.phase === "resolved")
    showScreen("screen-game");
  else if (game.phase === "gameover") showScreen("screen-gameover");
  else if (game.phase === "lobby") showScreen("screen-waiting");
  else showScreen("screen-lobby");
}

$("btn-help-ok").addEventListener("click", () => {
  try {
    localStorage.setItem("superstum-seen-help", "1");
  } catch (e) {}
  closeHelp();
});
$("btn-help-solo").addEventListener("click", () => {
  try {
    localStorage.setItem("superstum-seen-help", "1");
  } catch (e) {}
  startSoloGame();
});
$("btn-sound").addEventListener("click", toggleSound);
$("btn-share-code").addEventListener("click", () => {
  const code = $("host-code").textContent;
  const msg = "¡Únete a mi partida de SUPER STUM! Código de sala: " + code;
  if (navigator.share) {
    navigator.share({ text: msg }).catch(() => {});
  } else {
    window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
  }
});

// El código se escribe solo en mayúsculas y sin caracteres raros
$("input-join-code").addEventListener("input", () => {
  const el = $("input-join-code");
  const lim = el.value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 8);
  if (el.value !== lim) el.value = lim;
});
$("input-join-code").addEventListener("keydown", (e) => {
  if (e.key === "Enter") startJoinFlow();
});
$("input-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.preventDefault();
});

$("btn-copy-code").addEventListener("click", () => {
  const code = $("host-code").textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(code)
      .then(() => toast("Código copiado"))
      .catch(() => toast(code));
  } else {
    toast(code);
  }
});

$("btn-start-game").addEventListener("click", () => {
  if (role !== "host" || !game || game.players.length < MIN_PLAYERS) return;
  beginNewGame();
});

$("btn-cancel-wait").addEventListener("click", resetToLobby);
$("btn-leave-game").addEventListener("click", () => {
  if (role === "guest" && conn && conn.open) conn.send({ type: "leave" });
  resetToLobby();
});

$("btn-rematch").addEventListener("click", () => {
  if (role === "host") {
    beginNewGame();
  } else {
    if (conn && conn.open) conn.send({ type: "rematchRequest" });
    $("go-sub").textContent =
      "Esperando que el anfitrión inicie una nueva partidaâ¦";
  }
});
$("btn-back-lobby").addEventListener("click", () => {
  if (role === "guest" && conn && conn.open) conn.send({ type: "leave" });
  resetToLobby();
});

$("btn-theme").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "light" ? "dark" : "light", true);
});

// Si el usuario no eligió manualmente, seguir el cambio del sistema
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem("superstum-theme");
    } catch (err) {}
    if (saved !== "light" && saved !== "dark")
      applyTheme(e.matches ? "light" : "dark");
  };
  if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
}

initTheme();
renderReglas();
initSound();

// Recupera el último nombre usado para no escribirlo cada vez
try {
  const savedName = localStorage.getItem("superstum-name");
  if (savedName) $("input-name").value = savedName;
} catch (e) {}

// Primera visita: mostrar cómo se juega antes de nada
try {
  if (!localStorage.getItem("superstum-seen-help")) showScreen("screen-help");
} catch (e) {}

// Modo revisión: agrega ?admin a la dirección para ver si las cartas están bien armadas
if (/[?&]admin\b/.test(location.search)) {
  const total = EQUIPO.filter(cartaValida).length;
  alert(
    "Cartas participantes: " +
      total +
      "\n" +
      (PROBLEMAS_EQUIPO.length
        ? PROBLEMAS_EQUIPO.join("\n")
        : "Todas las cartas están balanceadas ✅"),
  );
}

/* ---------------------------------------------------------------------- */
/* PWA â registro del service worker                                     */
/* ---------------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
