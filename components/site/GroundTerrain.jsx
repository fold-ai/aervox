// An authored, fictional rural landscape. All positions are local illustration
// coordinates; this layer contains no geographic or operational source data.
const FIELD_EDGES = [
  "M30 220 145 219 165 273 57 290Z",
  "M35 299 164 283 172 313 22 330Z",
  "M51 360 155 346 177 410 57 429Z",
  "M65 439 180 420 205 474 75 491Z",
  "M91 504 211 482 247 506 144 544Z",
  "M255 89 347 102 334 156 286 147Z",
  "M343 102 434 119 418 167 338 157Z",
  "M439 122 538 143 521 184 423 169Z",
  "M308 341 356 326 384 364 337 393Z",
  "M274 382 330 399 299 442 236 469Z",
  "M351 435 408 400 450 454 392 490Z",
  "M403 499 456 465 506 511 452 546Z",
  "M471 552 514 520 572 555 537 602Z",
  "M576 371 655 350 681 407 602 427Z",
  "M609 440 685 416 708 468 640 487Z",
  "M647 494 713 480 740 530 688 545Z",
  "M765 134 838 152 820 206 755 188Z",
  "M960 215 1064 177 1093 230 987 273Z",
  "M994 281 1097 243 1120 289 1023 326Z",
  "M1018 361 1129 405 1104 448 993 401Z",
  "M821 477 902 521 876 567 798 524Z",
  "M928 591 1035 624 1018 671 907 633Z",
  "M1064 626 1175 659 1161 699 1042 676Z",
];
const CLUSTERS = [
  { x: 183, y: 209, angle: -8, rows: 3, cols: 5 },
  { x: 389, y: 281, angle: 22, rows: 4, cols: 5 },
  { x: 588, y: 196, angle: 10, rows: 3, cols: 6 },
  { x: 884, y: 325, angle: 31, rows: 4, cols: 7 },
  { x: 542, y: 498, angle: 28, rows: 3, cols: 5 },
  { x: 995, y: 552, angle: 15, rows: 3, cols: 6 },
  { x: 75, y: 116, angle: -6, rows: 2, cols: 4 },
  { x: 1080, y: 104, angle: 14, rows: 2, cols: 5 },
];
const SECONDARY_ROADS = [
  "M61 0C74 55 93 72 106 119S141 163 179 176",
  "M198 208 204 247 258 253 286 279",
  "M290 154 335 168 400 179",
  "M441 253 421 280 418 332 451 354 483 406",
  "M588 184 578 214 602 244 661 257 687 271",
  "M904 294 883 320 900 370 941 397 978 405",
  "M535 473 536 510 574 550 623 555",
  "M1017 514 996 550 1035 603 1078 615",
  "M22 331 161 316 247 292",
  "M171 347 189 419 216 477 252 497",
  "M485 340 561 360 582 425 642 487 689 548",
  "M966 213 993 277 1023 329 1020 362",
  "M1069 59 1081 91 1136 134 1199 153",
  "M765 576 802 526 819 480 851 459",
];
const STREAM = "M678 -30C636 41 664 77 614 119S583 164 563 207 555 261 514 293 468 346 455 385 461 439 424 464 409 512 373 547 345 610 290 646 247 679 209 735";

export default function GroundTerrain({ relief = true }) {
  return <g aria-hidden="true" pointerEvents="none">
    <rect width="1200" height="700" fill="#25282a" />
    {relief && <image href="/media/ground-relief.webp" width="1200" height="700" preserveAspectRatio="none" />}
    <g fill="none" stroke="#c4c7c6" strokeWidth=".55" opacity={relief ? ".13" : ".08"}>
      {FIELD_EDGES.map((path, index) => <path key={index} d={path} />)}
    </g>
    <path d={STREAM} fill="none" stroke="#151c20" strokeWidth="6.5" opacity=".72" />
    <path d={STREAM} fill="none" stroke="#768286" strokeWidth="1.6" opacity=".34" />
    <g fill="none" stroke="#171b1c" strokeWidth="5" opacity=".72">
      {SECONDARY_ROADS.map((path, index) => <path key={index} d={path} />)}
    </g>
    <g fill="none" stroke="#9b9b92" strokeWidth="1.15" opacity=".44">
      {SECONDARY_ROADS.map((path, index) => <path key={index} d={path} />)}
    </g>
    {CLUSTERS.map((cluster, clusterIndex) => <g key={clusterIndex} transform={`translate(${cluster.x} ${cluster.y}) rotate(${cluster.angle})`}>
      <path d={`M-6 -7H${cluster.cols * 13}V${cluster.rows * 13 + 1}H-6Z`} fill="#24282a" opacity=".34" />
      {Array.from({ length: cluster.rows * cluster.cols }, (_, index) => {
        if ((index + clusterIndex * 2) % 7 === 1) return null;
        const x = index % cluster.cols * 13;
        const y = Math.floor(index / cluster.cols) * 13;
        const w = 6 + (index % 3);
        const h = 4 + ((index + 1) % 3);
        return <g key={index}>
          <rect x={x + 1.6} y={y + 2} width={w} height={h} fill="#131718" opacity=".9" />
          <rect x={x} y={y} width={w} height={h} fill={index % 3 === 0 ? "#878985" : "#646a68"} stroke="#b2b3a8" strokeWidth=".25" />
          <path d={`M${x} ${y + h / 2}h${w}`} stroke="#303638" strokeWidth=".5" />
        </g>;
      })}
    </g>)}
    <g transform="translate(725 118) rotate(12)" fill="#727775" stroke="#a3a6a0" strokeWidth=".4" opacity=".77">
      <rect width="27" height="11" /><rect y="16" width="27" height="11" />
      <rect x="33" width="27" height="27" />
      <path d="M0 5.5h27M0 21.5h27M46.5 0v27" fill="none" stroke="#383e3e" />
    </g>
    <g transform="translate(1068 466)" fill="#777d79" stroke="#b0b4ad" strokeWidth=".4" opacity=".75">
      {[0, 13, 26].map(x => <g key={x}><circle cx={x} r="4.4" /><circle cx={x} cy="12" r="4.4" /></g>)}
      <rect x="-5" y="23" width="37" height="10" />
    </g>
  </g>;
}
