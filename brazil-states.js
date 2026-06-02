// Dados Geográficos do Brasil para Sentinel IA
// Contém metadados dos estados, coordenadas simplificadas de biomas, rodovias federais e principais cidades

export const BRAZIL_GEODATA = {
  // Metadados dos 26 estados + Distrito Federal
  states: [
    { id: "AC", name: "Acre", capital: "Rio Branco", lat: -9.0238, lon: -70.812, region: "Norte", baseRisk: 0.35 },
    { id: "AL", name: "Alagoas", capital: "Maceió", lat: -9.5713, lon: -36.782, region: "Nordeste", baseRisk: 0.55 },
    { id: "AP", name: "Amapá", capital: "Macapá", lat: 1.41, lon: -51.77, region: "Norte", baseRisk: 0.30 },
    { id: "AM", name: "Amazonas", capital: "Manaus", lat: -3.4168, lon: -64.03, region: "Norte", baseRisk: 0.45 },
    { id: "BA", name: "Bahia", capital: "Salvador", lat: -12.9714, lon: -38.5014, region: "Nordeste", baseRisk: 0.60 },
    { id: "CE", name: "Ceará", capital: "Fortaleza", lat: -5.1472, lon: -39.65, region: "Nordeste", baseRisk: 0.58 },
    { id: "DF", name: "Distrito Federal", capital: "Brasília", lat: -15.7797, lon: -47.9297, region: "Centro-Oeste", baseRisk: 0.40 },
    { id: "ES", name: "Espírito Santo", capital: "Vitória", lat: -19.1834, lon: -40.3089, region: "Sudeste", baseRisk: 0.42 },
    { id: "GO", name: "Goiás", capital: "Goiânia", lat: -15.827, lon: -49.837, region: "Centro-Oeste", baseRisk: 0.48 },
    { id: "MA", name: "Maranhão", capital: "São Luís", lat: -5.4246, lon: -45.4487, region: "Nordeste", baseRisk: 0.50 },
    { id: "MT", name: "Mato Grosso", capital: "Cuiabá", lat: -12.6819, lon: -56.9211, region: "Centro-Oeste", baseRisk: 0.52 },
    { id: "MS", name: "Mato Grosso do Sul", capital: "Campo Grande", lat: -20.7722, lon: -54.7852, region: "Centro-Oeste", baseRisk: 0.38 },
    { id: "MG", name: "Minas Gerais", capital: "Belo Horizonte", lat: -18.5122, lon: -44.555, region: "Sudeste", baseRisk: 0.35 },
    { id: "PA", name: "Pará", capital: "Belém", lat: -5.53, lon: -52.29, region: "Norte", baseRisk: 0.58 },
    { id: "PB", name: "Paraíba", capital: "João Pessoa", lat: -7.24, lon: -36.78, region: "Nordeste", baseRisk: 0.45 },
    { id: "PR", name: "Paraná", capital: "Curitiba", lat: -24.89, lon: -51.55, region: "Sul", baseRisk: 0.33 },
    { id: "PE", name: "Pernambuco", capital: "Recife", lat: -8.28, lon: -37.86, region: "Nordeste", baseRisk: 0.62 },
    { id: "PI", name: "Piauí", capital: "Teresina", lat: -7.714, lon: -42.728, region: "Nordeste", baseRisk: 0.40 },
    { id: "RJ", name: "Rio de Janeiro", capital: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, region: "Sudeste", baseRisk: 0.75 },
    { id: "RN", name: "Rio Grande do Norte", capital: "Natal", lat: -5.795, lon: -36.568, region: "Nordeste", baseRisk: 0.48 },
    { id: "RS", name: "Rio Grande do Sul", capital: "Porto Alegre", lat: -30.0346, lon: -51.2177, region: "Sul", baseRisk: 0.42 },
    { id: "RO", name: "Rondônia", capital: "Porto Velho", lat: -11.5057, lon: -63.5806, region: "Norte", baseRisk: 0.44 },
    { id: "RR", name: "Roraima", capital: "Boa Vista", lat: 2.7376, lon: -62.0751, region: "Norte", baseRisk: 0.32 },
    { id: "SC", name: "Santa Catarina", capital: "Florianópolis", lat: -27.2423, lon: -50.2189, region: "Sul", baseRisk: 0.28 },
    { id: "SP", name: "São Paulo", capital: "São Paulo", lat: -23.5505, lon: -46.6333, region: "Sudeste", baseRisk: 0.65 },
    { id: "SE", name: "Sergipe", capital: "Aracaju", lat: -10.9472, lon: -37.0731, region: "Nordeste", baseRisk: 0.46 },
    { id: "TO", name: "Tocantins", capital: "Palmas", lat: -10.1753, lon: -48.3317, region: "Norte", baseRisk: 0.38 }
  ],

  // Cidades estratégicas do interior e metropolitanas para garantir cobertura 100%
  cities: [
    // Sudeste Interior & Metro
    { name: "Campinas", state: "SP", lat: -22.9099, lon: -47.0626, importance: "Alta", type: "Metropolitana" },
    { name: "Ribeirão Preto", state: "SP", lat: -21.1775, lon: -47.8103, importance: "Média", type: "Interior" },
    { name: "São José dos Campos", state: "SP", lat: -23.1791, lon: -45.8872, importance: "Média", type: "Interior" },
    { name: "Santos", state: "SP", lat: -23.9608, lon: -46.3339, importance: "Alta", type: "Litorânea" },
    { name: "Bauru", state: "SP", lat: -22.3145, lon: -49.0587, importance: "Baixa", type: "Interior" },
    { name: "São José do Rio Preto", state: "SP", lat: -20.8113, lon: -49.3758, importance: "Baixa", type: "Interior" },
    { name: "Sorocaba", state: "SP", lat: -23.5015, lon: -47.4526, importance: "Média", type: "Interior" },
    { name: "Duque de Caxias", state: "RJ", lat: -22.7856, lon: -43.3117, importance: "Alta", type: "Metropolitana" },
    { name: "Niterói", state: "RJ", lat: -22.8858, lon: -43.1153, importance: "Média", type: "Metropolitana" },
    { name: "Campos dos Goytacazes", state: "RJ", lat: -21.7542, lon: -41.3244, importance: "Média", type: "Interior" },
    { name: "Uberlândia", state: "MG", lat: -18.9186, lon: -48.2772, importance: "Média", type: "Interior" },
    { name: "Juiz de Fora", state: "MG", lat: -21.7642, lon: -43.3496, importance: "Média", type: "Interior" },
    { name: "Montes Claros", state: "MG", lat: -16.7269, lon: -43.8687, importance: "Baixa", type: "Interior" },
    { name: "Serra", state: "ES", lat: -20.1287, lon: -40.3078, importance: "Média", type: "Metropolitana" },

    // Sul Interior & Metro
    { name: "Londrina", state: "PR", lat: -23.3045, lon: -51.1696, importance: "Média", type: "Interior" },
    { name: "Maringá", state: "PR", lat: -23.421, lon: -51.9331, importance: "Média", type: "Interior" },
    { name: "Foz do Iguaçu", state: "PR", lat: -25.5478, lon: -54.5881, importance: "Alta", type: "Fronteira" },
    { name: "Joinville", state: "SC", lat: -26.3044, lon: -48.8456, importance: "Média", type: "Interior" },
    { name: "Blumenau", state: "SC", lat: -26.9189, lon: -49.0661, importance: "Média", type: "Interior" },
    { name: "Caxias do Sul", state: "RS", lat: -29.1678, lon: -51.179, importance: "Média", type: "Interior" },
    { name: "Pelotas", state: "RS", lat: -31.776, lon: -52.3594, importance: "Média", type: "Interior" },
    { name: "Uruguaiana", state: "RS", lat: -29.7547, lon: -57.0863, importance: "Baixa", type: "Fronteira" },

    // Nordeste Interior & Metro
    { name: "Feira de Santana", state: "BA", lat: -12.2664, lon: -38.9662, importance: "Média", type: "Interior" },
    { name: "Vitória da Conquista", state: "BA", lat: -14.8661, lon: -40.8394, importance: "Baixa", type: "Interior" },
    { name: "Petrolina", state: "PE", lat: -9.3833, lon: -40.5028, importance: "Média", type: "Interior" },
    { name: "Caruaru", state: "PE", lat: -8.2818, lon: -35.9767, importance: "Baixa", type: "Interior" },
    { name: "Campina Grande", state: "PB", lat: -7.2247, lon: -35.8814, importance: "Média", type: "Interior" },
    { name: "Mossoró", state: "RN", lat: -5.1878, lon: -37.3442, importance: "Baixa", type: "Interior" },
    { name: "Sobral", state: "CE", lat: -3.6859, lon: -40.3444, importance: "Baixa", type: "Interior" },
    { name: "Juazeiro do Norte", state: "CE", lat: -7.2144, lon: -39.3153, importance: "Baixa", type: "Interior" },
    { name: "Imperatriz", state: "MA", lat: -5.5264, lon: -47.4917, importance: "Média", type: "Interior" },

    // Norte Interior & Metro
    { name: "Ananindeua", state: "PA", lat: -1.3656, lon: -48.3794, importance: "Média", type: "Metropolitana" },
    { name: "Santarém", state: "PA", lat: -2.4431, lon: -54.7083, importance: "Média", type: "Interior" },
    { name: "Marabá", state: "PA", lat: -5.3688, lon: -49.1242, importance: "Baixa", type: "Interior" },
    { name: "Parintins", state: "AM", lat: -2.6288, lon: -56.7358, importance: "Baixa", type: "Interior" },
    { name: "Cruzeiro do Sul", state: "AC", lat: -7.6311, lon: -72.6728, importance: "Baixa", type: "Fronteira" },
    { name: "Ji-Paraná", state: "RO", lat: -10.8797, lon: -61.9481, importance: "Baixa", type: "Interior" },

    // Centro-Oeste Interior & Metro
    { name: "Dourados", state: "MS", lat: -22.2238, lon: -54.8123, importance: "Baixa", type: "Interior" },
    { name: "Rondonópolis", state: "MT", lat: -16.4708, lon: -54.6356, importance: "Baixa", type: "Interior" },
    { name: "Sinop", state: "MT", lat: -11.8642, lon: -55.5028, importance: "Baixa", type: "Interior" },
    { name: "Anápolis", state: "GO", lat: -16.3267, lon: -48.9528, importance: "Média", type: "Interior" },
    { name: "Rio Verde", state: "GO", lat: -17.7944, lon: -50.9208, importance: "Baixa", type: "Interior" }
  ],

  // Limites simplificados dos Biomas brasileiros para renderização de Polígonos
  biomes: [
    {
      name: "Amazônia Legal",
      color: "#0f5132",
      riskFactor: 0.45,
      description: "Maior bioma brasileiro, monitorado intensamente contra desmatamento ilegal e incêndios florestais.",
      polygon: [
        [-10.0, -73.0], [2.0, -73.0], [5.0, -68.0], [4.5, -60.0], [4.0, -51.0], 
        [-1.0, -46.0], [-3.0, -44.0], [-7.0, -46.0], [-13.0, -50.0], [-15.0, -53.0], 
        [-16.0, -60.0], [-12.0, -64.0], [-10.0, -69.0]
      ]
    },
    {
      name: "Cerrado",
      color: "#d1a117",
      riskFactor: 0.52,
      description: "Savana brasileira, suscetível a queimadas no período de estiagem e desmatamento para agricultura.",
      polygon: [
        [-15.0, -45.0], [-10.0, -48.0], [-8.0, -44.0], [-4.0, -42.0], [-6.0, -47.0], 
        [-10.0, -49.0], [-12.0, -52.0], [-16.0, -56.0], [-22.0, -55.0], [-20.0, -48.0], 
        [-22.0, -47.0], [-20.0, -44.0], [-16.0, -42.0]
      ]
    },
    {
      name: "Mata Atlântica",
      color: "#198754",
      riskFactor: 0.58,
      description: "Bioma costeiro densamente povoado. Alto risco de deslizamentos e enchentes devido à urbanização.",
      polygon: [
        [-6.0, -35.0], [-10.0, -36.0], [-15.0, -39.0], [-20.0, -40.0], [-23.0, -42.0], 
        [-25.0, -48.0], [-30.0, -50.0], [-29.0, -54.0], [-25.0, -54.0], [-23.0, -49.0], 
        [-20.0, -45.0], [-18.0, -41.0], [-12.0, -38.0]
      ]
    },
    {
      name: "Caatinga",
      color: "#fd7e14",
      riskFactor: 0.65,
      description: "Semiárido nordestino, com estiagens severas frequentes, escassez hídrica e risco de desertificação.",
      polygon: [
        [-3.0, -40.0], [-5.0, -36.0], [-6.0, -35.0], [-10.0, -36.0], [-12.0, -37.0], 
        [-15.0, -41.0], [-13.0, -43.0], [-10.0, -43.0], [-8.0, -41.0], [-5.0, -41.0]
      ]
    },
    {
      name: "Pantanal",
      color: "#0dcaf0",
      riskFactor: 0.40,
      description: "Maior planície inundável contínua do planeta. Sensível a secas extremas e incêndios na vegetação rasteira.",
      polygon: [
        [-16.0, -58.0], [-15.0, -57.0], [-16.0, -55.0], [-19.0, -55.0], [-22.0, -57.0], 
        [-21.0, -58.0], [-19.0, -58.0]
      ]
    },
    {
      name: "Pampa",
      color: "#20c997",
      riskFactor: 0.30,
      description: "Campos do Sul, com baixas temperaturas no inverno e riscos de geada ou estiagem agrícola moderada.",
      polygon: [
        [-28.0, -54.0], [-30.0, -50.0], [-33.0, -52.0], [-34.0, -53.0], [-31.0, -57.0], 
        [-29.0, -57.0]
      ]
    }
  ],

  // Rodovias Federais Relevantes para Previsão de Acidentes e Infraestrutura
  highways: [
    {
      name: "BR-116 (Presidente Dutra / Rio-Bahia)",
      type: "Federal",
      riskLevel: "Alto",
      path: [
        [-30.03, -51.21], // Porto Alegre
        [-25.42, -49.27], // Curitiba
        [-23.55, -46.63], // São Paulo
        [-22.90, -43.17], // Rio de Janeiro
        [-16.72, -43.86], // Montes Claros
        [-12.26, -38.96], // Feira de Santana
        [-8.28, -37.86],  // PE interior
        [-5.79, -36.56]   // Natal
      ]
    },
    {
      name: "BR-101 (Translitorânea)",
      type: "Federal",
      riskLevel: "Moderado",
      path: [
        [-30.00, -50.10], // RS Litoral
        [-27.59, -48.54], // Florianópolis
        [-26.30, -48.84], // Joinville
        [-23.96, -46.33], // Santos
        [-22.88, -43.11], // Niterói
        [-20.12, -40.30], // Serra / ES
        [-12.97, -38.50], // Salvador
        [-10.94, -37.07], // Aracaju
        [-9.57, -36.78],  // Maceió
        [-8.05, -34.88],  // Recife
        [-7.11, -34.86],  // João Pessoa
        [-5.79, -35.20]   // Natal
      ]
    },
    {
      name: "BR-230 (Transamazônica)",
      type: "Federal - Integração",
      riskLevel: "Crítico",
      path: [
        [-7.11, -34.86],  // Cabedelo / PB (Início)
        [-7.24, -36.78],  // Campina Grande
        [-7.71, -42.72],  // Piauí
        [-5.52, -47.49],  // Imperatriz
        [-5.36, -49.12],  // Marabá
        [-2.44, -54.70],  // Santarém
        [-3.41, -64.03]   // Lábrea/AM (Término aproximado)
      ]
    },
    {
      name: "BR-163 (Cuiabá-Santarém)",
      type: "Federal - Agrocoamento",
      riskLevel: "Moderado",
      path: [
        [-20.77, -54.78], // Campo Grande
        [-16.47, -54.63], // Rondonópolis
        [-12.68, -56.92], // Cuiabá
        [-11.86, -55.50], // Sinop
        [-5.53, -52.29],  // Pará interior
        [-2.44, -54.70]   // Santarém
      ]
    }
  ]
};

// Expor dados globalmente no navegador
if (typeof window !== "undefined") {
  window.BRAZIL_GEODATA = BRAZIL_GEODATA;
}
