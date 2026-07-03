export type RoomStatus = 'Available' | 'Waitlist' | 'Coming Soon'
export type RoomGroup = 'building' | 'rooming_house'

export type RoomType = {
  name: string
  weeklyPrice: number | null
  allWeeklyPrices: number[]
  leaseTo: string
  description: string
}

export type RoomingKosOption = {
  id: string
  group: RoomGroup
  status: RoomStatus
  name: string
  displayName: string
  suburb: string
  address: string
  weeklyFrom: number | null
  availableFrom: string
  roomTypes: RoomType[]
  sourceUrl: string
  applyUrl: string
  imageUrl: string
  tags: string[]
  matchNotes: string[]
}

export const roomingKosCatalog: RoomingKosOption[] = [
  {
    "id": "177-johnston-street-fitzroy-vic-3065",
    "group": "building",
    "status": "Coming Soon",
    "name": "Johnston House",
    "displayName": "Johnston House",
    "suburb": "Fitzroy",
    "address": "177 Johnston Street, Fitzroy VIC 3065",
    "weeklyFrom": null,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://roomingkos.com.au/student-accommodation-johnston-house/",
    "applyUrl": "",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/4f/Untitled-design-2-scaled-4f884587.png",
    "tags": [
      "Building",
      "Coming Soon",
      "Fitzroy",
      "Student Professional Development"
    ],
    "matchNotes": [
      "Coming Soon option for future interest"
    ]
  },
  {
    "id": "43-marshall-ave-clayton-vic-3168",
    "group": "building",
    "status": "Available",
    "name": "Marshall Monash",
    "displayName": "Marshall Monash",
    "suburb": "Clayton",
    "address": "43 Marshall Ave, Clayton VIC 3168",
    "weeklyFrom": 550.0,
    "availableFrom": "1st July 2026",
    "roomTypes": [
      {
        "name": "Excellence Studio",
        "weeklyPrice": 650.0,
        "allWeeklyPrices": [
          650.0
        ],
        "leaseTo": "Fixed-term lease option available until 30th June 2027",
        "description": ""
      },
      {
        "name": "Focus Studio",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": ""
      },
      {
        "name": "Focus Studio \u2013 View",
        "weeklyPrice": 600.0,
        "allWeeklyPrices": [
          620.0,
          600.0
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/student-accommodation-marshall-monash/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/24D667FF/59/433/Application_Process_-Start_Or_Review_Your?themename=MARSHALL%20MONASH",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/b7/2516_RMK_43MarshallAve_V02_Hero-scaled-b73b84c1.jpg",
    "tags": [
      "Building",
      "Available",
      "Clayton",
      "Student Accommodation Building",
      "Studio"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $550/wk based on public listing data",
      "3 priced room types in the public extract"
    ]
  },
  {
    "id": "roomingkos-dudley",
    "group": "building",
    "status": "Available",
    "name": "RoomingKos Dudley",
    "displayName": "RoomingKos Dudley",
    "suburb": "",
    "address": "",
    "weeklyFrom": 300.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Large Ensuite",
        "weeklyPrice": 391.23,
        "allWeeklyPrices": [
          391.23,
          414.25,
          391.23
        ],
        "leaseTo": "Fixed-term lease options available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "One Bedroom Apartment",
        "weeklyPrice": 600.0,
        "allWeeklyPrices": [
          600.0,
          600.0
        ],
        "leaseTo": "Fixed-term lease options available until 30th of June 2027",
        "description": ""
      },
      {
        "name": "Small Ensuite",
        "weeklyPrice": 300.0,
        "allWeeklyPrices": [
          300.0,
          322.19,
          300.0
        ],
        "leaseTo": "Fixed-term lease options available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "Standard Ensuite",
        "weeklyPrice": 368.22,
        "allWeeklyPrices": [
          368.22,
          391.23,
          368.22
        ],
        "leaseTo": "Fixed-term lease options available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "Two Bedroom Apartment",
        "weeklyPrice": 750.0,
        "allWeeklyPrices": [
          750.0,
          750.0
        ],
        "leaseTo": "Fixed-term lease options available until 30th of June 2027",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/student-accommodation-dudley/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/Dudley/ADD4B13E/26/215/Application_Process_-Start_Or_Review_Your?HadEmptyContext=True",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/RoomingKos-Small-Room-.jpg",
    "tags": [
      "Building",
      "Available",
      "Student Accommodation Building",
      "Private bathroom"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $300/wk based on public listing data",
      "5 priced room types in the public extract"
    ]
  },
  {
    "id": "roomingkos-swanston",
    "group": "building",
    "status": "Available",
    "name": "RoomingKos Swanston",
    "displayName": "RoomingKos Swanston",
    "suburb": "",
    "address": "",
    "weeklyFrom": 299.18,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Studio Deluxe",
        "weeklyPrice": 392.0,
        "allWeeklyPrices": [
          392.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027.",
        "description": ""
      },
      {
        "name": "Studio Double",
        "weeklyPrice": 392.0,
        "allWeeklyPrices": [
          392.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027.",
        "description": ""
      },
      {
        "name": "Studio Single",
        "weeklyPrice": 299.18,
        "allWeeklyPrices": [
          299.18
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027.",
        "description": ""
      },
      {
        "name": "Studio Single Plus",
        "weeklyPrice": 322.19,
        "allWeeklyPrices": [
          322.19
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027.",
        "description": ""
      },
      {
        "name": "Studio Twin",
        "weeklyPrice": 392.0,
        "allWeeklyPrices": [
          392.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027.",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/student-accommodation-swanston/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=Swanston",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC05160-1.webp",
    "tags": [
      "Building",
      "Available",
      "Student Accommodation Building",
      "Studio",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $299.18/wk based on public listing data",
      "5 priced room types in the public extract"
    ]
  },
  {
    "id": "spire-by-roomingkos",
    "group": "building",
    "status": "Available",
    "name": "SPIRE by RoomingKos",
    "displayName": "SPIRE by RoomingKos",
    "suburb": "",
    "address": "",
    "weeklyFrom": 523.56,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Ascent Studio",
        "weeklyPrice": 588.38,
        "allWeeklyPrices": [
          588.38,
          588.38
        ],
        "leaseTo": "Fixed-term lease options available until 30th June 2027",
        "description": "Bills Included Fridge Induction Stove Microwave Unlimited Wifi Air Conditioning Keyless Entry Ensuite Bathroom Large Windows Study Desk"
      },
      {
        "name": "Ascent Studio (View)",
        "weeklyPrice": 698.08,
        "allWeeklyPrices": [
          698.08,
          698.08
        ],
        "leaseTo": "Fixed-term lease options available until 30th June 2027",
        "description": "Bills Included Fridge Induction Stove Microwave Unlimited Wifi Air Conditioning Keyless Entry Ensuite Bathroom Large Windows Study Desk"
      },
      {
        "name": "Horizon Studio",
        "weeklyPrice": 523.56,
        "allWeeklyPrices": [
          523.56,
          550.0,
          523.56
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": "Bills Included Fridge Induction Stove Microwave Unlimited Wifi Air Conditioning Keyless Entry Ensuite Bathroom Large Windows Study Desk"
      },
      {
        "name": "Horizon Studio (View)",
        "weeklyPrice": 548.49,
        "allWeeklyPrices": [
          548.49,
          575.0,
          548.49
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": "Bills Included Fridge Induction Stove Microwave Unlimited Wifi Air Conditioning Keyless Entry Ensuite Bathroom Large Windows Study Desk"
      },
      {
        "name": "Tandem Double",
        "weeklyPrice": 638.25,
        "allWeeklyPrices": [
          663.25,
          663.25,
          638.25
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": "Bills Included Fridge Induction Stove Microwave Unlimited Wifi Air Conditioning Keyless Entry Ensuite Bathroom Large Windows Study Desk"
      },
      {
        "name": "Tandem Twin",
        "weeklyPrice": 673.15,
        "allWeeklyPrices": [
          673.15,
          700.0,
          673.15
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": "Bills Included Fridge Induction Stove Microwave Unlimited Wifi Air Conditioning Keyless Entry Ensuite Bathroom Large Windows Study Desk"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/student-accommodation-spire-apartments/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=SPIRE",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00016_web-2.jpg",
    "tags": [
      "Building",
      "Available",
      "Student Accommodation Building",
      "Study-focused",
      "Work from home",
      "Wifi",
      "Private bathroom",
      "Bills included",
      "Air conditioning",
      "Studio",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $523.56/wk based on public listing data",
      "6 priced room types in the public extract"
    ]
  },
  {
    "id": "spire-apartments",
    "group": "building",
    "status": "Waitlist",
    "name": "Spire Apartments",
    "displayName": "Spire Apartments",
    "suburb": "",
    "address": "",
    "weeklyFrom": 525.0,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://www.spireliving.com.au/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=SPIRE",
    "imageUrl": "https://cdn.prod.website-files.com/67f3098d43f44cc07e82337c/682e596c2fff8cc76cd951aa_Spire-Hero.jpg",
    "tags": [
      "Building",
      "Waitlist",
      "Spire Official Site"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $525/wk based on public listing data"
    ]
  },
  {
    "id": "38-44-nicholson-st-fitzroy-vic-3065",
    "group": "building",
    "status": "Coming Soon",
    "name": "Stay Nicholson",
    "displayName": "Stay Nicholson",
    "suburb": "Nicholson St Fitzroy",
    "address": "38 \u2013 44 Nicholson St Fitzroy, VIC 3065",
    "weeklyFrom": null,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://roomingkos.com.au/rooming-house-stay-nicholson/",
    "applyUrl": "",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/89/Swanston-St-Lifestyle-47-WR-89a5eb30.jpg",
    "tags": [
      "Building",
      "Coming Soon",
      "Nicholson St Fitzroy",
      "Student Professional Development"
    ],
    "matchNotes": [
      "Coming Soon option for future interest"
    ]
  },
  {
    "id": "25-beddoe-ave-clayton-vic-3168",
    "group": "building",
    "status": "Available",
    "name": "Student Sanctuary - Acacia",
    "displayName": "Student Sanctuary - Acacia",
    "suburb": "Clayton",
    "address": "25 Beddoe Ave, Clayton VIC 3168",
    "weeklyFrom": 540.0,
    "availableFrom": "15 August 2026",
    "roomTypes": [
      {
        "name": "Dawn Studio (Limited Stock)",
        "weeklyPrice": 540.0,
        "allWeeklyPrices": [
          560.0,
          540.0
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": ""
      },
      {
        "name": "Daylight Studio",
        "weeklyPrice": 560.0,
        "allWeeklyPrices": [
          580.0,
          560.0
        ],
        "leaseTo": "Fixed-term lease options available until 31st January 2027 or 30th June 2027",
        "description": ""
      },
      {
        "name": "Horizon Studio (Limited Stock)",
        "weeklyPrice": 700.0,
        "allWeeklyPrices": [
          700.0
        ],
        "leaseTo": "Fixed-term lease option available until 30th June 2027",
        "description": "Clayton is where uni life actually happens. Mornings start with coffee and classes, afternoons blend into study sessions and food breaks, and evenings slow down just enough to reset. It\u2019s a neighbourhood shaped by students, easy-going, lived-in, and perfectly balanced between busy uni days and quiet moments to recharge. Living in Clayton means studying right where uni life happens. Being near Monash Clayton makes it easier to move between classes, study sessions, and daily routines, so your focus stays on uni, not the commute."
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/student-accommodation-acacia/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/0D3CD3D6/69/508/Application_Process_-Start_Or_Review_Your?themename=25%20Beddoe%20Avenue",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/WhatsApp-Image-2026-03-26-at-13.41.44-1.jpeg",
    "tags": [
      "Building",
      "Available",
      "Clayton",
      "Student Accommodation Building",
      "Study-focused",
      "Studio"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $540/wk based on public listing data",
      "3 priced room types in the public extract"
    ]
  },
  {
    "id": "1-james-parade-malvern-east-vic-3145",
    "group": "rooming_house",
    "status": "Available",
    "name": "1 James Parade, Malvern East VIC 3145",
    "displayName": "1 James Parade, Malvern East VIC 3145",
    "suburb": "Malvern East",
    "address": "1 James Parade, Malvern East VIC 3145",
    "weeklyFrom": 300.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 420.0,
        "allWeeklyPrices": [
          440.0,
          420.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 300.0,
        "allWeeklyPrices": [
          320.0,
          300.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 370.0,
        "allWeeklyPrices": [
          390.0,
          370.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/1-james-parade-malvern-east/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=1%20James",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/1-James-Pde-16-WR.jpeg",
    "tags": [
      "Rooming house property",
      "Available",
      "Malvern East",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $300/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "1-100-wellington-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "1/100 Wellington Road, Clayton VIC 3168",
    "displayName": "1/100 Wellington Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "1/100 Wellington Road, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          430.0,
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/1-100-wellington-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/U1100%20Wellington/61DE6B42/6/7/Register-Register",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00670_final.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "1 priced room type in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "1-22-collins-street-chadstone-vic-3148",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "1/22 Collins Street, Chadstone VIC 3148",
    "displayName": "1/22 Collins Street, Chadstone VIC 3148",
    "suburb": "Chadstone",
    "address": "1/22 Collins Street, Chadstone VIC 3148",
    "weeklyFrom": 320.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 360.0,
        "allWeeklyPrices": [
          360.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "Single Room",
        "weeklyPrice": 320.0,
        "allWeeklyPrices": [
          320.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 420.0,
        "allWeeklyPrices": [
          420.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/1-22-collins-street-chadstone/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=U1%2022%20Collins%20Street",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/1.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Chadstone",
      "Rooming House Property",
      "Private bathroom",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $320/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "1-85-kanooka-grove-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Available",
    "name": "1/85 Kanooka Grove, Clayton VIC 3168",
    "displayName": "1/85 Kanooka Grove, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "1/85 Kanooka Grove, Clayton VIC 3168",
    "weeklyFrom": 350.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 370.0,
        "allWeeklyPrices": [
          390.0,
          370.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/1-85-kanooka-grove-clayton-vic-3168/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=1%2F85%20Kanooka%20Grove",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00032_Final_VS_web.jpg",
    "tags": [
      "Rooming house property",
      "Available",
      "Clayton",
      "Rooming House Property",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $350/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "1-9-risdon-drive-notting-hill-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "1/9 Risdon Drive, Notting Hill VIC 3168",
    "displayName": "1/9 Risdon Drive, Notting Hill VIC 3168",
    "suburb": "Notting Hill",
    "address": "1/9 Risdon Drive, Notting Hill VIC 3168",
    "weeklyFrom": 320.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 320.0,
        "allWeeklyPrices": [
          340.0,
          320.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/1-9-risdon-drive-notting-hill/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=1%2F9%20Risdon",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/9-Risdon-Dr-8-PR.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Notting Hill",
      "Rooming House Property",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $320/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "10-auguste-avenue-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "10 Auguste Avenue, Clayton VIC 3168",
    "displayName": "10 Auguste Avenue, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "10 Auguste Avenue, Clayton VIC 3168",
    "weeklyFrom": 350.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 460.0,
        "allWeeklyPrices": [
          480.0,
          460.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/10-auguste-avenue-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=10%20Auguste%20Avenue",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/1-1.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $350/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "103-monash-drive-mulgrave-vic-3170",
    "group": "rooming_house",
    "status": "Coming Soon",
    "name": "103 Monash Drive, Mulgrave VIC 3170",
    "displayName": "103 Monash Drive, Mulgrave VIC 3170",
    "suburb": "Mulgrave",
    "address": "103 Monash Drive, Mulgrave VIC 3170",
    "weeklyFrom": null,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://roomingkos.com.au/properties/5170/",
    "applyUrl": "",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/0b/PriceGood_White_ICN-0bf2fc2c.png",
    "tags": [
      "Rooming house property",
      "Coming Soon",
      "Mulgrave",
      "Rooming House Property"
    ],
    "matchNotes": [
      "Coming Soon option for future interest",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "15-kings-court-oakleigh-east-vic-3166",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "15 Kings Court, Oakleigh East VIC 3166",
    "displayName": "15 Kings Court, Oakleigh East VIC 3166",
    "suburb": "Oakleigh East",
    "address": "15 Kings Court, Oakleigh East VIC 3166",
    "weeklyFrom": 390.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 390.0,
        "allWeeklyPrices": [
          410.0,
          390.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 450.0,
        "allWeeklyPrices": [
          480.0,
          450.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/15-kings-court/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/0065BBE4/6/7/Register-Register?themename=15%20Kings%20Court&EntryID=-1&ContactID=-1",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00091_web-2.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Oakleigh East",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $390/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "18-marshall-avenue-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "18 Marshall Avenue, Clayton VIC 3168",
    "displayName": "18 Marshall Avenue, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "18 Marshall Avenue, Clayton VIC 3168",
    "weeklyFrom": 330.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 330.0,
        "allWeeklyPrices": [
          350.0,
          330.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/18-marshall-avenue-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/0065BBE4/6/7/Register-Register?themename=18%20Marshall%20Avenue&EntryID=-1&ContactID=-1",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00094_web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $330/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "18-waverley-road-chadstone-vic-3148",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "18 Waverley Road, Chadstone VIC 3148",
    "displayName": "18 Waverley Road, Chadstone VIC 3148",
    "suburb": "Chadstone",
    "address": "18 Waverley Road, Chadstone VIC 3148",
    "weeklyFrom": 300.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 320.0,
        "allWeeklyPrices": [
          340.0,
          320.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 300.0,
        "allWeeklyPrices": [
          320.0,
          300.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room",
        "weeklyPrice": 400.0,
        "allWeeklyPrices": [
          400.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/18-waverley-road-chadstone-vic-3148/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/0065BBE4/6/7/Register-Register?themename=18%20Waverley%20Road&EntryID=-1&ContactID=-1",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00104_web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Chadstone",
      "Rooming House Property",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $300/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "1955-dandenong-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "1955 Dandenong Road, Clayton VIC 3168",
    "displayName": "1955 Dandenong Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "1955 Dandenong Road, Clayton VIC 3168",
    "weeklyFrom": 320.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Large Double Room",
        "weeklyPrice": 400.0,
        "allWeeklyPrices": [
          415.0,
          400.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 320.0,
        "allWeeklyPrices": [
          340.0,
          320.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/1955-dandenong-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=1955%20Dandenong%20Avenue",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/ROOM-5-1.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $320/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "2-10-binalong-ave-chadstone-vic-3148",
    "group": "rooming_house",
    "status": "Available",
    "name": "2/10 Binalong Ave, Chadstone VIC 3148",
    "displayName": "2/10 Binalong Ave, Chadstone VIC 3148",
    "suburb": "Chadstone",
    "address": "2/10 Binalong Ave, Chadstone VIC 3148",
    "weeklyFrom": 300.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room With Ensuite",
        "weeklyPrice": 300.0,
        "allWeeklyPrices": [
          320.0,
          300.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 380.0,
        "allWeeklyPrices": [
          400.0,
          380.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Double",
        "weeklyPrice": 400.0,
        "allWeeklyPrices": [
          420.0,
          400.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/2-10-binalong-ave/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/Unit%202%2010%20Binalong%20Avenue/61DE6B42/6/7/Register-Register",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00189_final_Web.jpg",
    "tags": [
      "Rooming house property",
      "Available",
      "Chadstone",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $300/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "2-100-wellington-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "2/100 Wellington Road, Clayton VIC 3168",
    "displayName": "2/100 Wellington Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "2/100 Wellington Road, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/2-100-wellington-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/U2100%20Wellington/61DE6B42/6/7/Register-Register",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00608_final.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "1 priced room type in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "20-renver-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "20 Renver Road, Clayton VIC 3168",
    "displayName": "20 Renver Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "20 Renver Road, Clayton VIC 3168",
    "weeklyFrom": 330.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 400.0,
        "allWeeklyPrices": [
          420.0,
          400.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Private Studio",
        "weeklyPrice": 500.0,
        "allWeeklyPrices": [
          500.0,
          520.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 330.0,
        "allWeeklyPrices": [
          350.0,
          330.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/20-renver-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=20%20Renver%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00013_Web-2.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $330/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "2017-dandenong-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "2017 Dandenong Road, Clayton VIC 3168",
    "displayName": "2017 Dandenong Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "2017 Dandenong Road, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Double",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/2017-dandenong-road-clayton-vic-3168/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=2017%20Dandenong%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00260_web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "21-murdo-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Coming Soon",
    "name": "21 Murdo Road, Clayton VIC 3168",
    "displayName": "21 Murdo Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "21 Murdo Road, Clayton VIC 3168",
    "weeklyFrom": null,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://roomingkos.com.au/properties/21-murdo-road/",
    "applyUrl": "",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/0b/PriceGood_White_ICN-0bf2fc2c.png",
    "tags": [
      "Rooming house property",
      "Coming Soon",
      "Clayton",
      "Rooming House Property"
    ],
    "matchNotes": [
      "Coming Soon option for future interest",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "23-mountfield-ave-malvern-east-vic-3145",
    "group": "rooming_house",
    "status": "Available",
    "name": "23 Mountfield Ave, Malvern East VIC 3145",
    "displayName": "23 Mountfield Ave, Malvern East VIC 3145",
    "suburb": "Malvern East",
    "address": "23 Mountfield Ave, Malvern East VIC 3145",
    "weeklyFrom": 280.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 400.0,
        "allWeeklyPrices": [
          420.0,
          400.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 280.0,
        "allWeeklyPrices": [
          300.0,
          280.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 380.0,
        "allWeeklyPrices": [
          400.0,
          380.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/23-mountfield-avenue-malvern-east/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=23%20Mountfield%20Avenue",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/RK_MOUNTFIELD_Room-3.jpg",
    "tags": [
      "Rooming house property",
      "Available",
      "Malvern East",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $280/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "23-murdo-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Coming Soon",
    "name": "23 Murdo Road, Clayton VIC 3168",
    "displayName": "23 Murdo Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "23 Murdo Road, Clayton VIC 3168",
    "weeklyFrom": null,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://roomingkos.com.au/properties/23-murdo-road-clayton/",
    "applyUrl": "",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/0b/PriceGood_White_ICN-0bf2fc2c.png",
    "tags": [
      "Rooming house property",
      "Coming Soon",
      "Clayton",
      "Rooming House Property"
    ],
    "matchNotes": [
      "Coming Soon option for future interest",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "24-prince-charles-street-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "24 Prince Charles Street, Clayton VIC 3168",
    "displayName": "24 Prince Charles Street, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "24 Prince Charles Street, Clayton VIC 3168",
    "weeklyFrom": 350.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 410.0,
        "allWeeklyPrices": [
          430.0,
          410.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 390.0,
        "allWeeklyPrices": [
          410.0,
          390.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/24-prince-charles-street-clayton-vic-3168/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/24%20Prince%20Charles%20Street/0065BBE4/6/7/Register-Register?EntryID=-1&ContactID=-1",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/Room4_DSC00063_web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $350/wk based on public listing data",
      "4 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "25-murdo-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Coming Soon",
    "name": "25 Murdo Road, Clayton VIC 3168",
    "displayName": "25 Murdo Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "25 Murdo Road, Clayton VIC 3168",
    "weeklyFrom": null,
    "availableFrom": "",
    "roomTypes": [],
    "sourceUrl": "https://roomingkos.com.au/properties/25-murdo-road-clayton/",
    "applyUrl": "",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/yootheme/cache/0b/PriceGood_White_ICN-0bf2fc2c.png",
    "tags": [
      "Rooming house property",
      "Coming Soon",
      "Clayton",
      "Rooming House Property"
    ],
    "matchNotes": [
      "Coming Soon option for future interest",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "38-dennis-street-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "38 Dennis Street, Clayton VIC 3168",
    "displayName": "38 Dennis Street, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "38 Dennis Street, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Double Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Twin Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/38-dennis-street-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=38%20Dennis%20Street",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC09383_final.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "4 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "39-beddoe-avenue-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "39 Beddoe Avenue, Clayton VIC 3168",
    "displayName": "39 Beddoe Avenue, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "39 Beddoe Avenue, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Double Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Twin Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Ensuite Room",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/39-beddoe-avenue-clayton-vic-3168/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=39%20Beddoe%20Avenue",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00001_room-1-web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "4 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "44-batesford-road-malvern-east-vic-3145",
    "group": "rooming_house",
    "status": "Available",
    "name": "44 Batesford Road, Malvern East VIC 3145",
    "displayName": "44 Batesford Road, Malvern East VIC 3145",
    "suburb": "Malvern East",
    "address": "44 Batesford Road, Malvern East VIC 3145",
    "weeklyFrom": 280.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Double Room Ensuite +",
        "weeklyPrice": 400.0,
        "allWeeklyPrices": [
          420.0,
          400.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 280.0,
        "allWeeklyPrices": [
          300.0,
          280.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Ensuite Room",
        "weeklyPrice": 500.0,
        "allWeeklyPrices": [
          520.0,
          500.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room",
        "weeklyPrice": 360.0,
        "allWeeklyPrices": [
          380.0,
          360.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room with Kitchen & Bathroom",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/44-batesford-road-malvern-east/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=44%20Batesford%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/1-3.jpg",
    "tags": [
      "Rooming house property",
      "Available",
      "Malvern East",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $280/wk based on public listing data",
      "6 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "49-beddoe-avenue-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "49 Beddoe Avenue, Clayton VIC 3168",
    "displayName": "49 Beddoe Avenue, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "49 Beddoe Avenue, Clayton VIC 3168",
    "weeklyFrom": 370.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 370.0,
        "allWeeklyPrices": [
          390.0,
          370.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          445.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/49-beddoe-avenue/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/49%20Beddoe%20Avenue/0065BBE4/6/7/Register-Register?EntryID=-1&ContactID=-1",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00728_ROOM-2_final.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $370/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "6-archibald-street-box-hill-vic-3171",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "6 Archibald Street, Box Hill VIC 3171",
    "displayName": "6 Archibald Street, Box Hill VIC 3171",
    "suburb": "Box Hill",
    "address": "6 Archibald Street, Box Hill VIC 3171",
    "weeklyFrom": 230.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 260.0,
        "allWeeklyPrices": [
          260.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "Single Room",
        "weeklyPrice": 230.0,
        "allWeeklyPrices": [
          230.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/6-archibald-street-box-hill/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=6%20Archibald",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC02729_1.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Box Hill",
      "Rooming House Property",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $230/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "622-warrigal-road-malvern-east-vic-3145",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "622 Warrigal Road, Malvern East VIC 3145",
    "displayName": "622 Warrigal Road, Malvern East VIC 3145",
    "suburb": "Malvern East",
    "address": "622 Warrigal Road, Malvern East VIC 3145",
    "weeklyFrom": 300.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room",
        "weeklyPrice": 330.0,
        "allWeeklyPrices": [
          350.0,
          330.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room",
        "weeklyPrice": 300.0,
        "allWeeklyPrices": [
          320.0,
          300.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/622-warrigal-road-malvern-east/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=622%20Warrigal",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/Warrigal-Rd-2-WR.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Malvern East",
      "Rooming House Property",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $300/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "67-alderford-drive-wantirna-vic-3152",
    "group": "rooming_house",
    "status": "Available",
    "name": "67 Alderford Drive, Wantirna VIC 3152",
    "displayName": "67 Alderford Drive, Wantirna VIC 3152",
    "suburb": "Wantirna",
    "address": "67 Alderford Drive, Wantirna VIC 3152",
    "weeklyFrom": 320.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Double Room | Separate Bathroom",
        "weeklyPrice": 330.0,
        "allWeeklyPrices": [
          350.0,
          330.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Ensuite Room",
        "weeklyPrice": 320.0,
        "allWeeklyPrices": [
          340.0,
          320.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/67-alderford-drive-wantirna/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/67AlderfordWay/C5CD5C62/6/7/Register-Register?UrlToken=23FD9FDE&ReturnUrl=%2FStarRezPortalX%2F67AlderfordWay%2F1D1F3C00%2F1%2F1%2FHome-Home%3FUrlToken%3D23FD9FDE",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/Room-5_final_web_quality.jpg",
    "tags": [
      "Rooming house property",
      "Available",
      "Wantirna",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $320/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "73-kambrook-road-caulfield-north-vic-3161",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "73 Kambrook Road, Caulfield North VIC 3161",
    "displayName": "73 Kambrook Road, Caulfield North VIC 3161",
    "suburb": "Caulfield North",
    "address": "73 Kambrook Road, Caulfield North VIC 3161",
    "weeklyFrom": 420.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 420.0,
        "allWeeklyPrices": [
          440.0,
          420.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 470.0,
        "allWeeklyPrices": [
          490.0,
          470.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Studio Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/73-kambrook-road-caulfield-north/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=73%20Kambrook",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/73-Kambrook_Room-1-1_final-scaled.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Caulfield North",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $420/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "74-railway-parade-south-chadstone-vic-3148",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "74 Railway Parade South, Chadstone VIC 3148",
    "displayName": "74 Railway Parade South, Chadstone VIC 3148",
    "suburb": "Chadstone",
    "address": "74 Railway Parade South, Chadstone VIC 3148",
    "weeklyFrom": 350.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 380.0,
        "allWeeklyPrices": [
          400.0,
          380.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Double Room | Separate Bathroom",
        "weeklyPrice": 370.0,
        "allWeeklyPrices": [
          390.0,
          370.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 350.0,
        "allWeeklyPrices": [
          370.0,
          350.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/74-railway-parade-south-chadstone/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/74%20Railway%20Parade/61DE6B42/6/7/Register-Register",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC00031_final_web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Chadstone",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $350/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "842-blackburn-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "842 Blackburn Road, Clayton VIC 3168",
    "displayName": "842 Blackburn Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "842 Blackburn Road, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/842-blackburn-road-clayton-2/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=842%20Blackburn%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/Room-1-1.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "844-blackburn-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "844 Blackburn Road, Clayton VIC 3168",
    "displayName": "844 Blackburn Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "844 Blackburn Road, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Double Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          550.0,
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": ""
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/844-blackburn-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=844%20Blackburn%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/844-Blackburn_Room-8-1_final-scaled.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "846-blackburn-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Available",
    "name": "846 Blackburn Road, Clayton VIC 3168",
    "displayName": "846 Blackburn Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "846 Blackburn Road, Clayton VIC 3168",
    "weeklyFrom": 410.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 410.0,
        "allWeeklyPrices": [
          430.0,
          410.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/846-blackburn-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=846%20Blackburn%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/1-2.jpg",
    "tags": [
      "Rooming house property",
      "Available",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Currently marked Available in the public RoomingKos catalog",
      "From $410/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "848-blackburn-road-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "848 Blackburn Road, Clayton VIC 3168",
    "displayName": "848 Blackburn Road, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "848 Blackburn Road, Clayton VIC 3168",
    "weeklyFrom": 430.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Studio Twin Ensuite",
        "weeklyPrice": 550.0,
        "allWeeklyPrices": [
          570.0,
          550.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 480.0,
        "allWeeklyPrices": [
          500.0,
          480.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/848-blackburn-road-clayton/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=848%20Blackburn%20Road",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/DSC01132_final_Web.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Studio",
      "Single room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $430/wk based on public listing data",
      "3 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "88-argyll-street-malvern-east-vic-3145",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "88 Argyll Street, Malvern East VIC 3145",
    "displayName": "88 Argyll Street, Malvern East VIC 3145",
    "suburb": "Malvern East",
    "address": "88 Argyll Street, Malvern East VIC 3145",
    "weeklyFrom": 380.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 380.0,
        "allWeeklyPrices": [
          400.0,
          380.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Twin Room Ensuite",
        "weeklyPrice": 450.0,
        "allWeeklyPrices": [
          480.0,
          450.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/88-argyll-street-malvern-east/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/61DE6B42/6/7/Register-Register?themename=88%20Argyll",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/88-Argyll-St-2-WR.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Malvern East",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $380/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  },
  {
    "id": "unit-2-13-thompson-street-clayton-vic-3168",
    "group": "rooming_house",
    "status": "Waitlist",
    "name": "Unit 2/13 Thompson Street, Clayton VIC 3168",
    "displayName": "Unit 2/13 Thompson Street, Clayton VIC 3168",
    "suburb": "Clayton",
    "address": "Unit 2/13 Thompson Street, Clayton VIC 3168",
    "weeklyFrom": 390.0,
    "availableFrom": "",
    "roomTypes": [
      {
        "name": "Double Room Ensuite",
        "weeklyPrice": 430.0,
        "allWeeklyPrices": [
          450.0,
          430.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      },
      {
        "name": "Single Room Ensuite",
        "weeklyPrice": 390.0,
        "allWeeklyPrices": [
          410.0,
          390.0
        ],
        "leaseTo": "Fixed term lease option available until 31st of January 2027 or 30th of June 2027",
        "description": "All bills and utilities included"
      }
    ],
    "sourceUrl": "https://roomingkos.com.au/properties/unit-2-13-thompson-street/",
    "applyUrl": "https://roomkos.starrezhousing.com/StarRezPortalX/U2%2013%20Thompson%20Street/0065BBE4/6/7/Register-Register?EntryID=-1&ContactID=-1",
    "imageUrl": "https://roomingkos.com.au/wp-content/uploads/2_13ThompsonSt039-scaled.jpg",
    "tags": [
      "Rooming house property",
      "Waitlist",
      "Clayton",
      "Rooming House Property",
      "Private bathroom",
      "Bills included",
      "Single room",
      "Double room"
    ],
    "matchNotes": [
      "Waitlist option for staff follow-up",
      "From $390/wk based on public listing data",
      "2 priced room types in the public extract",
      "Individual rooming house property, not a grouped building card"
    ]
  }
]
