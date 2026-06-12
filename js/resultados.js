// ============================================================
// RESULTADOS REALES — Mundial 2026
// Al terminar cada partido, escribe los goles en ga (equipo A)
// y gb (equipo B). Deja null en los partidos no jugados.
// El sitio recalcula tablas, ratings Elo y probabilidades solo.
// ============================================================
const RESULTADOS = [
  // ---- Grupo A ----
  {g:"A", j:1, A:"México", B:"Sudáfrica", ga:null, gb:null},
  {g:"A", j:1, A:"Corea del Sur", B:"Chequia", ga:null, gb:null},
  {g:"A", j:2, A:"México", B:"Corea del Sur", ga:null, gb:null},
  {g:"A", j:2, A:"Chequia", B:"Sudáfrica", ga:null, gb:null},
  {g:"A", j:3, A:"Chequia", B:"México", ga:null, gb:null},
  {g:"A", j:3, A:"Sudáfrica", B:"Corea del Sur", ga:null, gb:null},
  // ---- Grupo B ----
  {g:"B", j:1, A:"Canadá", B:"Bosnia", ga:null, gb:null},
  {g:"B", j:1, A:"Qatar", B:"Suiza", ga:null, gb:null},
  {g:"B", j:2, A:"Canadá", B:"Qatar", ga:null, gb:null},
  {g:"B", j:2, A:"Suiza", B:"Bosnia", ga:null, gb:null},
  {g:"B", j:3, A:"Suiza", B:"Canadá", ga:null, gb:null},
  {g:"B", j:3, A:"Bosnia", B:"Qatar", ga:null, gb:null},
  // ---- Grupo C ----
  {g:"C", j:1, A:"Brasil", B:"Marruecos", ga:null, gb:null},
  {g:"C", j:1, A:"Escocia", B:"Haití", ga:null, gb:null},
  {g:"C", j:2, A:"Brasil", B:"Escocia", ga:null, gb:null},
  {g:"C", j:2, A:"Haití", B:"Marruecos", ga:null, gb:null},
  {g:"C", j:3, A:"Haití", B:"Brasil", ga:null, gb:null},
  {g:"C", j:3, A:"Marruecos", B:"Escocia", ga:null, gb:null},
  // ---- Grupo D ----
  {g:"D", j:1, A:"Estados Unidos", B:"Paraguay", ga:null, gb:null},
  {g:"D", j:1, A:"Australia", B:"Turquía", ga:null, gb:null},
  {g:"D", j:2, A:"Estados Unidos", B:"Australia", ga:null, gb:null},
  {g:"D", j:2, A:"Turquía", B:"Paraguay", ga:null, gb:null},
  {g:"D", j:3, A:"Turquía", B:"Estados Unidos", ga:null, gb:null},
  {g:"D", j:3, A:"Paraguay", B:"Australia", ga:null, gb:null},
  // ---- Grupo E ----
  {g:"E", j:1, A:"Alemania", B:"Ecuador", ga:null, gb:null},
  {g:"E", j:1, A:"Costa de Marfil", B:"Curazao", ga:null, gb:null},
  {g:"E", j:2, A:"Alemania", B:"Costa de Marfil", ga:null, gb:null},
  {g:"E", j:2, A:"Curazao", B:"Ecuador", ga:null, gb:null},
  {g:"E", j:3, A:"Curazao", B:"Alemania", ga:null, gb:null},
  {g:"E", j:3, A:"Ecuador", B:"Costa de Marfil", ga:null, gb:null},
  // ---- Grupo F ----
  {g:"F", j:1, A:"Países Bajos", B:"Japón", ga:null, gb:null},
  {g:"F", j:1, A:"Suecia", B:"Túnez", ga:null, gb:null},
  {g:"F", j:2, A:"Países Bajos", B:"Suecia", ga:null, gb:null},
  {g:"F", j:2, A:"Túnez", B:"Japón", ga:null, gb:null},
  {g:"F", j:3, A:"Túnez", B:"Países Bajos", ga:null, gb:null},
  {g:"F", j:3, A:"Japón", B:"Suecia", ga:null, gb:null},
  // ---- Grupo G ----
  {g:"G", j:1, A:"Bélgica", B:"Egipto", ga:null, gb:null},
  {g:"G", j:1, A:"Irán", B:"Nueva Zelanda", ga:null, gb:null},
  {g:"G", j:2, A:"Bélgica", B:"Irán", ga:null, gb:null},
  {g:"G", j:2, A:"Nueva Zelanda", B:"Egipto", ga:null, gb:null},
  {g:"G", j:3, A:"Nueva Zelanda", B:"Bélgica", ga:null, gb:null},
  {g:"G", j:3, A:"Egipto", B:"Irán", ga:null, gb:null},
  // ---- Grupo H ----
  {g:"H", j:1, A:"España", B:"Uruguay", ga:null, gb:null},
  {g:"H", j:1, A:"Arabia Saudita", B:"Cabo Verde", ga:null, gb:null},
  {g:"H", j:2, A:"España", B:"Arabia Saudita", ga:null, gb:null},
  {g:"H", j:2, A:"Cabo Verde", B:"Uruguay", ga:null, gb:null},
  {g:"H", j:3, A:"Cabo Verde", B:"España", ga:null, gb:null},
  {g:"H", j:3, A:"Uruguay", B:"Arabia Saudita", ga:null, gb:null},
  // ---- Grupo I ----
  {g:"I", j:1, A:"Francia", B:"Senegal", ga:null, gb:null},
  {g:"I", j:1, A:"Noruega", B:"Irak", ga:null, gb:null},
  {g:"I", j:2, A:"Francia", B:"Noruega", ga:null, gb:null},
  {g:"I", j:2, A:"Irak", B:"Senegal", ga:null, gb:null},
  {g:"I", j:3, A:"Irak", B:"Francia", ga:null, gb:null},
  {g:"I", j:3, A:"Senegal", B:"Noruega", ga:null, gb:null},
  // ---- Grupo J ----
  {g:"J", j:1, A:"Argentina", B:"Austria", ga:null, gb:null},
  {g:"J", j:1, A:"Argelia", B:"Jordania", ga:null, gb:null},
  {g:"J", j:2, A:"Argentina", B:"Argelia", ga:null, gb:null},
  {g:"J", j:2, A:"Jordania", B:"Austria", ga:null, gb:null},
  {g:"J", j:3, A:"Jordania", B:"Argentina", ga:null, gb:null},
  {g:"J", j:3, A:"Austria", B:"Argelia", ga:null, gb:null},
  // ---- Grupo K ----
  {g:"K", j:1, A:"Portugal", B:"Colombia", ga:null, gb:null},
  {g:"K", j:1, A:"Uzbekistán", B:"RD Congo", ga:null, gb:null},
  {g:"K", j:2, A:"Portugal", B:"Uzbekistán", ga:null, gb:null},
  {g:"K", j:2, A:"RD Congo", B:"Colombia", ga:null, gb:null},
  {g:"K", j:3, A:"RD Congo", B:"Portugal", ga:null, gb:null},
  {g:"K", j:3, A:"Colombia", B:"Uzbekistán", ga:null, gb:null},
  // ---- Grupo L ----
  {g:"L", j:1, A:"Inglaterra", B:"Croacia", ga:null, gb:null},
  {g:"L", j:1, A:"Panamá", B:"Ghana", ga:null, gb:null},
  {g:"L", j:2, A:"Inglaterra", B:"Panamá", ga:null, gb:null},
  {g:"L", j:2, A:"Ghana", B:"Croacia", ga:null, gb:null},
  {g:"L", j:3, A:"Ghana", B:"Inglaterra", ga:null, gb:null},
  {g:"L", j:3, A:"Croacia", B:"Panamá", ga:null, gb:null},
];

// Fase eliminatoria: agrega resultados reales por número de partido FIFA (73–104).
// winner solo es necesario si el partido terminó empatado (prórroga/penales).
// Ejemplo: {id:73, A:"Suiza", B:"Bosnia", ga:1, gb:1, winner:"Suiza"},
const RESULTADOS_KO = [
];
