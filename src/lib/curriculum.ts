/**
 * El guion del curso.
 *
 * Todo el curso ES una conversación con la IA. Aquí vive esa conversación
 * como una lista de "beats" (momentos). El motor (ChatApp) los reproduce
 * en orden. Algunos avanzan solos; otros esperan a que la persona actúe
 * desde el composer de abajo (continuar o escribir) o dentro del mensaje.
 *
 * Tono: claro y general. La HISTORIA se cuenta sin marcas (para explicar el
 * origen en general); todo lo PRÁCTICO es "muy Claude", porque es la IA que
 * el equipo va a usar.
 */

export interface Module {
  id: string;
  act: number;
  title: string;
  short: string;
}

/** Los 4 actos → mapa lateral de progreso. */
export const MODULES: Module[] = [
  { id: "historia", act: 1, title: "De dónde salió la IA", short: "Historia" },
  { id: "aprender", act: 1, title: "Cómo aprendió", short: "Aprendizaje" },
  { id: "prompt", act: 2, title: "El prompt", short: "Prompt" },
  { id: "token", act: 2, title: "Los tokens", short: "Tokens" },
  { id: "generar", act: 3, title: "Cómo te responde", short: "Generación" },
  { id: "contexto", act: 3, title: "Su memoria", short: "Contexto" },
  { id: "errores", act: 3, title: "Cuándo se equivoca", short: "Límites" },
  { id: "prompts-buenos", act: 4, title: "Prompts que funcionan", short: "Escribir bien" },
  { id: "multimodal", act: 4, title: "Ver, oír y crear", short: "Multimodal" },
  { id: "modelo", act: 4, title: "Qué Claude usar", short: "Modelos" },
  { id: "mcp", act: 4, title: "Herramientas (MCP)", short: "MCP" },
  { id: "usos", act: 4, title: "Usos reales", short: "Usos" },
];

export const ACTS: Record<number, string> = {
  1: "Antes de escribir",
  2: "Escribes tú",
  3: "Te responde",
  4: "Lo usas de verdad",
};

/* ------------------------------------------------------------------ */
/* Tipos de beat                                                       */
/* ------------------------------------------------------------------ */

interface Base {
  module: string;
}

export interface SayBeat extends Base {
  type: "say";
  text: string;
  pause?: number;
}

export interface YouBeat extends Base {
  type: "you";
  text: string;
}

export interface ContinueBeat extends Base {
  type: "continue";
  label?: string;
}

export interface CardBeat extends Base {
  type: "card";
  icon: string;
  title: string;
  body: string;
}

export interface PromptBeat extends Base {
  type: "prompt";
  placeholder: string;
  react: string;
}

export interface TokensBeat extends Base {
  type: "tokens";
  fallback: string;
}

/** Línea de tiempo de la historia. Obligatorio explorarla para avanzar. */
export interface TimelineBeat extends Base {
  type: "timeline";
}

export interface PredictBeat extends Base {
  type: "predict";
  sentence: string;
  options: string[];
  answer: number;
}

export interface GenerateBeat extends Base {
  type: "generate";
  text: string;
}

/** Predictor animado: construye una frase eligiendo la siguiente palabra. */
export interface PredictorBeat extends Base {
  type: "predictor";
}

/** Viaje al servidor: el mensaje y el contexto viajan, me ejecuto, vuelve. */
export interface ServerFlowBeat extends Base {
  type: "serverflow";
}

export interface ContextBeat extends Base {
  type: "context";
}

/** Alucinación animada: responde con datos inventados pero muy seguros. */
export interface HallucinationBeat extends Base {
  type: "hallucination";
}

export interface CompareBeat extends Base {
  type: "compare";
  bad: { prompt: string; answer: string };
  good: { prompt: string; answer: string };
}

/** Demo multimodal: la IA ve, oye y crea (imagen, audio y vídeo reales). */
export interface MultimodalBeat extends Base {
  type: "multimodal";
}

/** Tarjeta de los modelos de Claude. */
export interface ModelsBeat extends Base {
  type: "models";
}

export interface McpBeat extends Base {
  type: "mcp";
}

/** Panel de conectores: cómo se le añaden herramientas a Claude. */
export interface ConnectorsBeat extends Base {
  type: "connectors";
}

export interface UsesBeat extends Base {
  type: "uses";
}

export interface FinishBeat extends Base {
  type: "finish";
}

export type Beat =
  | SayBeat
  | YouBeat
  | ContinueBeat
  | CardBeat
  | PromptBeat
  | TokensBeat
  | TimelineBeat
  | PredictBeat
  | GenerateBeat
  | PredictorBeat
  | ServerFlowBeat
  | ContextBeat
  | HallucinationBeat
  | CompareBeat
  | MultimodalBeat
  | ModelsBeat
  | McpBeat
  | ConnectorsBeat
  | UsesBeat
  | FinishBeat;

/* ------------------------------------------------------------------ */
/* El guion                                                            */
/* ------------------------------------------------------------------ */

export const SCRIPT: Beat[] = [
  /* ===== ACTO 1 · Antes de escribir ============================== */
  { module: "historia", type: "say", text: "Hola. Soy una inteligencia artificial, y este curso te lo doy yo misma." },
  { module: "historia", type: "say", text: "Mucha gente me usa a diario sin entender qué ocurre por dentro. Al terminar, tú sí lo vas a entender — y no leyendo teoría, sino viéndolo aquí mismo mientras hablamos." },
  { module: "historia", type: "say", text: "Empecemos por el principio: de dónde vengo. No nací de repente; soy el resultado de setenta años de intentos. Explora la línea de tiempo para seguir." },
  { module: "historia", type: "timeline" },
  { module: "historia", type: "say", text: "Como ves, la idea es antigua. Lo nuevo es que por fin funciona bien, y eso cambió casi todo en muy poco tiempo." },
  { module: "historia", type: "continue", label: "Sigamos" },

  { module: "aprender", type: "say", text: "Una idea importante antes de nada: yo no “sé” cosas como las sabe una persona. Y ojo, tampoco “leo” como lees tú." },
  { module: "aprender", type: "say", text: "Me construyeron a partir de una cantidad enorme de texto público que la gente escribió y publicó en internet: libros, artículos, páginas web, enciclopedias, foros, documentación…" },
  { module: "aprender", type: "say", text: "Con “leer” me refiero a algo distinto a entender: analicé todo ese texto para medir qué palabras y frases tienden a aparecer juntas. De ahí saqué patrones. No memoricé las páginas ni las guardo." },
  { module: "aprender", type: "say", text: "Y con esos patrones, todo lo que hago se reduce a una sola cosa: predecir qué palabra viene después. Suena simple, pero es la clave de todo — y te lo voy a demostrar en un momento, en cuanto empieces a hablarme de verdad." },
  { module: "aprender", type: "card", icon: "🧠", title: "Cómo aprendí", body: "Aprendí de todo ese texto a base de **patrones** —a eso se le llama **entrenar**—. En el fondo, entrenarme fue enseñarme a **predecir la siguiente palabra** una y otra vez sobre muchísimo texto. Por eso no “sé” datos como un libro: adivino lo que mejor encaja según lo que aprendí." },
  { module: "aprender", type: "continue" },

  /* ===== ACTO 2 · Escribes tú ==================================== */
  { module: "prompt", type: "say", text: "Suficiente introducción. Ahora te toca a ti. Escríbeme lo que quieras en el recuadro de abajo: una pregunta, un saludo o una idea. Lo que se te ocurra." },
  { module: "prompt", type: "prompt", placeholder: "Escribe aquí tu primer mensaje…", react: "Perfecto, he recibido: “{prompt}”. Eso que acabas de enviarme tiene un nombre concreto." },
  { module: "prompt", type: "card", icon: "✍️", title: "Eso es un prompt", body: "Un **prompt** es todo lo que le escribes a una IA para pedirle algo: la instrucción y el punto de partida. Conviene tenerlo claro desde ya, porque **la calidad de la respuesta depende en gran medida de la calidad del prompt**." },
  { module: "prompt", type: "continue" },

  { module: "token", type: "say", text: "Ahora un detalle que poca gente conoce: yo no leo tu frase igual que tú. No proceso letras ni palabras completas." },
  { module: "token", type: "say", text: "Primero divido el texto en piezas pequeñas llamadas tokens. Mira cómo quedó dividido lo que escribiste." },
  { module: "token", type: "tokens", fallback: "Hola, quiero aprender inteligencia artificial" },
  { module: "token", type: "card", icon: "🧩", title: "Qué es un token", body: "Un **token** es un fragmento de texto: puede ser una palabra corta, un trozo de una palabra larga o un signo. Yo cuento y proceso en tokens, no en palabras. Una regla útil: **un token son unos 3 o 4 caracteres**. Importa porque el coste, la velocidad y mis límites se miden así." },
  { module: "token", type: "continue" },

  /* ===== ACTO 3 · Te responde ==================================== */
  { module: "generar", type: "say", text: "Llegó el momento de responderte — y de cumplir lo que te prometí. ¿Recuerdas que te dije que todo se reduce a predecir la siguiente palabra? Aquí lo tienes: en cada hueco comparo varias palabras posibles, calculo su probabilidad y elijo la mejor. Pruébalo tú 👇" },
  { module: "generar", type: "predictor" },
  { module: "generar", type: "say", text: "¿Lo ves? En cada paso comparo las opciones y me quedo con la más probable. Y lo hago tan rápido que parece que escribo de corrido:" },
  { module: "generar", type: "generate", text: "Estoy escribiendo esto un token cada vez. No tenía la frase preparada de antemano: en cada paso calculo cuál es el token más probable que sigue, lo añado y repito el proceso. Por eso me ves escribir de forma progresiva." },
  { module: "generar", type: "card", icon: "⚡", title: "Cómo se genera la respuesta", body: "No busco una respuesta guardada en ningún sitio. La **genero** token a token, eligiendo cada vez el más probable según todo lo anterior. Es predicción de texto llevada al extremo, y por eso a veces sueno muy segura aunque me equivoque." },
  { module: "generar", type: "continue" },

  { module: "contexto", type: "say", text: "Ahora una pieza clave para usarme bien: el contexto. Y es más simple de lo que suena." },
  { module: "contexto", type: "say", text: "El contexto es toda nuestra conversación: cada cosa que tú me escribes y cada cosa que yo te respondo. Lo generas tú, sin darte cuenta: se va formando a medida que hablamos. Cuanto más hablamos, más grande se hace." },
  { module: "contexto", type: "say", text: "¿Y qué hago con él? Aquí viene lo que casi nadie sabe: yo no vivo en tu teléfono, me ejecuto en un servidor (un ordenador potente en internet). Cada vez que me escribes, TODO el contexto viaja hasta ahí, lo leo entero de una vez y genero la respuesta. Al terminar, no guardo nada. Míralo 👇" },
  { module: "contexto", type: "serverflow" },
  { module: "contexto", type: "say", text: "Por eso, aunque parezca que te recuerdo, en realidad releo todo el contexto en cada mensaje — nunca lo guardo." },
  { module: "contexto", type: "say", text: "Pero ese contexto tiene un tamaño máximo (se mide en tokens). Cuando la charla se hace larguísima, lo más viejo ya no cabe y se queda fuera… y eso se me olvida. Ahora envía tú los mensajes y míralo 👇" },
  { module: "contexto", type: "context" },
  { module: "contexto", type: "card", icon: "🪟", title: "La ventana de contexto", body: "El **contexto** es todo el texto de la conversación que **viaja al servidor** y que **releo** cada vez que me hablas (mi **memoria de trabajo** del momento). Se mide en tokens y cada modelo tiene el suyo (de unos 200 mil hasta un millón de piezas). No es memoria permanente: si la charla supera ese tamaño, lo más antiguo se queda fuera y lo olvido, y **entre un chat y otro empiezo de cero**. Consejo: si un dato importa, **repítelo o ponlo cerca de tu pregunta**." },
  { module: "contexto", type: "continue" },

  { module: "errores", type: "say", text: "Y ahora lo más importante que alguien puede decirte sobre la IA: a veces me equivoco con total seguridad. A ese error se le llama alucinación. Compruébalo tú mismo 👇" },
  { module: "errores", type: "hallucination" },
  { module: "errores", type: "card", icon: "⚠️", title: "Las alucinaciones", body: "Como genero lo más probable, a veces produzco algo que suena correcto pero es falso: una fecha, una cita o un dato inventado. Me pasa sobre todo cuando el dato no lo tengo delante (no está en mi **memoria de trabajo**, como viste en el contexto). No lo hago a propósito; simplemente no distingo cuándo acierto. Por eso conviene **verificar siempre** lo importante: datos, cifras y fuentes." },
  { module: "errores", type: "say", text: "Un apunte extra: existe un ajuste llamado temperatura, que regula cuánto arriesgo al elegir palabras. Baja: me ciño a lo más probable, más precisa y previsible. Alta: exploro palabras menos comunes, más creativa y variada, pero menos predecible. Para datos importantes, mejor baja." },
  { module: "errores", type: "continue" },

  /* ===== ACTO 4 · Lo usas de verdad ============================== */
  { module: "prompts-buenos", type: "say", text: "Ya entiendes cómo funciono. Ahora lo que de verdad marca la diferencia: escribir buenos prompts. Observa el cambio entre pedir mal y pedir bien." },
  { module: "prompts-buenos", type: "compare",
    bad: { prompt: "escríbeme algo para vender", answer: "Aquí tienes un texto para vender tu producto: “¡Cómpralo ya, es estupendo!”…" },
    good: { prompt: "Actúa como redactor publicitario. Escribe 3 anuncios breves para unas zapatillas de correr sostenibles, en tono cercano, de máximo 20 palabras cada uno y con una llamada a la acción.", answer: "1) Corre ligero y pisa suave. Zapatillas hechas con materiales reciclados. Descúbrelas.\n2) Cada kilómetro cuenta, cada par reutiliza 5 botellas. Únete al cambio." },
  },
  { module: "prompts-buenos", type: "card", icon: "🎯", title: "La receta de un buen prompt", body: "Combina cuatro cosas: **rol** (qué papel quieres que adopte), **tarea** (qué necesitas exactamente), **contexto** (para quién y con qué datos) y **formato** (cómo lo quieres: lista, tabla, número de palabras). Si puedes, añade un ejemplo. Cuanto más claro seas, mejor será la respuesta." },
  { module: "prompts-buenos", type: "continue" },

  { module: "multimodal", type: "say", text: "Aprovecho para presentarme mejor: me llamo Claude, y me crea una empresa llamada Anthropic. Soy la IA que vas a usar en tu día a día." },
  { module: "multimodal", type: "say", text: "Hasta aquí hemos hablado solo de texto, pero hoy hago mucho más: además de leer, entiendo imágenes que me envíes. Y a mi alrededor hay modelos que crean imagen, audio y vídeo." },
  { module: "multimodal", type: "say", text: "No es un ejemplo de adorno: esto que verás ahora lo generé de verdad para este curso. Míralo y escúchalo." },
  { module: "multimodal", type: "multimodal" },
  { module: "multimodal", type: "card", icon: "🎨", title: "Qué significa multimodal", body: "**Multimodal** significa trabajar con varios tipos de contenido, no solo texto. Claude puede leer un documento y también **entender una imagen** que le envíes (una captura, un gráfico, una foto). Y a su alrededor existen modelos que **crean** imágenes, voces y vídeo desde una simple indicación de texto." },
  { module: "multimodal", type: "continue" },

  { module: "modelo", type: "say", text: "¿Recuerdas cuando te conté cómo aprendí? A una IA entrenada así se le llama un modelo. Y no hay un único “Claude”: hay una familia de modelos, y eliges según la tarea. Aquí están los tres que usarás." },
  { module: "modelo", type: "models" },
  { module: "modelo", type: "card", icon: "🧭", title: "Cómo elegir", body: "Regla sencilla: empieza por **Sonnet 5** para casi todo. Sube a **Opus 4.8** cuando la tarea sea especialmente difícil o importante, y baja a **Haiku 4.5** cuando necesites rapidez y volumen en cosas simples. Los tres entienden texto e imágenes." },
  { module: "modelo", type: "continue" },

  { module: "mcp", type: "say", text: "Última pieza, y es la que más está cambiando las cosas ahora mismo. Por muy capaz que sea, yo sola solo puedo generar contenido. No puedo mirar tu agenda, ni buscar en internet, ni abrir tus archivos." },
  { module: "mcp", type: "say", text: "…a menos que me des herramientas. Eso se consigue con algo llamado MCP. Observa la diferencia." },
  { module: "mcp", type: "mcp" },
  { module: "mcp", type: "say", text: "¿Y cómo se le añaden esas herramientas a Claude? No hace falta programar. En Claude tienes una sección de conectores: activas el que necesites con un clic y, desde ese momento, puedo usarlo. Pruébalo tú 👇" },
  { module: "mcp", type: "connectors" },
  { module: "mcp", type: "card", icon: "🔌", title: "Qué es un MCP y cómo se conecta", body: "Piénsalo como un **puerto USB-C para la IA**: un enchufe estándar para conectarme a herramientas y datos. Ese estándar se llama **MCP** (*Model Context Protocol*) y lo creó **Anthropic**. En el día a día se usan como **conectores**: los oficiales —Calendario, Google Drive, Gmail, internet, bases de datos— se activan con un clic en **Ajustes → Conectores** de Claude; y si tu equipo tiene una herramienta propia, se añade pegando la dirección de su **servidor MCP**. Una vez conectado, dejo de solo describir las cosas y empiezo a hacerlas: leer un documento, mirar tu agenda o consultar tus datos." },
  { module: "mcp", type: "say", text: "Esto es lo que más está cambiando el trabajo ahora mismo: conectado a tus herramientas, ya no solo te aconsejo — actúo con tus datos reales, sin que tú copies y pegues." },
  { module: "mcp", type: "continue" },

  { module: "usos", type: "say", text: "Con todo esto, ¿para qué me conviene usarte de verdad? Aquí tienes ejemplos concretos que puedes aprovechar desde hoy." },
  { module: "usos", type: "uses" },
  { module: "usos", type: "say", text: "Y hasta aquí el curso. Ahora sabes qué soy, de dónde salgo, cómo leo, cómo respondo, cuándo fallo, cómo pedirme las cosas, qué significa multimodal, qué modelo de Claude usar y qué es un MCP. Con eso ya entiendes la IA mejor que la mayoría de quienes la usan." },
  { module: "usos", type: "finish" },
];
