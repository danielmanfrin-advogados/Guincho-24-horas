import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          servicos_plataforma: path.resolve(__dirname, 'servicos/guincho-plataforma/index.html'),
          servicos_moto: path.resolve(__dirname, 'servicos/guincho-moto/index.html'),
          servicos_bateria: path.resolve(__dirname, 'servicos/socorro-bateria/index.html'),
          bairros_centro: path.resolve(__dirname, 'bairros/centro/index.html'),
          bairros_jardim_botanico: path.resolve(__dirname, 'bairros/jardim-botanico/index.html'),
          bairros_nova_alianca: path.resolve(__dirname, 'bairros/nova-alianca/index.html'),
          bairros_vila_tiberio: path.resolve(__dirname, 'bairros/vila-tiberio/index.html'),
          bairros_bonfim_paulista: path.resolve(__dirname, 'bairros/bonfim-paulista/index.html'),
          bairros_campos_eliseos: path.resolve(__dirname, 'bairros/campos-eliseos/index.html'),
          perguntas_frequentes: path.resolve(__dirname, 'perguntas-frequentes/index.html'),
          sobre: path.resolve(__dirname, 'sobre/index.html'),
          politica_privacidade: path.resolve(__dirname, 'politica-de-privacidade/index.html'),
          not_found: path.resolve(__dirname, '404.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
