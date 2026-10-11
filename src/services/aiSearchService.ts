import { apiUrl } from './api';

export interface AISpecifierRecommendation {
  productName: string;
  category: string;
  whyRecommended: string;
  keySpec: string;
  estimatedQuantityRule: string;
}

export interface AISpecifierResponse {
  understanding: string;
  recommendations: AISpecifierRecommendation[];
  technicalAdvice: string;
  proInstallationTip: string;
  followUpSuggestions: string[];
  isAiLive?: boolean;
}

// Built-in intelligent fallback engine when backend is offline or API key is not yet configured
export function getLocalFallbackSpecifier(query: string, category?: string): AISpecifierResponse {
  const q = query.toLowerCase();

  if (q.includes('screw') || q.includes('gypsum') || q.includes('drywall') || q.includes('board') || q.includes('stud')) {
    return {
      understanding: `Fastener specification analysis for gypsum drywall and false ceiling installation (${query})`,
      recommendations: [
        {
          productName: 'MetaPro Drywall Screws Bugle Head Phillips Twinfast Thread (Box of 1,000)',
          category: 'Fasteners & Screws',
          whyRecommended: 'Black phosphate coating prevents gypsum surface paper tear and resists indoor humidity corrosion. Twinfast dual-lead thread penetrates 0.8mm light gauge steel framing in under 1.2 seconds without pre-drilling.',
          keySpec: 'Size: 3.5mm x 25mm (6 x 1"), Head: #2 Bugle Phillips, Hardness: 550 HV min.',
          estimatedQuantityRule: 'Rule of thumb: Use 28 to 32 screws per standard 8x4 ft (32 sq ft) drywall board spaced 200mm at edges and 300mm in field.'
        }
      ],
      technicalAdvice: 'Ensure screws are driven flush (dimpled) without puncturing the face paper to preserve gypsum core shear strength.',
      proInstallationTip: 'Use a drywall screwdriver gun with a depth-sensitive clutch set at 0.8mm countersink for uniform joint tape bedding.',
      followUpSuggestions: [
        'What screw length for double layer 12.5mm gypsum?',
        'Do I need self-drilling screws for 1.2mm GI framing?',
        'How many boxes needed for 1,200 sq ft ceiling?'
      ],
      isAiLive: false
    };
  }

  if (q.includes('anchor') || q.includes('bolt') || q.includes('concrete') || q.includes('heavy') || q.includes('hold') || q.includes('wall mount')) {
    return {
      understanding: `Heavy-duty anchoring & tensile calculation for masonry and concrete substrate (${query})`,
      recommendations: [
        {
          productName: 'MetaPro Heavy-Duty Yellow Zinc Expansion Anchor Fasteners M10 (Pack of 50)',
          category: 'Anchor Bolts & Hardware',
          whyRecommended: 'High-tensile carbon steel Class 5.8 sleeve anchor with yellow zinc dichromate passivated plating for 1,450 kgf pull-out resistance in M20/M25 concrete.',
          keySpec: 'Dimensions: M10 x 75mm (3/8" x 3"), Required Drill Hole: 12mm, Min Embedment: 50mm.',
          estimatedQuantityRule: 'For heavy equipment brackets (AC outdoor units, TV wall arms, channel brackets), specify minimum 4 anchors per bracket with a safety factor of 3.0.'
        }
      ],
      technicalAdvice: 'Always blow out drill hole debris with compressed air or hand pump before hammer-tapping the sleeve anchor to prevent friction loss.',
      proInstallationTip: 'Torque to 35-40 Nm; avoid over-tightening in hollow brick or lightweight AAC blocks where nylon chemical anchors are preferred.',
      followUpSuggestions: [
        'What is the load capacity of M8 vs M10 anchor?',
        'Can I use expansion bolts in AAC autoclaved blocks?',
        'What drill bit type is required for granite cladding?'
      ],
      isAiLive: false
    };
  }

  if (q.includes('water') || q.includes('panel') || q.includes('moisture') || q.includes('bathroom') || q.includes('pvc') || q.includes('marble')) {
    return {
      understanding: `Moisture-proof and acoustic architectural wall cladding recommendation (${query})`,
      recommendations: [
        {
          productName: 'MetaPro Italian Calacatta Gold UV Coated PVC Marble Sheet (8x4 ft)',
          category: 'PVC Wall Panels',
          whyRecommended: '100% waterproof and termite-proof virgin PVC polymer core with high-gloss UV cured coating that resists steam, moisture, and stains in wet zones.',
          keySpec: 'Thickness: 3.0mm, Size: 2440 x 1220mm (8x4 ft), Fire Rating: Class B1 Flame Retardant.',
          estimatedQuantityRule: 'Each sheet covers 32 sq ft. Add 8% allowance for tile layout cuts and corner joint profiles.'
        },
        {
          productName: 'MetaPro Charcoal Grey Fluted Wall Panel (Interior Louver)',
          category: 'Fluted Panels',
          whyRecommended: 'High-density polystyrene fluted slats provide 3D texture and acoustic diffusion behind TV media units and accent walls.',
          keySpec: 'Length: 2900mm (9.5 ft), Width: 120mm, Profile: 12mm flute depth.',
          estimatedQuantityRule: 'Calculate wall width in mm divided by 120mm net panel interlock width.'
        }
      ],
      technicalAdvice: 'For wet areas like bathrooms or splashbacks, seal all panel-to-panel grooves with neutral cure silicone adhesive.',
      proInstallationTip: 'Apply hybrid MS polymer adhesive in continuous vertical serpentine beads on flat plastered wall or existing tile base.',
      followUpSuggestions: [
        'Can UV marble sheets be applied directly over old ceramic tiles?',
        'Which adhesive is best for fluted wall panels?',
        'Are PVC panels safe near kitchen gas stoves?'
      ],
      isAiLive: false
    };
  }

  return {
    understanding: `Architectural material requirement analysis for: "${query}"`,
    recommendations: [
      {
        productName: 'MetaPro Drywall Screws Bugle Head Phillips Twinfast Thread (Box of 1,000)',
        category: category || 'Fasteners & Screws',
        whyRecommended: 'Multi-purpose professional fastener suitable for gypsum, acoustic boards, and light gauge framing.',
        keySpec: 'Black phosphate, twinfast thread, precision hardened.',
        estimatedQuantityRule: 'Standard 28-32 screws per 8x4 sheet.'
      },
      {
        productName: 'MetaPro Heavy-Duty Yellow Zinc Expansion Anchor Fasteners M10 (Pack of 50)',
        category: 'Anchor Bolts & Hardware',
        whyRecommended: 'Structural load bearing in concrete ceilings, lintels, and brick walls.',
        keySpec: 'M10 x 75mm, 1450 kgf load capacity.',
        estimatedQuantityRule: '1 anchor per 1200mm ceiling perimeter or hanger wire.'
      }
    ],
    technicalAdvice: 'Verify substrate load requirements and select anti-corrosion finishes suitable for indoor vs outdoor humidity.',
    proInstallationTip: 'Always request factory test certificates for high-rise or commercial compliance projects.',
    followUpSuggestions: [
      'What are the standard sizes for drywall screws?',
      'How to calculate fluted wall panel requirements?',
      'Do you offer wholesale bulk discounts for contractors?'
    ],
    isAiLive: false
  };
}

export async function fetchAISpecifier(
  query: string,
  category?: string,
  projectContext?: string
): Promise<AISpecifierResponse> {
  try {
    const res = await fetch(apiUrl('/api/ai/specifier'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        category,
        projectContext,
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data: AISpecifierResponse = await res.json();
    return data;
  } catch (err) {
    console.warn('Using client-side fallback AI specifier:', err);
    return getLocalFallbackSpecifier(query, category);
  }
}

export async function fetchAISuggestions(query: string): Promise<string[]> {
  try {
    const res = await fetch(apiUrl('/api/ai/autocomplete'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch (err) {
    return [];
  }
}
