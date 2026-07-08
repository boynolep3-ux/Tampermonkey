// ==UserScript==
// @name         Bintang Media - Red Theme
// @namespace    http://tampermonkey.net/
// @version      32.17
// @author       Hitami & Gemini
// @match        https://bintangbaru.bintangmedi4.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /* ==========================================================================
       PILIHAN TEMA (Cukup ganti value di bawah ini: 'red' atau 'blue')
    ========================================================================== */
    const PILIHAN_TEMA = 'red';

    // Konfigurasi Palet Warna Tema (Menjaga teks tetap hidup & kontras otomatis)
    const SELEKTOR_TEMA = {
        red: {
            bg1: '#4a0000', bg2: '#800000', bg3: '#b30000',
            header1: '#660000', header2: '#990000',
            accent: '#cc0000', accentLight: '#ffcccc',
            accentShadow: 'rgba(255, 100, 100, 0.6)',
            panelRgb: '30, 0, 0',
            dropdownRgb: '20, 0, 0',
            navbarRgb: '50, 0, 0',
            rowHighlight: 'rgba(150, 0, 0, 0.4)',
            textBtn: '#800000', textBtnHover: '#cc0000'
        },
        blue: {
            bg1: '#001a33', bg2: '#003366', bg3: '#004d99',
            header1: '#002244', header2: '#004488',
            accent: '#0066cc', accentLight: '#cce6ff',
            accentShadow: 'rgba(100, 180, 255, 0.6)',
            panelRgb: '0, 15, 30',
            dropdownRgb: '0, 10, 20',
            navbarRgb: '0, 20, 40',
            rowHighlight: 'rgba(0, 77, 153, 0.4)',
            textBtn: '#003366', textBtnHover: '#0066cc'
        }
    };

    // Ambil data tema aktif, fallback ke merah jika input salah
    const tema = SELEKTOR_TEMA[PILIHAN_TEMA] || SELEKTOR_TEMA.red;
    const path = window.location.pathname;

    // Deteksi halaman login berdasarkan kecocokan form id "FormLogin" dari file asli
    const isLoginPage = path === '/' || path === '' || path.includes('/otentikasi') || document.getElementById('FormLogin') !== null;
    const isExcludedPage = path.includes('/pelanggan') || path.includes('/datapenjualan/riwayat');

    // LOGO VECTOR ASLI UNTUK GLASSMORPHISM CARD LOGIN
    const logoSvg = `
        <div style="display: flex; justify-content: center; margin-bottom: 20px; width: 100%;">
            <svg xmlns="http://www.w3.org/2000/svg" width="160px" height="auto" viewBox="0 0 3034.89 2070.86" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">
 <defs>
  <style type="text/css">
   <![CDATA[
    .fil3 {fill:#FEFEFE}
    .fil0 {fill:#22A7F4}
    .fil1 {fill:#F62255}
    .fil2 {fill:#FDCE0C}
   ]]>
  </style>
 </defs>
 <g id="Layer_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <polygon class="fil0" points="1092.7,708.17 1120.39,0 641.29,402.33 15.12,340.54 682.23,570.6 1011.74,306.43 "/>
  <polygon class="fil1" points="682.23,570.6 268.1,527.87 423.35,920.12 -0,1496.92 246.2,920.02 15.12,340.54 "/>
  <polygon class="fil2" points="423.35,920.12 257.7,1300.72 440.09,1289.61 440.09,1471.66 -0,1496.92 "/>
  <path class="fil3" d="M487.95 618.12l236.81 0c74.95,0 112.48,39.03 112.48,116.97l0 119.84c0,44.77 -4.11,69.33 -12.35,73.7 8.23,5.86 12.35,29.56 12.35,70.96l0 152.02 -235.32 0c-75.7,0 -113.73,-28.81 -113.98,-86.3l0 -447.19zm98.02 96.52l0 163.61 141.66 0c6.86,0 10.23,-1.5 10.23,-4.36l0 -150.52c0,-5.86 -5.36,-8.73 -16.09,-8.73l-135.8 0zm147.15 261.51l-147.15 0 0 68.71c0,6.86 3.37,10.23 10.22,10.23l141.67 0 0 -71.58c0,-4.86 -1.5,-7.36 -4.74,-7.36zm269.3 -358.03l0 533.49 -99.39 0 0 -533.49 99.39 0zm65.78 0l235.32 0c76.07,0 113.98,42.4 113.98,127.2l0 406.29 -99.39 0 0 -425.37c0,-7.73 -5.86,-11.6 -17.46,-11.6l-133.06 0 0 436.97 -99.39 0 0 -533.49zm737.19 0l0 96.52 -124.21 0 0 436.97 -97.89 0 0 -436.97 -125.7 0 0 -96.52 347.8 0zm48.57 0l239.68 0c73.33,0 109.86,34.17 109.61,102.38l0 431.1 -97.89 0 0 -176.83 -153.39 0 0 176.83 -98.02 0 0 -523.26 0 -10.23zm98.02 96.52l0 163.61 153.39 0 0 -152.02c0,-7.73 -5.86,-11.6 -17.58,-11.6l-135.8 0zm317.06 -96.52l235.32 0c76.07,0 113.98,42.4 113.98,127.2l0 406.29 -99.39 0 0 -425.37c0,-7.73 -5.86,-11.6 -17.46,-11.6l-133.06 0 0 436.97 -99.39 0 0 -533.49zm415.08 0l236.81 0c75.95,0 113.98,42.4 113.98,127.2l0 105.25 -99.39 0 0 -124.33c0,-7.73 -5.86,-11.6 -17.58,-11.6l-137.3 0 0 318.87c0,14.47 6.24,21.57 18.58,21.57l136.3 0 0 -80.31 -76.69 0 0 -96.52 176.08 0 0 273.35 -227.96 0c-82.06,0 -123.08,-31.68 -122.83,-95.03l0 -438.46z"/>
  <path class="fil3" d="M928.7 1191.36c99.47,0 149.28,55.53 149.28,166.6l0 532.13 -130.17 0 0 -534.09c0,-25.48 -14.21,-38.22 -42.63,-38.22l-50.63 0 0 572.31 -130.17 0 0 -534.58c-0.33,-25.15 -13.88,-37.73 -40.67,-37.73l-65.66 0 0 572.31 -130.18 0 0 -698.73 440.83 0z"/>
  <path class="fil3" d="M1194 1190.87l312.13 0c95.71,0 143.4,44.75 143.4,134.09l0 169.87 -128.21 0 0 -160.39c0,-11.43 -7.68,-17.15 -22.87,-17.15l-176.07 0 0 214.29 209.56 0 0 126.42 -209.56 0 0 97.51c0,5.23 4.41,7.68 13.39,7.68l314.74 0 0 126.42 -307.23 0c-99.47,0 -149.28,-41.49 -149.28,-124.46l0 -574.27z"/>
  <path class="fil3" d="M1762.26 1190.87l317.84 0c94.41,0 141.61,46.55 141.61,139.81l0 440.18c0,79.05 -49.16,118.74 -147.32,118.74l-312.13 0 0 -698.73zm130.18 126.42l0 445.9 179.99 0c14.37,0 21.4,-8.66 21.07,-25.81l0 -397.22c0,-15.19 -5.72,-22.87 -17.31,-22.87l-183.75 0z"/>
  <polygon class="fil3" points="2464.44,1190.87 2464.44,1889.61 2334.27,1889.61 2334.27,1190.87 "/>
  <path class="fil3" d="M2577.16 1190.87l313.92 0c96.04,0 143.89,44.75 143.57,134.09l0 564.64 -128.21 0 0 -231.6 -200.9 0 0 231.6 -128.38 0 0 -685.34 0 -13.39zm128.38 126.42l0 214.29 200.9 0 0 -199.1c0,-10.13 -7.68,-15.19 -23.03,-15.19l-177.87 0z"/>
  <path class="fil3" d="M520.98 1969.14c10.63,0 19.95,2.04 27.95,6.11 8,4.07 14.18,9.91 18.53,17.53 4.36,7.61 6.54,16.5 6.54,26.65 0,10.15 -2.18,18.97 -6.54,26.44 -4.36,7.47 -10.54,13.19 -18.53,17.17 -8,3.98 -17.31,5.96 -27.95,5.96l-32.62 0 0 -99.86 32.62 0zm0 86.5c11.69,0 20.64,-3.16 26.87,-9.48 6.23,-6.32 9.34,-15.23 9.34,-26.73 0,-11.59 -3.11,-20.64 -9.34,-27.16 -6.23,-6.51 -15.18,-9.77 -26.87,-9.77l-16.24 0 0 73.13 16.24 0zm94.46 -86.5l0 99.86 -16.38 0 0 -99.86 16.38 0zm102.65 28.74c-2.59,-4.98 -6.18,-8.74 -10.78,-11.28 -4.6,-2.54 -9.91,-3.81 -15.95,-3.81 -6.61,0 -12.5,1.48 -17.67,4.45 -5.17,2.97 -9.22,7.18 -12.14,12.64 -2.92,5.46 -4.38,11.78 -4.38,18.97 0,7.18 1.46,13.53 4.38,19.04 2.92,5.51 6.97,9.75 12.14,12.72 5.17,2.97 11.06,4.45 17.67,4.45 8.91,0 16.14,-2.49 21.7,-7.47 5.56,-4.98 8.96,-11.73 10.2,-20.26l-37.5 0 0 -13.07 55.03 0 0 12.79c-1.05,7.76 -3.81,14.89 -8.26,21.41 -4.45,6.51 -10.25,11.71 -17.38,15.59 -7.14,3.88 -15.06,5.82 -23.78,5.82 -9.39,0 -17.96,-2.18 -25.72,-6.54 -7.76,-4.36 -13.91,-10.42 -18.46,-18.18 -4.55,-7.76 -6.83,-16.52 -6.83,-26.29 0,-9.77 2.28,-18.53 6.83,-26.29 4.55,-7.76 10.73,-13.82 18.54,-18.18 7.81,-4.36 16.35,-6.54 25.65,-6.54 10.63,0 20.09,2.61 28.38,7.83 8.29,5.22 14.3,12.62 18.03,22.2l-19.68 0zm64 -28.74l0 99.86 -16.38 0 0 -99.86 16.38 0zm94.89 0l0 13.36 -26.58 0 0 86.5 -16.38 0 0 -86.5 -26.73 0 0 -13.36 69.69 0zm85.55 79.46l-41.81 0 -7.18 20.4 -17.1 0 35.78 -100 18.97 0 35.78 100 -17.24 0 -7.18 -20.4zm-4.6 -13.36l-16.24 -46.41 -16.38 46.41 32.62 0zm69.74 20.55l33.76 0 0 13.22 -50.15 0 0 -99.86 16.38 0 0 86.64zm163.42 -56.9c0,5.08 -1.2,9.87 -3.59,14.37 -2.39,4.5 -6.23,8.17 -11.5,10.99 -5.27,2.83 -12.02,4.24 -20.26,4.24l-18.1 0 0 40.52 -16.38 0 0 -99.86 34.48 0c7.66,0 14.15,1.32 19.47,3.95 5.32,2.63 9.29,6.2 11.93,10.7 2.63,4.5 3.95,9.53 3.95,15.09zm-35.35 16.24c6.23,0 10.87,-1.41 13.94,-4.24 3.07,-2.83 4.6,-6.82 4.6,-12 0,-10.92 -6.18,-16.38 -18.54,-16.38l-18.1 0 0 32.62 18.1 0zm111.7 53.88l-22.99 -39.94 -12.5 0 0 39.94 -16.38 0 0 -99.86 34.48 0c7.66,0 14.15,1.34 19.47,4.02 5.32,2.68 9.29,6.27 11.93,10.78 2.63,4.5 3.95,9.53 3.95,15.09 0,6.51 -1.89,12.43 -5.68,17.74 -3.78,5.32 -9.6,8.93 -17.46,10.85l24.71 41.38 -19.54 0zm-35.49 -53.02l18.1 0c6.13,0 10.75,-1.53 13.87,-4.6 3.11,-3.07 4.67,-7.18 4.67,-12.36 0,-5.17 -1.53,-9.22 -4.6,-12.14 -3.07,-2.92 -7.71,-4.38 -13.94,-4.38l-18.1 0 0 33.48zm99.63 -46.84l0 99.86 -16.38 0 0 -99.86 16.38 0zm112.42 99.86l-16.38 0 -49.28 -74.57 0 74.57 -16.38 0 0 -100 16.38 0 49.28 74.43 0 -74.43 16.38 0 0 100zm94.89 -99.86l0 13.36 -26.58 0 0 86.5 -16.38 0 0 -86.5 -26.73 0 0 -13.36 69.69 0zm41.73 0l0 99.86 -16.38 0 0 -99.86 16.38 0zm112.42 99.86l-16.38 0 -49.28 -74.57 0 74.57 -16.38 0 0 -100 16.38 0 49.28 74.43 0 -74.43 16.38 0 0 100zm102.65 -71.12c-2.59,-4.98 -6.18,-8.74 -10.78,-11.28 -4.6,-2.54 -9.91,-3.81 -15.95,-3.81 -6.61,0 -12.5,1.48 -17.67,4.45 -5.17,2.97 -9.22,7.18 -12.14,12.64 -2.92,5.46 -4.38,11.78 -4.38,18.97 0,7.18 1.46,13.53 4.38,19.04 2.92,5.51 6.97,9.75 12.14,12.72 5.17,2.97 11.06,4.45 17.67,4.45 8.91,0 16.14,-2.49 21.7,-7.47 5.56,-4.98 8.96,-11.73 10.2,-20.26l-37.5 0 0 -13.07 55.03 0 0 12.79c-1.05,7.76 -3.81,14.89 -8.26,21.41 -4.45,6.51 -10.25,11.71 -17.38,15.59 -7.14,3.88 -15.06,5.82 -23.78,5.82 -9.39,0 -17.96,-2.18 -25.72,-6.54 -7.76,-4.36 -13.91,-10.42 -18.46,-18.18 -4.55,-7.76 -6.83,-16.52 -6.83,-26.29 0,-9.77 2.28,-18.53 6.83,-26.29 4.55,-7.76 10.73,-13.82 18.54,-18.18 7.81,-4.36 16.35,-6.54 25.65,-6.54 10.63,0 20.09,2.61 28.38,7.83 8.29,5.22 14.3,12.62 18.03,22.2l-19.68 0zm162.13 71.12l-12.36 -12.36c-4.79,4.79 -10.01,8.36 -15.66,10.7 -5.65,2.35 -11.97,3.52 -18.97,3.52 -7.09,0 -13.36,-1.24 -18.82,-3.73 -5.46,-2.49 -9.67,-6.06 -12.64,-10.7 -2.97,-4.64 -4.45,-10.03 -4.45,-16.16 0,-6.9 1.96,-13.05 5.89,-18.46 3.93,-5.41 9.77,-9.7 17.53,-12.86 -2.78,-3.35 -4.74,-6.49 -5.89,-9.41 -1.15,-2.92 -1.72,-6.15 -1.72,-9.7 0,-4.41 1.13,-8.33 3.38,-11.78 2.25,-3.45 5.48,-6.18 9.7,-8.19 4.22,-2.01 9.1,-3.02 14.66,-3.02 5.65,0 10.46,1.08 14.44,3.23 3.98,2.16 6.95,5.1 8.91,8.84 1.96,3.73 2.75,7.9 2.37,12.5l-16.38 0c0.1,-3.54 -0.77,-6.3 -2.59,-8.26 -1.82,-1.96 -4.31,-2.95 -7.47,-2.95 -3.16,0 -5.72,0.94 -7.69,2.8 -1.96,1.87 -2.95,4.14 -2.95,6.82 0,2.59 0.74,5.15 2.23,7.69 1.48,2.54 4.09,5.82 7.83,9.84l26.44 26.29 10.2 -16.81 17.67 0 -12.93 22.13 -3.59 5.89 24.28 24.14 -21.41 0zm-46.98 -12.07c9,0 16.95,-3.69 23.85,-11.06l-26.44 -26.58c-11.3,4.5 -16.95,11.3 -16.95,20.4 0,4.88 1.82,8.98 5.46,12.28 3.64,3.31 8.33,4.96 14.08,4.96zm185.55 -8.33l-41.81 0 -7.18 20.4 -17.1 0 35.78 -100 18.97 0 35.78 100 -17.24 0 -7.18 -20.4zm-4.6 -13.36l-16.24 -46.41 -16.38 46.41 32.62 0zm85.98 -66.09c10.63,0 19.95,2.04 27.95,6.11 8,4.07 14.18,9.91 18.53,17.53 4.36,7.61 6.54,16.5 6.54,26.65 0,10.15 -2.18,18.97 -6.54,26.44 -4.36,7.47 -10.54,13.19 -18.53,17.17 -8,3.98 -17.31,5.96 -27.95,5.96l-32.62 0 0 -99.86 32.62 0zm0 86.5c11.69,0 20.64,-3.16 26.87,-9.48 6.23,-6.32 9.34,-15.23 9.34,-26.73 0,-11.59 -3.11,-20.64 -9.34,-27.16 -6.23,-6.51 -15.18,-9.77 -26.87,-9.77l-16.24 0 0 73.13 16.24 0zm164.14 -86.5l-37.5 99.86 -18.97 0 -37.64 -99.86 17.53 0 29.6 83.05 29.74 -83.05 17.24 0zm38.85 13.22l0 29.31 34.48 0 0 13.36 -34.48 0 0 30.6 38.79 0 0 13.36 -55.17 0 0 -100 55.17 0 0 13.36 -38.79 0zm119.6 86.64l-22.99 -39.94 -12.5 0 0 39.94 -16.38 0 0 -99.86 34.48 0c7.66,0 14.15,1.34 19.47,4.02 5.32,2.68 9.29,6.27 11.93,10.78 2.63,4.5 3.95,9.53 3.95,15.09 0,6.51 -1.89,12.43 -5.68,17.74 -3.78,5.32 -9.6,8.93 -17.46,10.85l24.71 41.38 -19.54 0zm-35.49 -53.02l18.1 0c6.13,0 10.75,-1.53 13.87,-4.6 3.11,-3.07 4.67,-7.18 4.67,-12.36 0,-5.17 -1.53,-9.22 -4.6,-12.14 -3.07,-2.92 -7.71,-4.38 -13.94,-4.38l-18.1 0 0 33.48zm147.76 -46.84l0 13.36 -26.58 0 0 86.5 -16.38 0 0 -86.5 -26.73 0 0 -13.36 69.69 0zm41.73 0l0 99.86 -16.38 0 0 -99.86 16.38 0zm63.28 100.86c-6.71,0 -12.74,-1.17 -18.1,-3.52 -5.36,-2.35 -9.58,-5.68 -12.64,-9.99 -3.07,-4.31 -4.6,-9.34 -4.6,-15.09l17.53 0c0.38,4.31 2.08,7.85 5.1,10.63 3.02,2.78 7.26,4.17 12.72,4.17 5.65,0 10.06,-1.37 13.22,-4.09 3.16,-2.73 4.74,-6.25 4.74,-10.56 0,-3.35 -0.98,-6.08 -2.95,-8.19 -1.96,-2.11 -4.41,-3.74 -7.33,-4.89 -2.92,-1.15 -6.97,-2.39 -12.14,-3.73 -6.51,-1.72 -11.81,-3.47 -15.88,-5.24 -4.07,-1.77 -7.54,-4.53 -10.42,-8.26 -2.87,-3.73 -4.31,-8.72 -4.31,-14.94 0,-5.75 1.44,-10.78 4.31,-15.09 2.87,-4.31 6.9,-7.61 12.07,-9.91 5.17,-2.3 11.16,-3.45 17.96,-3.45 9.67,0 17.6,2.42 23.78,7.26 6.18,4.84 9.6,11.47 10.27,19.9l-18.1 0c-0.29,-3.64 -2.01,-6.75 -5.17,-9.34 -3.16,-2.59 -7.33,-3.88 -12.5,-3.88 -4.69,0 -8.53,1.2 -11.5,3.59 -2.97,2.39 -4.45,5.84 -4.45,10.34 0,3.07 0.94,5.58 2.8,7.54 1.87,1.96 4.24,3.52 7.11,4.67 2.87,1.15 6.8,2.39 11.78,3.74 6.61,1.82 12,3.64 16.16,5.46 4.17,1.82 7.71,4.62 10.63,8.41 2.92,3.78 4.38,8.84 4.38,15.16 0,5.08 -1.37,9.87 -4.1,14.37 -2.73,4.5 -6.7,8.12 -11.92,10.85 -5.22,2.73 -11.38,4.09 -18.46,4.09zm79.08 -100.86l0 99.86 -16.38 0 0 -99.86 16.38 0zm112.42 99.86l-16.38 0 -49.28 -74.57 0 74.57 -16.38 0 0 -100 16.38 0 49.28 74.43 0 -74.43 16.38 0 0 100zm102.65 -71.12c-2.59,-4.98 -6.18,-8.74 -10.78,-11.28 -4.6,-2.54 -9.91,-3.81 -15.95,-3.81 -6.61,0 -12.5,1.48 -17.67,4.45 -5.17,2.97 -9.22,7.18 -12.14,12.64 -2.92,5.46 -4.38,11.78 -4.38,18.97 0,7.18 1.46,13.53 4.38,19.04 2.92,5.51 6.97,9.75 12.14,12.72 5.17,2.97 11.06,4.45 17.67,4.45 8.91,0 16.14,-2.49 21.7,-7.47 5.56,-4.98 8.96,-11.73 10.2,-20.26l-37.5 0 0 -13.07 55.03 0 0 12.79c-1.05,7.76 -3.81,14.89 -8.26,21.41 -4.45,6.51 -10.25,11.71 -17.38,15.59 -7.14,3.88 -15.06,5.82 -23.78,5.82 -9.39,0 -17.96,-2.18 -25.72,-6.54 -7.76,-4.36 -13.91,-10.42 -18.46,-18.18 -4.55,-7.76 -6.83,-16.52 -6.83,-26.29 0,-9.77 2.28,-18.53 6.83,-26.29 4.55,-7.76 10.73,-13.82 18.54,-18.18 7.81,-4.36 16.35,-6.54 25.65,-6.54 10.63,0 20.09,2.61 28.38,7.83 8.29,5.22 14.3,12.62 18.03,22.2l-19.68 0z"/>
 </g>
</svg>

        </div>
    `;

    // ENGINE CSS MENGGUNAKAN VARIABEL DINAMIS
    let css = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        :root {
            --bg-grad-1: ${tema.bg1};
            --bg-grad-2: ${tema.bg2};
            --bg-grad-3: ${tema.bg3};
            --header-grad-1: ${tema.header1};
            --header-grad-2: ${tema.header2};
            --accent-color: ${tema.accent};
            --accent-light: ${tema.accentLight};
            --accent-shadow: ${tema.accentShadow};
            --panel-bg: rgba(${tema.panelRgb}, 0.65);
            --modal-bg: rgba(${tema.panelRgb}, 0.75);
            --dropdown-bg: rgba(${tema.dropdownRgb}, 0.9);
            --autocomplete-bg: rgba(${tema.dropdownRgb}, 0.85);
            --navbar-bg: rgba(${tema.navbarRgb}, 0.9);
            --row-highlight: ${tema.rowHighlight};
            --text-btn: ${tema.textBtn};
            --text-btn-hover: ${tema.textBtnHover};
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            background: linear-gradient(135deg, var(--bg-grad-1) 0%, var(--bg-grad-2) 50%, var(--bg-grad-3) 100%) !important;
            background-attachment: fixed !important;
        }

        /* ==========================================================================
           ROMAKAN GLASSMORPHISM HALAMAN LOGIN (Sesuai Struktur HTML Asli)
        ========================================================================== */
        ${isLoginPage ? `
            /* Buat area layar menjadi flexbox di tengah sempurna */
            html, body {
                height: 100vh !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                overflow: hidden !important;
                background: linear-gradient(135deg, var(--bg-grad-1) 0%, var(--bg-grad-2) 50%, var(--bg-grad-3) 100%) !important;
            }

            /* Memaksa kontainer bawaan dari web agar tidak merusak centering flexbox */
            .container-fluid {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                height: auto !important;
            }

            /* Hilangkan layout margin atas 13em bawaan web asli agar tidak turun kebawah */
            .main-content {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                margin: 0 auto !important;
                background: transparent !important;
                box-shadow: none !important;
                border: none !important;
                float: none !important;
            }

            /* Sembunyikan panel info biru bawaan asli */
            .company__info {
                display: none !important;
            }

            /* Sektor utama Card Form Login (Bentuk Kotak Glassmorphism Proporsional) */
            .login_form {
                width: 100% !important;
                max-width: 400px !important; /* Mengunci lebar agar berbentuk kotak ideal */
                height: auto !important;      /* Membiarkan tinggi menyesuaikan konten secara otomatis */
                float: none !important;
                margin: 0 auto !important;
                background: rgba(255, 255, 255, 0.07) !important;
                backdrop-filter: blur(25px) !important;
                -webkit-backdrop-filter: blur(25px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 24px !important;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
                padding: 35px 30px !important;
                box-sizing: border-box !important;
            }

            /* Format judul teks Bintang Media di dalam card */
            .login_form h2 {
                color: #ffffff !important;
                font-size: 24px !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                letter-spacing: 1.5px !important;
                margin-top: 10px !important;
                margin-bottom: 25px !important;
                text-align: center !important;
                text-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
            }

            /* Atur margin baris di dalam form */
            .login_form .row {
                margin-left: 0 !important;
                margin-right: 0 !important;
                margin-bottom: 16px !important;
                width: 100% !important;
            }
            .login_form .row:last-child { margin-bottom: 0 !important; }

            /* Kotak Form Input (User & Pass) */
            .login_form .form__input {
                width: 100% !important;
                background: rgba(0, 0, 0, 0.4) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                color: #ffffff !important;
                border-radius: 12px !important;
                padding: 12px 16px !important;
                height: 44px !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
                box-sizing: border-box !important;
            }

            .login_form .form__input:focus {
                background: rgba(0, 0, 0, 0.55) !important;
                border-color: var(--accent-light) !important;
                box-shadow: 0 0 15px var(--accent-shadow) !important;
                outline: none !important;
            }

            .login_form .form__input::placeholder {
                color: rgba(255, 255, 255, 0.5) !important;
            }

            /* Tombol Masuk Utama */
            .login_form input[type="submit"].btn {
                width: 100% !important;
                height: 46px !important;
                background: #ffffff !important;
                color: var(--text-btn) !important;
                border-radius: 12px !important;
                font-weight: 800 !important;
                font-size: 15px !important;
                text-transform: uppercase !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
                cursor: pointer !important;
            }

            .login_form input[type="submit"].btn:hover {
                background: #ffffff !important;
                transform: translateY(-2px) !important;
                color: var(--text-btn-hover) !important;
                box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4) !important;
            }

            /* Respon Error Validasi Ajax */
            #ResponseInput {
                text-align: center !important;
                font-weight: bold !important;
                margin-top: 10px !important;
                display: block !important;
                color: #ff8080 !important;
            }
        ` : ''}

        /* HEADER TABEL INTERN */
        thead th, thead th.sorting_desc, thead th.sorting_asc, thead th.sorting, thead th.sorting_disabled, .table > thead > tr > th {
            background: linear-gradient(90deg, var(--header-grad-1), var(--header-grad-2), var(--header-grad-1)) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            text-align: center !important;
            font-weight: 800 !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.6) !important;
            text-transform: uppercase !important;
        }

        /* PAGINATION */
        .pagination > li > a, .pagination > li > span {
            background-color: rgba(0, 0, 0, 0.4) !important;
            border-color: rgba(255,255,255,0.2) !important;
            color: #ffffff !important;
            font-weight: 600 !important;
            backdrop-filter: blur(10px) !important;
        }

        .pagination > .active > a, .pagination > .active > span {
            background: linear-gradient(45deg, var(--header-grad-2), var(--accent-color)) !important;
            border-color: #ffffff !important;
            color: #ffffff !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important;
        }

        /* GLASSMORPHISM PANEL INTERN */
        .panel {
            background: var(--panel-bg) !important;
            backdrop-filter: blur(30px) !important;
            -webkit-backdrop-filter: blur(30px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 20px !important;
            box-shadow: 0 15px 35px rgba(0,0,0,0.6) !important;
            color: #ffffff !important;
            overflow: visible !important;
        }

        .panel-body { background: transparent !important; }

        .panel-heading {
            background: rgba(0, 0, 0, 0.5) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 20px 20px 0 0 !important;
            padding: 15px 20px !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8) !important;
            text-transform: uppercase !important;
        }

        /* MODAL GLASSMORPHISM */
        .modal-content {
            background: var(--modal-bg) !important;
            backdrop-filter: blur(40px) !important;
            -webkit-backdrop-filter: blur(40px) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            border-radius: 20px !important;
            box-shadow: 0 15px 40px rgba(0,0,0,0.8) !important;
            color: #ffffff !important;
        }

        .modal-header {
            background: rgba(0, 0, 0, 0.5) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 20px 20px 0 0 !important;
            color: #ffffff !important;
        }

        .modal-footer {
            background: rgba(0, 0, 0, 0.4) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 0 0 20px 20px !important;
        }

        .modal-title {
            color: #ffffff !important;
            font-weight: 800 !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8) !important;
        }

        button.close { color: #ffffff !important; opacity: 0.9 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important; }
        button.close:hover { color: var(--accent-light) !important; opacity: 1 !important; }

        .modal-body table tr[style*="background:#deeffc"] {
            background: var(--row-highlight) !important;
            color: #ffffff !important;
        }

        .info_pelanggan td { color: #ffffff !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.6) !important; }

        /* FORM INPUTS & TEXTAREA UMUM */
        .form-control, .input-group-custom input, textarea.form-control, .input-group-custom, .datepicker-custom {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            color: #ffffff !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            transition: all 0.3s ease !important;
            font-weight: 600 !important;
        }

        #catatan, #custom-textarea-info {
            background: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            color: #ffffff !important;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.3) !important;
        }

        .form-control[disabled], .form-control[readonly], textarea.form-control[readonly], .input-group-custom input[readonly] {
            background-color: rgba(0, 0, 0, 0.6) !important;
            color: #dddddd !important;
            cursor: not-allowed;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .form-control:focus, .input-group-custom input:focus, textarea.form-control:focus, #custom-textarea-info:focus {
            background: rgba(0, 0, 0, 0.5) !important;
            border-color: var(--accent-light) !important;
            box-shadow: 0 0 12px var(--accent-shadow) !important;
            outline: none !important;
        }

        label, label.control-label, h5, h5 b, .col-sm-8 i { color: #ffffff !important; text-shadow: 1px 1px 3px rgba(0,0,0,0.8) !important; }

        /* TABLE GLASSMORPHISM */
        .table { background: transparent !important; color: #ffffff !important; }
        .table-striped > tbody > tr:nth-of-type(odd) { background-color: rgba(0, 0, 0, 0.2) !important; }
        .table-striped > tbody > tr:nth-of-type(even) { background-color: transparent !important; }
        .table-bordered, .table-bordered > tbody > tr > td, .table-bordered > tbody > tr > th { border: 1px solid rgba(255, 255, 255, 0.2) !important; }
        .table > tbody > tr > td { vertical-align: middle !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important; }

        .input-group-custom { border-radius: 15px !important; padding: 15px !important; margin-top: 10px !important; box-shadow: inset 0 2px 10px rgba(0,0,0,0.4) !important; }

        /* SELECT2 DROPDOWN REVISION */
        .select2-container { z-index: 10 !important; }
        .select2-container--open { z-index: 9999999 !important; }
        .select2-container--default .select2-selection--single {
            background: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            color: #ffffff !important;
            font-weight: 600 !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered { color: #ffffff !important; }
        .select2-dropdown {
            background: var(--dropdown-bg) !important;
            backdrop-filter: blur(40px) !important;
            -webkit-backdrop-filter: blur(40px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 10px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.9) !important;
            overflow: hidden !important;
            z-index: 9999999 !important;
        }
        .select2-search--dropdown { background: transparent !important; padding: 10px !important; }
        .select2-search__field {
            background: rgba(0, 0, 0, 0.5) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            color: #ffffff !important;
            border-radius: 6px !important;
            padding: 6px 10px !important;
            outline: none !important;
        }
        .select2-results__option { background: transparent !important; color: #ffffff !important; padding: 8px 12px !important; }
        .select2-results__option[aria-selected="true"] { background: rgba(255, 255, 255, 0.2) !important; color: #ffffff !important; }
        .select2-results__option--highlighted[aria-selected] {
            background: linear-gradient(45deg, var(--header-grad-2), var(--accent-color)) !important;
            color: #ffffff !important;
            font-weight: bold !important;
        }

        /* AUTOCOMPLETE REVISION */
        #hasil_pencarian {
            background: var(--autocomplete-bg) !important;
            backdrop-filter: blur(40px) !important;
            -webkit-backdrop-filter: blur(40px) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            border-radius: 10px !important;
            box-shadow: 0 15px 40px rgba(0,0,0,0.9) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            max-height: 300px !important;
            margin-top: 5px !important;
            z-index: 9999 !important;
            position: absolute !important;
            width: auto !important;
            min-width: 15% !important;
            max-width: 15vw !important;
            overscroll-behavior: contain !important;
            pointer-events: auto !important;
        }
        #hasil_pencarian::-webkit-scrollbar { width: 8px; }
        #hasil_pencarian::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 10px; }
        #hasil_pencarian::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.4); border-radius: 10px; }
        #hasil_pencarian::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.7); }

        #daftar-autocomplete { list-style: none !important; padding: 0 !important; margin: 0 !important; background: transparent !important; }
        #daftar-autocomplete li {
            background: transparent !important;
            color: #ffffff !important;
            padding: 10px 12px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: block !important;
        }
        #daftar-autocomplete li:last-child { border-bottom: none !important; }
        #daftar-autocomplete li:hover, #daftar-autocomplete li.active {
            background: linear-gradient(45deg, var(--header-grad-2), var(--accent-color)) !important;
            color: #ffffff !important;
            font-weight: bold !important;
        }
        #daftar-autocomplete li a { color: inherit !important; text-decoration: none !important; display: block !important; }

        /* TIMELOG */
        #log-nota-update-time, .log-nota-time {
            color: #ffffff !important;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.9) !important;
            font-weight: 800 !important;
            background: rgba(0,0,0,0.3) !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
        }
        .tile-stats, .info-box { border-radius:20px !important; overflow:hidden !important; }

        /* BUBBLE FLAKES ANIMS FOR BACKGROUND */
        .floating-bg { position:fixed; top:0; left:0; width:100%; height:100%; z-index:-1; overflow:hidden; pointer-events:none; }
        .bubble { position:absolute; background:rgba(255, 255, 255, 0.12); border-radius:50%; animation:floatUp 25s infinite linear; will-change: transform, opacity; transform: translateZ(0); }

        @keyframes floatUp {
            0% { transform:translate3d(0, 110vh, 0) scale(.5); opacity:0; }
            50% { opacity:.3; }
            100% { transform:translate3d(0, -20vh, 0) scale(1.2); opacity:0; }
        }

        /* BUTTONS INTERNAL */
        #Simpann, #SimpanEditPelanggan, #Cetaks, .btn-primary {
            background: linear-gradient(45deg, #ffffff, #e0e0e0) !important;
            border: 1px solid #ffffff !important;
            color: var(--text-btn) !important;
            font-weight: 800 !important;
            transition: all .3s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4) !important;
        }

        #Simpann:hover, #SimpanEditPelanggan:hover, #Cetaks:hover, .btn-primary:hover {
            background: #ffffff !important;
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.6) !important;
            transform: scale(1.03);
            color: var(--text-btn-hover) !important;
        }

        /* TOTAL BAYAR BLOCK */
        .TotalBayar {
            background: linear-gradient(to left, var(--bg-grad-1) 0%, var(--bg-grad-2) 100%) !important;
            border: 2px solid #ffffff !important;
            border-radius: 15px !important;
            padding: 15px 20px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:space-between !important;
            box-shadow: inset 0 2px 5px rgba(0,0,0,.4), 0 8px 20px rgba(0,0,0,.5) !important;
        }
        .TotalBayar h2 { color:#ffffff !important; margin:0 !important; font-size:32px !important; font-weight:800 !important; text-shadow: 0 3px 6px rgba(0,0,0,.6); }

        #BarisBaru {
            background:#ffffff !important;
            color: var(--text-btn) !important;
            border: 2px solid #ffffff !important;
            border-radius: 10px !important;
            padding: 6px 14px !important;
            transition: .2s;
            font-weight: bold !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
        }
        #BarisBaru:hover {
            background: linear-gradient(45deg,#e0e0e0,#ffffff) !important;
            color: var(--text-btn-hover) !important;
            transform: scale(1.05);
            box-shadow: 0 5px 12px rgba(255,255,255,.5) !important;
        }

        /* NAVBAR INTERN */
        .navbar {
            background: var(--navbar-bg) !important;
            backdrop-filter: blur(30px) !important;
            border-bottom: 2px solid rgba(255,255,255,0.4) !important;
            box-shadow: 0 8px 20px rgba(0,0,0,.6) !important;
        }
        .navbar .container, .navbar .container-fluid { display:flex !important; align-items:center !important; justify-content:center !important; }
        .navbar-right { position:absolute !important; right:20px !important; top:50% !important; transform:translateY(-50%) !important; }

        .nav.navbar-nav > li > a {
            background: transparent !important;
            color: rgba(255,255,255,.9) !important;
            font-weight: 600 !important;
            font-size: 11px !important;
            transition: all .3s ease !important;
            border: 1.5px solid transparent !important;
            margin: 5px 12px !important;
            border-radius: 10px !important;
        }
        .nav.navbar-nav > li.active > a, .nav.navbar-nav > li > a:hover {
            background: rgba(255,255,255,.15) !important;
            color: #ffffff !important;
            border: 1.5px solid #ffffff !important;
            box-shadow: 0 0 12px rgba(255,255,255,.3) !important;
            outline: none !important;
        }

        .navbar-header, .navbar-toggle, .jamdigital, input[name="tanggal"] { display:none !important; }

        /* CLOCK WIDGET CONTAINER */
        .custom-form-clock-container {
            margin-top: 15px;
            padding: 12px; background: rgba(0,0,0,0.4) !important; backdrop-filter: blur(10px) !important;
            border-radius: 20px !important; border: 1px solid rgba(255,255,255,0.3) !important; text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,.5);
        }
        #custom-clock-form { display:block; color:#ffffff; font-weight:800; font-size:26px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
        #custom-date-form { display:block; color:#cccccc; font-weight:700; font-size:14px; }

        /* FOOTER & BACKGROUND BUTTON PANEL */
        p.footer, .footer { color:#ffffff !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.6) !important; }
        .animated-spacer { animation: slideDownSpacer .5s cubic-bezier(.25,1,.5,1) forwards; }
        @keyframes slideDownSpacer { 0% { height:0; opacity:0; } 100% { height:20px; opacity:1; } }

        #bg-upload-btn, #bg-reset-btn {
            background: linear-gradient(45deg, #e0e0e0, #ffffff);
            color: var(--text-btn); border: none; border-radius: 12px; padding: 10px 14px; font-weight: 800; cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,.4); transition: .2s;
        }
        #bg-upload-btn:hover, #bg-reset-btn:hover {
            transform: scale(1.05);
            color: var(--text-btn-hover); box-shadow: 0 5px 15px rgba(255, 255, 255, 0.5);
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = css;
    document.head.appendChild(styleSheet);

    // =========================================================================================
    // INJECT LOGO & ANIMASI BUBBLE KHAS HALAMAN LOGIN
    // =========================================================================================
    if (isLoginPage) {
        // Otomatis update placeholder "Nama" bawaan web asli agar lebih informatif
        const inputNama = document.querySelector('input[name="nohandphone"]');
        if (inputNama) inputNama.setAttribute('placeholder', 'Username / No Handphone');

        // Pasang animasi butiran background mengambang
        const bgFlakes = document.createElement('div');
        bgFlakes.className = 'floating-bg';
        for(let i=0; i<12; i++){
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = Math.random()*90+20;
            bubble.style.width = size+'px';
            bubble.style.height = size+'px';
            bubble.style.left = (Math.random()*100)+'%';
            bubble.style.animationDelay = (Math.random()*15)+'s';
            bgFlakes.appendChild(bubble);
        }
        document.body.appendChild(bgFlakes);

        // Inject Logo SVG asli tepat di atas judul teks di dalam card login
        const targetCard = document.querySelector('.login_form');
        if(targetCard && !document.querySelector('.login_form svg')) {
            targetCard.insertAdjacentHTML('afterbegin', logoSvg);
        }
    }

    // =========================================================================================
    // FILTER PELANGGAN REAL-TIME (Hanya di dalam dashboard)
    // =========================================================================================
    let kolomPelangganIndex = -1;
    if(!isLoginPage) {
        setInterval(() => {
            const filterWrapper = document.getElementById('my-grid_filter') || document.querySelector('.dataTables_filter');
            const tabelAsli = document.getElementById('my-grid');

            if (filterWrapper && !document.getElementById('search-pelanggan')) {
                const searchContainer = document.createElement('div');
                searchContainer.id = 'pelanggan-search-container';
                searchContainer.style.display = 'inline-flex';
                searchContainer.style.alignItems = 'center';
                searchContainer.style.marginRight = '15px';
                searchContainer.style.verticalAlign = 'middle';

                searchContainer.innerHTML = `
                    <input type="text" id="search-pelanggan" class="form-control" placeholder="🔍 Cari Nama Pelanggan..."
                           style="width: 220px; display: inline-block; background: rgba(0, 0, 0, 0.4) !important;
                           border: 1px solid rgba(255, 255, 255, 0.4) !important; color: #ffffff !important;
                           border-radius: 10px !important; padding: 6px 12px !important;
                           font-weight: 600 !important; margin: 0 !important; height: 34px !important; box-sizing: border-box;">
                `;
                filterWrapper.insertBefore(searchContainer, filterWrapper.firstChild);

                filterWrapper.style.display = 'flex';
                filterWrapper.style.alignItems = 'center';
                filterWrapper.style.justifyContent = 'flex-end';
            }

            const inputPelanggan = document.getElementById('search-pelanggan');
            if (inputPelanggan && tabelAsli) {
                const keyword = inputPelanggan.value.trim().toLowerCase();
                const selectLength = document.querySelector('select[name="my-grid_length"]');

                if (kolomPelangganIndex === -1) {
                    const ths = tabelAsli.querySelectorAll('thead th');
                    ths.forEach((th, index) => {
                        const txt = th.textContent.toLowerCase();
                        if (txt.includes('pelanggan') || txt.includes('nama') || txt.includes('customer')) {
                            kolomPelangganIndex = index;
                        }
                    });
                    if (kolomPelangganIndex === -1) kolomPelangganIndex = 2;
                }

                const rows = tabelAsli.querySelectorAll('tbody tr');
                if (keyword !== "") {
                    if (selectLength && selectLength.value !== "999999") {
                        let optionAll = selectLength.querySelector('option[value="999999"]');
                        if (!optionAll) {
                            optionAll = document.createElement('option');
                            optionAll.value = "999999";
                            optionAll.textContent = "All";
                            selectLength.appendChild(optionAll);
                        }
                        selectLength.value = "999999";
                        selectLength.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    rows.forEach(row => {
                        const cell = row.cells[kolomPelangganIndex];
                        if (cell) {
                            const cellText = cell.textContent.toLowerCase();
                            if (cellText.indexOf(keyword) > -1) {
                                if (row.style.getPropertyValue('display') === 'none') {
                                    row.style.removeProperty('display');
                                }
                            } else {
                                if (row.style.getPropertyValue('display') !== 'none') {
                                    row.style.setProperty('display', 'none', 'important');
                                }
                            }
                        }
                    });
                } else {
                    if (selectLength && selectLength.value === "999999") {
                        selectLength.value = "50";
                        selectLength.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    rows.forEach(row => {
                        if (row.style.display === 'none') {
                            row.style.removeProperty('display');
                        }
                    });
                }
            }
        }, 400);
    }

    // MULTILINE TEXTAREA CONVERTER INFO TAMBAHAN
    if(!isLoginPage) {
        let cekInputCustom = setInterval(() => {
            const labels = Array.from(document.querySelectorAll('label'));
            let targetInput = null;

            for (let label of labels) {
                if (label.textContent.toUpperCase().includes('INFO TAMBAHAN')) {
                    targetInput = label.parentElement.querySelector('input[type="text"]');
                    break;
                }
            }

            if (!targetInput) targetInput = document.getElementById('input-info-custom');

            if (targetInput && targetInput.tagName.toLowerCase() === 'input' && !document.getElementById('custom-textarea-info')) {
                const textArea = document.createElement('textarea');
                textArea.id = 'custom-textarea-info';
                textArea.className = targetInput.className;
                textArea.value = targetInput.value;
                textArea.placeholder = targetInput.placeholder;
                textArea.style.minHeight = '60px';
                textArea.style.resize = 'vertical';
                targetInput.style.display = 'none';
                targetInput.parentNode.insertBefore(textArea, targetInput.nextSibling);

                textArea.addEventListener('input', function() {
                    let textValue = this.value;
                    if (textValue.includes('\n')) {
                        textValue = textValue.replace(/\n/g, ' {BR} ');
                    }
                    targetInput.value = textValue;
                    targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                    targetInput.dispatchEvent(new Event('keyup', { bubbles: true }));
                    targetInput.dispatchEvent(new Event('change', { bubbles: true }));
                });
                clearInterval(cekInputCustom);
            }
        }, 500);
        setTimeout(() => clearInterval(cekInputCustom), 10000);
    }

    // FORMATTER BREAKLINE KETERANGAN
    if(!isLoginPage) {
        setInterval(() => {
            let catatanEl = document.getElementById('catatan');
            if (catatanEl && catatanEl.value) {
                let text = catatanEl.value;
                if (text.includes(' {BR} ')) {
                    text = text.replace(/ \{BR\} /g, '\n');
                    text = text.replace(/\s*-\s*DP\s*:/g, '\nDP :');
                    text = text.replace(/\s*-\s*TF\s*:/g, '\nTF :');
                    if (catatanEl.value !== text) {
                        catatanEl.value = text;
                    }
                }
            }
        }, 200);
    }

    // CUSTOM BACKGROUND PANEL UPLOAD
    (function(){
        const applyBackgroundFromDataUrl = async (dataUrl) => {
            try {
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                document.body.style.setProperty('background', `url(${objectUrl}) center center / cover fixed no-repeat`, 'important');
            } catch (err) {
                console.error("Gagal memuat custom background", err);
            }
        };

        const savedBg = localStorage.getItem('bm_custom_bg');
        if(savedBg) applyBackgroundFromDataUrl(savedBg);

        const panel = document.createElement('div');
        panel.innerHTML = `
            <button id="bg-upload-btn">🖼️ BG</button>
            <button id="bg-reset-btn">↺</button>
            <input type="file" id="bg-file-input" accept="image/*" style="display:none;">
        `;

        Object.assign(panel.style, { position:'fixed', bottom:'20px', right:'20px', zIndex:'999999', display:'flex', gap:'8px' });
        document.body.appendChild(panel);

        const uploadBtn = panel.querySelector('#bg-upload-btn');
        const resetBtn = panel.querySelector('#bg-reset-btn');
        const fileInput = panel.querySelector('#bg-file-input');

        uploadBtn.onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if(!file) return;

            const tempObjectUrl = URL.createObjectURL(file);
            document.body.style.setProperty('background', `url(${tempObjectUrl}) center center / cover fixed no-repeat`, 'important');

            const reader = new FileReader();
            reader.onload = function(ev){
                try {
                    localStorage.setItem('bm_custom_bg', ev.target.result);
                } catch (error) {
                    alert("Gagal menyimpan gambar permanen! Ukuran file terlalu besar.\n\nBackground tetap berubah saat ini, namun akan hilang saat halaman di-refresh.");
                }
            };
            reader.readAsDataURL(file);
        };

        resetBtn.onclick = () => {
            localStorage.removeItem('bm_custom_bg');
            document.body.style.setProperty('background', `linear-gradient(135deg, var(--bg-grad-1) 0%, var(--bg-grad-2) 50%, var(--bg-grad-3) 100%)`, 'important');
        };
    })();

    // CLOCK ENGINE INJECTOR
    if(!isLoginPage && !isExcludedPage){
        const oldDateInput = document.querySelector('input.form-control[style*="text-align:center"][readonly]');
        if(oldDateInput) oldDateInput.remove();

        const panelBody = document.querySelector('.panel-body');
        if(panelBody && !document.getElementById('custom-clock-form')){
            panelBody.insertAdjacentHTML('beforeend', `
                <div class="custom-form-clock-container">
                    <span id="custom-clock-form">00:00:00</span>
                    <span id="custom-date-form">00 - 00 - 0000</span>
                </div>
            `);
        }

        setInterval(()=>{
            const now = new Date();
            const clockEl = document.getElementById('custom-clock-form');
            const dateEl = document.getElementById('custom-date-form');
            if(clockEl) clockEl.textContent = now.toLocaleTimeString('en-GB',{hour12:false});
            if(dateEl) dateEl.textContent = now.toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,' - ');
        },500);
    }

    // FOOTER REVISION WITH EMJE DESIGN
    setTimeout(()=>{
        if(!isLoginPage){
            const navbar = document.querySelector('.navbar') || document.querySelector('nav');
            if(navbar && !document.getElementById('jarak-paksa')){
                navbar.insertAdjacentHTML('afterend', '<div id="jarak-paksa" class="animated-spacer" style="width:100%;display:block;clear:both;background:transparent;"></div>');
            }
        }
        const footer = document.querySelector('p.footer') || document.querySelector('.footer');
        if(footer && !footer.innerHTML.includes('EMJE Design')) {
            footer.innerHTML = footer.innerHTML.replace('ZenLess', 'ZenLess &amp; EMJE Design');
        }
    },500);
})();
