// ==========================================================================
// VGU MSI Seminar & Workshop Poster (A4 Portrait - 210mm x 297mm)
// Compiled with Typst (Vector-perfect typesetting engine)
// ==========================================================================

#set page(
  paper: "a4",
  margin: 0cm,
)

// Configure Font Stack and Line Spacing (Leading)
#set text(
  font: ("Segoe UI", "Calibri", "Arial"),
  size: 8.5pt,
  fill: rgb("#0f2240") // Deep Navy
)
#set par(
  leading: 0.52em,
  justify: false
)

// Define Brand Colors & Gradients
#let vgu-orange = rgb("#e87722")
#let ovgu-burgundy = rgb("#7a003c")
#let slate-gray = rgb("#475569")
#let light-bg = rgb("#f8fafc")
#let header-grad = gradient.linear(rgb("#091322"), rgb("#162846"))

// Define Premium Custom SVG Icons
#let icon-calendar = image.decode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#e87722' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='18' rx='2' ry='2'/><line x1='16' y1='2' x2='16' y2='6'/><line x1='8' y1='2' x2='8' y2='6'/><line x1='3' y1='10' x2='21' y2='10'/></svg>", width: 10pt)
#let icon-clock = image.decode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#e87722' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>", width: 10pt)
#let icon-location = image.decode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#e87722' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg>", width: 10pt)
#let icon-microphone = image.decode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#e87722' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'/><path d='M19 10v1a7 7 0 0 1-14 0v-1'/><line x1='12' y1='19' x2='12' y2='22'/></svg>", width: 10pt)
#let icon-mail = image.decode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#7a003c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>", width: 10pt)
#let icon-timeline = image.decode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#e87722' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>", width: 11pt)

// 1. Watermark Campus Background Image
#place(top + left, dx: 0cm, dy: 0cm, block(
  width: 210mm,
  height: 297mm,
  image("../public/images/Students_Life_VGU.png", fit: "cover", width: 100%, height: 100%)
))

// Translucent white overlay to wash out the campus background as a watermark
#place(top + left, dx: 0cm, dy: 0cm, rect(
  width: 210mm,
  height: 297mm,
  fill: rgb(255, 255, 255, 95.5%)
))

// 2. Dark Header Bar with Linear Gradient
#place(top + left, dx: 0cm, dy: 0cm, block(
  width: 210mm,
  height: 64mm,
  fill: header-grad
))

// Curvy Wave Divider (Scaled cubic bezier waves mapped 1-to-1 from the website's SVG)
#place(top + left, dx: 0cm, dy: 64mm, block(
  width: 210mm,
  height: 12mm,
  [
    // Wave 1: Semi-transparent Burgundy wave
    #place(top + left, curve(
      fill: ovgu-burgundy.transparentize(55%),
      curve.move((0mm, 2.67mm)),
      curve.cubic((46.7mm, 10.67mm), (93.3mm, 0mm), (140mm, 8mm)),
      curve.cubic((163.3mm, 12mm), (186.7mm, 10.67mm), (210mm, 5.33mm)),
      curve.line((210mm, 12mm)),
      curve.line((0mm, 12mm))
    ))
    // Wave 2: VGU Orange Wave
    #place(top + left, curve(
      fill: vgu-orange,
      curve.move((0mm, 4.5mm)),
      curve.cubic((42.5mm, 9.5mm), (90mm, 1.5mm), (135mm, 7.2mm)),
      curve.cubic((165mm, 11mm), (187.5mm, 9.2mm), (210mm, 4.8mm)),
      curve.line((210mm, 12mm)),
      curve.line((0mm, 12mm))
    ))
    // Wave 3: White Cover Wave
    #place(top + left, curve(
      fill: rgb("#ffffff"),
      curve.move((0mm, 6.5mm)),
      curve.cubic((45mm, 11.5mm), (95mm, 3.2mm), (142mm, 9mm)),
      curve.cubic((170mm, 12.8mm), (190mm, 10.5mm), (210mm, 6.8mm)),
      curve.line((210mm, 12mm)),
      curve.line((0mm, 12mm))
    ))
  ]
))

// Header Logos Row
#place(top + left, dx: 12mm, dy: 7mm, block(
  width: 186mm,
  [
    #grid(
      columns: (1fr, auto),
      align: horizon,
      // Left: VGU Logo (White capsule card)
      rect(fill: rgb("#ffffff"), radius: 4pt, inset: (x: 8pt, y: 5pt), stroke: 0.5pt + rgb("#cbd5e1"))[
        #image("../public/Logo/VGU_Logo.png", height: 13pt)
      ],
      // Right: Cooperation Row
      grid(
        columns: (auto, auto, auto),
        gutter: 8pt,
        align: horizon,
        text(fill: rgb("#cbd5e1"), size: 6.2pt, weight: "bold", tracking: 0.05em)[IN COOPERATION WITH],
        rect(fill: rgb("#ffffff"), radius: 3pt, inset: 3.5pt, stroke: 0.5pt + rgb("#cbd5e1"))[
          #image("../public/Logo/OVGU_Logo.png", height: 9.2pt)
        ],
        rect(fill: rgb("#ffffff"), radius: 3pt, inset: 3.5pt, stroke: 0.5pt + rgb("#cbd5e1"))[
          #image("../public/Logo/Norwegian University of Science and Technology.jpg", height: 9.2pt)
        ]
      )
    )
  ]
))

// Header Titles (Structured for print)
#place(top + left, dx: 12mm, dy: 22mm, block(
  width: 186mm,
  align(center)[
    #text(fill: rgb("#ffffff"), size: 10.8pt, weight: "black", tracking: 0.03em)[WORKSHOP ON MINISTRY-LEVEL SCIENTIFIC & TECHNOLOGICAL PROJECT]
    #v(2.2mm)
    #rect(fill: ovgu-burgundy, stroke: 1.2pt + vgu-orange, radius: 4pt, inset: (x: 10pt, y: 4pt))[
      #text(fill: vgu-orange, size: 7.2pt, weight: "bold", tracking: 0.05em)[IN CONJUNCTION WITH]
    ]
    #v(2.2mm)
    #text(fill: rgb("#ffffff"), size: 10.8pt, weight: "black", tracking: 0.03em)[MATERIALS SCIENCE SEMINAR]
  ]
))

// 3. Hero Date, Time & Venue Bar
#place(top + left, dx: 12mm, dy: 72mm, block(
  width: 186mm,
  fill: rgb("#ffffff"),
  stroke: 1pt + rgb("#e2e8f0"),
  radius: 6pt,
  inset: (x: 10pt, y: 8pt),
  [
    #grid(
      columns: (1fr, 0.9fr, 1.8fr),
      gutter: 12pt,
      align: horizon,
      // Date Card
      grid(
        columns: (auto, 1fr),
        gutter: 8pt,
        align: horizon,
        icon-calendar,
        grid(
          columns: 1,
          gutter: 1.5pt,
          text(size: 5.5pt, fill: slate-gray, weight: "bold", tracking: 0.02em)[DATE],
          text(size: 7.5pt, fill: rgb("#0f2240"), weight: "bold")[Thursday, 23 July 2026]
        )
      ),
      // Time Card
      grid(
        columns: (auto, 1fr),
        gutter: 8pt,
        align: horizon,
        icon-clock,
        grid(
          columns: 1,
          gutter: 1.5pt,
          text(size: 5.5pt, fill: slate-gray, weight: "bold", tracking: 0.02em)[TIME],
          text(size: 7.5pt, fill: rgb("#0f2240"), weight: "bold")[09:00 AM – 04:00 PM]
        )
      ),
      // Location Card
      grid(
        columns: (auto, 1fr),
        gutter: 8pt,
        align: horizon,
        icon-location,
        grid(
          columns: 1,
          gutter: 1.5pt,
          text(size: 5.5pt, fill: slate-gray, weight: "bold", tracking: 0.02em)[VENUE],
          text(size: 7.2pt, fill: rgb("#0f2240"), weight: "bold")[VGU Campus (Lab Tour) | Hybrid (Seminar)]
        )
      )
    )
  ]
))

// 4. Speakers Section
#let speaker-card(name, designation, topic, avatar-path) = rect(
  width: 100%,
  stroke: 1.2pt + ovgu-burgundy,
  radius: 6pt,
  fill: rgb("#ffffff"),
  inset: (x: 8pt, y: 7pt),
  [
    #align(center)[
      // Profile Avatar Circle with dynamic double border
      #block(
        stroke: 0.8pt + rgb("#e2e8f0"),
        radius: 8.5mm,
        inset: 1.5pt,
        [
          #block(
            width: 14mm,
            height: 14mm,
            radius: 7mm,
            clip: true,
            image(avatar-path, width: 100%, height: 100%, fit: "cover")
          )
        ]
      )
      #v(1.5mm)
      #text(size: 7.2pt, weight: "bold", fill: rgb("#0f2240"))[#name] \
      #v(0.8mm)
      #text(size: 5.6pt, fill: slate-gray, style: "italic")[#designation]
      #v(1.8mm)
      #align(left)[
        #line(length: 100%, stroke: 0.4pt + rgb("#f1f5f9"))
        #v(1mm)
        #text(size: 5.2pt, fill: vgu-orange, weight: "black", tracking: 0.02em)[TOPIC:] \
        #v(0.4mm)
        #text(size: 6.2pt, fill: rgb("#0f2240"), weight: "bold", leading: 0.48em)[#topic]
      ]
    ]
  ]
)

#place(top + left, dx: 12mm, dy: 89mm, block(
  width: 186mm,
  [
    // Section Title
    #grid(
      columns: (auto, 1fr),
      gutter: 6pt,
      align: horizon,
      icon-microphone,
      text(size: 8.2pt, weight: "bold", fill: rgb("#0f2240"), tracking: 0.05em)[SPEAKERS]
    )
    #v(2mm)
    
    // Row 1: VGU & NTNU Presenters (3 columns)
    #grid(
      columns: (1fr, 1fr, 1fr),
      gutter: 8pt,
      speaker-card("Dr. Hieu Linh Duong", "Researcher, VGU", "Production of Syzygium nervosum Leaf Extract Nano-Formulation", "../public/Lecturer_Avatar/Linh Duong Hieu.png"),
      speaker-card("Dr. Thanh Thuat Trinh", "Researcher, NTNU", "Computational Insights into Antioxidant Mechanisms: DFT Study of Terpenoids from Syzygium nervosum", "../public/Lecturer_Avatar/NTNU Trinh Thanh Thuat.jpg"),
      speaker-card("Dr. Xuan Thanh Nguyen", "Senior Lecturer & MSI Coordinator, VGU", "Computational Design for Hydrogen Storage and Purification Materials", "../public/Lecturer_Avatar/Thanh Nguyen Xuan.jpg")
    )
    #v(3mm)
    
    // Row 2: Germany Guest Speakers (2 columns centered)
    #align(center)[
      #block(width: 66%)[
        #grid(
          columns: (1fr, 1fr),
          gutter: 8pt,
          speaker-card("Prof. Daniel Juhre", "MSI Director, OVGU", "Gateway to Europe: Building a Global Career in Materials Science through VGU & OVGU", "../public/Lecturer_Avatar/Daniel Juhre.jpg"),
          speaker-card("Dr. Georg Hasemann", "Researcher & Lecturer, OVGU", "Forging the Future: High-Temperature Materials and the DAAD Scholar Journey in Germany", "../public/Lecturer_Avatar/Georg Hasemann.jpg")
        )
      ]
    ]
  ]
))

// 5. Detailed Timeline & Registration Card (Split Layout with Equal Heights)
#let timeline-item(time, title, desc) = grid(
  columns: (auto, 1fr),
  gutter: 6pt,
  align: top,
  [
    #place(dx: 0.5mm, dy: 1mm, circle(radius: 2pt, fill: vgu-orange))
    #v(3.8mm)
  ],
  [
    #grid(
      columns: (auto, 1fr),
      gutter: 6pt,
      align: horizon,
      text(size: 6.2pt, fill: vgu-orange, weight: "bold")[#time],
      text(size: 7.2pt, weight: "bold", fill: rgb("#0f2240"))[#title]
    )
    #v(0.6mm)
    #text(size: 5.6pt, fill: rgb("#475569"), leading: 0.46em)[#desc]
    #v(0.6mm)
  ]
)

#place(top + left, dx: 12mm, dy: 181mm, block(
  width: 186mm,
  [
    #grid(
      columns: (1.15fr, 0.85fr),
      rows: (96mm), // Set exact height for equal height alignment
      gutter: 10pt,
      
      // Column 1: Detailed Timeline Box
      rect(
        width: 100%,
        height: 100%,
        stroke: 1pt + rgb("#e2e8f0"),
        radius: 6pt,
        fill: rgb("#ffffff").lighten(60%),
        inset: (x: 8pt, y: 7pt),
        [
          #grid(
            columns: (auto, 1fr),
            gutter: 5pt,
            align: horizon,
            icon-timeline,
            text(size: 8pt, weight: "bold", fill: rgb("#0f2240"))[DETAILED TIMELINE]
          )
          #v(2mm)
          
          #timeline-item("09:00 – 12:00", "Lab Tour", "Excursion and tour of the state-of-the-art laboratory facilities at VGU Campus.")
          #timeline-item("13:00 – 13:30", "Dr. Hieu Linh Duong", "Production of Syzygium nervosum Leaf Extract Nano-Formulation.")
          #timeline-item("13:30 – 14:00", "Dr. Thanh Thuat Trinh", "DFT Study of Terpenoids from Syzygium nervosum.")
          #timeline-item("14:00 – 14:30", "Dr. Xuan Thanh Nguyen", "Computational Design for Hydrogen Storage and Purification.")
          #timeline-item("14:30 – 14:45", "Break", "Networking break & refreshments.")
          #timeline-item("14:45 – 15:15", "Prof. Daniel Juhre", "Gateway to Europe: Building a Global Career in Materials Science.")
          #timeline-item("15:15 – 15:45", "Dr. Georg Hasemann", "Forging the Future: High-Temperature Materials.")
        ]
      ),
      
      // Column 2: Join the Event Box (Registration Card)
      rect(
        width: 100%,
        height: 100%,
        stroke: 1pt + rgb("#e2e8f0"),
        radius: 6pt,
        fill: rgb("#ffffff"),
        inset: (x: 8pt, y: 7pt),
        [
          #align(center)[
            #text(size: 8pt, weight: "bold", fill: rgb("#0f2240"), tracking: 0.02em)[JOIN THE EVENT] \
            #v(1mm)
            #text(size: 5.8pt, fill: rgb("#475569"), leading: 0.48em)[Free attendance. Scan the QR code below to register your participation.]
            #v(2.2mm)
            
            // Program Highlights Box
            #rect(
              width: 100%,
              fill: light-bg,
              stroke: 0.5pt + rgb("#cbd5e1"),
              radius: 4pt,
              inset: (x: 5pt, y: 4.5pt),
              align(left)[
                #text(size: 5.5pt, weight: "bold", fill: rgb("#0f2240"))[MSI Highlights:] \
                #v(0.8mm)
                #text(size: 4.8pt, fill: rgb("#475569"), leading: 0.44em)[
                  • Joint Master Degree from VGU & OVGU \
                  • Flexible schedule for working professionals \
                  • State-of-the-art laboratory facilities \
                  • Industrial career & global PhD pathways
                ]
              ]
            )
            #v(2.2mm)
            
            // Highlighted QR Code Card
            #rect(
              stroke: 1.5pt + vgu-orange,
              radius: 4pt,
              fill: rgb("#ffffff"),
              inset: 3.5pt,
              [
                #rect(width: 20mm, height: 20mm, stroke: none, fill: rgb("#000000"), [
                  #place(top + left, dx: 0.8mm, dy: 0.8mm, rect(width: 18.4mm, height: 18.4mm, fill: rgb("#ffffff")))
                  #place(top + left, dx: 1.8mm, dy: 1.8mm, rect(width: 5.5mm, height: 5.5mm, fill: rgb("#000000")))
                  #place(top + left, dx: 2.7mm, dy: 2.7mm, rect(width: 3.7mm, height: 3.7mm, fill: rgb("#ffffff")))
                  #place(top + right, dx: -1.8mm, dy: 1.8mm, rect(width: 5.5mm, height: 5.5mm, fill: rgb("#000000")))
                  #place(top + right, dx: -2.7mm, dy: 2.7mm, rect(width: 3.7mm, height: 3.7mm, fill: rgb("#ffffff")))
                  #place(bottom + left, dx: 1.8mm, dy: -1.8mm, rect(width: 5.5mm, height: 5.5mm, fill: rgb("#000000")))
                  #place(bottom + left, dx: 2.7mm, dy: -2.7mm, rect(width: 3.7mm, height: 3.7mm, fill: rgb("#ffffff")))
                  // Center alignment and random blocks for QR pattern
                  #place(center + horizon, rect(width: 7mm, height: 7mm, stroke: none, fill: rgb("#000000")))
                ])
              ]
            )
            #v(1mm)
            #text(size: 5.2pt, weight: "black", fill: rgb("#0f2240"), tracking: 0.05em)[SCAN TO REGISTER]
            #v(2.5mm)
            
            // Inquiries Info
            #grid(
              columns: (auto, 1fr),
              gutter: 5pt,
              align: horizon,
              icon-mail,
              align(left)[
                #text(size: 5pt, fill: slate-gray, weight: "bold", tracking: 0.02em)[INQUIRIES] \
                #text(size: 5.5pt, fill: rgb("#0f2240"), weight: "bold")[msi.info\@vgu.edu.vn]
              ]
            )
            #v(3mm)
            
            // Sponsors Supported By Section
            #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))
            #v(1.5mm)
            #text(size: 5pt, fill: slate-gray, weight: "bold", tracking: 0.02em)[SUPPORTED BY:] \
            #v(1mm)
            #grid(
              columns: (auto, auto),
              gutter: 8pt,
              align: horizon,
              rect(fill: rgb("#ffffff"), radius: 2pt, inset: 2pt, stroke: 0.5pt + rgb("#cbd5e1"))[
                #image("../public/Logo/Ministry of Education and Training.jpg", height: 8mm)
              ],
              rect(fill: rgb("#ffffff"), radius: 2pt, inset: 2pt, stroke: 0.5pt + rgb("#cbd5e1"))[
                #image("../public/Logo/Research Management Department VGU.jpg", height: 8mm)
              ]
            )
          ]
        ]
      )
    )
  ]
))

// 6. Bottom Banner Strip
#place(bottom + left, dx: 0cm, dy: 0cm, block(
  width: 210mm,
  height: 8mm,
  fill: rgb("#091322"),
  [
    #place(horizon + left, dx: 12mm)[
      #rect(fill: vgu-orange, radius: 2pt, inset: (x: 5pt, y: 2pt))[
        #text(fill: rgb("#ffffff"), size: 5pt, weight: "bold", tracking: 0.02em)[MATERIALS SCIENCE (MSI) PROGRAM]
      ]
    ]
    #place(horizon + right, dx: -12mm)[
      #text(fill: rgb("#cbd5e1"), size: 5.5pt, weight: "bold", tracking: 0.02em)[GERMAN QUALITY - GLOBAL CAREERS]
    ]
  ]
))
