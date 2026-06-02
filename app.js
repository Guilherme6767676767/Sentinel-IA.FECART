// Sentinel IA Brasil - Logic & Core Engine
import { BRAZIL_GEODATA } from "./brazil-states.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- INICIALIZAÇÃO DE ESTADOS E MAPA ---
  let map;
  let activeFoco = "geral";
  let activeLayer = "heat"; // 'heat', 'states', 'biomes', 'highways'
  let selectedRegion = { name: "BRASIL", type: "Nacional", baseRisk: 0.48 };
  
  // Elementos do DOM
  const timeEl = document.getElementById("currentTime");
  const dateEl = document.getElementById("currentDate");
  const globalRiskValEl = document.getElementById("globalRiskVal");
  const globalAlertsCountEl = document.getElementById("globalAlertsCount");
  const regionTitleEl = document.getElementById("selectedRegionTitle");
  const statRiskScoreEl = document.getElementById("statRiskScore");
  const statRiskLevelEl = document.getElementById("statRiskLevel");
  const statAreaEl = document.getElementById("statArea");
  const statAlertsEl = document.getElementById("statAlerts");
  const aiReportTextEl = document.getElementById("aiReportText");
  const typingIndicatorEl = document.getElementById("typingIndicator");
  const eventsFeedEl = document.getElementById("eventsFeed");
  const feedCounterEl = document.getElementById("feedCounter");
  
  // Contêineres de Camadas do Mapa
  let tileLayer;
  let heatLayer = null;
  let statesGeoJsonLayer = null;
  let biomesLayerGroup = null;
  let highwaysLayerGroup = null;
  let markersLayerGroup = null;
  
  // --- DATA & CLOCK ---
  function updateClock() {
    const now = new Date();
    // Ajustar para fuso horário de Brasília ou local
    const timeStr = now.toLocaleTimeString("pt-BR", { hour12: false });
    const dateStr = now.toLocaleDateString("pt-BR");
    if (timeEl) timeEl.textContent = timeStr;
    if (dateEl) dateEl.textContent = dateStr;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- MAPA LEAFLET ---
  function initMap() {
    // Centralizado geograficamente no Brasil
    map = L.map("map", {
      center: [-14.2350, -51.9253],
      zoom: 4,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: true
    });

    // Dark Mode Tiles (CartoDB Dark Matter)
    tileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Inicializa os grupos de camadas
    biomesLayerGroup = L.layerGroup();
    highwaysLayerGroup = L.layerGroup();
    markersLayerGroup = L.layerGroup();

    // Carregar todas as camadas
    generateHeatmap();
    loadStatesGeoJSON();
    renderBiomes();
    renderHighways();
    renderCityMarkers();

    // Aplica a visualização inicial da camada padrão (Calor)
    setMapLayer("heat");
  }

  // --- ESCALA DE SEVERIDADE DE RISCO ---
  // Retorna a cor correspondente baseada no nível de risco (0 a 1)
  function getRiskColor(risk) {
    if (risk < 0.2) return "#10b981"; // Verde (Muito Baixo)
    if (risk < 0.4) return "#eab308"; // Amarelo (Baixo)
    if (risk < 0.6) return "#f97316"; // Laranja (Moderado)
    if (risk < 0.8) return "#ef4444"; // Vermelho (Alto)
    return "#880808";        // Vermelho Escuro/Preto (Crítico)
  }

  function getRiskLabel(risk) {
    if (risk < 0.2) return "Muito Baixo";
    if (risk < 0.4) return "Baixo";
    if (risk < 0.6) return "Moderado";
    if (risk < 0.8) return "Alto";
    return "Crítico";
  }

  // --- RENDERIZADORES DE CAMADAS ---

  // 1. Mapa de Calor (Heatmap)
  function generateHeatmap() {
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    const heatPoints = [];
    const seed = activeFoco;

    // Fatores de risco por categoria para dar dinamismo
    const mult = {
      geral: 1.0,
      crime: 0.9,
      clima: 1.1,
      desastre: 0.8,
      infra: 0.75,
      queimadas: 1.2
    }[seed];

    // Adiciona pontos de calor para todas as capitais (cobertura urbana e metropolitana)
    BRAZIL_GEODATA.states.forEach(state => {
      let val = state.baseRisk * mult;
      // Ajustes específicos do filtro
      if (seed === "queimadas" && ["AM", "PA", "MT", "TO", "MA"].includes(state.id)) val += 0.25;
      if (seed === "crime" && ["RJ", "SP", "BA", "PE"].includes(state.id)) val += 0.2;
      if (seed === "clima" && ["RS", "SC", "PR", "SP", "RJ"].includes(state.id)) val += 0.2;
      if (seed === "desastre" && ["RS", "RJ", "MG", "BA"].includes(state.id)) val += 0.15;
      
      val = Math.min(Math.max(val, 0.1), 1.0);
      heatPoints.push([state.lat, state.lon, val]);
    });

    // Adiciona pontos para todas as cidades do interior para garantir 100% de cobertura territorial
    BRAZIL_GEODATA.cities.forEach(city => {
      let val = 0.3 * mult;
      if (seed === "infra" && city.type === "Interior") val += 0.2;
      if (seed === "crime" && city.importance === "Alta") val += 0.25;
      
      val = Math.min(Math.max(val, 0.1), 0.9);
      heatPoints.push([city.lat, city.lon, val]);
    });

    // Adiciona pontos ao longo de todas as rodovias
    BRAZIL_GEODATA.highways.forEach(hw => {
      hw.path.forEach((pt, index) => {
        let val = (hw.riskLevel === "Crítico" ? 0.85 : hw.riskLevel === "Alto" ? 0.65 : 0.45) * mult;
        if (seed === "infra") val += 0.15;
        
        val = Math.min(Math.max(val, 0.1), 1.0);
        heatPoints.push([pt[0], pt[1], val]);
        
        // Adiciona pontos intermediários para preencher a linha da rodovia no calor
        if (index < hw.path.length - 1) {
          const nextPt = hw.path[index + 1];
          const midLat = (pt[0] + nextPt[0]) / 2;
          const midLon = (pt[1] + nextPt[1]) / 2;
          heatPoints.push([midLat, midLon, val * 0.8]);
        }
      });
    });

    // Adiciona pontos de grade cobrindo biomas inteiros (Amazônia Legal, Pantanal, Cerrado, etc.)
    // Garante que mesmo áreas remotas fiquem visíveis sob análise preditiva
    BRAZIL_GEODATA.biomes.forEach(biome => {
      let val = biome.riskFactor * 0.6 * mult;
      if (seed === "queimadas" && ["Amazônia Legal", "Cerrado", "Pantanal"].includes(biome.name)) val += 0.3;
      if (seed === "clima" && ["Mata Atlântica", "Pampa"].includes(biome.name)) val += 0.2;

      val = Math.min(Math.max(val, 0.1), 0.85);

      // Amostragem interna do polígono para criar pontos de calor de dispersão territorial
      biome.polygon.forEach(pt => {
        heatPoints.push([pt[0] + 1.2, pt[1] - 1.2, val * 0.7]);
        heatPoints.push([pt[0] - 0.8, pt[1] + 0.8, val * 0.5]);
      });
    });

    // Configuração do Leaflet.heat
    // Cores mapeadas conforme solicitado
    heatLayer = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 6,
      max: 1.0,
      gradient: {
        0.2: "#10b981", // Verde (Risco Muito Baixo)
        0.4: "#eab308", // Amarelo (Risco Baixo)
        0.6: "#f97316", // Laranja (Risco Moderado)
        0.8: "#ef4444", // Vermelho (Risco Alto)
        1.0: "#880808"  // Vermelho Escuro (Risco Crítico)
      }
    });
  }

  // 2. Divisão por Estados (Choropleth Layer)
  function loadStatesGeoJSON() {
    // Url pública para GeoJSON leve e simplificado do Brasil
    const geoJsonUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

    fetch(geoJsonUrl)
      .then(response => {
        if (!response.ok) throw new Error("Falha no download do GeoJSON");
        return response.json();
      })
      .then(data => {
        renderStates(data);
      })
      .catch(err => {
        console.warn("Usando Fallback de polígonos estaduais devido a erro de rede:", err.message);
        // Criação de círculos grandes representativos de estados se o GeoJSON falhar
        renderStatesFallback();
      });
  }

  function renderStates(geoJsonData) {
    if (statesGeoJsonLayer) {
      map.removeLayer(statesGeoJsonLayer);
    }

    statesGeoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const stateCode = feature.properties.sigla;
        const stateMeta = BRAZIL_GEODATA.states.find(s => s.id === stateCode) || { baseRisk: 0.4 };
        
        let calculatedRisk = stateMeta.baseRisk;
        // Ajuste conforme o filtro
        calculatedRisk = adjustRiskByFoco(calculatedRisk, stateCode, activeFoco);

        return {
          fillColor: getRiskColor(calculatedRisk),
          weight: 1.5,
          opacity: 0.8,
          color: "rgba(255, 255, 255, 0.15)",
          fillOpacity: 0.45
        };
      },
      onEachFeature: (feature, layer) => {
        const stateCode = feature.properties.sigla;
        const stateName = feature.properties.name;
        const stateMeta = BRAZIL_GEODATA.states.find(s => s.id === stateCode) || { baseRisk: 0.4 };

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              fillOpacity: 0.7,
              color: varColor("--accent"),
              weight: 2
            });
          },
          mouseout: (e) => {
            statesGeoJsonLayer.resetStyle(e.target);
          },
          click: () => {
            selectRegion({
              name: stateName,
              code: stateCode,
              type: "Estado",
              baseRisk: adjustRiskByFoco(stateMeta.baseRisk, stateCode, activeFoco),
              area: "Área Aprox: " + (Math.floor(Math.random() * 300) + 50) + " mil km²"
            });
            
            // Focar o mapa no estado
            map.fitBounds(layer.getBounds(), { padding: [20, 20] });
          }
        });
      }
    });
  }

  // Fallback seguro caso o Github GeoJSON esteja indisponível (offline)
  function renderStatesFallback() {
    if (statesGeoJsonLayer) {
      map.removeLayer(statesGeoJsonLayer);
    }
    statesGeoJsonLayer = L.layerGroup();

    BRAZIL_GEODATA.states.forEach(state => {
      const calculatedRisk = adjustRiskByFoco(state.baseRisk, state.id, activeFoco);
      const color = getRiskColor(calculatedRisk);

      // Renderiza círculos concêntricos como delimitações estaduais simplificadas
      const circle = L.circle([state.lat, state.lon], {
        radius: 200000, // 200 km
        fillColor: color,
        weight: 1.5,
        opacity: 0.8,
        color: "rgba(255,255,255,0.1)",
        fillOpacity: 0.35
      });

      circle.on("click", () => {
        selectRegion({
          name: state.name,
          code: state.id,
          type: "Estado (Simulado)",
          baseRisk: calculatedRisk,
          area: "Área Central Monitorada"
        });
        map.setView([state.lat, state.lon], 6);
      });

      statesGeoJsonLayer.addLayer(circle);
    });
  }

  // Helper para ajustar risco conforme categoria
  function adjustRiskByFoco(base, stateCode, foco) {
    let r = base;
    if (foco === "crime") {
      if (["RJ", "SP", "BA", "PE"].includes(stateCode)) r += 0.22;
      else r -= 0.05;
    } else if (foco === "queimadas") {
      if (["MT", "AM", "PA", "TO", "RO"].includes(stateCode)) r += 0.3;
      else r -= 0.2;
    } else if (foco === "clima") {
      if (["RS", "SC", "PR", "SP", "RJ"].includes(stateCode)) r += 0.18;
      else r -= 0.05;
    } else if (foco === "desastre") {
      if (["RS", "MG", "RJ", "BA"].includes(stateCode)) r += 0.15;
    } else if (foco === "infra") {
      if (["DF", "SP", "RJ", "MG"].includes(stateCode)) r -= 0.1;
      else r += 0.12;
    }
    return Math.min(Math.max(r, 0.1), 0.98);
  }

  // Retorna o valor de uma variável CSS
  function varColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  // 3. Biomas (Polygons Layer)
  function renderBiomes() {
    biomesLayerGroup.clearLayers();

    BRAZIL_GEODATA.biomes.forEach(biome => {
      let riskVal = biome.riskFactor;
      if (activeFoco === "queimadas" && ["Amazônia Legal", "Cerrado", "Pantanal"].includes(biome.name)) riskVal += 0.25;
      if (activeFoco === "clima" && ["Mata Atlântica", "Pampa"].includes(biome.name)) riskVal += 0.2;
      riskVal = Math.min(Math.max(riskVal, 0.15), 0.95);

      const color = getRiskColor(riskVal);

      const poly = L.polygon(biome.polygon, {
        fillColor: color,
        weight: 2,
        color: biome.color,
        fillOpacity: 0.35,
        opacity: 0.9
      });

      poly.on("mouseover", (e) => {
        e.target.setStyle({ fillOpacity: 0.6, weight: 3 });
      });

      poly.on("mouseout", (e) => {
        e.target.setStyle({ fillOpacity: 0.35, weight: 2 });
      });

      poly.on("click", () => {
        selectRegion({
          name: biome.name,
          type: "Bioma",
          baseRisk: riskVal,
          area: biome.description
        });
        map.fitBounds(poly.getBounds());
      });

      biomesLayerGroup.addLayer(poly);
    });
  }

  // 4. Rodovias (Polylines Layer)
  function renderHighways() {
    highwaysLayerGroup.clearLayers();

    BRAZIL_GEODATA.highways.forEach(hw => {
      let riskVal = hw.riskLevel === "Crítico" ? 0.9 : hw.riskLevel === "Alto" ? 0.72 : 0.45;
      if (activeFoco === "infra") riskVal += 0.1;
      riskVal = Math.min(riskVal, 0.98);

      const color = getRiskColor(riskVal);

      const polyline = L.polyline(hw.path, {
        color: color,
        weight: 5,
        opacity: 0.85,
        dashArray: hw.riskLevel === "Crítico" ? "5, 10" : null
      });

      polyline.on("mouseover", (e) => {
        e.target.setStyle({ weight: 8, opacity: 1.0 });
      });

      polyline.on("mouseout", (e) => {
        e.target.setStyle({ weight: 5, opacity: 0.85 });
      });

      polyline.on("click", () => {
        selectRegion({
          name: hw.name,
          type: `Rodovia ${hw.type}`,
          baseRisk: riskVal,
          area: `Grau de Risco: ${getRiskLabel(riskVal)}`
        });
      });

      // Bind popups
      polyline.bindPopup(`<h3>${hw.name}</h3><b>Classificação:</b> Rodovia ${hw.type}<br><b>Risco de Infraestrutura/Acidentes:</b> ${getRiskLabel(riskVal)}`);

      highwaysLayerGroup.addLayer(polyline);
    });
  }

  // 5. Cidades (Markers Layer)
  function renderCityMarkers() {
    markersLayerGroup.clearLayers();

    BRAZIL_GEODATA.cities.forEach(city => {
      let calculatedRisk = 0.35;
      if (activeFoco === "crime" && city.importance === "Alta") calculatedRisk += 0.3;
      if (activeFoco === "infra" && city.type === "Interior") calculatedRisk += 0.2;
      calculatedRisk = Math.min(calculatedRisk, 0.9);

      const color = getRiskColor(calculatedRisk);

      // Ícone personalizado moderno
      const circleMarker = L.circleMarker([city.lat, city.lon], {
        radius: city.importance === "Alta" ? 8 : 5,
        fillColor: color,
        color: "#ffffff",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.9
      });

      circleMarker.on("click", () => {
        selectRegion({
          name: `${city.name} (${city.state})`,
          type: `${city.type}`,
          baseRisk: calculatedRisk,
          area: `Cidade do Interior / Monitorada`
        });
      });

      circleMarker.bindPopup(`<h3>${city.name} - ${city.state}</h3><b>Status:</b> ${city.type}<br><b>Índice Risco:</b> ${(calculatedRisk*100).toFixed(0)}%`);

      markersLayerGroup.addLayer(circleMarker);
    });
  }

  // Alternador das Camadas do Mapa
  function setMapLayer(layerName) {
    activeLayer = layerName;

    // Desativa botões anteriores
    document.querySelectorAll(".map-layer-btn").forEach(btn => btn.classList.remove("active"));
    
    // Remove camadas anteriores
    if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
    if (statesGeoJsonLayer && map.hasLayer(statesGeoJsonLayer)) map.removeLayer(statesGeoJsonLayer);
    if (map.hasLayer(biomesLayerGroup)) map.removeLayer(biomesLayerGroup);
    if (map.hasLayer(highwaysLayerGroup)) map.removeLayer(highwaysLayerGroup);
    if (map.hasLayer(markersLayerGroup)) map.removeLayer(markersLayerGroup);

    // Ativa a camada selecionada
    if (layerName === "heat") {
      document.getElementById("layerHeat").classList.add("active");
      map.addLayer(heatLayer);
      map.addLayer(markersLayerGroup); // Mostrar marcadores nas cidades secundárias para apoio visual
    } else if (layerName === "states") {
      document.getElementById("layerStates").classList.add("active");
      if (statesGeoJsonLayer) map.addLayer(statesGeoJsonLayer);
    } else if (layerName === "biomes") {
      document.getElementById("layerBiomes").classList.add("active");
      map.addLayer(biomesLayerGroup);
    } else if (layerName === "highways") {
      document.getElementById("layerHighways").classList.add("active");
      map.addLayer(highwaysLayerGroup);
    }
  }

  // --- SELETOR DE FOCO (FILTRO PRINCIPAL) ---
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const button = e.currentTarget;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      activeFoco = button.getAttribute("data-foco");

      // Atualiza os dados
      generateHeatmap();
      renderBiomes();
      renderHighways();
      renderCityMarkers();
      
      // Se tiver carregado estados por GeoJSON, força re-render
      if (statesGeoJsonLayer) {
        if (statesGeoJsonLayer instanceof L.LayerGroup) {
          renderStatesFallback();
        } else {
          loadStatesGeoJSON();
        }
      }

      // Reaplica a camada corrente
      setMapLayer(activeLayer);

      // Re-seleciona a região corrente para recalcular estatísticas sob o novo foco
      let currentRisk = selectedRegion.baseRisk;
      if (selectedRegion.name === "BRASIL") {
        currentRisk = 0.48; // Risco global base
      } else {
        // Encontrar base risk real
        const st = BRAZIL_GEODATA.states.find(s => s.name === selectedRegion.name);
        if (st) {
          currentRisk = adjustRiskByFoco(st.baseRisk, st.id, activeFoco);
        } else {
          currentRisk = Math.min(Math.max(selectedRegion.baseRisk + (Math.random() * 0.2 - 0.1), 0.1), 0.95);
        }
      }

      selectRegion({
        name: selectedRegion.name,
        type: selectedRegion.type,
        baseRisk: currentRisk,
        area: selectedRegion.area
      });
      
      // Pequeno efeito sonoro / micro-animação no header ao mudar
      const statusInd = document.getElementById("statusIndicator");
      statusInd.style.transform = "scale(1.8)";
      setTimeout(() => statusInd.style.transform = "scale(1)", 300);
    });
  });

  // --- ATUALIZADOR DE ESTATÍSTICAS E GRÁFICOS (RIGHT PANEL) ---
  function selectRegion(region) {
    selectedRegion = region;

    // Atualiza Textos
    regionTitleEl.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> Visão Geral: ${region.name.toUpperCase()}`;
    
    const riskPercentage = Math.floor(region.baseRisk * 100);
    statRiskScoreEl.textContent = `${riskPercentage}%`;
    statRiskScoreEl.className = `stat-value text-${getRiskColorClass(region.baseRisk)}`;
    statRiskLevelEl.textContent = `Risco ${getRiskLabel(region.baseRisk)}`;
    statAreaEl.textContent = region.type === "Estado" || region.type === "Bioma" ? region.area : "8,5M km²";
    
    // Alertas ativos simulados
    const activeAlerts = Math.floor(region.baseRisk * 42) + 2;
    statAlertsEl.textContent = activeAlerts;
    statAlertsEl.className = `stat-value ${region.baseRisk > 0.6 ? 'text-red' : 'text-primary'}`;

    // Atualiza Gráficos
    updateCharts(region);

    // Escreve Relatório Preditivo de IA
    triggerAIDiagnosis(region.name, activeFoco, region.baseRisk);
  }

  function getRiskColorClass(risk) {
    if (risk < 0.2) return "green";
    if (risk < 0.4) return "yellow";
    if (risk < 0.6) return "orange";
    if (risk < 0.8) return "red";
    return "red-dark";
  }

  // --- DIAGNÓSTICO DE IA (TYPEWRITER SIMULATION) ---
  let typingTimer = null;
  function triggerAIDiagnosis(regionName, foco, riskScore) {
    if (typingTimer) clearTimeout(typingTimer);
    
    typingIndicatorEl.textContent = "IA Analisando dados...";
    aiReportTextEl.textContent = "";

    const report = getAIDiagnosisText(regionName, foco, riskScore);
    
    // Efeito de escrita rápida
    let i = 0;
    function type() {
      if (i < report.length) {
        aiReportTextEl.textContent += report.charAt(i);
        i++;
        typingTimer = setTimeout(type, 15);
      } else {
        typingIndicatorEl.textContent = "IA Sentinel Concluído";
      }
    }
    type();
  }

  function getAIDiagnosisText(regionName, foco, riskScore) {
    const riskLvl = getRiskLabel(riskScore);
    const scorePct = (riskScore * 100).toFixed(0);

    // Textos personalizados por Foco
    if (foco === "geral") {
      return `Sentinel IA detectou estabilidade territorial relativa em ${regionName}. O modelo preditivo indica risco global de ${scorePct}% (${riskLvl}). As áreas urbanas demandam monitoramento padrão de infraestrutura de transporte e tráfego. Sensores hidrológicos sem anomalias críticas nas últimas 3 horas.`;
    }
    if (foco === "crime") {
      if (riskScore > 0.6) {
        return `ALERTA DE SEGURANÇA: Sentinel IA reporta flutuação incomum nos índices de ocorrências noturnas em ${regionName}. Recomendado reforço em patrulhamento nas vias expressas e regiões metropolitanas centrais. Análise preditiva estima probabilidade de incidentes de roubo de carga em 78% na próxima janela de 12 horas.`;
      }
      return `Área de segurança está sob controle padrão em ${regionName}. Baixo volume de incidentes violentos relatados no período. Câmeras integradas com reconhecimento de placas operando em conformidade nas principais rodovias periféricas.`;
    }
    if (foco === "clima") {
      if (riskScore > 0.5) {
        return `ALERTA CLIMÁTICO EXTREMO: Instabilidade atmosférica severa avançando sobre ${regionName}. Sensores de pressão indicam ventos fortes e pancadas de chuva de até 60mm/h. Risco iminente de alagamentos pontuais em zonas de baixa altitude e potenciais interrupções elétricas devido a quedas de galhos de árvores.`;
      }
      return `Condições climáticas estáveis em ${regionName}. Temperatura nominal para a estação do ano, ventos moderados a calmos e umidade dentro da zona de conforto. Sem alertas de tempestade vigentes.`;
    }
    if (foco === "desastre") {
      if (riskScore > 0.5) {
        return `ANÁLISE DE ENCOSTAS E INUNDAÇÃO: Índice acumulado de precipitação nas últimas 48 horas atinge nível de saturação do solo em ${regionName}. Sentinel IA projeta deslizamentos localizados em encostas vulneráveis. Recomenda-se acionamento preventivo dos núcleos locais da Defesa Civil.`;
      }
      return `Sem incidentes geológicos ou hidrológicos reportados em ${regionName}. Nível de rios e reservatórios mantidos em faixas de segurança civil. Encostas monitoradas por radar em estado verde.`;
    }
    if (foco === "infra") {
      if (riskScore > 0.5) {
        return `DIAGNÓSTICO DE INFRAESTRUTURA: Subestações de energia elétrica sob alta carga de demanda térmica em ${regionName}. Risco moderado de sobrecarga e interrupção na distribuição em regiões suburbanas. Fluxo em vias arteriais operando acima da capacidade crítica com lentidão acumulada.`;
      }
      return `Estruturas de saneamento, malha elétrica e distribuição de dados operando em plena capacidade em ${regionName}. Tempo médio de resposta a emergências técnicas estimado em 18 minutos.`;
    }
    if (foco === "queimadas") {
      if (riskScore > 0.5) {
        return `ATENÇÃO FLORESTAL: Satélites do INPE integrados ao Sentinel IA identificaram novos focos térmicos com emissão de CO2 anormal em áreas de vegetação de ${regionName}. Baixa umidade de solo (abaixo de 12%) eleva o risco de propagação contínua. Alerta ativo de contenção e brigadas civis recomendadas.`;
      }
      return `Área florestal monitorada sem focos de calor ativos identificados nas últimas 6 horas em ${regionName}. Níveis de umidade foliar normais para conservação do ecossistema.`;
    }
    return `Análise territorial padrão concluída para ${regionName}. Risco médio estimado em ${scorePct}%.`;
  }

  // --- FEED DE EVENTOS EM TEMPO REAL ---
  const incidentTexts = {
    crime: [
      "Assalto a estabelecimento reportado na zona central",
      "Tentativa de furto frustrada por câmeras preditivas",
      "Furto de fiação elétrica prejudica iluminação pública",
      "Ocorrência de roubo a transeunte registrada",
      "Ação integrada de patrulhamento resulta em apreensão"
    ],
    clima: [
      "Fortes rajadas de vento provocam quedas de árvores",
      "Rajadas de granizo isoladas reportadas em áreas rurais",
      "Umidade do ar cai para níveis de atenção",
      "Nevoeiro denso reduz visibilidade em aeroportos locais",
      "Queda acentuada de temperatura registrada nas últimas horas"
    ],
    desastre: [
      "Alagamento intransitável em via marginal de escoamento",
      "Desmoronamento parcial de terra em rodovia vicinal",
      "Alerta de inundação emitido para comunidades de encosta",
      "Transbordamento de córrego local bloqueia tráfego",
      "Defesa Civil realiza vistorias preventivas estruturais"
    ],
    infra: [
      "Semáforos inoperantes causam congestionamentos severos",
      "Queda de energia elétrica atinge bairro residencial",
      "Vazamento em adutora de água compromete calçamento",
      "Buraco de grande porte na via danifica veículos",
      "Manutenção programada em rede de alta tensão concluída"
    ],
    queimadas: [
      "Foco de incêndio detectado em área de preservação",
      "Fumaça densa em rodovia por queima de pastagem",
      "Satélite Sentinel identifica área de calor crítica",
      "Brigada de incêndio combate chamas em vegetação seca",
      "Foco de queimada contido com apoio da guarda florestal"
    ]
  };

  let feedEventCounter = 0;
  function addFeedEvent(focoOverride = null) {
    const categories = ["crime", "clima", "desastre", "infra", "queimadas"];
    const activeCat = focoOverride || (activeFoco === "geral" ? categories[Math.floor(Math.random() * categories.length)] : activeFoco);
    
    // Escolhe estado e cidade aleatórios
    const state = BRAZIL_GEODATA.states[Math.floor(Math.random() * BRAZIL_GEODATA.states.length)];
    const textList = incidentTexts[activeCat];
    const text = textList[Math.floor(Math.random() * textList.length)];
    
    const severityVal = Math.random();
    let severity = "low";
    if (severityVal > 0.85) severity = "critical";
    else if (severityVal > 0.6) severity = "high";
    else if (severityVal > 0.3) severity = "moderate";
    else severity = "very-low";

    const timestamp = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    const feedItem = document.createElement("div");
    feedItem.className = `feed-item ${severity}`;
    feedItem.innerHTML = `
      <div class="feed-meta">
        <span>${timestamp}</span>
        <span>${activeCat.toUpperCase()}</span>
      </div>
      <div class="feed-text">${text}</div>
      <div class="feed-location">
        <i class="fa-solid fa-location-dot"></i> ${state.name} (${state.id})
      </div>
    `;

    eventsFeedEl.prepend(feedItem);
    feedEventCounter++;
    feedCounterEl.textContent = feedEventCounter;

    // Limita tamanho do feed para performance
    if (eventsFeedEl.children.length > 25) {
      eventsFeedEl.removeChild(eventsFeedEl.lastChild);
    }
  }

  // Gera alguns eventos iniciais no feed
  for (let idx = 0; idx < 5; idx++) {
    addFeedEvent();
  }
  
  // Roda looping de eventos no feed
  setInterval(() => {
    addFeedEvent();
  }, 5000);

  // --- INTEGRAÇÃO COM CHART.JS ---
  let riskProfileChart = null;
  let riskTrendChart = null;

  function initCharts() {
    const ctxProfile = document.getElementById("riskProfileChart").getContext("2d");
    const ctxTrend = document.getElementById("riskTrendChart").getContext("2d");

    // Cores de glow e borders
    const chartAccent = "rgba(0, 229, 255, 0.8)";
    const chartAccentFill = "rgba(0, 229, 255, 0.15)";

    // 1. Radar Chart - Risk Profile (Crime, Clima, Desastres, Infra, Queimadas)
    riskProfileChart = new Chart(ctxProfile, {
      type: "radar",
      data: {
        labels: ["Crime", "Clima", "Desastres", "Infraestrutura", "Queimadas"],
        datasets: [{
          label: "Índice de Ameaça (%)",
          data: [45, 52, 35, 40, 30],
          backgroundColor: chartAccentFill,
          borderColor: chartAccent,
          borderWidth: 2,
          pointBackgroundColor: "var(--accent)",
          pointBorderColor: "#fff",
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            grid: { color: "rgba(255, 255, 255, 0.08)" },
            angleLines: { color: "rgba(255, 255, 255, 0.08)" },
            pointLabels: {
              color: "var(--text-secondary)",
              font: { size: 9, family: "Inter" }
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.3)",
              backdropColor: "transparent",
              font: { size: 8 }
            },
            min: 0,
            max: 100
          }
        }
      }
    });

    // 2. Line Chart - Risk Trend History (24h)
    const hours = Array.from({ length: 8 }, (_, i) => `${(21 - i * 3 + 24) % 24}:00`);
    riskTrendChart = new Chart(ctxTrend, {
      type: "line",
      data: {
        labels: hours.reverse(),
        datasets: [{
          data: [42, 45, 48, 51, 49, 47, 46, 48],
          borderColor: "rgba(249, 115, 22, 0.8)", // Orange line
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "var(--text-muted)", font: { size: 8 } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "var(--text-muted)", font: { size: 8 } },
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  function updateCharts(region) {
    if (!riskProfileChart || !riskTrendChart) return;

    const base = region.baseRisk * 100;
    
    // Geração de dados de radar baseados na região e filtros ativos
    let crimeVal = base + (Math.random() * 15 - 7);
    let climaVal = base + (Math.random() * 15 - 7);
    let desastreVal = base + (Math.random() * 15 - 7);
    let infraVal = base + (Math.random() * 15 - 7);
    let queimadasVal = base + (Math.random() * 15 - 7);

    // Ajusta conforme filtro ativo para dar ênfase no gráfico
    if (activeFoco === "crime") crimeVal += 20;
    if (activeFoco === "clima") climaVal += 20;
    if (activeFoco === "desastre") desastreVal += 20;
    if (activeFoco === "infra") infraVal += 20;
    if (activeFoco === "queimadas") queimadasVal += 20;

    // Normalização [5, 98]
    const dataRadar = [crimeVal, climaVal, desastreVal, infraVal, queimadasVal].map(v => Math.min(Math.max(Math.floor(v), 5), 98));
    
    riskProfileChart.data.datasets[0].data = dataRadar;
    
    // Altera a cor do gráfico com base no risco global
    const color = getRiskColor(region.baseRisk);
    riskProfileChart.data.datasets[0].borderColor = color;
    riskProfileChart.data.datasets[0].backgroundColor = color.replace(")", ", 0.15)").replace("rgb", "rgba").replace("#", "rgba("); // Seletor simples
    riskProfileChart.update();

    // Atualiza histórico temporal
    const trendData = [];
    let cur = base - 5;
    for (let i = 0; i < 8; i++) {
      cur += Math.random() * 10 - 5;
      trendData.push(Math.min(Math.max(Math.floor(cur), 10), 98));
    }
    riskTrendChart.data.datasets[0].data = trendData;
    riskTrendChart.data.datasets[0].borderColor = color;
    riskTrendChart.update();
  }

  // --- SIMULAÇÃO DE EVENTO CRÍTICO (MODAL) ---
  const btnSimulate = document.getElementById("btnSimulateEvent");
  const modalOverlay = document.getElementById("criticalModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const modalMetaEl = document.getElementById("modalMeta");
  const modalEventTitleEl = document.getElementById("modalEventTitle");
  const modalDescriptionEl = document.getElementById("modalDescription");

  const simulatedCriticalEvents = [
    {
      title: "Deslizamento em massa atinge trecho serrano na BR-116",
      meta: "ESTADO: RIO DE JANEIRO (SERRA) | INFRAESTRUTURA / CLIMA",
      desc: "Precipitação acumulada de 180mm em 24h provocou saturação do solo, gerando deslizamento crítico na encosta rodoviária. Pista interditada totalmente em ambos os sentidos. Equipes da Defesa Civil e concessionária acionadas.",
      lat: -22.45,
      lon: -42.97
    },
    {
      title: "Queimada severa ameaça reserva ecológica e rodovia no Mato Grosso",
      meta: "ESTADO: MATO GRASS (SINOP) | QUEIMADAS / MEIO AMBIENTE",
      desc: "Satélites infravermelhos detectaram múltiplas frentes de fogo ativo com altura de labareda estimada em 8 metros. Ventos de 40km/h dificultam contenção rápida. Rodovia BR-163 sob fumaça tóxica.",
      lat: -11.86,
      lon: -55.50
    },
    {
      title: "Falha catastrófica de subestação desliga energia na Região Metropolitana",
      meta: "ESTADO: SÃO PAULO (CAMPINAS) | INFRAESTRUTURA URBANA",
      desc: "Sobrecarga de circuito causou curto circuito seguido de princípio de incêndio em transformador de alta potência. Aproximadamente 450 mil residências sem fornecimento elétrico ativo. Risco de falhas na malha de transporte metroferroviário.",
      lat: -22.90,
      lon: -47.06
    },
    {
      title: "Inundação severa bloqueia vias centrais e afeta transporte público",
      meta: "ESTADO: RIO GRANDE DO SUL (PORTO ALEGRE) | EVENTOS EXTREMOS",
      desc: "Elevação do nível do rio atinge cota de transbordo histórico após chuvas torrenciais persistentes. Vias urbanas marginais tomadas pelas águas. Serviços de ônibus e trens metropolitanos suspensos em caráter preventivo.",
      lat: -30.03,
      lon: -51.21
    }
  ];

  if (btnSimulate && modalOverlay && btnCloseModal) {
    btnSimulate.addEventListener("click", () => {
      // Escolhe um evento aleatório
      const ev = simulatedCriticalEvents[Math.floor(Math.random() * simulatedCriticalEvents.length)];
      
      modalMetaEl.textContent = `DATA: ${new Date().toLocaleDateString()} | ${ev.meta}`;
      modalEventTitleEl.textContent = ev.title;
      modalDescriptionEl.textContent = ev.desc;

      // Abre Modal
      modalOverlay.classList.add("active");

      // Força feed de alertas
      addFeedEvent();

      // Ajusta o foco do mapa para a área do evento crítico
      map.setView([ev.lat, ev.lon], 8);
      
      // Cria marcador vermelho temporário com pulso no mapa
      const emergencyIcon = L.divIcon({
        className: 'custom-emergency-icon',
        html: '<div class="emergency-marker-pulse"></div>',
        iconSize: [30, 30]
      });

      const emergencyMarker = L.marker([ev.lat, ev.lon], { icon: emergencyIcon }).addTo(map);
      emergencyMarker.bindPopup(`<h3>ALERT EXTRAORDINÁRIO</h3><b>${ev.title}</b>`).openPopup();

      // Remove o marcador após 15 segundos
      setTimeout(() => {
        map.removeLayer(emergencyMarker);
      }, 15000);

      // Atualiza painel para indicar risco crítico na região correspondente
      selectRegion({
        name: ev.meta.split("|")[0].split(":")[1].trim(),
        type: "Evento Emergencial",
        baseRisk: 0.95,
        area: "Zona sob Emergência Civil"
      });
    });

    btnCloseModal.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });
  }

  // --- BOTÕES ADICIONAIS ---
  
  // Restaurar Foco Nacional
  const btnReset = document.getElementById("btnResetMap");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      map.setView([-14.2350, -51.9253], 4);
      selectRegion({
        name: "BRASIL",
        type: "Nacional",
        baseRisk: 0.48,
        area: "8,5 milhões de km² monitorados"
      });
    });
  }

  // Exportar Relatório (Download Simulado)
  const btnExport = document.getElementById("btnExportReport");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const regionText = `=========================================
SENTINEL IA BRASIL - RELATÓRIO PREDITIVO
DATA E HORA: ${new Date().toLocaleString()}
REGIAO: ${selectedRegion.name} (${selectedRegion.type})
RISCO ESTIMADO: ${(selectedRegion.baseRisk * 100).toFixed(0)}% (${getRiskLabel(selectedRegion.baseRisk)})
FOCO DA ANALISE: ${activeFoco.toUpperCase()}
=========================================
DIAGNÓSTICO DA IA:
${aiReportTextEl.textContent.trim()}
=========================================
Relatório gerado automaticamente pelo motor Sentinel IA.`;
      
      const blob = new Blob([regionText], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `sentinel-ia-report-${selectedRegion.name.toLowerCase().replace(/ /g, "-")}.txt`;
      link.click();
    });
  }

  // --- BOOTSTRAP INICIAL ---
  initMap();
  initCharts();
  
  // Inicia selecionando o Brasil Geral
  selectRegion({
    name: "BRASIL",
    type: "Nacional",
    baseRisk: 0.48,
    area: "8,5M km²"
  });

  // Listener para botões do alternador de camadas
  document.getElementById("layerHeat").addEventListener("click", () => setMapLayer("heat"));
  document.getElementById("layerStates").addEventListener("click", () => setMapLayer("states"));
  document.getElementById("layerBiomes").addEventListener("click", () => setMapLayer("biomes"));
  document.getElementById("layerHighways").addEventListener("click", () => setMapLayer("highways"));
});

// Estilos adicionais injetados dinamicamente para o pulso emergencial no Leaflet
const styleElement = document.createElement("style");
styleElement.innerHTML = `
.custom-emergency-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.emergency-marker-pulse {
  width: 20px;
  height: 20px;
  background-color: #ff3333;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 10px #ff3333;
  animation: marker-pulse 1.2s infinite;
}
@keyframes marker-pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 51, 81, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(255, 51, 81, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 51, 81, 0); }
}
`;
document.head.appendChild(styleElement);
