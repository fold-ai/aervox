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
const WOODLANDS = [
  "M72 101C95 74 135 80 154 101S190 117 203 145 176 176 141 166 105 151 80 147 57 126 72 101Z",
  "M228 179C257 160 274 171 283 191S318 200 333 217 315 245 285 234 260 222 238 222 213 199 228 179Z",
  "M337 282C367 257 392 268 405 288S443 303 447 329 419 351 395 335 374 326 349 326 321 304 337 282Z",
  "M567 230C594 208 626 215 643 240S678 251 683 275 656 304 632 284 612 275 583 273 550 249 567 230Z",
  "M846 173C869 155 900 165 919 184S951 189 960 211 946 241 916 229 888 218 862 215 832 192 846 173Z",
  "M893 411C925 387 957 406 970 425S1002 439 1006 464 974 487 951 470 934 458 907 457 875 435 893 411Z",
  "M249 549C274 534 305 537 321 558S351 576 352 597 328 616 301 603 282 598 259 593 233 568 249 549Z",
];
const TREE_BELTS = [
  { x: 95, y: 112, angle: 27, length: 106, depth: 26, count: 28 },
  { x: 240, y: 193, angle: 24, length: 88, depth: 18, count: 23 },
  { x: 352, y: 290, angle: 25, length: 96, depth: 22, count: 26 },
  { x: 590, y: 239, angle: 25, length: 90, depth: 22, count: 24 },
  { x: 861, y: 183, angle: 22, length: 93, depth: 23, count: 26 },
  { x: 909, y: 424, angle: 28, length: 95, depth: 23, count: 27 },
  { x: 266, y: 560, angle: 22, length: 84, depth: 20, count: 24 },
  { x: 66, y: 428, angle: -12, length: 112, depth: 6, count: 24 },
  { x: 347, y: 166, angle: 12, length: 120, depth: 5, count: 23 },
  { x: 595, y: 428, angle: -17, length: 86, depth: 6, count: 19 },
  { x: 1000, y: 280, angle: -20, length: 102, depth: 6, count: 22 },
];
const SPARSE_STANDS = [
  { x: 203, y: 375, angle: 70, length: 29, depth: 12, count: 8 },
  { x: 517, y: 514, angle: -12, length: 36, depth: 15, count: 9 },
  { x: 748, y: 99, angle: 30, length: 37, depth: 12, count: 8 },
  { x: 789, y: 550, angle: -24, length: 35, depth: 16, count: 8 },
  { x: 1096, y: 522, angle: 67, length: 35, depth: 13, count: 9 },
];
const CONTOURS = [
  "M73 55C111 37 143 41 175 62M63 65C107 41 146 48 178 72M55 76C99 50 145 55 181 81",
  "M403 84C443 60 496 72 520 101M397 94C441 71 486 80 512 108M392 104C433 82 477 87 505 117",
  "M1037 97C1063 64 1113 63 1156 92M1044 107C1073 76 1110 76 1147 101M1053 117C1079 91 1109 89 1139 111",
  "M118 608C155 578 198 583 220 612M126 615C160 590 192 591 213 619M134 624C160 604 185 602 206 626",
  "M779 625C802 605 851 609 873 637M787 633C808 617 845 620 864 643M796 641C817 630 839 631 854 649",
];
// Tiny, generic earthwork symbols add context, without describing a real layout.
const EARTHWORKS = [
  { x: 306, y: 305, angle: 23 },
  { x: 476, y: 488, angle: -18 },
  { x: 653, y: 329, angle: 21 },
  { x: 958, y: 332, angle: 65 },
  { x: 867, y: 575, angle: -17 },
];

function TreeStand({ stand, seed }) {
  return <g transform={`translate(${stand.x} ${stand.y}) rotate(${stand.angle})`}>
    {Array.from({ length: stand.count }, (_, index) => {
      const x = index / (stand.count - 1) * stand.length;
      const y = Math.sin(index * 2.37 + seed) * stand.depth * .48 + Math.sin(index * .62) * 2.3;
      const radius = 2.7 + ((index * 7 + seed) % 9) * .28;
      return <g key={index}>
        <ellipse cx={x + 1.7} cy={y + 2.1} rx={radius + .9} ry={radius * .77} fill="#121a19" opacity=".52" />
        <ellipse cx={x} cy={y} rx={radius} ry={radius * .83} fill={index % 3 ? "#3c4741" : "#4d554d"} opacity=".74" />
        <path d={`M${x - radius * .44} ${y - .3}q${radius * .3} ${-radius * .4} ${radius * .65} ${-radius * .28}`} stroke="#939b89" strokeWidth=".45" opacity=".27" fill="none" />
      </g>;
    })}
  </g>;
}

export default function GroundTerrain({ relief = true }) {
  return <g aria-hidden="true" pointerEvents="none">
    <rect width="1200" height="700" fill="#25282a" />
    {relief && <image href="/media/ground-relief.webp" width="1200" height="700" preserveAspectRatio="none" />}
    <g fill="none" stroke="#c4c7c6" strokeWidth=".55" opacity={relief ? ".13" : ".08"}>
      {FIELD_EDGES.map((path, index) => <path key={index} d={path} />)}
    </g>
    <g fill="#1f2b27" opacity=".34">
      {WOODLANDS.map((path, index) => <path key={index} d={path} />)}
    </g>
    {[...TREE_BELTS, ...SPARSE_STANDS].map((stand, index) => <TreeStand key={index} stand={stand} seed={index * 3} />)}
    <g fill="none" stroke="#c3c7bd" strokeWidth=".45" opacity={relief ? ".12" : ".2"}>
      {CONTOURS.map((path, index) => <path key={index} d={path} />)}
    </g>
    {EARTHWORKS.map((position, index) => <g key={index} transform={`translate(${position.x} ${position.y}) rotate(${position.angle})`} fill="none" strokeLinecap="round" opacity=".48">
      <path d="M-9 5Q-10-5 0-6T10 5" stroke="#111818" strokeWidth="3.5" />
      <path d="M-11 5Q-12-7 0-8T12 5" stroke="#879084" strokeWidth="1.2" />
      <path d="M-6 6H6" stroke="#5b665b" strokeWidth="2" />
    </g>)}
  </g>;
}
