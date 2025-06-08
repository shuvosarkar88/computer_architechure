document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-fade-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });

  const asciiData = [];
  for (let i = 32; i <= 126; i++) {
    asciiData.push({
      char: String.fromCharCode(i),
      dec: i,
      hex: i.toString(16).toUpperCase().padStart(2, "0"),
      bin: i.toString(2).padStart(7, "0"),
    });
  }

  const asciiTableContainer = document.getElementById("ascii-table-container");
  const asciiDetails = document.getElementById("ascii-details");

  asciiData.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "p-2 border rounded-md cursor-pointer hover:bg-teal-100 hover:shadow-md transition-all duration-200";
    div.textContent = item.char === " " ? "Space" : item.char;
    div.addEventListener("mouseenter", () => {
      asciiDetails.innerHTML = `
                        <div class="flex items-center space-x-4">
                           <div class="text-4xl font-bold text-teal-600">${
                             item.char === " " ? "␣" : item.char
                           }</div>
                           <div class="text-left text-sm">
                               <p><strong>Decimal:</strong> ${item.dec}</p>
                               <p><strong>Hex:</strong> 0x${item.hex}</p>
                               <p><strong>Binary:</strong> ${item.bin}</p>
                           </div>
                        </div>
                    `;
    });
    asciiTableContainer.appendChild(div);
  });

  const unicodePlanesContainer = document.getElementById("unicode-planes");
  const planes = [
    {
      name: "BMP",
      range: "U+0000-FFFF",
      desc: "Basic Multilingual Plane: Most modern scripts and symbols.",
    },
    {
      name: "SMP",
      range: "U+10000-1FFFF",
      desc: "Supplementary Multilingual Plane: Historic scripts, emojis, symbols.",
    },
    {
      name: "SIP",
      range: "U+20000-2FFFF",
      desc: "Supplementary Ideographic Plane: Rare CJK ideographs.",
    },
    {
      name: "TIP",
      range: "U+30000-3FFFF",
      desc: "Tertiary Ideographic Plane: Oracle Bone script, rare CJK.",
    },
    { name: "Plane 4", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 5", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 6", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 7", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 8", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 9", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 10", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 11", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 12", range: "Unassigned", desc: "Reserved for future use." },
    { name: "Plane 13", range: "Unassigned", desc: "Reserved for future use." },
    {
      name: "SSP",
      range: "U+E0000-EFFFF",
      desc: "Supplementary Special-purpose Plane: Language tags.",
    },
    {
      name: "PUA",
      range: "U+F0000-10FFFF",
      desc: "Private Use Areas: For custom characters.",
    },
  ];

  planes.forEach((plane, index) => {
    const div = document.createElement("div");
    div.className = `p-2 border rounded-md cursor-help text-center transition-colors ${
      index === 0 ? "bg-teal-100" : "bg-slate-100"
    } hover:bg-teal-200`;
    div.textContent = `P${index}`;
    div.title = `${plane.name} (${plane.range}): ${plane.desc}`;
    unicodePlanesContainer.appendChild(div);
  });

  const charInspectorInput = document.getElementById("char-inspector-input");
  const charInspectorOutput = document.getElementById("char-inspector-output");

  function inspectChar() {
    const text = charInspectorInput.value;
    if (!text) {
      charInspectorOutput.innerHTML = `<p class="text-slate-500">Enter a character above.</p>`;
      return;
    }
    const char = Array.from(text)[0];
    const codePoint = char.codePointAt(0);
    const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");

    charInspectorOutput.innerHTML = `
                    <div class="flex items-center space-x-4">
                       <div class="text-4xl font-bold text-teal-600">${char}</div>
                       <div class="text-left text-sm md:text-base">
                           <p><strong>Code Point:</strong> U+${hex}</p>
                       </div>
                    </div>
                `;
  }
  charInspectorInput.addEventListener("input", inspectChar);
  inspectChar();

  const explorerInput = document.getElementById("explorer-input");
  const outputAscii = document.getElementById("explorer-output-ascii");
  const outputUtf8 = document.getElementById("explorer-output-utf8");
  const outputUtf16 = document.getElementById("explorer-output-utf16");
  const outputUtf32 = document.getElementById("explorer-output-utf32");

  let encodingChart;

  function updateExplorer() {
    const text = explorerInput.value;

    let asciiBytes = [];
    let asciiValid = true;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code > 127) {
        asciiValid = false;
        break;
      }
      asciiBytes.push(code.toString(16).toUpperCase().padStart(2, "0"));
    }

    let utf8Bytes = [];
    let utf16Bytes = [];
    let utf32Bytes = [];

    for (const char of text) {
      const codePoint = char.codePointAt(0);

      if (codePoint < 0x80) {
        utf8Bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        utf8Bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
      } else if (codePoint < 0x10000) {
        utf8Bytes.push(
          0xe0 | (codePoint >> 12),
          0x80 | ((codePoint >> 6) & 0x3f),
          0x80 | (codePoint & 0x3f)
        );
      } else {
        utf8Bytes.push(
          0xf0 | (codePoint >> 18),
          0x80 | ((codePoint >> 12) & 0x3f),
          0x80 | ((codePoint >> 6) & 0x3f),
          0x80 | (codePoint & 0x3f)
        );
      }

      if (codePoint < 0x10000) {
        utf16Bytes.push(codePoint);
      } else {
        const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xd800;
        const low = ((codePoint - 0x10000) % 0x400) + 0xdc00;
        utf16Bytes.push(high, low);
      }

      utf32Bytes.push(codePoint);
    }

    const renderBytes = (bytes, unitSize) =>
      bytes
        .map((b) => {
          const hex = b.toString(16).toUpperCase().padStart(unitSize, "0");
          let color = "bg-slate-200 text-slate-800";
          if (unitSize === 2) {
            const byteVal = parseInt(hex, 16);
            if (byteVal >= 0xd800 && byteVal <= 0xdbff)
              color = "bg-sky-200 text-sky-800"; // High surrogate
            if (byteVal >= 0xdc00 && byteVal <= 0xdfff)
              color = "bg-indigo-200 text-indigo-800"; // Low surrogate
          } else {
            if ((b & 0xc0) === 0x80)
              color = "bg-yellow-200 text-yellow-800"; // Continuation
            else if (b > 0x7f) color = "bg-green-200 text-green-800"; // Start
          }

          return `<span class="inline-block font-mono text-xs p-1 rounded-md m-0.5 ${color}" title="0x${hex}">${hex}</span>`;
        })
        .join("");

    outputAscii.innerHTML = `
                    <h4 class="font-semibold text-lg">ASCII (7-bit)</h4>
                    ${
                      asciiValid
                        ? `
                        <p class="text-sm text-slate-600">Total Bytes: ${
                          asciiBytes.length
                        }</p>
                        <div class="mt-2 p-3 bg-slate-50 rounded-lg flex flex-wrap">${renderBytes(
                          asciiBytes.map((b) => parseInt(b, 16)),
                          2
                        )}</div>
                    `
                        : `
                        <p class="p-3 bg-red-100 text-red-800 rounded-lg">Invalid ASCII: Contains characters beyond the 127 limit.</p>
                    `
                    }
                `;

    outputUtf8.innerHTML = `
                    <h4 class="font-semibold text-lg">UTF-8 (variable, 1-4 bytes)</h4>
                    <p class="text-sm text-slate-600">Total Bytes: ${
                      utf8Bytes.length
                    }</p>
                    <div class="mt-2 p-3 bg-slate-50 rounded-lg flex flex-wrap">${renderBytes(
                      utf8Bytes,
                      2
                    )}</div>
                `;

    outputUtf16.innerHTML = `
                    <h4 class="font-semibold text-lg">UTF-16 (variable, 2 or 4 bytes)</h4>
                    <p class="text-sm text-slate-600">Total Bytes: ${
                      utf16Bytes.length * 2
                    }</p>
                    <div class="mt-2 p-3 bg-slate-50 rounded-lg flex flex-wrap">${renderBytes(
                      utf16Bytes,
                      4
                    )}</div>
                `;

    outputUtf32.innerHTML = `
                    <h4 class="font-semibold text-lg">UTF-32 (fixed, 4 bytes)</h4>
                    <p class="text-sm text-slate-600">Total Bytes: ${
                      utf32Bytes.length * 4
                    }</p>
                    <div class="mt-2 p-3 bg-slate-50 rounded-lg flex flex-wrap">${renderBytes(
                      utf32Bytes,
                      8
                    )}</div>
                `;

    updateChart(
      asciiValid ? asciiBytes.length : 0,
      utf8Bytes.length,
      utf16Bytes.length * 2,
      utf32Bytes.length * 4
    );
  }

  function updateChart(ascii, utf8, utf16, utf32) {
    const ctx = document.getElementById("encoding-chart").getContext("2d");
    const data = {
      labels: ["ASCII", "UTF-8", "UTF-16", "UTF-32"],
      datasets: [
        {
          label: "Bytes Used",
          data: [ascii, utf8, utf16, utf32],
          backgroundColor: [
            "rgba(148, 163, 184, 0.6)", // slate-400
            "rgba(14, 165, 233, 0.6)", // sky-500
            "rgba(99, 102, 241, 0.6)", // indigo-500
            "rgba(20, 184, 166, 0.6)", // teal-500
          ],
          borderColor: [
            "rgb(148, 163, 184)",
            "rgb(14, 165, 233)",
            "rgb(99, 102, 241)",
            "rgb(20, 184, 166)",
          ],
          borderWidth: 1,
        },
      ],
    };

    if (encodingChart) {
      encodingChart.data = data;
      encodingChart.update();
    } else {
      encodingChart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Bytes",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y + " bytes";
                  }
                  return label;
                },
              },
            },
          },
        },
      });
    }
  }

  explorerInput.addEventListener("input", updateExplorer);
  explorerInput.value = "Hello! 😊";
  updateExplorer();
});
