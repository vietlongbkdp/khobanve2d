import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════
   BLUEPRINT SVG THUMBNAILS (trông như AutoCAD thật)
══════════════════════════════════════════════════════ */
const toDataURL = (svg) =>
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

// SVG blueprint cho từng danh mục
const BP = {
  "kien-truc": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="300" fill="#071525"/><defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/></pattern></defs><rect width="480" height="300" fill="url(#g)"/><rect x="72" y="44" width="336" height="212" fill="rgba(74,158,255,0.04)" stroke="#4A9EFF" stroke-width="2"/><line x1="240" y1="44" x2="240" y2="256" stroke="#4A9EFF" stroke-width="1.5"/><line x1="72" y1="155" x2="240" y2="155" stroke="#4A9EFF" stroke-width="1.5"/><line x1="240" y1="160" x2="408" y2="160" stroke="#4A9EFF" stroke-width="1.5"/><line x1="300" y1="44" x2="300" y2="160" stroke="#4A9EFF" stroke-width="1.5"/><line x1="200" y1="44" x2="200" y2="72" stroke="#4A9EFF" stroke-width="1.5"/><path d="M200 72 A28 28 0 0 0 228 44" fill="none" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="3,2"/><line x1="240" y1="180" x2="264" y2="180" stroke="#4A9EFF" stroke-width="1.5"/><path d="M264 180 A24 24 0 0 0 264 156" fill="none" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="3,2"/><line x1="100" y1="44" x2="140" y2="44" stroke="#7BC8FF" stroke-width="4"/><line x1="280" y1="44" x2="295" y2="44" stroke="#7BC8FF" stroke-width="4"/><line x1="320" y1="44" x2="370" y2="44" stroke="#7BC8FF" stroke-width="4"/><line x1="72" y1="80" x2="72" y2="120" stroke="#7BC8FF" stroke-width="4"/><line x1="408" y1="90" x2="408" y2="130" stroke="#7BC8FF" stroke-width="4"/><line x1="72" y1="272" x2="408" y2="272" stroke="#FF9500" stroke-width="1"/><line x1="72" y1="268" x2="72" y2="276" stroke="#FF9500" stroke-width="1.5"/><line x1="408" y1="268" x2="408" y2="276" stroke="#FF9500" stroke-width="1.5"/><text x="240" y="285" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">5000</text><line x1="54" y1="44" x2="54" y2="256" stroke="#FF9500" stroke-width="1"/><text x="44" y="155" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace" transform="rotate(-90,44,155)">3500</text><text x="152" y="102" text-anchor="middle" fill="#9BCFFF" font-size="9" font-family="monospace">PHÒNG NGỦ</text><text x="152" y="200" text-anchor="middle" fill="#9BCFFF" font-size="9" font-family="monospace">WC+TẮM</text><text x="324" y="105" text-anchor="middle" fill="#9BCFFF" font-size="9" font-family="monospace">PHÒNG KHÁCH</text><text x="270" y="195" text-anchor="middle" fill="#9BCFFF" font-size="9" font-family="monospace">NHÀ BẾP</text><rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/><rect x="268" y="6" width="208" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/><line x1="268" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/><text x="372" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT BẰNG TẦNG 1 - TỈ LỆ 1:100</text><text x="372" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">NHÀ PHỐ 2 TẦNG 5×15m</text></svg>`),

  "co-khi": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="300" fill="#071525"/><defs><pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/></pattern></defs><rect width="480" height="300" fill="url(#g2)"/><rect x="90" y="60" width="300" height="180" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="2"/><rect x="100" y="70" width="280" height="160" fill="rgba(74,158,255,0.03)" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="4,3"/><circle cx="175" cy="150" r="42" fill="rgba(74,158,255,0.08)" stroke="#4A9EFF" stroke-width="1.5"/><circle cx="175" cy="150" r="13" fill="rgba(74,158,255,0.2)" stroke="#4A9EFF" stroke-width="1.5"/><line x1="90" y1="150" x2="45" y2="150" stroke="#4A9EFF" stroke-width="3"/><rect x="35" y="143" width="10" height="14" fill="#4A9EFF"/><g stroke="#4A9EFF" stroke-width="1.3" fill="none"><path d="M158 109 L161 101 L167 101 L170 109"/><path d="M178 108 L182 100 L188 100 L192 108"/><path d="M205 121 L213 117 L215 123 L207 127"/><path d="M206 173 L214 177 L212 183 L204 179"/><path d="M178 190 L182 198 L188 198 L192 190"/><path d="M158 191 L161 199 L167 199 L170 191"/><path d="M138 179 L130 182 L128 177 L136 174"/><path d="M137 126 L129 122 L131 116 L139 120"/></g><circle cx="305" cy="150" r="56" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/><circle cx="305" cy="150" r="18" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/><line x1="390" y1="150" x2="435" y2="150" stroke="#4A9EFF" stroke-width="4"/><rect x="435" y="141" width="10" height="18" fill="#4A9EFF"/><g stroke="#4A9EFF" stroke-width="1.2" fill="none"><path d="M286 95 L290 86 L296 86 L300 95"/><path d="M311 94 L315 85 L321 85 L325 94"/><path d="M341 111 L349 107 L352 113 L344 117"/><path d="M354 143 L363 143 L363 149 L354 149"/><path d="M353 162 L362 165 L360 171 L351 168"/><path d="M340 188 L348 192 L345 197 L337 193"/><path d="M311 204 L315 213 L321 213 L325 204"/><path d="M286 203 L290 212 L296 212 L300 203"/><path d="M257 189 L249 193 L246 187 L254 183"/><path d="M247 163 L238 166 L236 160 L245 157"/><path d="M246 143 L237 143 L237 149 L246 149"/><path d="M256 113 L248 109 L251 103 L259 107"/></g><line x1="90" y1="256" x2="390" y2="256" stroke="#FF9500" stroke-width="1"/><line x1="90" y1="252" x2="90" y2="260" stroke="#FF9500" stroke-width="1.5"/><line x1="390" y1="252" x2="390" y2="260" stroke="#FF9500" stroke-width="1.5"/><text x="240" y="270" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">L = 450</text><text x="175" y="155" text-anchor="middle" fill="#9BCFFF" font-size="8" font-family="monospace">Z₁=20</text><text x="305" y="155" text-anchor="middle" fill="#9BCFFF" font-size="8" font-family="monospace">Z₂=50</text><rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/><rect x="260" y="6" width="216" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/><line x1="260" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/><text x="368" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">BẢN VẼ LẮP - HỘP GIẢM TỐC</text><text x="368" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">BÁNH RĂNG TRỤ 2 CẤP</text></svg>`),

  "cong": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="300" fill="#071525"/><defs><pattern id="g3" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/></pattern></defs><rect width="480" height="300" fill="url(#g3)"/><rect x="60" y="60" width="50" height="200" fill="rgba(74,158,255,0.08)" stroke="#4A9EFF" stroke-width="2"/><rect x="65" y="55" width="40" height="15" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="63" y="40" width="44" height="18" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="370" y="60" width="50" height="200" fill="rgba(74,158,255,0.08)" stroke="#4A9EFF" stroke-width="2"/><rect x="375" y="55" width="40" height="15" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="373" y="40" width="44" height="18" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="110" y="70" width="110" height="165" fill="rgba(74,158,255,0.04)" stroke="#4A9EFF" stroke-width="1.5"/><line x1="110" y1="108" x2="220" y2="108" stroke="#4A9EFF" stroke-width="1"/><line x1="110" y1="152" x2="220" y2="152" stroke="#4A9EFF" stroke-width="1"/><line x1="110" y1="196" x2="220" y2="196" stroke="#4A9EFF" stroke-width="1"/><line x1="148" y1="70" x2="148" y2="235" stroke="#4A9EFF" stroke-width="1"/><line x1="183" y1="70" x2="183" y2="235" stroke="#4A9EFF" stroke-width="1"/><g fill="rgba(74,158,255,0.3)" stroke="#4A9EFF" stroke-width="0.8"><ellipse cx="130" cy="89" rx="5" ry="8"/><ellipse cx="165" cy="89" rx="5" ry="8"/><ellipse cx="200" cy="89" rx="5" ry="8"/><ellipse cx="130" cy="130" rx="5" ry="8"/><ellipse cx="165" cy="130" rx="5" ry="8"/><ellipse cx="200" cy="130" rx="5" ry="8"/><ellipse cx="130" cy="174" rx="5" ry="8"/><ellipse cx="165" cy="174" rx="5" ry="8"/><ellipse cx="200" cy="174" rx="5" ry="8"/><ellipse cx="130" cy="216" rx="5" ry="8"/><ellipse cx="165" cy="216" rx="5" ry="8"/><ellipse cx="200" cy="216" rx="5" ry="8"/></g><rect x="260" y="70" width="110" height="165" fill="rgba(74,158,255,0.04)" stroke="#4A9EFF" stroke-width="1.5"/><line x1="260" y1="108" x2="370" y2="108" stroke="#4A9EFF" stroke-width="1"/><line x1="260" y1="152" x2="370" y2="152" stroke="#4A9EFF" stroke-width="1"/><line x1="260" y1="196" x2="370" y2="196" stroke="#4A9EFF" stroke-width="1"/><line x1="297" y1="70" x2="297" y2="235" stroke="#4A9EFF" stroke-width="1"/><line x1="333" y1="70" x2="333" y2="235" stroke="#4A9EFF" stroke-width="1"/><g fill="rgba(74,158,255,0.3)" stroke="#4A9EFF" stroke-width="0.8"><ellipse cx="279" cy="89" rx="5" ry="8"/><ellipse cx="315" cy="89" rx="5" ry="8"/><ellipse cx="351" cy="89" rx="5" ry="8"/><ellipse cx="279" cy="130" rx="5" ry="8"/><ellipse cx="315" cy="130" rx="5" ry="8"/><ellipse cx="351" cy="130" rx="5" ry="8"/><ellipse cx="279" cy="174" rx="5" ry="8"/><ellipse cx="315" cy="174" rx="5" ry="8"/><ellipse cx="351" cy="174" rx="5" ry="8"/><ellipse cx="279" cy="216" rx="5" ry="8"/><ellipse cx="315" cy="216" rx="5" ry="8"/><ellipse cx="351" cy="216" rx="5" ry="8"/></g><line x1="60" y1="274" x2="420" y2="274" stroke="#FF9500" stroke-width="1"/><line x1="60" y1="270" x2="60" y2="278" stroke="#FF9500" stroke-width="1.5"/><line x1="420" y1="270" x2="420" y2="278" stroke="#FF9500" stroke-width="1.5"/><text x="240" y="287" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">3600</text><rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/><rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/><line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/><text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT ĐỨNG CỔNG SẮT NGHỆ THUẬT</text><text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">CỔNG 2 CÁNH - TỈ LỆ 1:20</text></svg>`),

  "lazer": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="300" fill="#071525"/><defs><pattern id="g4" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/></pattern></defs><rect width="480" height="300" fill="url(#g4)"/><rect x="60" y="30" width="360" height="240" fill="none" stroke="#4A9EFF" stroke-width="1.5"/><rect x="70" y="40" width="340" height="220" fill="none" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="4,3"/><circle cx="240" cy="150" r="80" fill="none" stroke="#4A9EFF" stroke-width="1.5"/><circle cx="240" cy="150" r="55" fill="none" stroke="#4A9EFF" stroke-width="1"/><circle cx="240" cy="150" r="30" fill="none" stroke="#4A9EFF" stroke-width="1"/><circle cx="240" cy="150" r="10" fill="rgba(74,158,255,0.3)" stroke="#4A9EFF" stroke-width="1.5"/><g stroke="#4A9EFF" stroke-width="1.2" fill="rgba(74,158,255,0.08)"><path d="M240 150 C230 120 220 100 240 80 C260 100 250 120 240 150Z"/><path d="M240 150 C270 140 290 130 310 150 C290 170 270 160 240 150Z"/><path d="M240 150 C250 180 260 200 240 220 C220 200 230 180 240 150Z"/><path d="M240 150 C210 160 190 170 170 150 C190 130 210 140 240 150Z"/></g><g stroke="#4A9EFF" stroke-width="1" fill="none"><path d="M60 30 Q90 30 90 60"/><path d="M420 30 Q390 30 390 60"/><path d="M60 270 Q90 270 90 240"/><path d="M420 270 Q390 270 390 240"/><circle cx="75" cy="45" r="10" stroke-width="0.8"/><circle cx="75" cy="45" r="5" fill="rgba(74,158,255,0.3)"/><circle cx="405" cy="45" r="10" stroke-width="0.8"/><circle cx="405" cy="45" r="5" fill="rgba(74,158,255,0.3)"/><circle cx="75" cy="255" r="10" stroke-width="0.8"/><circle cx="75" cy="255" r="5" fill="rgba(74,158,255,0.3)"/><circle cx="405" cy="255" r="10" stroke-width="0.8"/><circle cx="405" cy="255" r="5" fill="rgba(74,158,255,0.3)"/></g><line x1="60" y1="150" x2="155" y2="150" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="325" y1="150" x2="420" y2="150" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="240" y1="30" x2="240" y2="65" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="240" y1="235" x2="240" y2="270" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/><text x="240" y="20" text-anchor="middle" fill="#FF9500" font-size="9" font-family="monospace">⌀ 800</text><rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/><rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/><line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/><text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">HOA VĂN CNC LAZER</text><text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">ĐÔNG NAM Á - FILE DXF XUẤT MÁY</text></svg>`),

  "do-an": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="300" fill="#071525"/><defs><pattern id="g5" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/></pattern></defs><rect width="480" height="300" fill="url(#g5)"/><line x1="50" y1="258" x2="430" y2="258" stroke="#4A9EFF" stroke-width="2.5"/><rect x="100" y="198" width="280" height="60" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="110" y="143" width="260" height="55" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="120" y="93" width="240" height="50" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/><polygon points="100,93 240,48 380,93" fill="rgba(74,158,255,0.1)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="120" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="180" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="265" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="325" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="220" y="218" width="40" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><path d="M240 218 A20 20 0 0 0 220 218" fill="none" stroke="#4A9EFF" stroke-width="1"/><rect x="130" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="190" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="260" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="320" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="155" y="108" width="28" height="22" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="216" y="108" width="28" height="22" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><rect x="277" y="108" width="28" height="22" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/><line x1="50" y1="258" x2="50" y2="48" stroke="#FF9500" stroke-width="1"/><line x1="46" y1="258" x2="54" y2="258" stroke="#FF9500" stroke-width="1.5"/><line x1="46" y1="198" x2="54" y2="198" stroke="#FF9500" stroke-width="1"/><line x1="46" y1="143" x2="54" y2="143" stroke="#FF9500" stroke-width="1"/><line x1="46" y1="93" x2="54" y2="93" stroke="#FF9500" stroke-width="1"/><text x="42" y="261" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">±0.000</text><text x="42" y="201" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">+3.300</text><text x="42" y="146" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">+6.600</text><text x="42" y="96" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">+9.900</text><line x1="100" y1="275" x2="380" y2="275" stroke="#FF9500" stroke-width="1"/><line x1="100" y1="271" x2="100" y2="279" stroke="#FF9500" stroke-width="1.5"/><line x1="380" y1="271" x2="380" y2="279" stroke="#FF9500" stroke-width="1.5"/><text x="240" y="287" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">8400</text><rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/><rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/><line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/><text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT ĐỨNG CHÍNH - ĐỒ ÁN KT</text><text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">CHUNG CƯ MINI 5 TẦNG - 1:100</text></svg>`),

  "xay-dung": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="300" fill="#071525"/><defs><pattern id="g6" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/></pattern><pattern id="ht" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#1a4070" stroke-width="1"/></pattern></defs><rect width="480" height="300" fill="url(#g6)"/><rect x="60" y="90" width="360" height="180" fill="url(#ht)" opacity="0.4"/><line x1="60" y1="90" x2="420" y2="90" stroke="#4A9EFF" stroke-width="1.5" stroke-dasharray="8,4"/><rect x="150" y="60" width="180" height="60" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="2"/><line x1="155" y1="68" x2="325" y2="68" stroke="#FF6B6B" stroke-width="2"/><line x1="155" y1="112" x2="325" y2="112" stroke="#FF6B6B" stroke-width="2"/><line x1="165" y1="62" x2="165" y2="118" stroke="#FF6B6B" stroke-width="1.5"/><line x1="195" y1="62" x2="195" y2="118" stroke="#FF6B6B" stroke-width="1.5"/><line x1="225" y1="62" x2="225" y2="118" stroke="#FF6B6B" stroke-width="1.5"/><line x1="255" y1="62" x2="255" y2="118" stroke="#FF6B6B" stroke-width="1.5"/><line x1="285" y1="62" x2="285" y2="118" stroke="#FF6B6B" stroke-width="1.5"/><line x1="315" y1="62" x2="315" y2="118" stroke="#FF6B6B" stroke-width="1.5"/><rect x="175" y="120" width="34" height="150" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/><rect x="271" y="120" width="34" height="150" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/><line x1="183" y1="118" x2="183" y2="268" stroke="#FF6B6B" stroke-width="1.5"/><line x1="192" y1="118" x2="192" y2="268" stroke="#FF6B6B" stroke-width="1.5"/><line x1="199" y1="118" x2="199" y2="268" stroke="#FF6B6B" stroke-width="1.5"/><line x1="279" y1="118" x2="279" y2="268" stroke="#FF6B6B" stroke-width="1.5"/><line x1="288" y1="118" x2="288" y2="268" stroke="#FF6B6B" stroke-width="1.5"/><line x1="297" y1="118" x2="297" y2="268" stroke="#FF6B6B" stroke-width="1.5"/><rect x="178" y="140" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/><rect x="178" y="170" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/><rect x="178" y="200" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/><rect x="274" y="140" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/><rect x="274" y="170" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/><rect x="274" y="200" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/><text x="88" y="88" fill="#9BCFFF" font-size="8.5" font-family="monospace">MẶT ĐẤT TỰ NHIÊN</text><text x="348" y="200" fill="#9BCFFF" font-size="8" font-family="monospace">CỌC Ø600</text><text x="348" y="212" fill="#9BCFFF" font-size="8" font-family="monospace">L=18m</text><line x1="150" y1="44" x2="330" y2="44" stroke="#FF9500" stroke-width="1"/><line x1="150" y1="40" x2="150" y2="48" stroke="#FF9500" stroke-width="1.5"/><line x1="330" y1="40" x2="330" y2="48" stroke="#FF9500" stroke-width="1.5"/><text x="240" y="38" text-anchor="middle" fill="#FF9500" font-size="9" font-family="monospace">2400</text><rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/><rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/><line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/><text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT CẮT MÓNG CỌC KHOAN NHỒI</text><text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">TỈ LỆ 1:50 - THÉP Ø25 A-III</text></svg>`),
};

// Lấy thumbnail theo catId
const getBP = (catId, prodId) => {
  const base = BP[catId] || BP["kien-truc"];
  return base; // Có thể thêm logic variation theo prodId sau
};

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const CATS = [
  { id: "kien-truc",  label: "Kiến Trúc",        emoji: "🏛️", color: "#2563EB", bg: "#DBEAFE", count: 124 },
  { id: "co-khi",     label: "Cơ Khí & CNC",     emoji: "⚙️", color: "#7C3AED", bg: "#EDE9FE", count: 87  },
  { id: "cong",       label: "Cổng & Hàng Rào",  emoji: "🔩", color: "#059669", bg: "#D1FAE5", count: 53  },
  { id: "lazer",      label: "Lazer & Trang Trí", emoji: "✨", color: "#EA580C", bg: "#FFEDD5", count: 96  },
  { id: "do-an",      label: "Đồ Án",            emoji: "📐", color: "#D97706", bg: "#FEF3C7", count: 142 },
  { id: "xay-dung",   label: "Thi Công XD",      emoji: "🏗️", color: "#0284C7", bg: "#E0F2FE", count: 68  },
];

const PRODS = [
  { id:"p01", cat:"kien-truc", title:"Nhà Phố 2 Tầng 5×15m — Full KT + KC + Điện Nước", price:50000, oldPrice:80000, desc:"Bộ hồ sơ 12 bản vẽ hoàn chỉnh nhà phố 2 tầng 5×15m: mặt bằng, mặt đứng, mặt cắt, kết cấu móng-sàn-mái, sơ đồ điện, cấp thoát nước. File DWG AutoCAD 2020, tương thích 2014+.", ft:"DWG AutoCAD 2020", fc:12, dl:247, rate:4.8, rev:38, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_1", free:false, hot:true,  isNew:true,  tags:["nhà phố","2 tầng","full bộ","5x15m"] },
  { id:"p02", cat:"co-khi",    title:"Hộp Giảm Tốc Bánh Răng Trụ 2 Cấp — Đồ Án CTM",  price:35000, oldPrice:60000, desc:"Đồ án chi tiết máy HGT bánh răng trụ 2 cấp: bản vẽ lắp, chi tiết trục-bánh răng-ổ lăn, sơ đồ động học, thuyết minh tính toán. File DWG + PDF.", ft:"DWG + PDF", fc:8, dl:183, rate:4.9, rev:27, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_2", free:false, hot:true,  isNew:false, tags:["hộp giảm tốc","chi tiết máy","đồ án cơ khí"] },
  { id:"p03", cat:"kien-truc", title:"Biệt Thự 3 Tầng 10×12m — Phong Cách Hiện Đại",   price:75000, oldPrice:120000, desc:"18 bản vẽ biệt thự 3 tầng 10×12m: kiến trúc, kết cấu BTCT, MEP (điện-nước-PCCC). Chất lượng hồ sơ xin phép xây dựng.", ft:"DWG AutoCAD", fc:18, dl:89, rate:4.7, rev:14, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_3", free:false, hot:true,  isNew:false, tags:["biệt thự","3 tầng","hiện đại"] },
  { id:"p04", cat:"cong",      title:"20 Mẫu Cổng Sắt Nghệ Thuật — DWG Lazer CNC",     price:0, oldPrice:null, desc:"20 mẫu cổng sắt nghệ thuật đẹp, sẵn xuất CNC/lazer. File DWG kích thước chi tiết đầy đủ.", ft:"DWG AutoCAD", fc:5, dl:512, rate:4.6, rev:72, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_4", free:true, hot:false, isNew:false, tags:["cổng sắt","lazer","miễn phí"] },
  { id:"p05", cat:"lazer",     title:"50 Mẫu Hoa Văn Đông Nam Á — Lazer Cắt CNC",      price:45000, oldPrice:70000, desc:"50 mẫu hoa văn Đông Nam Á cho lazer cắt, trần thạch cao, vách ngăn trang trí. DWG + DXF xuất máy CNC trực tiếp.", ft:"DWG + DXF", fc:6, dl:334, rate:4.9, rev:51, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_5", free:false, hot:true,  isNew:true,  tags:["lazer","hoa văn","CNC","đông nam á"] },
  { id:"p06", cat:"do-an",     title:"Đồ Án KT Chung Cư Mini 5 Tầng — Full Bộ",        price:40000, oldPrice:null, desc:"Đồ án kiến trúc chung cư mini 5 tầng: mặt bằng, mặt đứng, mặt cắt, phối cảnh 3D. DWG + Sketchup.", ft:"DWG + Sketchup", fc:15, dl:201, rate:4.7, rev:31, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_6", free:false, hot:false, isNew:false, tags:["đồ án","chung cư","kiến trúc"] },
  { id:"p07", cat:"xay-dung",  title:"Biện Pháp Thi Công Móng Cọc Khoan Nhồi",         price:0, oldPrice:null, desc:"Bộ bản vẽ BPTC móng cọc khoan nhồi chi tiết: sơ đồ thiết bị, trình tự các bước, an toàn lao động.", ft:"DWG AutoCAD", fc:7, dl:423, rate:4.5, rev:61, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_7", free:true,  hot:false, isNew:false, tags:["thi công","móng cọc","miễn phí"] },
  { id:"p08", cat:"co-khi",    title:"30 Chi Tiết Máy Thông Dụng — Sẵn Xuất CNC",      price:30000, oldPrice:50000, desc:"30 bản vẽ chi tiết máy thông dụng: trục, bạc, then. Kích thước dung sai đầy đủ, xuất CNC trực tiếp.", ft:"DWG AutoCAD", fc:10, dl:156, rate:4.6, rev:22, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_8", free:false, hot:false, isNew:false, tags:["chi tiết máy","CNC","cơ khí"] },
  { id:"p09", cat:"kien-truc", title:"Nhà Xưởng Khung Thép 12×24m — Kết Cấu Full",     price:60000, oldPrice:90000, desc:"Bản vẽ nhà xưởng khung thép nhịp 12m dài 24m: móng, cột, xà, liên kết, mái tôn.", ft:"DWG AutoCAD", fc:10, dl:156, rate:4.8, rev:19, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_9", free:false, hot:false, isNew:false, tags:["nhà xưởng","khung thép","kết cấu"] },
  { id:"p10", cat:"lazer",     title:"30 Mẫu Hoa Văn Trần Thạch Cao — CNC",             price:35000, oldPrice:55000, desc:"30 mẫu hoa văn trần thạch cao CNC: tân cổ điển, hiện đại, Địa Trung Hải. DWG + DXF.", ft:"DWG + DXF", fc:4, dl:289, rate:4.8, rev:44, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_10", free:false, hot:false, isNew:true,  tags:["hoa văn","trần thạch cao","CNC"] },
  { id:"p11", cat:"cong",      title:"Hàng Rào Hoa Văn 15 Mẫu — File DWG CNC",         price:25000, oldPrice:40000, desc:"15 mẫu hàng rào hoa văn đẹp, đầy đủ kích thước, sẵn xuất CNC lazer.", ft:"DWG AutoCAD", fc:3, dl:178, rate:4.7, rev:33, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_11", free:false, hot:false, isNew:false, tags:["hàng rào","lazer","CNC"] },
  { id:"p12", cat:"do-an",     title:"Đồ Án Cơ Khí Máy Ép Thủy Lực 10T",               price:45000, oldPrice:70000, desc:"Đồ án máy ép thủy lực 10 tấn: bản vẽ lắp tổng thể, chi tiết xy-lanh, thuyết minh tính toán.", ft:"DWG + PDF", fc:11, dl:112, rate:4.8, rev:17, drive:"https://drive.google.com/drive/folders/THAY_LINK_THUC_O_DAY_12", free:false, hot:false, isNew:true,  tags:["đồ án","thủy lực","cơ khí"] },
];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
const vnd = (n) => n.toLocaleString("vi-VN") + "đ";
const genOid = () => "KBV" + Date.now().toString(36).toUpperCase().slice(-6);
const qrURL = (amt, ref) =>
  `https://img.vietqr.io/image/BIDV-5601440258-compact2.png?amount=${amt}&addInfo=${encodeURIComponent(ref)}&accountName=${encodeURIComponent("NGUYEN VIET LONG")}`;
const catOf = (id) => CATS.find((c) => c.id === id);

/* ══════════════════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════════════════ */
function Stars({ r }) {
  return (
    <span style={{ fontSize: 12 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(r) ? "#F59E0B" : "#D1D5DB" }}>★</span>
      ))}
      <span style={{ color: "#6B7280", marginLeft: 4, fontWeight: 600 }}>{r}</span>
    </span>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color, letterSpacing: 0.3 }}>
      {label}
    </span>
  );
}

function ProductCard({ p, onOpen }) {
  const cat = catOf(p.cat);
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div className="kbv-card" onClick={() => onOpen(p)} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(15,23,42,.08)", cursor: "pointer", position: "relative" }}>
      <div style={{ position: "relative", overflow: "hidden", height: 185 }}>
        {/* SVG Blueprint thumbnail */}
        <img src={getBP(p.cat, p.id)} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* Category color overlay strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: cat?.color || "#2563EB" }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          {p.free  && <Badge label="MIỄN PHÍ" color="#fff" bg="#059669" />}
          {p.isNew && !p.free && <Badge label="MỚI" color="#fff" bg="#2563EB" />}
          {p.hot   && !p.free && <Badge label="🔥 HOT" color="#fff" bg="#DC2626" />}
        </div>
        {disc > 0 && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#EF4444", color: "#fff", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            -{disc}%
          </span>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: 11, color: cat?.color, fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {cat?.emoji} {cat?.label}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A", lineHeight: 1.45, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 38 }}>
          {p.title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Stars r={p.rate} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>📥 {p.dl.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {p.free
              ? <span style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>Miễn phí</span>
              : <>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#1D4ED8" }}>{vnd(p.price)}</span>
                  {p.oldPrice && <span style={{ fontSize: 11.5, color: "#94A3B8", textDecoration: "line-through", marginLeft: 6 }}>{vnd(p.oldPrice)}</span>}
                </>
            }
          </div>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>📁 {p.fc} files</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════ */
function Header({ page, go, query, setQuery }) {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(15,23,42,.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", gap: 20 }}>
        <div onClick={() => go("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📐</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>KhoBanVe<span style={{ color: "#2563EB" }}>2D</span></div>
            <div style={{ fontSize: 9.5, color: "#94A3B8", fontWeight: 500, letterSpacing: 0.5 }}>THƯ VIỆN BẢN VẼ AUTOCAD</div>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
          <input value={query} onChange={(e) => { setQuery(e.target.value); if (page !== "shop") go("shop"); }} placeholder="Tìm bản vẽ, đồ án, hoa văn lazer…" style={{ width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "0 16px 0 42px", fontSize: 13.5, outline: "none", background: "#F8FAFC", fontFamily: "inherit" }} />
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#94A3B8" }}>🔍</span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {[["home", "🏠 Trang Chủ"], ["shop", "🛒 Kho Bản Vẽ"]].map(([p, l]) => (
            <button key={p} onClick={() => go(p)} style={{ background: page === p ? "#EFF6FF" : "transparent", color: page === p ? "#1D4ED8" : "#475569", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════
   PAYMENT PAGE — với SePay auto polling
══════════════════════════════════════════════════════ */
function PayPage({ order, payState, setPayState, go }) {
  const [elapsed, setElapsed]   = useState(0);
  const [pollStatus, setPollStatus] = useState("idle"); // idle | polling | error
  const timerRef  = useRef(null);
  const pollRef   = useRef(null);

  // Đồng hồ đếm giờ
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // ── AUTO POLLING SePay mỗi 4 giây ──
  useEffect(() => {
    if (!order || payState !== "waiting") return;
    setPollStatus("polling");

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/check-payment?orderId=${order.id}&amount=${order.prod.price}`
        );
        const data = await res.json();

        if (data.paid) {
          // 🎉 Thanh toán thành công!
          setPayState("success");
          setPollStatus("idle");
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setTimeout(() => go("success"), 1400);
        }
      } catch (e) {
        // Lỗi kết nối — tiếp tục thử
        setPollStatus("error");
        setTimeout(() => setPollStatus("polling"), 3000);
      }
    };

    // Poll ngay lập tức + mỗi 4 giây
    poll();
    pollRef.current = setInterval(poll, 4000);
    return () => clearInterval(pollRef.current);
  }, [order, payState]);

  if (!order) return null;
  const { prod, id } = order;
  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div style={{ maxWidth: 540, margin: "40px auto", padding: "0 20px" }}>
      <div className="kbv-fadeup" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(15,23,42,.14)" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#0F172A,#1E3A8A)", padding: "22px 28px", color: "#fff" }}>
          <div style={{ fontSize: 12, color: "#93C5FD", fontWeight: 600, marginBottom: 4 }}>THANH TOÁN ĐƠN HÀNG</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, lineHeight: 1.4 }}>{prod.title}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Mã đơn: <b style={{ color: "#60A5FA" }}>{id}</b></span>
            <span style={{ fontSize: 14, color: "#94A3B8" }}>⏱ <b style={{ color: "#FCD34D" }}>{mins}:{secs}</b></span>
          </div>
        </div>

        <div style={{ padding: "28px 28px 0", textAlign: "center" }}>
          {payState === "success" ? (
            <div className="kbv-fadeup" style={{ padding: "30px 0" }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>✅</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#059669" }}>Thanh toán thành công!</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>Đang chuyển đến trang tải xuống…</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>Quét mã QR bên dưới để thanh toán</div>
              <div style={{ display: "inline-block", border: "4px solid #E2E8F0", borderRadius: 16, overflow: "hidden", marginBottom: 4 }}>
                <img src={qrURL(prod.price, id)} alt="VietQR" style={{ width: 220, height: 220, display: "block" }} />
              </div>

              {/* Bank info */}
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 20px", margin: "16px 0", textAlign: "left", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Thông tin chuyển khoản</div>
                {[
                  ["🏦 Ngân hàng", "BIDV"],
                  ["👤 Chủ TK",    "NGUYEN VIET LONG"],
                  ["💳 Số TK",     "5601440258"],
                  ["💰 Số tiền",   <b style={{ color: "#1D4ED8" }}>{vnd(prod.price)}</b>],
                  ["📝 Nội dung",  <b style={{ color: "#DC2626", userSelect: "all" }}>{id}</b>],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "1px dashed #E2E8F0" }}>
                    <span style={{ color: "#64748B" }}>{k}</span>
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Polling status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18, fontSize: 12 }}>
                {pollStatus === "polling" && (
                  <>
                    <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #2563EB", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <span style={{ color: "#2563EB", fontWeight: 600 }}>Đang chờ xác nhận tự động…</span>
                  </>
                )}
                {pollStatus === "error" && (
                  <span style={{ color: "#EF4444" }}>⚠️ Lỗi kết nối — thử lại…</span>
                )}
              </div>
            </>
          )}
        </div>

        {payState !== "success" && (
          <div style={{ padding: "0 28px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => go("shop")} style={{ background: "none", border: "1.5px solid #E2E8F0", color: "#64748B", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              ✕ Hủy & Quay Lại
            </button>
            <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center" }}>
              ⚡ Hệ thống tự động xác nhận qua SePay sau khi nhận thanh toán.<br />
              Gặp vấn đề: <b>khobanve2d@gmail.com</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   OTHER PAGES (HomePage, ShopPage, DetailPage, SuccessPage)
   — Giữ nguyên từ file trước, chỉ cập nhật thumbnail
══════════════════════════════════════════════════════ */

// [Paste các component HomePage, ShopPage, DetailPage, SuccessPage từ file App.jsx cũ vào đây]
// Thay đổi duy nhất: trong ProductCard đã dùng getBP() thay vì picsum URL

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
export { PRODS, CATS, getBP, PayPage };
export default function App() {
  // ... (giữ nguyên cấu trúc root từ file trước)
}
