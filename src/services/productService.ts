import {
  Product,
  ProductFormData,
  CartItem,
  CategoryItem,
  BusinessSettingsData,
  EnquiryRecord,
} from '../types/product';
import { MATERIAL_IMAGES, resolveMaterialImage } from '../assets/materialImages';
import { getStoredAdminToken } from '../context/AuthContext';
import { apiUrl, getAuthHeaders } from './api';

export const DEFAULT_WHATSAPP_NUMBER = '917666323894';

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettingsData = {
  businessName: 'MetaPro Enterprises',
  whatsAppNumber: '917666323894',
  businessPhone: '7666323894',
  businessEmail: 'pdheeraj351@gmail.com',
  businessAddress:
    'Pili Nadi, Sunday Market, Plot No. 02, Kamptee Road, Nagpur, Maharashtra 440026, India',
  heroHeadline: 'Materials That Shape Better Spaces.',
  heroSubheadline:
    'Explore interior materials, architectural wall & ceiling panels, and precision fixing hardware from MetaPro Enterprises.',
  aboutText:
    'MetaPro Enterprises supplies interior materials, architectural wall and ceiling panels, and installation fasteners for customers working on homes, offices, commercial spaces, and interior renovation projects.',
  instagramUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
};

export const METAPRO_BUSINESS_INFO = {
  businessName: DEFAULT_BUSINESS_SETTINGS.businessName,
  phone: DEFAULT_BUSINESS_SETTINGS.businessPhone,
  whatsAppDisplay: '+91 7666323894',
  whatsAppNumber: DEFAULT_BUSINESS_SETTINGS.whatsAppNumber,
  email: DEFAULT_BUSINESS_SETTINGS.businessEmail,
  address: DEFAULT_BUSINESS_SETTINGS.businessAddress,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Pili+Nadi+Sunday+Market+Plot+No+02+Kamptee+Road+Nagpur+Maharashtra+440026',
  socials: {
    instagram: '',
    instagramHandle: '@metaproenterprises',
    facebook: '',
    facebookHandle: 'MetaPro Enterprises',
    youtube: '',
    youtubeHandle: '@metaproenterprises',
    linkedin: '',
    linkedinHandle: 'MetaPro Enterprises',
  },
};

export const CATEGORIES = [
  'All',
  'Fasteners & Screws',
  'Anchor Bolts & Hardware',
  'PVC Wall Panels',
  'Fluted Panels',
  'WPC Panels',
  'Interior Ceiling Panels',
  'Decorative Wall Panels',
  'Metal Profiles & Trims',
  'Adhesives, Sealants & Tapes',
  'Installation Tools & Accessories',
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'mp-prod-001',
    slug: 'wpc-fluted-panel-natural-oak',
    name: 'WPC Fluted Panel – Natural Oak',
    price: 145,
    salePrice: 145,
    sku: 'MP-FLT-NOAK-01',
    stock: 120,
    unit: 'sq ft',
    category: 'Fluted Panels',
    description:
      'Linear slatted architectural fluted wall panels crafted from high-density moisture-resistant polymer in natural oak finish. Engineered to bring warm tactile rhythm and acoustic softening.',
    specifications: [
      { label: 'Material', value: 'High-Density Co-Extruded WPC Polymer' },
      { label: 'Finish', value: 'Natural Oak Grain' },
      { label: 'Application', value: 'Feature Walls, TV Units & Partitions' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Feature Walls', 'TV Units', 'Partitions'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [
      MATERIAL_IMAGES.flutedWpcPanels,
      MATERIAL_IMAGES.heroShowroom,
      MATERIAL_IMAGES.spaceApplications,
    ],
    relatedProductIds: ['mp-prod-002', 'mp-prod-003', 'mp-prod-004'],
    featured: true,
    availability: 'Available',
    createdAt: '2026-03-14T09:15:00.000Z',
  },
  {
    id: 'mp-prod-002',
    slug: 'wpc-fluted-panel-walnut',
    name: 'WPC Fluted Panel – Walnut',
    price: 155,
    salePrice: 155,
    sku: 'MP-FLT-WAL-02',
    stock: 100,
    unit: 'sq ft',
    category: 'Fluted Panels',
    description:
      'Rich warm walnut fluted louver panels engineered for acoustic softening and linear wall geometry in living spaces and executive offices.',
    specifications: [
      { label: 'Material', value: 'WPC Polymer Core' },
      { label: 'Finish', value: 'Dark Walnut' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Living Room', 'Executive Office', 'Feature Walls'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [MATERIAL_IMAGES.flutedWpcPanels],
    relatedProductIds: ['mp-prod-001', 'mp-prod-003'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:16:00.000Z',
  },
  {
    id: 'mp-prod-003',
    slug: 'wpc-fluted-panel-charcoal',
    name: 'WPC Fluted Panel – Charcoal',
    price: 150,
    salePrice: 150,
    sku: 'MP-FLT-CH-03',
    stock: 90,
    unit: 'sq ft',
    category: 'Fluted Panels',
    description:
      'Architectural matte charcoal slatted fluted panels for modern, high-contrast interior backdrops and media consoles.',
    specifications: [
      { label: 'Material', value: 'Charcoal Polymer' },
      { label: 'Finish', value: 'Matte Charcoal' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['TV Backdrops', 'Reception Lobbies', 'Bedrooms'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [MATERIAL_IMAGES.flutedWpcPanels],
    relatedProductIds: ['mp-prod-001', 'mp-prod-002'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:17:00.000Z',
  },
  {
    id: 'mp-prod-004',
    slug: 'wpc-fluted-panel-teak',
    name: 'WPC Fluted Panel – Teak',
    price: 160,
    salePrice: 160,
    sku: 'MP-FLT-TEAK-04',
    stock: 80,
    unit: 'sq ft',
    category: 'Fluted Panels',
    description:
      'Classic golden teak wood finish fluted panels with tongue-and-groove interlocking channels for seamless dry installation.',
    specifications: [
      { label: 'Material', value: 'WPC Wood Composite' },
      { label: 'Finish', value: 'Golden Teak' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Balconies', 'Dining Areas', 'Feature Walls'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [MATERIAL_IMAGES.flutedWpcPanels],
    relatedProductIds: ['mp-prod-001', 'mp-prod-002'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:18:00.000Z',
  },
  {
    id: 'mp-prod-005',
    slug: 'pvc-marble-wall-panel-white-carrara',
    name: 'PVC Marble Wall Panel – White Carrara',
    price: 85,
    salePrice: 85,
    sku: 'MP-PVC-CAR-05',
    stock: 140,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    description:
      'Full-height stone-core PVC wall cladding sheet with UV-cured White Carrara marble pattern and high moisture resistance.',
    specifications: [
      { label: 'Composition', value: 'Virgin PVC + Calcium Carbonate Core' },
      { label: 'Finish', value: 'UV High Gloss Carrara' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Living Accent Walls', 'Lift Lobbies', 'Vanity Zones'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-006', 'mp-prod-007', 'mp-prod-008'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:19:00.000Z',
  },
  {
    id: 'mp-prod-006',
    slug: 'pvc-marble-wall-panel-grey-stone',
    name: 'PVC Marble Wall Panel – Grey Stone',
    price: 90,
    salePrice: 90,
    sku: 'MP-PVC-GRY-06',
    stock: 110,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    description:
      'Contemporary grey stone texture PVC cladding panel with high scratch and water resistance for rapid wall transformation.',
    specifications: [
      { label: 'Composition', value: 'SPC PVC Core' },
      { label: 'Finish', value: 'Satin Grey Stone' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Offices', 'Corridors', 'Bathrooms'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-005', 'mp-prod-007'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:20:00.000Z',
  },
  {
    id: 'mp-prod-007',
    slug: 'pvc-wooden-finish-wall-panel-walnut',
    name: 'PVC Wooden Finish Wall Panel – Walnut',
    price: 95,
    salePrice: 95,
    sku: 'MP-PVC-WAL-07',
    stock: 95,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    description:
      'Lightweight moisture-proof PVC wall sheet featuring realistic warm walnut timber grain for bedroom and retail cladding.',
    specifications: [
      { label: 'Composition', value: 'Rigid PVC Composite' },
      { label: 'Finish', value: 'Matte Walnut Timber' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Bedrooms', 'Dining Rooms', 'Retail Stores'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-005', 'mp-prod-006'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:21:00.000Z',
  },
  {
    id: 'mp-prod-008',
    slug: 'pvc-high-gloss-wall-panel-beige',
    name: 'PVC High Gloss Wall Panel – Beige',
    price: 80,
    salePrice: 80,
    sku: 'MP-PVC-BGE-08',
    stock: 130,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    description:
      'UV-cured warm beige gloss marble sheet providing seamless light-reflective wall surfaces in foyer and reception areas.',
    specifications: [
      { label: 'Composition', value: 'Stone-Core PVC Sheet' },
      { label: 'Finish', value: 'UV Mirror Gloss Beige' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Foyers', 'Showrooms', 'Residential Walls'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-005', 'mp-prod-006'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:22:00.000Z',
  },
  {
    id: 'mp-prod-009',
    slug: 'wpc-wall-panel-teak-wood-finish',
    name: 'WPC Wall Panel – Teak Wood Finish',
    price: 135,
    salePrice: 135,
    sku: 'MP-WPC-TEAK-09',
    stock: 100,
    unit: 'sq ft',
    category: 'WPC Panels',
    description:
      'Heavy-duty exterior & interior wood-plastic composite deep-channel wall panel in rich teak finish. Weather-resistant and zero-rot.',
    specifications: [
      { label: 'Composition', value: '60% Wood Fiber + 35% HDPE' },
      { label: 'Finish', value: 'Natural Teak Texture' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Facade Cladding', 'Soffits', 'Pergolas'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [MATERIAL_IMAGES.flutedWpcPanels],
    relatedProductIds: ['mp-prod-010', 'mp-prod-011'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:23:00.000Z',
  },
  {
    id: 'mp-prod-010',
    slug: 'wpc-wall-panel-dark-walnut',
    name: 'WPC Wall Panel – Dark Walnut',
    price: 140,
    salePrice: 140,
    sku: 'MP-WPC-DWAL-10',
    stock: 85,
    unit: 'sq ft',
    category: 'WPC Panels',
    description:
      'Weatherproof co-extruded WPC composite cladding panel in dark walnut shade, resistant to fading, moisture, and termites.',
    specifications: [
      { label: 'Composition', value: 'HDPE + Hardwood Flour' },
      { label: 'Finish', value: 'Deep Walnut Timber' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Terrace Walls', 'Retail Fronts', 'Feature Walls'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [MATERIAL_IMAGES.flutedWpcPanels],
    relatedProductIds: ['mp-prod-009', 'mp-prod-011'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:24:00.000Z',
  },
  {
    id: 'mp-prod-011',
    slug: 'wpc-decorative-panel-stone-grey',
    name: 'WPC Decorative Panel – Stone Grey',
    price: 130,
    salePrice: 130,
    sku: 'MP-WPC-SGRY-11',
    stock: 90,
    unit: 'sq ft',
    category: 'WPC Panels',
    description:
      'Modern stone grey WPC composite architectural panel designed for dry-wall installation across commercial elevations.',
    specifications: [
      { label: 'Composition', value: 'Engineered Polymer Composite' },
      { label: 'Finish', value: 'Brushed Stone Grey' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Office Partitions', 'Building Lobbies', 'Feature Walls'],
    image: MATERIAL_IMAGES.flutedWpcPanels,
    images: [MATERIAL_IMAGES.flutedWpcPanels],
    relatedProductIds: ['mp-prod-009', 'mp-prod-010'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:25:00.000Z',
  },
  {
    id: 'mp-prod-012',
    slug: 'pvc-ceiling-panel-white-matte',
    name: 'PVC Ceiling Panel – White Matte',
    price: 55,
    salePrice: 55,
    sku: 'MP-CLG-WMAT-12',
    stock: 200,
    unit: 'sq ft',
    category: 'Interior Ceiling Panels',
    description:
      'Clean, lightweight moisture-proof hollow PVC false ceiling planks with interlocking edges for seamless monolithic overhead finish.',
    specifications: [
      { label: 'Material', value: 'Hollow Chamber Rigid PVC' },
      { label: 'Finish', value: 'Monolithic Matte White' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Bathrooms', 'Kitchens', 'Commercial Corridors'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-013', 'mp-prod-014'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:26:00.000Z',
  },
  {
    id: 'mp-prod-013',
    slug: 'pvc-ceiling-panel-wood-grain',
    name: 'PVC Ceiling Panel – Wood Grain',
    price: 70,
    salePrice: 70,
    sku: 'MP-CLG-WGRN-13',
    stock: 150,
    unit: 'sq ft',
    category: 'Interior Ceiling Panels',
    description:
      'Warm wood-grain architectural PVC false ceiling panel engineered for residential interiors and covered outdoor balconies.',
    specifications: [
      { label: 'Material', value: 'Extruded PVC Ceiling Plank' },
      { label: 'Finish', value: 'Natural Timber Texture' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Living Room Ceilings', 'Balconies', 'Dining Rooms'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-012', 'mp-prod-014'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:27:00.000Z',
  },
  {
    id: 'mp-prod-014',
    slug: 'pvc-ceiling-panel-marble-finish',
    name: 'PVC Ceiling Panel – Marble Finish',
    price: 75,
    salePrice: 75,
    sku: 'MP-CLG-MARB-14',
    stock: 140,
    unit: 'sq ft',
    category: 'Interior Ceiling Panels',
    description:
      'Glossy Italian marble vein PVC ceiling panel for elegant overhead lighting designs in hotel and dining interiors.',
    specifications: [
      { label: 'Material', value: 'UV Coated Virgin PVC' },
      { label: 'Finish', value: 'Gloss Marble Coat' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Dining Ceilings', 'Lobbies', 'Vanity Zones'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-012', 'mp-prod-013'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:28:00.000Z',
  },
  {
    id: 'mp-prod-015',
    slug: 'decorative-3d-wall-panel-concrete-texture',
    name: 'Decorative 3D Wall Panel – Concrete Texture',
    price: 110,
    salePrice: 110,
    sku: 'MP-DEC-3DCON-15',
    stock: 80,
    unit: 'sq ft',
    category: 'Decorative Wall Panels',
    description:
      'Molded geometric 3D relief decorative wall tiles creating sharp shadow lines and an industrial raw concrete visual.',
    specifications: [
      { label: 'Material', value: 'High-Density Plant Fiber Composite' },
      { label: 'Finish', value: 'Molded Concrete Texture' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Cafe Interiors', 'Living Room Feature Walls', 'Studios'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-016', 'mp-prod-017'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:29:00.000Z',
  },
  {
    id: 'mp-prod-016',
    slug: 'decorative-wall-panel-travertine-finish',
    name: 'Decorative Wall Panel – Travertine Finish',
    price: 125,
    salePrice: 125,
    sku: 'MP-DEC-TRAV-16',
    stock: 70,
    unit: 'sq ft',
    category: 'Decorative Wall Panels',
    description:
      'Warm limestone travertine finish sculptural wall panel for understated luxury in master suites and boutique retail.',
    specifications: [
      { label: 'Material', value: 'Sculpted Mineral Composite' },
      { label: 'Finish', value: 'Natural Travertine Pores' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Master Bedrooms', 'Studios', 'Lounges'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-015', 'mp-prod-017'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:30:00.000Z',
  },
  {
    id: 'mp-prod-017',
    slug: 'decorative-wall-panel-sandstone-texture',
    name: 'Decorative Wall Panel – Sandstone Texture',
    price: 115,
    salePrice: 115,
    sku: 'MP-DEC-SAND-17',
    stock: 75,
    unit: 'sq ft',
    category: 'Decorative Wall Panels',
    description:
      'Tactile sandstone texture architectural wall panel paintable in any interior emulsion shade for custom walls.',
    specifications: [
      { label: 'Material', value: 'Composite Mineral Board' },
      { label: 'Finish', value: 'Fine Grain Sandstone' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Retail Showrooms', 'Lounges', 'Reception Desks'],
    image: MATERIAL_IMAGES.pvcMarbleCeiling,
    images: [MATERIAL_IMAGES.pvcMarbleCeiling],
    relatedProductIds: ['mp-prod-015', 'mp-prod-016'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:31:00.000Z',
  },
  {
    id: 'mp-prod-018',
    slug: 'self-drilling-screw-25mm',
    name: 'Self Drilling Screw – 25mm',
    price: 180,
    salePrice: 180,
    sku: 'MP-FS-SD25-18',
    stock: 300,
    unit: 'box',
    category: 'Fasteners & Screws',
    description:
      'Zinc-plated hardened steel self-drilling screws with tek point for light metal studs, GI channels, and framing.',
    specifications: [
      { label: 'Material', value: 'Hardened Carbon Steel' },
      { label: 'Pack Quantity', value: '500 pcs/box' },
      { label: 'Unit', value: 'box' },
    ],
    applications: ['GI Stud Framing', 'Panel Installation', 'False Ceilings'],
    image: MATERIAL_IMAGES.fastenersAnchors,
    images: [MATERIAL_IMAGES.fastenersAnchors],
    relatedProductIds: ['mp-prod-019', 'mp-prod-020'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:32:00.000Z',
  },
  {
    id: 'mp-prod-019',
    slug: 'drywall-screw-32mm',
    name: 'Drywall Screw – 32mm',
    price: 220,
    salePrice: 220,
    sku: 'MP-FS-DW32-19',
    stock: 350,
    unit: 'box',
    category: 'Fasteners & Screws',
    description:
      'Anti-corrosive black phosphated twinfast bugle head drywall screws for gypsum partition boards and ceiling furring.',
    specifications: [
      { label: 'Coating', value: 'Black Phosphate' },
      { label: 'Pack Quantity', value: '1000 pcs/box' },
      { label: 'Unit', value: 'box' },
    ],
    applications: ['Gypsum Drywall', 'False Ceilings', 'Subframe Mounting'],
    image: MATERIAL_IMAGES.fastenersAnchors,
    images: [MATERIAL_IMAGES.fastenersAnchors],
    relatedProductIds: ['mp-prod-018', 'mp-prod-020'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:33:00.000Z',
  },
  {
    id: 'mp-prod-020',
    slug: 'wood-screw-40mm',
    name: 'Wood Screw – 40mm',
    price: 250,
    salePrice: 250,
    sku: 'MP-FS-WD40-20',
    stock: 250,
    unit: 'box',
    category: 'Fasteners & Screws',
    description:
      'Yellow zinc passivated countersunk wood screws with sharp deep threads for plywood subframes and timber battens.',
    specifications: [
      { label: 'Coating', value: 'Yellow Zinc Dichromate' },
      { label: 'Pack Quantity', value: '500 pcs/box' },
      { label: 'Unit', value: 'box' },
    ],
    applications: ['Carpentry', 'Wood Furring', 'Cabinetry Installation'],
    image: MATERIAL_IMAGES.fastenersAnchors,
    images: [MATERIAL_IMAGES.fastenersAnchors],
    relatedProductIds: ['mp-prod-018', 'mp-prod-019'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:34:00.000Z',
  },
  {
    id: 'mp-prod-021',
    slug: 'expansion-anchor-bolt-m8',
    name: 'Expansion Anchor Bolt – M8',
    price: 160,
    salePrice: 160,
    sku: 'MP-ANC-M8-21',
    stock: 220,
    unit: 'pack',
    category: 'Anchor Bolts & Hardware',
    description:
      'Carbon steel sleeve expansion anchor bolts with hex nut for secure fixing into solid concrete slabs and masonry.',
    specifications: [
      { label: 'Mechanism', value: 'Sleeve Expansion Pin Bolt' },
      { label: 'Pack Quantity', value: '50 pcs/pack' },
      { label: 'Unit', value: 'pack' },
    ],
    applications: ['Concrete Ceilings', 'Heavy Channel Anchoring', 'Columns'],
    image: MATERIAL_IMAGES.fastenersAnchors,
    images: [MATERIAL_IMAGES.fastenersAnchors],
    relatedProductIds: ['mp-prod-022', 'mp-prod-023'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:35:00.000Z',
  },
  {
    id: 'mp-prod-022',
    slug: 'heavy-duty-anchor-bolt-m10',
    name: 'Heavy Duty Anchor Bolt – M10',
    price: 240,
    salePrice: 240,
    sku: 'MP-ANC-M10-22',
    stock: 180,
    unit: 'pack',
    category: 'Anchor Bolts & Hardware',
    description:
      'High-tensile yellow zinc M10 expansion anchor bolts for structural ceiling furring and heavy framing framework.',
    specifications: [
      { label: 'Mechanism', value: 'Heavy Duty Torque Expansion' },
      { label: 'Pack Quantity', value: '50 pcs/pack' },
      { label: 'Unit', value: 'pack' },
    ],
    applications: ['Structural Framing', 'HVAC Supports', 'Ceiling Hangers'],
    image: MATERIAL_IMAGES.fastenersAnchors,
    images: [MATERIAL_IMAGES.fastenersAnchors],
    relatedProductIds: ['mp-prod-021', 'mp-prod-023'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:36:00.000Z',
  },
  {
    id: 'mp-prod-023',
    slug: 'wall-plug-set-assorted',
    name: 'Wall Plug Set – Assorted',
    price: 120,
    salePrice: 120,
    sku: 'MP-ANC-PLUG-23',
    stock: 300,
    unit: 'pack',
    category: 'Anchor Bolts & Hardware',
    description:
      'Virgin nylon expansion wall plugs with anti-rotation ribs for hollow brick and solid masonry partition fixing.',
    specifications: [
      { label: 'Material', value: 'Engineered High-Grade Nylon' },
      { label: 'Pack Quantity', value: '100 pcs/pack' },
      { label: 'Unit', value: 'pack' },
    ],
    applications: ['Lightweight Fixtures', 'Fittings', 'Electrical Channels'],
    image: MATERIAL_IMAGES.fastenersAnchors,
    images: [MATERIAL_IMAGES.fastenersAnchors],
    relatedProductIds: ['mp-prod-021', 'mp-prod-022'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:37:00.000Z',
  },
  {
    id: 'mp-prod-024',
    slug: 'panel-installation-adhesive',
    name: 'Panel Installation Adhesive',
    price: 180,
    salePrice: 180,
    sku: 'MP-TL-ADH-24',
    stock: 200,
    unit: 'tube',
    category: 'Installation Tools & Accessories',
    description:
      'Instant-grab hybrid polymer construction adhesive formulated for direct bonding of PVC marble and WPC panels without sagging.',
    specifications: [
      { label: 'Volume', value: '300 ml Cartridge' },
      { label: 'Bond Type', value: 'Zero-Sag Instant Grab' },
      { label: 'Unit', value: 'tube' },
    ],
    applications: ['Wall Panel Bonding', 'Trim Fixing', 'Skirting'],
    image: MATERIAL_IMAGES.adhesivesSealantsTools,
    images: [MATERIAL_IMAGES.adhesivesSealantsTools],
    relatedProductIds: ['mp-prod-025', 'mp-prod-026'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:38:00.000Z',
  },
  {
    id: 'mp-prod-025',
    slug: 'pvc-panel-joining-profile',
    name: 'PVC Panel Joining Profile',
    price: 45,
    salePrice: 45,
    sku: 'MP-TL-JPROF-25',
    stock: 250,
    unit: 'piece',
    category: 'Installation Tools & Accessories',
    description:
      'H-profile PVC joint connector strip for clean alignment and seamless visual transition between two panel sheets.',
    specifications: [
      { label: 'Length', value: '8 ft (2440 mm)' },
      { label: 'Material', value: 'Extruded PVC Joint Strip' },
      { label: 'Unit', value: 'piece' },
    ],
    applications: ['Panel Sheet Transitions', 'Drywall Furring'],
    image: MATERIAL_IMAGES.adhesivesSealantsTools,
    images: [MATERIAL_IMAGES.adhesivesSealantsTools],
    relatedProductIds: ['mp-prod-024', 'mp-prod-026'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:39:00.000Z',
  },
  {
    id: 'mp-prod-026',
    slug: 'panel-corner-finishing-profile',
    name: 'Panel Corner Finishing Profile',
    price: 55,
    salePrice: 55,
    sku: 'MP-TL-CORN-26',
    stock: 250,
    unit: 'piece',
    category: 'Installation Tools & Accessories',
    description:
      'L-shaped outer corner guard and internal corner trim for clean, protected panel edge finishing.',
    specifications: [
      { label: 'Length', value: '8 ft (2440 mm)' },
      { label: 'Material', value: 'Impact-Resistant PVC' },
      { label: 'Unit', value: 'piece' },
    ],
    applications: ['External Corner Edging', 'Window Reveals', 'Wall Ends'],
    image: MATERIAL_IMAGES.adhesivesSealantsTools,
    images: [MATERIAL_IMAGES.adhesivesSealantsTools],
    relatedProductIds: ['mp-prod-024', 'mp-prod-025'],
    featured: false,
    availability: 'Available',
    createdAt: '2026-03-14T09:40:00.000Z',
  },
];

function getAdminHeaders(): HeadersInit {
  return getAuthHeaders();
}

export function normalizeProductRow(row: any): Product {
  const cleanMainImage = resolveMaterialImage(row.image, row.category);
  const rawImages =
    Array.isArray(row.images) && row.images.length > 0 ? row.images : [cleanMainImage];
  const cleanImages = rawImages.map((img: string) => resolveMaterialImage(img, row.category));

  return {
    id: row.id,
    slug:
      row.slug ||
      String(row.name || row.id)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    name: row.name,
    description: row.description,
    category: row.category,
    categoryId: row.categoryId,
    brand: row.brand || 'MetaPro',
    price: Number(row.price) || 0,
    salePrice: row.salePrice !== undefined && row.salePrice !== null ? Number(row.salePrice) : undefined,
    sku: row.sku || undefined,
    stock: typeof row.stock === 'number' ? row.stock : 50,
    minOrderQuantity: typeof row.minOrderQuantity === 'number' ? row.minOrderQuantity : 1,
    unit: row.unit || 'Unit',
    image: cleanMainImage,
    images: cleanImages,
    availability: row.availability === 'Out of Stock' ? 'Out of Stock' : 'Available',
    active: row.active !== undefined ? Boolean(row.active) : true,
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    applications: Array.isArray(row.applications) ? row.applications : [],
    featured: Boolean(row.featured),
    createdAt: row.createdAt || new Date().toISOString(),
    updatedAt: row.updatedAt,
  };
}

// Keep a runtime reference to the latest settings for synchronous WhatsApp URL generation
let currentSettingsCache: BusinessSettingsData = { ...DEFAULT_BUSINESS_SETTINGS };

export const productService = {
  // ============================================================================
  // PRODUCTS API (PostgreSQL Source of Truth)
  // ============================================================================

  async fetchAllFromApi(): Promise<Product[]> {
    const res = await fetch(apiUrl('/api/products'));
    if (!res.ok) {
      throw new Error(`Failed to fetch products: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(normalizeProductRow);
  },

  async fetchByIdOrSlugFromApi(idOrSlug: string): Promise<Product | null> {
    const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(idOrSlug)}`));
    if (!res.ok) return null;
    const row = await res.json();
    return normalizeProductRow(row);
  },

  async createInApi(data: ProductFormData): Promise<Product> {
    const res = await fetch(apiUrl('/api/products'), {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create product');
    }
    const created = await res.json();
    return normalizeProductRow(created);
  },

  async updateInApi(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(id)}`), {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update product');
    }
    const updated = await res.json();
    return normalizeProductRow(updated);
  },

  async deleteFromApi(id: string): Promise<boolean> {
    const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    return res.ok;
  },

  async toggleAvailabilityInApi(id: string): Promise<Product> {
    const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(id)}/availability`), {
      method: 'PATCH',
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to toggle availability');
    }
    const updated = await res.json();
    return normalizeProductRow(updated);
  },

  async setFeaturedInApi(id: string): Promise<Product> {
    const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(id)}/featured`), {
      method: 'PATCH',
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to set featured product');
    }
    const updated = await res.json();
    return normalizeProductRow(updated);
  },

  async resetDefaultsInApi(): Promise<Product[]> {
    const res = await fetch(apiUrl('/api/products/reset'), {
      method: 'POST',
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reset catalogue');
    const list = await res.json();
    return Array.isArray(list) ? list.map(normalizeProductRow) : [];
  },

  // ============================================================================
  // CATEGORIES API
  // ============================================================================

  async fetchCategoriesFromApi(): Promise<CategoryItem[]> {
    const res = await fetch(apiUrl('/api/categories'));
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  },

  async createCategoryInApi(data: {
    name: string;
    description?: string;
    image?: string;
    active?: boolean;
  }): Promise<CategoryItem> {
    const res = await fetch(apiUrl('/api/categories'), {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create category');
    }
    return await res.json();
  },

  async updateCategoryInApi(
    id: string,
    data: Partial<CategoryItem>
  ): Promise<CategoryItem> {
    const res = await fetch(apiUrl(`/api/categories/${encodeURIComponent(id)}`), {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update category');
    }
    return await res.json();
  },

  async deleteCategoryFromApi(id: string): Promise<{
    deleted: boolean;
    deactivated?: boolean;
    message: string;
  }> {
    const res = await fetch(apiUrl(`/api/categories/${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to delete category');
    }
    return await res.json();
  },

  // ============================================================================
  // BUSINESS SETTINGS API
  // ============================================================================

  async fetchSettingsFromApi(): Promise<BusinessSettingsData> {
    const res = await fetch(apiUrl('/api/settings'));
    if (!res.ok) return currentSettingsCache;
    const data = await res.json();
    currentSettingsCache = { ...DEFAULT_BUSINESS_SETTINGS, ...data };
    return currentSettingsCache;
  },

  async updateSettingsInApi(
    data: Partial<BusinessSettingsData>
  ): Promise<BusinessSettingsData> {
    const res = await fetch(apiUrl('/api/settings'), {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save settings');
    }
    const updated = await res.json();
    currentSettingsCache = { ...DEFAULT_BUSINESS_SETTINGS, ...updated };
    return currentSettingsCache;
  },

  getWhatsAppNumber(): string {
    return currentSettingsCache.whatsAppNumber || DEFAULT_WHATSAPP_NUMBER;
  },

  setWhatsAppNumber(number: string): void {
    currentSettingsCache.whatsAppNumber = number.replace(/[^0-9]/g, '');
  },

  generateWhatsAppUrl(
    product: Product,
    quantity = 1,
    customPhone?: string
  ): string {
    const phone =
      (customPhone && customPhone.replace(/[^0-9]/g, '')) ||
      this.getWhatsAppNumber();
    const unitLabel = product.unit ? ` (${product.unit})` : '';
    const skuLabel = product.sku ? `\nSKU: ${product.sku}` : '';
    const message = `Hello ${currentSettingsCache.businessName || 'MetaPro Enterprises'},\n\nI would like to enquire about the following material:\n\n• *${product.name}* × ${quantity}${unitLabel}\nCategory: ${product.category}${skuLabel}\nIndicative Price: ₹${product.price.toLocaleString('en-IN')}\n\nPlease share current availability, specification sheet, and quotation for my project.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  },

  async saveEnquiryRecord(data: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    projectType?: string;
    notes?: string;
    items: CartItem[];
  }): Promise<EnquiryRecord | null> {
    try {
      const payload = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        projectType: data.projectType,
        notes: data.notes,
        items: data.items.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          quantity: it.quantity,
          unit: it.product.unit,
          sku: it.product.sku,
          price: it.product.price,
        })),
      };
      const res = await fetch(apiUrl('/api/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to save enquiry record via API:', e);
    }
    return null;
  },

  async fetchEnquiriesFromApi(): Promise<EnquiryRecord[]> {
    try {
      const res = await fetch(apiUrl('/api/enquiries'), {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch enquiries from API:', e);
    }
    return [];
  },

  formatEnquiryListMessage(
    items: CartItem[],
    details?: {
      customerName?: string;
      customerPhone?: string;
      projectType?: string;
      notes?: string;
    }
  ): string {
    const bName = currentSettingsCache.businessName || 'MetaPro Enterprises';
    if (!items || items.length === 0) {
      return `Hello ${bName},\n\nI would like to enquire about your interior materials and hardware solutions.`;
    }

    const lines = items.map((item, idx) => {
      const unitStr = item.product.unit ? ` (${item.product.unit})` : '';
      const skuStr = item.product.sku ? ` [${item.product.sku}]` : '';
      return `${idx + 1}. ${item.product.name}${skuStr} × ${item.quantity}${unitStr}`;
    });

    const totalEstimate = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const contextLines: string[] = [];
    if (details?.customerName?.trim()) {
      contextLines.push(`Name: ${details.customerName.trim()}`);
    }
    if (details?.customerPhone?.trim()) {
      contextLines.push(`Phone: ${details.customerPhone.trim()}`);
    }
    if (details?.projectType?.trim()) {
      contextLines.push(`Application / Space: ${details.projectType.trim()}`);
    }
    if (details?.notes?.trim()) {
      contextLines.push(`Notes: ${details.notes.trim()}`);
    }

    const contextBlock =
      contextLines.length > 0 ? `\n\n*Project Details:*\n${contextLines.join('\n')}` : '';

    return `Hello ${bName},\n\nI have prepared the following *Material Enquiry List* from your catalogue:\n\n${lines.join(
      '\n'
    )}\n\nIndicative Catalogue Value: ₹${totalEstimate.toLocaleString(
      'en-IN'
    )}${contextBlock}\n\nPlease confirm availability and share your best project quotation.`;
  },

  generateEnquiryListWhatsAppUrl(
    items: CartItem[],
    details?: {
      customerName?: string;
      customerPhone?: string;
      projectType?: string;
      notes?: string;
    }
  ): string {
    const phone = this.getWhatsAppNumber();
    const message = this.formatEnquiryListMessage(items, details);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  },
};
