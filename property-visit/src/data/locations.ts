// Pakistan location hierarchy: Province → City → Area → Society → Block.

export interface Society {
  name: string;
  blocks: string[];
}

export interface Area {
  name: string;
  societies: Society[];
}

export interface City {
  slug: string;
  name: string;
  areas: Area[];
}

export interface Province {
  slug: string;
  name: string;
  cities: City[];
}

export const PROVINCES: Province[] = [
  {
    slug: "sindh",
    name: "Sindh",
    cities: [
      {
        slug: "karachi",
        name: "Karachi",
        areas: [
          { name: "DHA Defence", societies: [{ name: "DHA Karachi", blocks: ["Phase 5", "Phase 6", "Phase 8"] }] },
          { name: "Clifton", societies: [{ name: "Clifton", blocks: ["Block 2", "Block 5", "Block 9"] }] },
          {
            name: "Bahria Town Karachi",
            societies: [{ name: "Bahria Town Karachi", blocks: ["Precinct 1", "Precinct 10", "Precinct 27"] }],
          },
          { name: "Tariq Road", societies: [{ name: "PECHS", blocks: ["Block 2", "Block 6"] }] },
          { name: "Gulshan-e-Iqbal", societies: [{ name: "Gulshan-e-Iqbal", blocks: ["Block 6", "Block 13-D"] }] },
        ],
      },
      {
        slug: "hyderabad",
        name: "Hyderabad",
        areas: [
          { name: "Qasimabad", societies: [{ name: "Qasimabad", blocks: ["Phase 1", "Phase 2"] }] },
          { name: "Latifabad", societies: [{ name: "Latifabad", blocks: ["Unit 6", "Unit 8"] }] },
        ],
      },
      {
        slug: "sukkur",
        name: "Sukkur",
        areas: [{ name: "Military Road", societies: [{ name: "Sukkur Housing", blocks: ["Block A"] }] }],
      },
    ],
  },
  {
    slug: "punjab",
    name: "Punjab",
    cities: [
      {
        slug: "lahore",
        name: "Lahore",
        areas: [
          { name: "DHA Defence", societies: [{ name: "DHA Lahore", blocks: ["Phase 5", "Phase 6", "Phase 8"] }] },
          { name: "Gulberg", societies: [{ name: "Gulberg", blocks: ["Gulberg II", "Gulberg III"] }] },
          { name: "Raiwind Road", societies: [{ name: "Lake City", blocks: ["Sector M-3", "Sector M-7"] }] },
          { name: "Johar Town", societies: [{ name: "Johar Town", blocks: ["Phase 1", "Phase 2"] }] },
          { name: "Bahria Town Lahore", societies: [{ name: "Bahria Town Lahore", blocks: ["Sector C", "Sector E"] }] },
        ],
      },
      {
        slug: "rawalpindi",
        name: "Rawalpindi",
        areas: [
          {
            name: "Bahria Town Rawalpindi",
            societies: [{ name: "Bahria Town", blocks: ["Phase 7", "Phase 8"] }],
          },
          { name: "Saddar", societies: [{ name: "Saddar", blocks: ["Bank Road"] }] },
        ],
      },
      {
        slug: "faisalabad",
        name: "Faisalabad",
        areas: [
          { name: "Sargodha Road", societies: [{ name: "Industrial Estate", blocks: ["Zone A", "Zone B"] }] },
          { name: "Canal Road", societies: [{ name: "Citi Housing", blocks: ["Block A", "Block C"] }] },
        ],
      },
      {
        slug: "multan",
        name: "Multan",
        areas: [
          { name: "Wapda Town", societies: [{ name: "Wapda Town", blocks: ["Phase 1", "Phase 2"] }] },
          { name: "Bosan Road", societies: [{ name: "Gulgasht Colony", blocks: ["Block A"] }] },
        ],
      },
    ],
  },
  {
    slug: "islamabad",
    name: "Islamabad Capital Territory",
    cities: [
      {
        slug: "islamabad",
        name: "Islamabad",
        areas: [
          { name: "DHA Islamabad", societies: [{ name: "DHA Islamabad", blocks: ["Phase 2", "Phase 5"] }] },
          { name: "Blue Area", societies: [{ name: "Jinnah Avenue", blocks: ["F-6", "G-7"] }] },
          { name: "Park Road", societies: [{ name: "Park Road Farms", blocks: ["Chak Shahzad"] }] },
          { name: "E-11", societies: [{ name: "E-11", blocks: ["E-11/2", "E-11/3"] }] },
        ],
      },
    ],
  },
  {
    slug: "kpk",
    name: "Khyber Pakhtunkhwa",
    cities: [
      {
        slug: "peshawar",
        name: "Peshawar",
        areas: [
          { name: "Hayatabad", societies: [{ name: "Hayatabad", blocks: ["Phase 5", "Phase 6"] }] },
          { name: "University Town", societies: [{ name: "University Town", blocks: ["Block A"] }] },
        ],
      },
      {
        slug: "abbottabad",
        name: "Abbottabad",
        areas: [{ name: "Jinnahabad", societies: [{ name: "Jinnahabad", blocks: ["Block 1"] }] }],
      },
    ],
  },
  {
    slug: "balochistan",
    name: "Balochistan",
    cities: [
      {
        slug: "quetta",
        name: "Quetta",
        areas: [
          { name: "Jinnah Town", societies: [{ name: "Jinnah Town", blocks: ["Block 1", "Block 2"] }] },
          { name: "Samungli Road", societies: [{ name: "Samungli Housing", blocks: ["Block A"] }] },
        ],
      },
      {
        slug: "gwadar",
        name: "Gwadar",
        areas: [{ name: "Marine Drive", societies: [{ name: "Marine Drive", blocks: ["Sector 1"] }] }],
      },
    ],
  },
  {
    slug: "gilgit-baltistan",
    name: "Gilgit-Baltistan",
    cities: [
      {
        slug: "gilgit",
        name: "Gilgit",
        areas: [{ name: "Jutial", societies: [{ name: "Jutial", blocks: ["Block A"] }] }],
      },
      {
        slug: "skardu",
        name: "Skardu",
        areas: [{ name: "Satpara Road", societies: [{ name: "Satpara", blocks: ["Block 1"] }] }],
      },
    ],
  },
  {
    slug: "azad-kashmir",
    name: "Azad Kashmir",
    cities: [
      {
        slug: "muzaffarabad",
        name: "Muzaffarabad",
        areas: [{ name: "Upper Chattar", societies: [{ name: "Chattar Housing", blocks: ["Block A"] }] }],
      },
      {
        slug: "mirpur",
        name: "Mirpur",
        areas: [{ name: "Sector F-1", societies: [{ name: "Mirpur Sector F", blocks: ["F-1", "F-2"] }] }],
      },
    ],
  },
];

export const POPULAR_CITY_SLUGS = [
  "karachi",
  "lahore",
  "islamabad",
  "rawalpindi",
  "hyderabad",
  "faisalabad",
  "multan",
  "peshawar",
  "quetta",
] as const;

export const ALL_CITIES: (City & { province: Province })[] = PROVINCES.flatMap((p) =>
  p.cities.map((c) => ({ ...c, province: p })),
);

export function findCity(slug: string | undefined) {
  if (!slug) return undefined;
  return ALL_CITIES.find((c) => c.slug === slug);
}

export function citiesForProvince(provinceSlug: string | undefined) {
  if (!provinceSlug) return ALL_CITIES;
  return ALL_CITIES.filter((c) => c.province.slug === provinceSlug);
}

export function areasForCity(citySlug: string | undefined): Area[] {
  return findCity(citySlug)?.areas ?? [];
}
