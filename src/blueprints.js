// Blueprint-style SVG thumbnails — one per category
// Trông như bản vẽ AutoCAD thực tế

const toDataURL = (svg) =>
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

const BLUEPRINTS = {

  /* ── KIẾN TRÚC: Mặt bằng nhà phố ── */
  "kien-truc": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#071525"/>
    <defs>
      <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="480" height="300" fill="url(#g1)"/>
    <!-- Outline nhà -->
    <rect x="72" y="44" width="336" height="212" fill="rgba(74,158,255,0.04)" stroke="#4A9EFF" stroke-width="2"/>
    <!-- Tường trong -->
    <line x1="240" y1="44" x2="240" y2="256" stroke="#4A9EFF" stroke-width="1.5"/>
    <line x1="72" y1="155" x2="240" y2="155" stroke="#4A9EFF" stroke-width="1.5"/>
    <line x1="240" y1="160" x2="408" y2="160" stroke="#4A9EFF" stroke-width="1.5"/>
    <line x1="300" y1="44" x2="300" y2="160" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Cửa -->
    <line x1="200" y1="44" x2="200" y2="72" stroke="#4A9EFF" stroke-width="1.5"/>
    <path d="M200 72 A28 28 0 0 0 228 44" fill="none" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="240" y1="180" x2="264" y2="180" stroke="#4A9EFF" stroke-width="1.5"/>
    <path d="M264 180 A24 24 0 0 0 264 156" fill="none" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="3,2"/>
    <!-- Cửa sổ -->
    <line x1="100" y1="44" x2="140" y2="44" stroke="#7BC8FF" stroke-width="4"/>
    <line x1="100" y1="46" x2="140" y2="46" stroke="#071525" stroke-width="1.5"/>
    <line x1="280" y1="44" x2="295" y2="44" stroke="#7BC8FF" stroke-width="4"/>
    <line x1="320" y1="44" x2="370" y2="44" stroke="#7BC8FF" stroke-width="4"/>
    <line x1="72" y1="80" x2="72" y2="120" stroke="#7BC8FF" stroke-width="4"/>
    <line x1="408" y1="90" x2="408" y2="130" stroke="#7BC8FF" stroke-width="4"/>
    <!-- Kích thước -->
    <line x1="72" y1="272" x2="408" y2="272" stroke="#FF9500" stroke-width="1"/>
    <line x1="72" y1="268" x2="72" y2="276" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="408" y1="268" x2="408" y2="276" stroke="#FF9500" stroke-width="1.5"/>
    <text x="240" y="285" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">5000</text>
    <line x1="54" y1="44" x2="54" y2="256" stroke="#FF9500" stroke-width="1"/>
    <line x1="50" y1="44" x2="58" y2="44" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="50" y1="256" x2="58" y2="256" stroke="#FF9500" stroke-width="1.5"/>
    <text x="44" y="155" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace" transform="rotate(-90,44,155)">3500</text>
    <!-- Nhãn phòng -->
    <text x="152" y="102" text-anchor="middle" fill="#9BCFFF" font-size="9.5" font-family="monospace">PHÒNG NGỦ 1</text>
    <text x="152" y="200" text-anchor="middle" fill="#9BCFFF" font-size="9.5" font-family="monospace">WC + TẮM</text>
    <text x="324" y="105" text-anchor="middle" fill="#9BCFFF" font-size="9.5" font-family="monospace">PHÒNG KHÁCH</text>
    <text x="270" y="195" text-anchor="middle" fill="#9BCFFF" font-size="9.5" font-family="monospace">NHÀ BẾP</text>
    <text x="358" y="195" text-anchor="middle" fill="#9BCFFF" font-size="9.5" font-family="monospace">PHÒNG ĂN</text>
    <!-- Khung bản vẽ -->
    <rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/>
    <rect x="268" y="6" width="208" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="268" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/>
    <text x="372" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT BẰNG TẦNG 1 - TỈ LỆ 1:100</text>
    <text x="372" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">NHÀ PHỐ 2 TẦNG 5×15m</text>
  </svg>`),

  /* ── CƠ KHÍ: Hộp giảm tốc bánh răng ── */
  "co-khi": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#071525"/>
    <defs>
      <pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="480" height="300" fill="url(#g2)"/>
    <!-- Vỏ hộp giảm tốc (mặt cắt) -->
    <rect x="90" y="60" width="300" height="180" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="2"/>
    <rect x="100" y="70" width="280" height="160" fill="rgba(74,158,255,0.03)" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="4,3"/>
    <!-- Trục 1 (đầu vào) -->
    <circle cx="160" cy="150" r="38" fill="rgba(74,158,255,0.08)" stroke="#4A9EFF" stroke-width="1.5"/>
    <circle cx="160" cy="150" r="12" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/>
    <line x1="90" y1="150" x2="50" y2="150" stroke="#4A9EFF" stroke-width="3"/>
    <rect x="40" y="143" width="10" height="14" fill="#4A9EFF"/>
    <!-- Bánh răng 1 răng -->
    <g stroke="#4A9EFF" stroke-width="1.2" fill="none">
      <path d="M145 113 L148 105 L153 105 L156 113"/>
      <path d="M163 112 L167 104 L172 104 L175 112"/>
      <path d="M189 125 L197 122 L199 127 L192 130"/>
      <path d="M190 170 L198 173 L196 178 L188 175"/>
      <path d="M163 188 L167 196 L172 196 L175 188"/>
      <path d="M145 187 L148 195 L153 195 L156 187"/>
      <path d="M127 175 L119 178 L117 173 L125 170"/>
      <path d="M126 128 L118 125 L120 120 L128 123"/>
    </g>
    <!-- Trục 2 (đầu ra) -->
    <circle cx="300" cy="150" r="54" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/>
    <circle cx="300" cy="150" r="18" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/>
    <line x1="390" y1="150" x2="430" y2="150" stroke="#4A9EFF" stroke-width="4"/>
    <rect x="430" y="141" width="10" height="18" fill="#4A9EFF"/>
    <!-- Bánh răng 2 -->
    <g stroke="#4A9EFF" stroke-width="1.2" fill="none">
      <path d="M282 97 L285 88 L291 88 L294 97"/>
      <path d="M305 96 L308 87 L314 87 L317 96"/>
      <path d="M336 112 L344 108 L347 114 L340 118"/>
      <path d="M349 143 L358 143 L358 149 L349 149"/>
      <path d="M348 162 L357 165 L355 171 L346 168"/>
      <path d="M335 188 L343 192 L340 197 L332 193"/>
      <path d="M305 204 L308 213 L314 213 L317 204"/>
      <path d="M282 203 L285 212 L291 212 L294 203"/>
      <path d="M252 189 L244 193 L241 187 L249 183"/>
      <path d="M242 163 L233 166 L231 160 L240 157"/>
      <path d="M241 143 L232 143 L232 149 L241 149"/>
      <path d="M251 113 L243 109 L246 103 L254 107"/>
    </g>
    <!-- Kích thước -->
    <line x1="90" y1="256" x2="390" y2="256" stroke="#FF9500" stroke-width="1"/>
    <line x1="90" y1="252" x2="90" y2="260" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="390" y1="252" x2="390" y2="260" stroke="#FF9500" stroke-width="1.5"/>
    <text x="240" y="270" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">L = 450</text>
    <line x1="152" y1="44" x2="308" y2="44" stroke="#FF9500" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="230" y="38" text-anchor="middle" fill="#FF9500" font-size="9" font-family="monospace">a_w = 160</text>
    <!-- Nhãn -->
    <text x="160" y="155" text-anchor="middle" fill="#9BCFFF" font-size="8" font-family="monospace">Z₁=20</text>
    <text x="300" y="155" text-anchor="middle" fill="#9BCFFF" font-size="8" font-family="monospace">Z₂=50</text>
    <!-- Khung -->
    <rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/>
    <rect x="260" y="6" width="216" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="260" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/>
    <text x="368" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">BẢN VẼ LẮP - HỘP GIẢM TỐC</text>
    <text x="368" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">BÁNH RĂNG TRỤ 2 CẤP - TỈ LỆ 1:5</text>
  </svg>`),

  /* ── CỔNG & HÀNG RÀO ── */
  "cong": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#071525"/>
    <defs>
      <pattern id="g3" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="480" height="300" fill="url(#g3)"/>
    <!-- Mặt đứng cổng -->
    <!-- Trụ trái -->
    <rect x="60" y="60" width="50" height="200" fill="rgba(74,158,255,0.08)" stroke="#4A9EFF" stroke-width="2"/>
    <rect x="65" y="55" width="40" height="15" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/>
    <rect x="63" y="40" width="44" height="18" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Trụ phải -->
    <rect x="370" y="60" width="50" height="200" fill="rgba(74,158,255,0.08)" stroke="#4A9EFF" stroke-width="2"/>
    <rect x="375" y="55" width="40" height="15" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1.5"/>
    <rect x="373" y="40" width="44" height="18" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Cánh cổng trái -->
    <rect x="110" y="70" width="110" height="165" fill="rgba(74,158,255,0.04)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Hoa văn cánh trái -->
    <line x1="110" y1="108" x2="220" y2="108" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="110" y1="152" x2="220" y2="152" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="110" y1="196" x2="220" y2="196" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="148" y1="70" x2="148" y2="235" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="183" y1="70" x2="183" y2="235" stroke="#4A9EFF" stroke-width="1"/>
    <!-- Hoa văn: con tiện đứng -->
    <g fill="rgba(74,158,255,0.3)" stroke="#4A9EFF" stroke-width="0.8">
      <ellipse cx="130" cy="89" rx="5" ry="8"/>
      <ellipse cx="165" cy="89" rx="5" ry="8"/>
      <ellipse cx="200" cy="89" rx="5" ry="8"/>
      <ellipse cx="130" cy="130" rx="5" ry="8"/>
      <ellipse cx="165" cy="130" rx="5" ry="8"/>
      <ellipse cx="200" cy="130" rx="5" ry="8"/>
      <ellipse cx="130" cy="174" rx="5" ry="8"/>
      <ellipse cx="165" cy="174" rx="5" ry="8"/>
      <ellipse cx="200" cy="174" rx="5" ry="8"/>
      <ellipse cx="130" cy="216" rx="5" ry="8"/>
      <ellipse cx="165" cy="216" rx="5" ry="8"/>
      <ellipse cx="200" cy="216" rx="5" ry="8"/>
    </g>
    <!-- Cánh cổng phải -->
    <rect x="260" y="70" width="110" height="165" fill="rgba(74,158,255,0.04)" stroke="#4A9EFF" stroke-width="1.5"/>
    <line x1="260" y1="108" x2="370" y2="108" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="260" y1="152" x2="370" y2="152" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="260" y1="196" x2="370" y2="196" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="297" y1="70" x2="297" y2="235" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="333" y1="70" x2="333" y2="235" stroke="#4A9EFF" stroke-width="1"/>
    <g fill="rgba(74,158,255,0.3)" stroke="#4A9EFF" stroke-width="0.8">
      <ellipse cx="279" cy="89" rx="5" ry="8"/><ellipse cx="315" cy="89" rx="5" ry="8"/><ellipse cx="351" cy="89" rx="5" ry="8"/>
      <ellipse cx="279" cy="130" rx="5" ry="8"/><ellipse cx="315" cy="130" rx="5" ry="8"/><ellipse cx="351" cy="130" rx="5" ry="8"/>
      <ellipse cx="279" cy="174" rx="5" ry="8"/><ellipse cx="315" cy="174" rx="5" ry="8"/><ellipse cx="351" cy="174" rx="5" ry="8"/>
      <ellipse cx="279" cy="216" rx="5" ry="8"/><ellipse cx="315" cy="216" rx="5" ry="8"/><ellipse cx="351" cy="216" rx="5" ry="8"/>
    </g>
    <!-- Kích thước -->
    <line x1="60" y1="274" x2="420" y2="274" stroke="#FF9500" stroke-width="1"/>
    <line x1="60" y1="270" x2="60" y2="278" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="420" y1="270" x2="420" y2="278" stroke="#FF9500" stroke-width="1.5"/>
    <text x="240" y="287" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">3600</text>
    <!-- Khung -->
    <rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/>
    <rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/>
    <text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT ĐỨNG CỔNG SẮT</text>
    <text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">CỔNG NGHỆ THUẬT 2 CÁNH - TỈ LỆ 1:20</text>
  </svg>`),

  /* ── LAZER & TRANG TRÍ: Hoa văn CNC ── */
  "lazer": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#071525"/>
    <defs>
      <pattern id="g4" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="480" height="300" fill="url(#g4)"/>
    <!-- Khung hoa văn -->
    <rect x="60" y="30" width="360" height="240" fill="none" stroke="#4A9EFF" stroke-width="1.5"/>
    <rect x="70" y="40" width="340" height="220" fill="none" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="4,3"/>
    <!-- Hoa văn tâm -->
    <circle cx="240" cy="150" r="80" fill="none" stroke="#4A9EFF" stroke-width="1.5"/>
    <circle cx="240" cy="150" r="55" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <circle cx="240" cy="150" r="30" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <circle cx="240" cy="150" r="10" fill="rgba(74,158,255,0.3)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Cánh hoa 8 cánh -->
    <g stroke="#4A9EFF" stroke-width="1.2" fill="rgba(74,158,255,0.08)">
      <path d="M240 150 C230 120 220 100 240 80 C260 100 250 120 240 150Z"/>
      <path d="M240 150 C270 140 290 130 310 150 C290 170 270 160 240 150Z"/>
      <path d="M240 150 C250 180 260 200 240 220 C220 200 230 180 240 150Z"/>
      <path d="M240 150 C210 160 190 170 170 150 C190 130 210 140 240 150Z"/>
      <path d="M240 150 C218 122 208 102 218 82 C238 88 242 112 240 150Z" opacity="0.5"/>
      <path d="M240 150 C268 128 288 118 300 138 C286 158 262 158 240 150Z" opacity="0.5"/>
      <path d="M240 150 C262 178 272 198 262 218 C242 212 238 188 240 150Z" opacity="0.5"/>
      <path d="M240 150 C212 172 192 182 180 162 C194 142 218 142 240 150Z" opacity="0.5"/>
    </g>
    <!-- Góc trang trí -->
    <g stroke="#4A9EFF" stroke-width="1" fill="none">
      <path d="M60 30 Q90 30 90 60"/>
      <path d="M420 30 Q390 30 390 60"/>
      <path d="M60 270 Q90 270 90 240"/>
      <path d="M420 270 Q390 270 390 240"/>
      <!-- Hoa góc -->
      <circle cx="75" cy="45" r="10" stroke-width="0.8"/>
      <circle cx="75" cy="45" r="5" fill="rgba(74,158,255,0.3)"/>
      <circle cx="405" cy="45" r="10" stroke-width="0.8"/>
      <circle cx="405" cy="45" r="5" fill="rgba(74,158,255,0.3)"/>
      <circle cx="75" cy="255" r="10" stroke-width="0.8"/>
      <circle cx="75" cy="255" r="5" fill="rgba(74,158,255,0.3)"/>
      <circle cx="405" cy="255" r="10" stroke-width="0.8"/>
      <circle cx="405" cy="255" r="5" fill="rgba(74,158,255,0.3)"/>
    </g>
    <!-- Đường viền hoa văn -->
    <line x1="60" y1="150" x2="155" y2="150" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/>
    <line x1="325" y1="150" x2="420" y2="150" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/>
    <line x1="240" y1="30" x2="240" y2="65" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/>
    <line x1="240" y1="235" x2="240" y2="270" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/>
    <!-- Kích thước -->
    <text x="240" y="20" text-anchor="middle" fill="#FF9500" font-size="9" font-family="monospace">⌀ 800</text>
    <text x="8" y="155" fill="#FF9500" font-size="9" font-family="monospace" transform="rotate(-90,8,150)">H=600</text>
    <!-- Khung -->
    <rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/>
    <rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/>
    <text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">HOA VĂN TRANG TRÍ CNC</text>
    <text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">ĐÔNG NAM Á - FILE DXF XUẤT MÁY</text>
  </svg>`),

  /* ── ĐỒ ÁN: Mặt đứng công trình ── */
  "do-an": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#071525"/>
    <defs>
      <pattern id="g5" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="480" height="300" fill="url(#g5)"/>
    <!-- Nền đất -->
    <line x1="50" y1="258" x2="430" y2="258" stroke="#4A9EFF" stroke-width="2.5"/>
    <!-- Tầng 1 -->
    <rect x="100" y="198" width="280" height="60" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Tầng 2 -->
    <rect x="110" y="143" width="260" height="55" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Tầng 3 -->
    <rect x="120" y="93" width="240" height="50" fill="rgba(74,158,255,0.06)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Mái -->
    <polygon points="100,93 240,48 380,93" fill="rgba(74,158,255,0.1)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Cửa sổ tầng 1 -->
    <rect x="120" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="180" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="265" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="325" y="212" width="35" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <!-- Cửa chính -->
    <rect x="220" y="218" width="40" height="40" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <path d="M240 218 A20 20 0 0 0 220 218" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <!-- Cửa sổ tầng 2 -->
    <rect x="130" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="190" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="250" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="320" y="158" width="30" height="25" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <!-- Cửa sổ tầng 3 -->
    <rect x="155" y="108" width="28" height="22" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="216" y="108" width="28" height="22" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <rect x="277" y="108" width="28" height="22" fill="rgba(74,158,255,0.15)" stroke="#4A9EFF" stroke-width="1"/>
    <!-- Cao độ -->
    <line x1="50" y1="258" x2="50" y2="48" stroke="#FF9500" stroke-width="1"/>
    <line x1="46" y1="258" x2="54" y2="258" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="46" y1="198" x2="54" y2="198" stroke="#FF9500" stroke-width="1"/>
    <line x1="46" y1="143" x2="54" y2="143" stroke="#FF9500" stroke-width="1"/>
    <line x1="46" y1="93" x2="54" y2="93" stroke="#FF9500" stroke-width="1"/>
    <line x1="46" y1="48" x2="54" y2="48" stroke="#FF9500" stroke-width="1"/>
    <text x="42" y="261" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">±0.000</text>
    <text x="42" y="201" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">+3.300</text>
    <text x="42" y="146" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">+6.600</text>
    <text x="42" y="96" text-anchor="end" fill="#FF9500" font-size="8" font-family="monospace">+9.900</text>
    <!-- Kích thước ngang -->
    <line x1="100" y1="275" x2="380" y2="275" stroke="#FF9500" stroke-width="1"/>
    <line x1="100" y1="271" x2="100" y2="279" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="380" y1="271" x2="380" y2="279" stroke="#FF9500" stroke-width="1.5"/>
    <text x="240" y="287" text-anchor="middle" fill="#FF9500" font-size="10" font-family="monospace">8400</text>
    <!-- Khung -->
    <rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/>
    <rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/>
    <text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT ĐỨNG - ĐỒ ÁN KIẾN TRÚC</text>
    <text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">CHUNG CƯ MINI 5 TẦNG - TỈ LỆ 1:100</text>
  </svg>`),

  /* ── THI CÔNG XD: Mặt cắt móng cọc ── */
  "xay-dung": toDataURL(`<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#071525"/>
    <defs>
      <pattern id="g6" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0L0 0 0 20" fill="none" stroke="#0d2644" stroke-width="0.6"/>
      </pattern>
      <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#1a4070" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="480" height="300" fill="url(#g6)"/>
    <!-- Đất -->
    <rect x="60" y="90" width="360" height="180" fill="url(#hatch)" opacity="0.5"/>
    <line x1="60" y1="90" x2="420" y2="90" stroke="#4A9EFF" stroke-width="1.5" stroke-dasharray="8,4"/>
    <!-- Đài cọc -->
    <rect x="150" y="60" width="180" height="60" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="2"/>
    <!-- Gạch chéo đài cọc (bê tông) -->
    <g stroke="#2a5090" stroke-width="0.6" clip-path="url(#pile-cap)">
      <line x1="150" y1="60" x2="330" y2="120"/>
      <line x1="150" y1="75" x2="330" y2="120"/>
      <line x1="150" y1="90" x2="330" y2="120"/>
      <line x1="180" y1="60" x2="330" y2="115"/>
      <line x1="210" y1="60" x2="330" y2="105"/>
      <line x1="240" y1="60" x2="330" y2="95"/>
    </g>
    <!-- Thép đài cọc -->
    <line x1="155" y1="68" x2="325" y2="68" stroke="#FF6B6B" stroke-width="2"/>
    <line x1="155" y1="112" x2="325" y2="112" stroke="#FF6B6B" stroke-width="2"/>
    <line x1="165" y1="62" x2="165" y2="118" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="195" y1="62" x2="195" y2="118" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="225" y1="62" x2="225" y2="118" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="255" y1="62" x2="255" y2="118" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="285" y1="62" x2="285" y2="118" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="315" y1="62" x2="315" y2="118" stroke="#FF6B6B" stroke-width="1.5"/>
    <!-- Cọc khoan nhồi -->
    <rect x="175" y="120" width="34" height="150" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/>
    <rect x="271" y="120" width="34" height="150" fill="rgba(74,158,255,0.12)" stroke="#4A9EFF" stroke-width="1.5"/>
    <!-- Thép cọc -->
    <line x1="183" y1="118" x2="183" y2="268" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="192" y1="118" x2="192" y2="268" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="199" y1="118" x2="199" y2="268" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="279" y1="118" x2="279" y2="268" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="288" y1="118" x2="288" y2="268" stroke="#FF6B6B" stroke-width="1.5"/>
    <line x1="297" y1="118" x2="297" y2="268" stroke="#FF6B6B" stroke-width="1.5"/>
    <!-- Đai thép -->
    <rect x="178" y="140" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/>
    <rect x="178" y="170" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/>
    <rect x="178" y="200" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/>
    <rect x="274" y="140" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/>
    <rect x="274" y="170" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/>
    <rect x="274" y="200" width="28" height="12" fill="none" stroke="#FF6B6B" stroke-width="1"/>
    <!-- Chú thích -->
    <text x="90" y="88" fill="#9BCFFF" font-size="8.5" font-family="monospace">MẶT ĐẤT TỰ NHIÊN (±0.000)</text>
    <text x="346" y="200" fill="#9BCFFF" font-size="8" font-family="monospace">CỌC Ø600</text>
    <text x="346" y="210" fill="#9BCFFF" font-size="8" font-family="monospace">L=18m</text>
    <!-- Kích thước -->
    <line x1="148" y1="44" x2="148" y2="125" stroke="#FF9500" stroke-width="1"/>
    <text x="136" y="88" fill="#FF9500" font-size="8" font-family="monospace" transform="rotate(-90,136,88)">1200</text>
    <line x1="150" y1="44" x2="330" y2="44" stroke="#FF9500" stroke-width="1"/>
    <line x1="150" y1="40" x2="150" y2="48" stroke="#FF9500" stroke-width="1.5"/>
    <line x1="330" y1="40" x2="330" y2="48" stroke="#FF9500" stroke-width="1.5"/>
    <text x="240" y="38" text-anchor="middle" fill="#FF9500" font-size="9" font-family="monospace">2400</text>
    <!-- Khung -->
    <rect x="2" y="2" width="476" height="296" fill="none" stroke="#1e4080" stroke-width="1.5"/>
    <rect x="258" y="6" width="218" height="32" fill="none" stroke="#4A9EFF" stroke-width="1"/>
    <line x1="258" y1="20" x2="476" y2="20" stroke="#4A9EFF" stroke-width="0.7"/>
    <text x="367" y="16" text-anchor="middle" fill="#4A9EFF" font-size="9" font-family="monospace" font-weight="bold">MẶT CẮT MÓNG CỌC KHOAN NHỒI</text>
    <text x="367" y="30" text-anchor="middle" fill="#6aacff" font-size="8" font-family="monospace">TỈ LỆ 1:50 - THÉP Ø25 A-III</text>
  </svg>`),
};

// Lấy thumbnail theo category, fallback về kien-truc
export const getBlueprintImg = (catId) =>
  BLUEPRINTS[catId] || BLUEPRINTS["kien-truc"];

export default BLUEPRINTS;
