/**
 * Configuração central do site de captação de leads.
 * Todos os dados variáveis (telefones, parceiro, domínios e tokens)
 * devem ser alterados exclusivamente neste arquivo.
 */
const CONFIG = {
  // Identificação do site
  siteName: "Guincho 24 Horas em Ribeirão Preto",
  domain: "https://guinchoribeiraopreto.vercel.app",
  siteId: "guincho-24h-ribeirao-preto",
  city: "Ribeirão Preto, SP",
  hours: "Atendimento 24 horas por dia, 7 dias por semana",

  // Contato do parceiro de atendimento (somente dígitos com 55 e DDD)
  whatsapp: "5516999999999",
  whatsappFormatted: "(16) 99999-9999",
  telefone: "5516999999999",
  telefoneFormatted: "(16) 99999-9999",

  // Mensagem padrão pré-preenchida para o WhatsApp
  defaultMessage: "Olá! Vim pelo site Guincho 24 Horas em Ribeirão Preto e preciso de guincho em Ribeirão Preto.",

  // Planilha de captação de cliques / webhook (deixe vazio se não usar)
  // Se preenchido com a URL do script do Google Sheets, receberá os eventos de clique
  webhookUrl: "https://script.google.com/macros/s/AKfycbzNOf1W0H8qo7UEY0AGEyLIF3ksLYgj2YELKy9OytgORZ_3Zs6PmRGl_a2p9w-myqdnlg/exec",
  trackingToken: "479479",

  // Ferramentas opcionais de análise (desativadas por padrão)
  gaMeasurementId: "", // Exemplo: "G-XXXXXXXXXX"
  googleAdsConversionId: "", // Exemplo: "AW-XXXXXXXXXX"
  googleAdsConversionLabel: "", // Exemplo: "AbCdEfGhIjKlMnOpQrS"

  /**
   * Gera a URL completa para contato via WhatsApp
   * @param {string} [service] Nome do serviço específico solicitado
   * @param {string} [location] Bairro ou ponto de referência
   * @returns {string} Link com texto codificado
   */
  getWhatsAppUrl(service, location) {
    let text = CONFIG.defaultMessage;
    if (service || location) {
      const serv = service || "guincho 24 horas";
      const loc = location || "Ribeirão Preto";
      text = `Olá! Vim pelo site ${CONFIG.siteName} e preciso de ${serv} em ${loc}.`;
    }
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Gera o link para chamada telefônica
   * @returns {string} Link tel:+...
   */
  getTelUrl() {
    return `tel:+${CONFIG.telefone}`;
  }
};

// Disponibiliza no escopo global para tracking.js e scripts de página
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
