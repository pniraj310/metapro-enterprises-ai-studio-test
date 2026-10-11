import { ProductReview } from '../types/product';

const REVIEWS_STORAGE_KEY = 'metapro_product_reviews_v1';

export const INITIAL_REVIEWS: ProductReview[] = [
  // mp-prod-001 (Drywall Screws)
  {
    id: 'rev-001',
    productId: 'mp-prod-001',
    author: 'Rajesh Sharma',
    role: 'Civil Contractor, DLF Projects',
    rating: 5,
    title: 'Top notch quality! Zero screw slippage and razor sharp tips.',
    comment: 'We used over 20,000 screws on our latest corporate drywall partition project in Cyber City. The phillips bugle head engages smoothly without stripping drill bits. The black phosphated coating provides solid corrosion resistance.',
    date: 'February 18, 2026',
    verified: true,
    helpfulCount: 38
  },
  {
    id: 'rev-002',
    productId: 'mp-prod-001',
    author: 'Vikram Mehta',
    role: 'Interior Turnkey Specialist',
    rating: 5,
    title: 'Value for money bulk packaging. Highly recommend for drywalling.',
    comment: 'The twinfast thread bites directly into light gauge metal framing without pre-punching. Packaging was sturdy, no loose damaged threads. MetaPro has become our permanent fastener supplier.',
    date: 'January 29, 2026',
    verified: true,
    helpfulCount: 22
  },
  {
    id: 'rev-003',
    productId: 'mp-prod-001',
    author: 'Anand Patel',
    role: 'False Ceiling Installer',
    rating: 4,
    title: 'Very good grip, saves time on site',
    comment: 'Consistent quality across the entire 1,000 piece box. Clean coating and precise #2 Phillips socket. Delivery was prompt within 2 days.',
    date: 'March 02, 2026',
    verified: true,
    helpfulCount: 15
  },

  // mp-prod-002 (Expansion Anchor Fasteners)
  {
    id: 'rev-004',
    productId: 'mp-prod-002',
    author: 'Suresh Kumar',
    role: 'HVAC & Ducting Engineer',
    rating: 5,
    title: 'Solid anchoring for heavy ceiling ducts and heavy loads',
    comment: 'Installed M10 sleeve expansion anchors into M25 grade concrete slab. Tensile grip is phenomenal. The yellow zinc passivated coating gives superior rust protection in basements.',
    date: 'February 24, 2026',
    verified: true,
    helpfulCount: 29
  },
  {
    id: 'rev-005',
    productId: 'mp-prod-002',
    author: 'Sunil Rao',
    role: 'MEP Project Manager',
    rating: 5,
    title: 'Heavy duty build quality, strictly adheres to specs',
    comment: 'Drilled 12mm holes, anchors seated cleanly. The washer and hex nut are properly hardened steel. Excellent product from MetaPro.',
    date: 'March 08, 2026',
    verified: true,
    helpfulCount: 14
  },

  // mp-prod-003 (Fluted Panels)
  {
    id: 'rev-006',
    productId: 'mp-prod-003',
    author: 'Pooja Singhania',
    role: 'Principal Architect, Studio Luxe',
    rating: 5,
    title: 'Stunning luxury finish! Completely transformed our client’s living room',
    comment: 'The matte charcoal texture combined with warm walnut depth looks like high-end imported Italian architectural louvers. Interlocking tongue & groove mechanism made installation rapid and completely seamless.',
    date: 'March 11, 2026',
    verified: true,
    helpfulCount: 45
  },
  {
    id: 'rev-007',
    productId: 'mp-prod-003',
    author: 'Karan Verma',
    role: 'Interior Decorator',
    rating: 4,
    title: 'Premium acoustic feel and 100% moisture proof',
    comment: 'Used behind a 75-inch TV feature wall with concealed warm LED strip lighting. The result is pure hotel luxury. Great packaging and protected corners.',
    date: 'February 15, 2026',
    verified: true,
    helpfulCount: 19
  },

  // mp-prod-004 (PVC Marble Wall Panels)
  {
    id: 'rev-008',
    productId: 'mp-prod-004',
    author: 'Deepak Nair',
    role: 'Commercial Developer',
    rating: 5,
    title: 'Looks 100% identical to natural Italian Statuario marble!',
    comment: 'We cladded 4 lift lobbies and entrance hallways. Weighs a fraction of natural stone, saved us 70% in installation labor costs. The UV mirror gloss coat is very resilient to fingerprints and scuffs.',
    date: 'March 01, 2026',
    verified: true,
    helpfulCount: 33
  },

  // mp-prod-005 (WPC Louver Panels)
  {
    id: 'rev-009',
    productId: 'mp-prod-005',
    author: 'Harpreet Singh',
    role: 'Exterior Elevation Specialist',
    rating: 5,
    title: 'Outstanding weather resistance for terrace elevation',
    comment: 'Installed on exterior facade exposed to rain and full sun. Zero warping, color has not faded at all. Sturdy composite material with natural timber touch.',
    date: 'February 20, 2026',
    verified: true,
    helpfulCount: 27
  },

  // mp-prod-006 (Acoustic Ceiling Panels)
  {
    id: 'rev-010',
    productId: 'mp-prod-006',
    author: 'Dr. Amitabh Roy',
    role: 'Auditorium Acoustic Consultant',
    rating: 5,
    title: 'Noticeable sound dampening and crisp modern finish',
    comment: 'Measured NRC is true to lab specification. Echo dropped drastically in the 120-seat conference room. Lay-in into the standard 24mm T-grid was seamless.',
    date: 'January 14, 2026',
    verified: true,
    helpfulCount: 18
  },

  // mp-prod-007 (Chalk Line Powder)
  {
    id: 'rev-011',
    productId: 'mp-prod-007',
    author: 'Ramesh Yadav',
    role: 'Drywall Foreman',
    rating: 5,
    title: 'Vibrant blue snap line that doesn’t blow away',
    comment: 'Excellent cling on rough concrete subfloor. Even when workers walk over the line, it stays clearly visible for framing layout.',
    date: 'March 05, 2026',
    verified: true,
    helpfulCount: 11
  }
];

export const reviewService = {
  getAllReviews(): ProductReview[] {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  getReviewsByProductId(productId: string): ProductReview[] {
    const reviews = this.getAllReviews();
    return reviews.filter((r) => r.productId === productId);
  },

  addReview(newReview: Omit<ProductReview, 'id' | 'date' | 'helpfulCount' | 'verified'>): ProductReview {
    const reviews = this.getAllReviews();
    const created: ProductReview = {
      ...newReview,
      id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      verified: true,
      helpfulCount: 0
    };
    reviews.unshift(created);
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save review', e);
    }
    return created;
  },

  voteHelpful(reviewId: string): void {
    const reviews = this.getAllReviews();
    const found = reviews.find((r) => r.id === reviewId);
    if (found) {
      found.helpfulCount = (found.helpfulCount || 0) + 1;
      try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      } catch (e) {
        console.error('Failed to update helpful count', e);
      }
    }
  }
};
