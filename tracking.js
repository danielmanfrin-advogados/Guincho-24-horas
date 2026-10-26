/**
 * Sistema leve de rastreamento de cliques em botões de conversão.
 * Opera sem cookies, sem identificadores pessoais e sem atrasar a navegação.
 */
(function () {
  'use strict';

  // Sincroniza links e telefones na interface a partir do config.js
  function syncDynamicConfig() {
    if (typeof window.CONFIG === 'undefined') return;

    var cfg = window.CONFIG;

    // Atualiza links de WhatsApp que possuam atributo data-service ou data-location
    var waLinks = document.querySelectorAll('a[data-role="whatsapp-link"]');
    waLinks.forEach(function (link) {
      var service = link.getAttribute('data-service') || '';
      var location = link.getAttribute('data-location') || '';
      link.href = cfg.getWhatsAppUrl(service, location);
    });

    // Atualiza links de telefone
    var telLinks = document.querySelectorAll('a[data-role="tel-link"]');
    telLinks.forEach(function (link) {
      link.href = cfg.getTelUrl();
    });

    // Atualiza textos com o número formatado
    var phoneSpans = document.querySelectorAll('.phone-text');
    phoneSpans.forEach(function (span) {
      span.textContent = cfg.telefoneFormatted;
    });
  }

  // Extrai parâmetros UTM e origem da navegação
  function getTrafficSource() {
    var params = new URLSearchParams(window.location.search);
    var utmSource = params.get('utm_source');
    var referrer = document.referrer;
    var origem = 'direto';

    if (utmSource) {
      origem = utmSource;
    } else if (referrer) {
      try {
        var refUrl = new URL(referrer);
        origem = refUrl.hostname;
      } catch (e) {
        origem = 'referrer';
      }
    }

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    return {
      origem: origem,
      meio: params.get('utm_medium') || '',
      campanha: params.get('utm_campaign') || '',
      termo: params.get('utm_term') || '',
      anuncio: params.has('gclid') ? 'sim' : 'nao',
      dispositivo: isMobile ? 'celular' : 'computador'
    };
  }

  // Dispara o evento de rastreamento
  function trackEvent(botao, posicao) {
    if (!window.CONFIG || !window.CONFIG.webhookUrl) {
      return;
    }

    var traffic = getTrafficSource();
    var payload = {
      token: window.CONFIG.trackingToken || '',
      site: window.CONFIG.siteId || 'site-guincho',
      botao: botao, // "whatsapp" ou "ligar"
      posicao: posicao, // "topo", "meio", "rodape", "barra-fixa"
      pagina: window.location.pathname,
      origem: traffic.origem,
      meio: traffic.meio,
      campanha: traffic.campanha,
      termo: traffic.termo,
      dispositivo: traffic.dispositivo,
      anuncio: traffic.anuncio
    };

    var bodyString = JSON.stringify(payload);

    // Prioriza sendBeacon para não bloquear o redirecionamento
    if (navigator.sendBeacon) {
      var blob = new Blob([bodyString], { type: 'text/plain; charset=UTF-8' });
      navigator.sendBeacon(window.CONFIG.webhookUrl, blob);
    } else {
      fetch(window.CONFIG.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
        body: bodyString
      }).catch(function () {
        // Falha silenciosa para não interferir na experiência do usuário
      });
    }

    /*
     * Bloco opcional para Google Analytics 4 e Google Ads.
     * Para ativar, configure gaMeasurementId ou googleAdsConversionId em config.js
     * e retire o comentário abaixo:
     *
     * if (window.gtag && window.CONFIG.gaMeasurementId) {
     *   window.gtag('event', 'conversion_click', {
     *     event_category: 'lead',
     *     event_label: botao + '_' + posicao,
     *     send_to: window.CONFIG.googleAdsConversionId
     *       ? window.CONFIG.googleAdsConversionId + '/' + window.CONFIG.googleAdsConversionLabel
     *       : undefined
     *   });
     * }
     */
  }

  // Escuta cliques nos botões marcados com data-track
  function initTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-track]');
      if (!target) return;

      var botao = target.getAttribute('data-track'); // "whatsapp" ou "ligar"
      var posicao = target.getAttribute('data-pos') || 'corpo'; // "topo", "meio", "rodape", "barra-fixa"

      trackEvent(botao, posicao);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncDynamicConfig();
      initTracking();
    });
  } else {
    syncDynamicConfig();
    initTracking();
  }
})();
