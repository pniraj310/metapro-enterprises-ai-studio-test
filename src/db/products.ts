import crypto from 'crypto';
import { eq, desc, or } from 'drizzle-orm';
import { db } from './index.ts';
import {
  products,
  enquiries,
  categories,
  businessSettings,
  adminUsers,
} from './schema.ts';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const SEED_CATEGORIES = [
  {
    id: 'cat-fasteners-screws',
    name: 'Fasteners & Screws',
    slug: 'fasteners-screws',
    description:
      'Black phosphated twinfast bugle-head drywall screws and self-drilling fasteners for gypsum boards, GI studs, and framing channels.',
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    active: true,
  },
  {
    id: 'cat-anchor-bolts',
    name: 'Anchor Bolts & Hardware',
    slug: 'anchor-bolts-hardware',
    description:
      'Torque-controlled yellow zinc M10 expansion anchor bolts, GI ceiling channels, and stainless steel concealed mounting clips.',
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    active: true,
  },
  {
    id: 'cat-pvc-wall-panels',
    name: 'PVC Wall Panels',
    slug: 'pvc-wall-panels',
    description:
      'Moisture-resistant stone-core PVC sheets with UV marble and satin architectural finishes for rapid dry-wall cladding.',
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    active: true,
  },
  {
    id: 'cat-fluted-panels',
    name: 'Fluted Panels',
    slug: 'fluted-panels',
    description:
      'Linear charcoal and warm wood-grain slatted panels that introduce rhythm, depth, and acoustic comfort to feature walls.',
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    active: true,
  },
  {
    id: 'cat-wpc-panels',
    name: 'WPC Panels',
    slug: 'wpc-panels',
    description:
      'Weather-stabilized wood-plastic composite louver profiles suited for interior elevations, soffits, and semi-exterior facades.',
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    active: true,
  },
  {
    id: 'cat-ceiling-panels',
    name: 'Interior Ceiling Panels',
    slug: 'interior-ceiling-panels',
    description:
      'Micro-perforated acoustic ceiling tiles and T-grid suspension modules engineered for clean overhead geometry.',
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    active: true,
  },
  {
    id: 'cat-decorative-panels',
    name: 'Decorative Wall Panels',
    slug: 'decorative-wall-panels',
    description:
      'Sculptural 3D plant-fiber and textured relief panels ready for custom interior paint finishes.',
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    active: true,
  },
  {
    id: 'cat-metal-profiles',
    name: 'Metal Profiles & Trims',
    slug: 'metal-profiles-trims',
    description:
      'Anodized brushed champagne gold, rose gold, and matte black aluminium T-profiles, L-edge trims, and corner beading.',
    image: '/assets/images/hardware_profiles_trims_1790924245282.jpg',
    active: true,
  },
  {
    id: 'cat-adhesives-tapes',
    name: 'Adhesives, Sealants & Tapes',
    slug: 'adhesives-sealants-tapes',
    description:
      'High-grab polymer construction adhesives and alkali-resistant fiberglass drywall joint mesh tapes for seamless installation.',
    image: '/assets/images/adhesives_sealants_tools_1790924264227.jpg',
    active: true,
  },
  {
    id: 'cat-installation-tools',
    name: 'Installation Tools & Accessories',
    slug: 'installation-tools-accessories',
    description:
      'Precision layout chalk lines, marking reels, and site alignment accessories for clean wall, floor, and ceiling work.',
    image: '/assets/images/adhesives_sealants_tools_1790924264227.jpg',
    active: true,
  },
];

export const SEED_PRODUCTS = [
  {
    id: 'mp-prod-001',
    slug: 'wpc-fluted-panel-natural-oak',
    name: 'WPC Fluted Panel – Natural Oak',
    price: 145,
    salePrice: 145,
    sku: 'MP-FLT-NOAK-01',
    stock: 120,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Fluted Panels',
    categoryId: 'cat-fluted-panels',
    brand: 'MetaPro',
    description:
      'Linear slatted architectural fluted wall panels crafted from high-density moisture-resistant polymer in natural oak finish. Engineered to bring warm tactile rhythm and acoustic softening.',
    specifications: [
      { label: 'Material', value: 'High-Density Co-Extruded WPC Polymer' },
      { label: 'Finish', value: 'Natural Oak Grain' },
      { label: 'Application', value: 'Feature Walls, TV Units & Partitions' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Feature Walls', 'TV Units', 'Partitions'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: [
      '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
      '/assets/images/hero_showroom_interiors_1790919377238.jpg',
      '/assets/images/space_applications_showcase_1790919435342.jpg',
    ],
    featured: true,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-002',
    slug: 'wpc-fluted-panel-walnut',
    name: 'WPC Fluted Panel – Walnut',
    price: 155,
    salePrice: 155,
    sku: 'MP-FLT-WAL-02',
    stock: 100,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Fluted Panels',
    categoryId: 'cat-fluted-panels',
    brand: 'MetaPro',
    description:
      'Rich warm walnut fluted louver panels engineered for acoustic softening and linear wall geometry in living spaces and executive offices.',
    specifications: [
      { label: 'Material', value: 'WPC Polymer Core' },
      { label: 'Finish', value: 'Dark Walnut' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Living Room', 'Executive Office', 'Feature Walls'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: ['/assets/images/material_fluted_wpc_panels_1790919395083.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-003',
    slug: 'wpc-fluted-panel-charcoal',
    name: 'WPC Fluted Panel – Charcoal',
    price: 150,
    salePrice: 150,
    sku: 'MP-FLT-CH-03',
    stock: 90,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Fluted Panels',
    categoryId: 'cat-fluted-panels',
    brand: 'MetaPro',
    description:
      'Architectural matte charcoal slatted fluted panels for modern, high-contrast interior backdrops and media consoles.',
    specifications: [
      { label: 'Material', value: 'Charcoal Polymer' },
      { label: 'Finish', value: 'Matte Charcoal' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['TV Backdrops', 'Reception Lobbies', 'Bedrooms'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: ['/assets/images/material_fluted_wpc_panels_1790919395083.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-004',
    slug: 'wpc-fluted-panel-teak',
    name: 'WPC Fluted Panel – Teak',
    price: 160,
    salePrice: 160,
    sku: 'MP-FLT-TEAK-04',
    stock: 80,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Fluted Panels',
    categoryId: 'cat-fluted-panels',
    brand: 'MetaPro',
    description:
      'Classic golden teak wood finish fluted panels with tongue-and-groove interlocking channels for seamless dry installation.',
    specifications: [
      { label: 'Material', value: 'WPC Wood Composite' },
      { label: 'Finish', value: 'Golden Teak' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Balconies', 'Dining Areas', 'Feature Walls'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: ['/assets/images/material_fluted_wpc_panels_1790919395083.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-005',
    slug: 'pvc-marble-wall-panel-white-carrara',
    name: 'PVC Marble Wall Panel – White Carrara',
    price: 85,
    salePrice: 85,
    sku: 'MP-PVC-CAR-05',
    stock: 140,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    categoryId: 'cat-pvc-wall-panels',
    brand: 'MetaPro',
    description:
      'Full-height stone-core PVC wall cladding sheet with UV-cured White Carrara marble pattern and high moisture resistance.',
    specifications: [
      { label: 'Composition', value: 'Virgin PVC + Calcium Carbonate Core' },
      { label: 'Finish', value: 'UV High Gloss Carrara' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Living Accent Walls', 'Lift Lobbies', 'Vanity Zones'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-006',
    slug: 'pvc-marble-wall-panel-grey-stone',
    name: 'PVC Marble Wall Panel – Grey Stone',
    price: 90,
    salePrice: 90,
    sku: 'MP-PVC-GRY-06',
    stock: 110,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    categoryId: 'cat-pvc-wall-panels',
    brand: 'MetaPro',
    description:
      'Contemporary grey stone texture PVC cladding panel with high scratch and water resistance for rapid wall transformation.',
    specifications: [
      { label: 'Composition', value: 'SPC PVC Core' },
      { label: 'Finish', value: 'Satin Grey Stone' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Offices', 'Corridors', 'Bathrooms'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-007',
    slug: 'pvc-wooden-finish-wall-panel-walnut',
    name: 'PVC Wooden Finish Wall Panel – Walnut',
    price: 95,
    salePrice: 95,
    sku: 'MP-PVC-WAL-07',
    stock: 95,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    categoryId: 'cat-pvc-wall-panels',
    brand: 'MetaPro',
    description:
      'Lightweight moisture-proof PVC wall sheet featuring realistic warm walnut timber grain for bedroom and retail cladding.',
    specifications: [
      { label: 'Composition', value: 'Rigid PVC Composite' },
      { label: 'Finish', value: 'Matte Walnut Timber' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Bedrooms', 'Dining Rooms', 'Retail Stores'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-008',
    slug: 'pvc-high-gloss-wall-panel-beige',
    name: 'PVC High Gloss Wall Panel – Beige',
    price: 80,
    salePrice: 80,
    sku: 'MP-PVC-BGE-08',
    stock: 130,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'PVC Wall Panels',
    categoryId: 'cat-pvc-wall-panels',
    brand: 'MetaPro',
    description:
      'UV-cured warm beige gloss marble sheet providing seamless light-reflective wall surfaces in foyer and reception areas.',
    specifications: [
      { label: 'Composition', value: 'Stone-Core PVC Sheet' },
      { label: 'Finish', value: 'UV Mirror Gloss Beige' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Foyers', 'Showrooms', 'Residential Walls'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-009',
    slug: 'wpc-wall-panel-teak-wood-finish',
    name: 'WPC Wall Panel – Teak Wood Finish',
    price: 135,
    salePrice: 135,
    sku: 'MP-WPC-TEAK-09',
    stock: 100,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'WPC Panels',
    categoryId: 'cat-wpc-panels',
    brand: 'MetaPro',
    description:
      'Heavy-duty exterior & interior wood-plastic composite deep-channel wall panel in rich teak finish. Weather-resistant and zero-rot.',
    specifications: [
      { label: 'Composition', value: '60% Wood Fiber + 35% HDPE' },
      { label: 'Finish', value: 'Natural Teak Texture' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Facade Cladding', 'Soffits', 'Pergolas'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: ['/assets/images/material_fluted_wpc_panels_1790919395083.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-010',
    slug: 'wpc-wall-panel-dark-walnut',
    name: 'WPC Wall Panel – Dark Walnut',
    price: 140,
    salePrice: 140,
    sku: 'MP-WPC-DWAL-10',
    stock: 85,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'WPC Panels',
    categoryId: 'cat-wpc-panels',
    brand: 'MetaPro',
    description:
      'Weatherproof co-extruded WPC composite cladding panel in dark walnut shade, resistant to fading, moisture, and termites.',
    specifications: [
      { label: 'Composition', value: 'HDPE + Hardwood Flour' },
      { label: 'Finish', value: 'Deep Walnut Timber' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Terrace Walls', 'Retail Fronts', 'Feature Walls'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: ['/assets/images/material_fluted_wpc_panels_1790919395083.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-011',
    slug: 'wpc-decorative-panel-stone-grey',
    name: 'WPC Decorative Panel – Stone Grey',
    price: 130,
    salePrice: 130,
    sku: 'MP-WPC-SGRY-11',
    stock: 90,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'WPC Panels',
    categoryId: 'cat-wpc-panels',
    brand: 'MetaPro',
    description:
      'Modern stone grey WPC composite architectural panel designed for dry-wall installation across commercial elevations.',
    specifications: [
      { label: 'Composition', value: 'Engineered Polymer Composite' },
      { label: 'Finish', value: 'Brushed Stone Grey' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Office Partitions', 'Building Lobbies', 'Feature Walls'],
    image: '/assets/images/material_fluted_wpc_panels_1790919395083.jpg',
    images: ['/assets/images/material_fluted_wpc_panels_1790919395083.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-012',
    slug: 'pvc-ceiling-panel-white-matte',
    name: 'PVC Ceiling Panel – White Matte',
    price: 55,
    salePrice: 55,
    sku: 'MP-CLG-WMAT-12',
    stock: 200,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Interior Ceiling Panels',
    categoryId: 'cat-ceiling-panels',
    brand: 'MetaPro',
    description:
      'Clean, lightweight moisture-proof hollow PVC false ceiling planks with interlocking edges for seamless monolithic overhead finish.',
    specifications: [
      { label: 'Material', value: 'Hollow Chamber Rigid PVC' },
      { label: 'Finish', value: 'Monolithic Matte White' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Bathrooms', 'Kitchens', 'Commercial Corridors'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-013',
    slug: 'pvc-ceiling-panel-wood-grain',
    name: 'PVC Ceiling Panel – Wood Grain',
    price: 70,
    salePrice: 70,
    sku: 'MP-CLG-WGRN-13',
    stock: 150,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Interior Ceiling Panels',
    categoryId: 'cat-ceiling-panels',
    brand: 'MetaPro',
    description:
      'Warm wood-grain architectural PVC false ceiling panel engineered for residential interiors and covered outdoor balconies.',
    specifications: [
      { label: 'Material', value: 'Extruded PVC Ceiling Plank' },
      { label: 'Finish', value: 'Natural Timber Texture' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Living Room Ceilings', 'Balconies', 'Dining Rooms'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-014',
    slug: 'pvc-ceiling-panel-marble-finish',
    name: 'PVC Ceiling Panel – Marble Finish',
    price: 75,
    salePrice: 75,
    sku: 'MP-CLG-MARB-14',
    stock: 140,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Interior Ceiling Panels',
    categoryId: 'cat-ceiling-panels',
    brand: 'MetaPro',
    description:
      'Glossy Italian marble vein PVC ceiling panel for elegant overhead lighting designs in hotel and dining interiors.',
    specifications: [
      { label: 'Material', value: 'UV Coated Virgin PVC' },
      { label: 'Finish', value: 'Gloss Marble Coat' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Dining Ceilings', 'Lobbies', 'Vanity Zones'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-015',
    slug: 'decorative-3d-wall-panel-concrete-texture',
    name: 'Decorative 3D Wall Panel – Concrete Texture',
    price: 110,
    salePrice: 110,
    sku: 'MP-DEC-3DCON-15',
    stock: 80,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Decorative Wall Panels',
    categoryId: 'cat-decorative-panels',
    brand: 'MetaPro',
    description:
      'Molded geometric 3D relief decorative wall tiles creating sharp shadow lines and an industrial raw concrete visual.',
    specifications: [
      { label: 'Material', value: 'High-Density Plant Fiber Composite' },
      { label: 'Finish', value: 'Molded Concrete Texture' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Cafe Interiors', 'Living Room Feature Walls', 'Studios'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-016',
    slug: 'decorative-wall-panel-travertine-finish',
    name: 'Decorative Wall Panel – Travertine Finish',
    price: 125,
    salePrice: 125,
    sku: 'MP-DEC-TRAV-16',
    stock: 70,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Decorative Wall Panels',
    categoryId: 'cat-decorative-panels',
    brand: 'MetaPro',
    description:
      'Warm limestone travertine finish sculptural wall panel for understated luxury in master suites and boutique retail.',
    specifications: [
      { label: 'Material', value: 'Sculpted Mineral Composite' },
      { label: 'Finish', value: 'Natural Travertine Pores' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Master Bedrooms', 'Studios', 'Lounges'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-017',
    slug: 'decorative-wall-panel-sandstone-texture',
    name: 'Decorative Wall Panel – Sandstone Texture',
    price: 115,
    salePrice: 115,
    sku: 'MP-DEC-SAND-17',
    stock: 75,
    minOrderQuantity: 1,
    unit: 'sq ft',
    category: 'Decorative Wall Panels',
    categoryId: 'cat-decorative-panels',
    brand: 'MetaPro',
    description:
      'Tactile sandstone texture architectural wall panel paintable in any interior emulsion shade for custom walls.',
    specifications: [
      { label: 'Material', value: 'Composite Mineral Board' },
      { label: 'Finish', value: 'Fine Grain Sandstone' },
      { label: 'Unit', value: 'sq ft' },
    ],
    applications: ['Retail Showrooms', 'Lounges', 'Reception Desks'],
    image: '/assets/images/material_pvc_marble_ceiling_1790919414453.jpg',
    images: ['/assets/images/material_pvc_marble_ceiling_1790919414453.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-018',
    slug: 'self-drilling-screw-25mm',
    name: 'Self Drilling Screw – 25mm',
    price: 180,
    salePrice: 180,
    sku: 'MP-FS-SD25-18',
    stock: 300,
    minOrderQuantity: 1,
    unit: 'box',
    category: 'Fasteners & Screws',
    categoryId: 'cat-fasteners-screws',
    brand: 'MetaPro',
    description:
      'Zinc-plated hardened steel self-drilling screws with tek point for light metal studs, GI channels, and framing.',
    specifications: [
      { label: 'Material', value: 'Hardened Carbon Steel' },
      { label: 'Pack Quantity', value: '500 pcs/box' },
      { label: 'Unit', value: 'box' },
    ],
    applications: ['GI Stud Framing', 'Panel Installation', 'False Ceilings'],
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    images: ['/assets/images/material_fasteners_anchors_1790919426419.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-019',
    slug: 'drywall-screw-32mm',
    name: 'Drywall Screw – 32mm',
    price: 220,
    salePrice: 220,
    sku: 'MP-FS-DW32-19',
    stock: 350,
    minOrderQuantity: 1,
    unit: 'box',
    category: 'Fasteners & Screws',
    categoryId: 'cat-fasteners-screws',
    brand: 'MetaPro',
    description:
      'Anti-corrosive black phosphated twinfast bugle head drywall screws for gypsum partition boards and ceiling furring.',
    specifications: [
      { label: 'Coating', value: 'Black Phosphate' },
      { label: 'Pack Quantity', value: '1000 pcs/box' },
      { label: 'Unit', value: 'box' },
    ],
    applications: ['Gypsum Drywall', 'False Ceilings', 'Subframe Mounting'],
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    images: ['/assets/images/material_fasteners_anchors_1790919426419.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-020',
    slug: 'wood-screw-40mm',
    name: 'Wood Screw – 40mm',
    price: 250,
    salePrice: 250,
    sku: 'MP-FS-WD40-20',
    stock: 250,
    minOrderQuantity: 1,
    unit: 'box',
    category: 'Fasteners & Screws',
    categoryId: 'cat-fasteners-screws',
    brand: 'MetaPro',
    description:
      'Yellow zinc passivated countersunk wood screws with sharp deep threads for plywood subframes and timber battens.',
    specifications: [
      { label: 'Coating', value: 'Yellow Zinc Dichromate' },
      { label: 'Pack Quantity', value: '500 pcs/box' },
      { label: 'Unit', value: 'box' },
    ],
    applications: ['Carpentry', 'Wood Furring', 'Cabinetry Installation'],
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    images: ['/assets/images/material_fasteners_anchors_1790919426419.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-021',
    slug: 'expansion-anchor-bolt-m8',
    name: 'Expansion Anchor Bolt – M8',
    price: 160,
    salePrice: 160,
    sku: 'MP-ANC-M8-21',
    stock: 220,
    minOrderQuantity: 1,
    unit: 'pack',
    category: 'Anchor Bolts & Hardware',
    categoryId: 'cat-anchor-bolts',
    brand: 'MetaPro',
    description:
      'Carbon steel sleeve expansion anchor bolts with hex nut for secure fixing into solid concrete slabs and masonry.',
    specifications: [
      { label: 'Mechanism', value: 'Sleeve Expansion Pin Bolt' },
      { label: 'Pack Quantity', value: '50 pcs/pack' },
      { label: 'Unit', value: 'pack' },
    ],
    applications: ['Concrete Ceilings', 'Heavy Channel Anchoring', 'Columns'],
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    images: ['/assets/images/material_fasteners_anchors_1790919426419.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-022',
    slug: 'heavy-duty-anchor-bolt-m10',
    name: 'Heavy Duty Anchor Bolt – M10',
    price: 240,
    salePrice: 240,
    sku: 'MP-ANC-M10-22',
    stock: 180,
    minOrderQuantity: 1,
    unit: 'pack',
    category: 'Anchor Bolts & Hardware',
    categoryId: 'cat-anchor-bolts',
    brand: 'MetaPro',
    description:
      'High-tensile yellow zinc M10 expansion anchor bolts for structural ceiling furring and heavy framing framework.',
    specifications: [
      { label: 'Mechanism', value: 'Heavy Duty Torque Expansion' },
      { label: 'Pack Quantity', value: '50 pcs/pack' },
      { label: 'Unit', value: 'pack' },
    ],
    applications: ['Structural Framing', 'HVAC Supports', 'Ceiling Hangers'],
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    images: ['/assets/images/material_fasteners_anchors_1790919426419.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-023',
    slug: 'wall-plug-set-assorted',
    name: 'Wall Plug Set – Assorted',
    price: 120,
    salePrice: 120,
    sku: 'MP-ANC-PLUG-23',
    stock: 300,
    minOrderQuantity: 1,
    unit: 'pack',
    category: 'Anchor Bolts & Hardware',
    categoryId: 'cat-anchor-bolts',
    brand: 'MetaPro',
    description:
      'Virgin nylon expansion wall plugs with anti-rotation ribs for hollow brick and solid masonry partition fixing.',
    specifications: [
      { label: 'Material', value: 'Engineered High-Grade Nylon' },
      { label: 'Pack Quantity', value: '100 pcs/pack' },
      { label: 'Unit', value: 'pack' },
    ],
    applications: ['Lightweight Fixtures', 'Fittings', 'Electrical Channels'],
    image: '/assets/images/material_fasteners_anchors_1790919426419.jpg',
    images: ['/assets/images/material_fasteners_anchors_1790919426419.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-024',
    slug: 'panel-installation-adhesive',
    name: 'Panel Installation Adhesive',
    price: 180,
    salePrice: 180,
    sku: 'MP-TL-ADH-24',
    stock: 200,
    minOrderQuantity: 1,
    unit: 'tube',
    category: 'Installation Tools & Accessories',
    categoryId: 'cat-installation-tools',
    brand: 'MetaPro',
    description:
      'Instant-grab hybrid polymer construction adhesive formulated for direct bonding of PVC marble and WPC panels without sagging.',
    specifications: [
      { label: 'Volume', value: '300 ml Cartridge' },
      { label: 'Bond Type', value: 'Zero-Sag Instant Grab' },
      { label: 'Unit', value: 'tube' },
    ],
    applications: ['Wall Panel Bonding', 'Trim Fixing', 'Skirting'],
    image: '/assets/images/adhesives_sealants_tools_1790924264227.jpg',
    images: ['/assets/images/adhesives_sealants_tools_1790924264227.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-025',
    slug: 'pvc-panel-joining-profile',
    name: 'PVC Panel Joining Profile',
    price: 45,
    salePrice: 45,
    sku: 'MP-TL-JPROF-25',
    stock: 250,
    minOrderQuantity: 1,
    unit: 'piece',
    category: 'Installation Tools & Accessories',
    categoryId: 'cat-installation-tools',
    brand: 'MetaPro',
    description:
      'H-profile PVC joint connector strip for clean alignment and seamless visual transition between two panel sheets.',
    specifications: [
      { label: 'Length', value: '8 ft (2440 mm)' },
      { label: 'Material', value: 'Extruded PVC Joint Strip' },
      { label: 'Unit', value: 'piece' },
    ],
    applications: ['Panel Sheet Transitions', 'Drywall Furring'],
    image: '/assets/images/adhesives_sealants_tools_1790924264227.jpg',
    images: ['/assets/images/adhesives_sealants_tools_1790924264227.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
  {
    id: 'mp-prod-026',
    slug: 'panel-corner-finishing-profile',
    name: 'Panel Corner Finishing Profile',
    price: 55,
    salePrice: 55,
    sku: 'MP-TL-CORN-26',
    stock: 250,
    minOrderQuantity: 1,
    unit: 'piece',
    category: 'Installation Tools & Accessories',
    categoryId: 'cat-installation-tools',
    brand: 'MetaPro',
    description:
      'L-shaped outer corner guard and internal corner trim for clean, protected panel edge finishing.',
    specifications: [
      { label: 'Length', value: '8 ft (2440 mm)' },
      { label: 'Material', value: 'Impact-Resistant PVC' },
      { label: 'Unit', value: 'piece' },
    ],
    applications: ['External Corner Edging', 'Window Reveals', 'Wall Ends'],
    image: '/assets/images/adhesives_sealants_tools_1790924264227.jpg',
    images: ['/assets/images/adhesives_sealants_tools_1790924264227.jpg'],
    featured: false,
    active: true,
    availability: 'Available',
  },
];

// ============================================================================
// IN-MEMORY DATA STORE (Active when Cloud SQL / PostgreSQL is offline)
// ============================================================================

let isDbConnected: boolean | null = null;

function markDbOffline(err: any) {
  if (isDbConnected !== false) {
    console.warn('[AI Studio] PostgreSQL offline or unreachable. Using in-memory store:', err?.message || err);
    isDbConnected = false;
  }
}

// In-memory clones
let memoryProducts: any[] = JSON.parse(JSON.stringify(SEED_PRODUCTS)).map((p: any) => ({
  ...p,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

if (memoryProducts.length > 0 && !memoryProducts.some((p) => p.featured)) {
  memoryProducts[0].featured = true;
}

let memoryCategories: any[] = JSON.parse(JSON.stringify(SEED_CATEGORIES)).map((c: any) => ({
  ...c,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

let memoryBusinessSettings: any = {
  id: 1,
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

let memoryAdminUsers: any[] = [];
let memoryEnquiries: any[] = [];

// ============================================================================
// PRODUCTS REPOSITORY
// ============================================================================

export async function getAllProductsFromDb() {
  if (isDbConnected !== false) {
    try {
      let existing = await db.select().from(products).orderBy(desc(products.createdAt));
      if (existing.length < SEED_PRODUCTS.length) {
        await db.insert(products).values(SEED_PRODUCTS).onConflictDoNothing();
        existing = await db.select().from(products).orderBy(desc(products.createdAt));
      }
      // Backfill slug if missing on any existing rows
      for (const row of existing) {
        if (!row.slug) {
          const generatedSlug = slugify(row.name);
          await db
            .update(products)
            .set({ slug: generatedSlug })
            .where(eq(products.id, row.id));
          row.slug = generatedSlug;
        }
      }
      // Enforce single primary featured product if multiple were previously true
      const featuredRows = existing.filter((r) => r.featured);
      if (featuredRows.length > 1) {
        const keepId = featuredRows[0].id;
        for (const extra of featuredRows.slice(1)) {
          await db.update(products).set({ featured: false }).where(eq(products.id, extra.id));
          extra.featured = false;
        }
      } else if (featuredRows.length === 0 && existing.length > 0) {
        await db
          .update(products)
          .set({ featured: true })
          .where(eq(products.id, existing[0].id));
        existing[0].featured = true;
      }
      isDbConnected = true;
      return existing;
    } catch (error) {
      markDbOffline(error);
    }
  }

  return [...memoryProducts];
}

export async function getProductByIdFromDb(idOrSlug: string) {
  if (isDbConnected !== false) {
    try {
      const rows = await db
        .select()
        .from(products)
        .where(or(eq(products.id, idOrSlug), eq(products.slug, idOrSlug)));
      isDbConnected = true;
      if (rows.length > 0) return rows[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const found = memoryProducts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  return found || null;
}

export async function createProductInDb(data: {
  id?: string;
  slug?: string;
  name: string;
  description: string;
  category: string;
  categoryId?: string;
  brand?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock?: number;
  minOrderQuantity?: number;
  unit?: string;
  image: string;
  images?: string[];
  availability?: string;
  active?: boolean;
  specifications?: { label: string; value: string }[];
  applications?: string[];
  featured?: boolean;
}) {
  const id =
    data.id ||
    `mp-prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const slug = data.slug || slugify(data.name) || id;
  const newProduct = {
    id,
    slug,
    name: data.name,
    description: data.description,
    category: data.category,
    categoryId: data.categoryId || slugify(data.category),
    brand: data.brand || 'MetaPro',
    price: Math.round(Number(data.price) || 0),
    salePrice: data.salePrice
      ? Math.round(Number(data.salePrice))
      : Math.round(Number(data.price) || 0),
    sku: data.sku || `MP-${Date.now().toString().slice(-5)}`,
    stock: typeof data.stock === 'number' ? data.stock : 50,
    minOrderQuantity: typeof data.minOrderQuantity === 'number' ? data.minOrderQuantity : 1,
    unit: data.unit || 'Piece',
    image: data.image,
    images: data.images && data.images.length > 0 ? data.images : [data.image],
    availability: data.availability || 'Available',
    active: data.active !== undefined ? Boolean(data.active) : true,
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    applications: Array.isArray(data.applications) ? data.applications : [],
    featured: Boolean(data.featured),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isDbConnected !== false) {
    try {
      if (data.featured) {
        await db.update(products).set({ featured: false });
      }
      const result = await db.insert(products).values(newProduct).returning();
      isDbConnected = true;
      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  if (data.featured) {
    memoryProducts.forEach((p) => (p.featured = false));
  }
  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProductInDb(
  id: string,
  data: Partial<{
    slug: string;
    name: string;
    description: string;
    category: string;
    categoryId: string;
    brand: string;
    price: number;
    salePrice: number;
    sku: string;
    stock: number;
    minOrderQuantity: number;
    unit: string;
    image: string;
    images: string[];
    availability: string;
    active: boolean;
    specifications: { label: string; value: string }[];
    applications: string[];
    featured: boolean;
  }>
) {
  if (isDbConnected !== false) {
    try {
      if (data.featured === true) {
        await db.update(products).set({ featured: false });
      }

      const updatePayload: Record<string, any> = { updatedAt: new Date() };
      if (data.name !== undefined) {
        updatePayload.name = data.name;
        if (!data.slug) updatePayload.slug = slugify(data.name);
      }
      if (data.slug !== undefined) updatePayload.slug = data.slug;
      if (data.description !== undefined) updatePayload.description = data.description;
      if (data.category !== undefined) updatePayload.category = data.category;
      if (data.categoryId !== undefined) updatePayload.categoryId = data.categoryId;
      if (data.brand !== undefined) updatePayload.brand = data.brand;
      if (data.price !== undefined) updatePayload.price = Math.round(Number(data.price) || 0);
      if (data.salePrice !== undefined)
        updatePayload.salePrice = Math.round(Number(data.salePrice) || 0);
      if (data.sku !== undefined) updatePayload.sku = data.sku;
      if (data.stock !== undefined) updatePayload.stock = Math.round(Number(data.stock) || 0);
      if (data.minOrderQuantity !== undefined)
        updatePayload.minOrderQuantity = Math.round(Number(data.minOrderQuantity) || 1);
      if (data.unit !== undefined) updatePayload.unit = data.unit;
      if (data.image !== undefined) updatePayload.image = data.image;
      if (data.images !== undefined) updatePayload.images = data.images;
      if (data.availability !== undefined) updatePayload.availability = data.availability;
      if (data.active !== undefined) updatePayload.active = Boolean(data.active);
      if (data.specifications !== undefined) updatePayload.specifications = data.specifications;
      if (data.applications !== undefined) updatePayload.applications = data.applications;
      if (data.featured !== undefined) updatePayload.featured = Boolean(data.featured);

      const result = await db
        .update(products)
        .set(updatePayload)
        .where(eq(products.id, id))
        .returning();
      isDbConnected = true;
      if (result.length > 0) return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const idx = memoryProducts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  if (data.featured === true) {
    memoryProducts.forEach((p) => (p.featured = false));
  }
  const current = memoryProducts[idx];
  const updated = {
    ...current,
    ...data,
    slug: data.slug || (data.name ? slugify(data.name) : current.slug),
    price: data.price !== undefined ? Math.round(Number(data.price) || 0) : current.price,
    salePrice: data.salePrice !== undefined ? Math.round(Number(data.salePrice) || 0) : current.salePrice,
    updatedAt: new Date(),
  };
  memoryProducts[idx] = updated;
  return updated;
}

export async function setFeaturedProductInDb(id: string) {
  if (isDbConnected !== false) {
    try {
      await db.update(products).set({ featured: false });
      const result = await db
        .update(products)
        .set({ featured: true, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();
      isDbConnected = true;
      if (result.length > 0) return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  memoryProducts.forEach((p) => (p.featured = false));
  const target = memoryProducts.find((p) => p.id === id);
  if (!target) return null;
  target.featured = true;
  target.updatedAt = new Date();
  return target;
}

export async function toggleProductAvailabilityInDb(id: string) {
  if (isDbConnected !== false) {
    try {
      const existing = await getProductByIdFromDb(id);
      if (!existing) return null;
      const nextStatus = existing.availability === 'Available' ? 'Out of Stock' : 'Available';
      const result = await db
        .update(products)
        .set({ availability: nextStatus, updatedAt: new Date() })
        .where(eq(products.id, existing.id))
        .returning();
      isDbConnected = true;
      if (result.length > 0) return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const target = memoryProducts.find((p) => p.id === id);
  if (!target) return null;
  target.availability = target.availability === 'Available' ? 'Out of Stock' : 'Available';
  target.updatedAt = new Date();
  return target;
}

export async function deleteProductFromDb(id: string) {
  if (isDbConnected !== false) {
    try {
      const deleted = await db.delete(products).where(eq(products.id, id)).returning();
      isDbConnected = true;
      return deleted.length > 0;
    } catch (error) {
      markDbOffline(error);
    }
  }

  const prevLen = memoryProducts.length;
  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  return memoryProducts.length < prevLen;
}

export async function resetProductsInDb() {
  if (isDbConnected !== false) {
    try {
      await db.delete(products);
      const inserted = await db.insert(products).values(SEED_PRODUCTS).returning();
      isDbConnected = true;
      return inserted;
    } catch (error) {
      markDbOffline(error);
    }
  }

  memoryProducts = JSON.parse(JSON.stringify(SEED_PRODUCTS)).map((p: any) => ({
    ...p,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  if (memoryProducts.length > 0) memoryProducts[0].featured = true;
  return memoryProducts;
}

// ============================================================================
// CATEGORIES REPOSITORY
// ============================================================================

export async function getAllCategoriesFromDb() {
  if (isDbConnected !== false) {
    try {
      const existing = await db.select().from(categories);
      if (existing.length === 0) {
        await db.insert(categories).values(SEED_CATEGORIES).onConflictDoNothing();
        return await db.select().from(categories);
      }
      isDbConnected = true;
      return existing;
    } catch (error) {
      markDbOffline(error);
    }
  }

  return [...memoryCategories];
}

export async function createCategoryInDb(data: {
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
}) {
  const slug = slugify(data.name);
  const id = `cat-${slug}-${Date.now().toString(36).slice(-3)}`;
  const newCat = {
    id,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || '',
    image: data.image?.trim() || '',
    active: data.active !== undefined ? Boolean(data.active) : true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (isDbConnected !== false) {
    try {
      const result = await db
        .insert(categories)
        .values(newCat)
        .returning();
      isDbConnected = true;
      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  memoryCategories.push(newCat);
  return newCat;
}

export async function updateCategoryInDb(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    image: string;
    active: boolean;
  }>
) {
  if (isDbConnected !== false) {
    try {
      const existingRows = await db.select().from(categories).where(eq(categories.id, id));
      const existing = existingRows[0];
      if (existing) {
        const payload: Record<string, any> = {};
        if (data.name !== undefined) {
          payload.name = data.name.trim();
          payload.slug = slugify(data.name);
          if (data.name.trim() !== existing.name) {
            await db
              .update(products)
              .set({ category: data.name.trim() })
              .where(eq(products.category, existing.name));
          }
        }
        if (data.description !== undefined) payload.description = data.description;
        if (data.image !== undefined) payload.image = data.image;
        if (data.active !== undefined) payload.active = Boolean(data.active);

        const updated = await db
          .update(categories)
          .set(payload)
          .where(eq(categories.id, id))
          .returning();
        isDbConnected = true;
        return updated[0] || null;
      }
    } catch (error) {
      markDbOffline(error);
    }
  }

  const idx = memoryCategories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const existing = memoryCategories[idx];
  if (data.name && data.name.trim() !== existing.name) {
    memoryProducts.forEach((p) => {
      if (p.category === existing.name) {
        p.category = data.name!.trim();
      }
    });
  }
  const updated = {
    ...existing,
    ...data,
    name: data.name ? data.name.trim() : existing.name,
    slug: data.name ? slugify(data.name) : existing.slug,
    updatedAt: new Date(),
  };
  memoryCategories[idx] = updated;
  return updated;
}

export async function deleteCategoryFromDb(id: string): Promise<{
  deleted: boolean;
  deactivated?: boolean;
  message: string;
}> {
  if (isDbConnected !== false) {
    try {
      const existingRows = await db.select().from(categories).where(eq(categories.id, id));
      const existing = existingRows[0];
      if (!existing) {
        return { deleted: false, message: 'Category not found.' };
      }

      const associatedProducts = await db
        .select()
        .from(products)
        .where(eq(products.category, existing.name));

      if (associatedProducts.length > 0) {
        await db.update(categories).set({ active: false }).where(eq(categories.id, id));
        return {
          deleted: false,
          deactivated: true,
          message: `Category "${existing.name}" is linked to ${associatedProducts.length} product(s). It has been deactivated instead of deleted to preserve product integrity.`,
        };
      }

      await db.delete(categories).where(eq(categories.id, id));
      isDbConnected = true;
      return { deleted: true, message: `Category "${existing.name}" deleted.` };
    } catch (error) {
      markDbOffline(error);
    }
  }

  const idx = memoryCategories.findIndex((c) => c.id === id);
  if (idx === -1) {
    return { deleted: false, message: 'Category not found.' };
  }
  const existing = memoryCategories[idx];
  const associatedCount = memoryProducts.filter((p) => p.category === existing.name).length;
  if (associatedCount > 0) {
    existing.active = false;
    return {
      deleted: false,
      deactivated: true,
      message: `Category "${existing.name}" is linked to ${associatedCount} product(s). It has been deactivated instead of deleted to preserve product integrity.`,
    };
  }
  memoryCategories.splice(idx, 1);
  return { deleted: true, message: `Category "${existing.name}" deleted.` };
}

// ============================================================================
// BUSINESS SETTINGS REPOSITORY
// ============================================================================

export async function getBusinessSettingsFromDb() {
  if (isDbConnected !== false) {
    try {
      const rows = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));
      if (rows.length === 0) {
        const inserted = await db
          .insert(businessSettings)
          .values(memoryBusinessSettings)
          .returning();
        isDbConnected = true;
        return inserted[0];
      }
      isDbConnected = true;
      return rows[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  return { ...memoryBusinessSettings };
}

export async function updateBusinessSettingsInDb(
  data: Partial<{
    businessName: string;
    whatsAppNumber: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress: string;
    heroHeadline: string;
    heroSubheadline: string;
    aboutText: string;
    instagramUrl: string;
    facebookUrl: string;
    youtubeUrl: string;
    linkedinUrl: string;
  }>
) {
  if (isDbConnected !== false) {
    try {
      await getBusinessSettingsFromDb();
      const payload: Record<string, any> = { updatedAt: new Date() };
      if (data.businessName !== undefined) payload.businessName = data.businessName.trim();
      if (data.whatsAppNumber !== undefined)
        payload.whatsAppNumber = data.whatsAppNumber.replace(/[^0-9]/g, '');
      if (data.businessPhone !== undefined) payload.businessPhone = data.businessPhone.trim();
      if (data.businessEmail !== undefined) payload.businessEmail = data.businessEmail.trim();
      if (data.businessAddress !== undefined) payload.businessAddress = data.businessAddress.trim();
      if (data.heroHeadline !== undefined) payload.heroHeadline = data.heroHeadline.trim();
      if (data.heroSubheadline !== undefined) payload.heroSubheadline = data.heroSubheadline.trim();
      if (data.aboutText !== undefined) payload.aboutText = data.aboutText.trim();
      if (data.instagramUrl !== undefined) payload.instagramUrl = data.instagramUrl.trim();
      if (data.facebookUrl !== undefined) payload.facebookUrl = data.facebookUrl.trim();
      if (data.youtubeUrl !== undefined) payload.youtubeUrl = data.youtubeUrl.trim();
      if (data.linkedinUrl !== undefined) payload.linkedinUrl = data.linkedinUrl.trim();

      const updated = await db
        .update(businessSettings)
        .set(payload)
        .where(eq(businessSettings.id, 1))
        .returning();
      isDbConnected = true;
      if (updated.length > 0) return updated[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  Object.assign(memoryBusinessSettings, data, { updatedAt: new Date() });
  return { ...memoryBusinessSettings };
}

// ============================================================================
// ADMIN AUTHENTICATION REPOSITORY (PBKDF2-SHA512 Hashed Passwords)
// ============================================================================

const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'metapro-default-admin-secret-2026';

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function createAdminToken(username: string): string {
  const payload = JSON.stringify({
    sub: username,
    role: 'owner',
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });
  const base64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(base64Payload)
    .digest('base64url');
  return `${base64Payload}.${signature}`;
}

export function verifyAdminToken(token?: string): { valid: boolean; username?: string } {
  if (!token) return { valid: false };
  try {
    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) return { valid: false };
    const expectedSig = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(base64Payload)
      .digest('base64url');
    if (signature !== expectedSig) return { valid: false };
    const parsed = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
    if (!parsed.exp || Date.now() > parsed.exp) return { valid: false };
    return { valid: true, username: parsed.sub };
  } catch {
    return { valid: false };
  }
}

export async function ensureDefaultAdminUser() {
  const initialUser = process.env.ADMIN_INITIAL_USER || 'admin';
  const initialEmail = process.env.ADMIN_INITIAL_EMAIL || 'pdheeraj351@gmail.com';
  const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';

  if (memoryAdminUsers.length === 0) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(initialPass, salt);
    memoryAdminUsers.push({
      id: 1,
      username: initialUser,
      email: initialEmail,
      passwordHash,
      salt,
    });
  }

  if (isDbConnected !== false) {
    try {
      const existing = await db.select().from(adminUsers);
      if (existing.length === 0) {
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = hashPassword(initialPass, salt);
        await db.insert(adminUsers).values({
          username: initialUser,
          email: initialEmail,
          passwordHash,
          salt,
        });
      }
      isDbConnected = true;
    } catch (error) {
      markDbOffline(error);
    }
  }
}

export async function authenticateAdminInDb(identifier: string, password: string) {
  await ensureDefaultAdminUser();
  const cleanId = identifier.trim().toLowerCase();

  if (isDbConnected !== false) {
    try {
      const allAdmins = await db.select().from(adminUsers);
      const matched = allAdmins.find(
        (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
      );
      if (matched) {
        const computedHash = hashPassword(password, matched.salt);
        if (computedHash === matched.passwordHash) {
          const token = createAdminToken(matched.username);
          return { username: matched.username, email: matched.email, token };
        }
        return null;
      }
    } catch (error) {
      markDbOffline(error);
    }
  }

  const matched = memoryAdminUsers.find(
    (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
  );
  if (!matched) return null;
  const computedHash = hashPassword(password, matched.salt);
  if (computedHash !== matched.passwordHash) return null;
  const token = createAdminToken(matched.username);
  return { username: matched.username, email: matched.email, token };
}

// ============================================================================
// ENQUIRIES REPOSITORY
// ============================================================================

export async function createEnquiryInDb(data: {
  userUid?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  projectType?: string;
  items: { productId: string; name: string; quantity: number; unit?: string }[];
  notes?: string;
}) {
  if (isDbConnected !== false) {
    try {
      const result = await db
        .insert(enquiries)
        .values({
          userUid: data.userUid || null,
          customerName: data.customerName || 'Showroom Visitor',
          customerPhone: data.customerPhone || 'WhatsApp Enquiry',
          customerEmail: data.customerEmail || null,
          projectType: data.projectType || 'Interior Project',
          items: data.items,
          notes: data.notes || null,
          status: 'New',
        })
        .returning();
      isDbConnected = true;
      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const memoryEnquiry = {
    id: memoryEnquiries.length + 1,
    userUid: data.userUid || null,
    customerName: data.customerName || 'Showroom Visitor',
    customerPhone: data.customerPhone || 'WhatsApp Enquiry',
    customerEmail: data.customerEmail || null,
    projectType: data.projectType || 'Interior Project',
    items: data.items,
    notes: data.notes || null,
    status: 'New',
    createdAt: new Date(),
  };

  memoryEnquiries.unshift(memoryEnquiry);
  return memoryEnquiry;
}

export async function getAllEnquiriesFromDb() {
  if (isDbConnected !== false) {
    try {
      const list = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      isDbConnected = true;
      return list;
    } catch (error) {
      markDbOffline(error);
    }
  }

  return [...memoryEnquiries];
}
