import { Product } from '../types/product';
import { apiUrl } from './api';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
  quickReplies?: string[];
  isLive?: boolean;
}

export interface SupportChatRequest {
  message: string;
  history: { role: 'user' | 'model'; text: string }[];
  catalogContext: Partial<Product>[];
  currentProductId?: string;
}

export interface SupportChatResponse {
  reply: string;
  suggestedProductIds: string[];
  quickReplies: string[];
  isLive?: boolean;
  isAiLive?: boolean;
}

export const aiChatService = {
  async sendMessage(params: SupportChatRequest): Promise<SupportChatResponse> {
    try {
      const response = await fetch(apiUrl('/api/ai/support-chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: SupportChatResponse = await response.json();
      return data;
    } catch (err) {
      console.warn('aiChatService fallback to local reasoning engine:', err);
      return this.getLocalFallback(params.message, params.catalogContext);
    }
  },

  getLocalFallback(message: string, catalogContext: Partial<Product>[]): SupportChatResponse {
    const q = message.toLowerCase();

    if (q.includes('screw') || q.includes('gypsum') || q.includes('drywall') || q.includes('ceiling') || q.includes('fastener')) {
      const screw = catalogContext.find(p => p.name?.toLowerCase().includes('screw') || p.category?.includes('Fasteners'));
      return {
        reply: `For gypsum boards and false ceilings, **MetaPro Twinfast Drywall Screws** are engineered with:\n\n• **Thread Design:** High-low twinfast thread for rapid steel stud bite without pre-drilling.\n• **Bugle Head:** Countersinks flush with gypsum paper without tearing the core.\n• **Recommended Spacing:** 250mm to 300mm on centers along metal framing studs.\n• **Coating:** Black phosphated for maximum corrosion protection against joint compound moisture.`,
        suggestedProductIds: screw?.id ? [screw.id] : [],
        quickReplies: [
          'How many screws per 8x4 sheet?',
          'What drill bit size is recommended?',
          'Do you have bulk contractor packs?'
        ],
        isAiLive: false
      };
    }

    if (q.includes('anchor') || q.includes('bolt') || q.includes('concrete') || q.includes('load') || q.includes('heavy') || q.includes('brick')) {
      const anchor = catalogContext.find(p => p.name?.toLowerCase().includes('anchor') || p.category?.includes('Anchor'));
      return {
        reply: `For solid masonry and structural concrete anchoring, use **MetaPro Yellow Zinc Mechanical Expansion Anchors**:\n\n• **Tension Rating:** Up to 650kg tensile pullout for M10 grade.\n• **Embedment Depth:** Minimum 50mm in solid C25 concrete.\n• **Applications:** Outdoor AC condenser stands, heavy framing channels, railings, and structural brackets.\n• **Corrosion Protection:** Yellow zinc plating prevents atmospheric oxidation.`,
        suggestedProductIds: anchor?.id ? [anchor.id] : [],
        quickReplies: [
          'What drill bit size for M10?',
          'Can anchors be used in hollow brick?',
          'What is the recommended torque?'
        ],
        isAiLive: false
      };
    }

    if (q.includes('panel') || q.includes('wall') || q.includes('fluted') || q.includes('pvc') || q.includes('wpc') || q.includes('waterproof')) {
      const panel = catalogContext.find(p => p.category?.includes('Panel') || p.name?.toLowerCase().includes('panel'));
      return {
        reply: `MetaPro architectural wall systems combine modern acoustics with durability:\n\n• **PVC UV Marble Sheets:** 100% moisture-resistant, lightweight, and perfect for bathroom/kitchen accent walls.\n• **Charcoal Fluted Louvers:** High-density acoustic fluted profile for luxury TV backdrops and office partitions.\n• **WPC Exterior Cladding:** Weather-shield composite resistant to harsh sun and rain.\n• **Installation:** Use high-grab polyurethane adhesive with tongue-and-groove interlock.`,
        suggestedProductIds: panel?.id ? [panel.id] : [],
        quickReplies: [
          'What adhesive is needed for panels?',
          'Are fluted panels termite proof?',
          'How to calculate sheets needed for my wall?'
        ],
        isAiLive: false
      };
    }

    if (q.includes('delivery') || q.includes('shipping') || q.includes('cod') || q.includes('time') || q.includes('truck')) {
      return {
        reply: `**MetaPro Logistics & Delivery Details:**\n\n• **Dispatch Window:** Same-day dispatch for orders placed before 2:00 PM IST.\n• **Standard Site Transit:** 24 to 48 hours across major Indian cities & industrial hubs.\n• **Payment Methods:** Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Corporate Purchase Orders.\n• **GST Invoicing:** All shipments include a formal B2B GST tax invoice for input tax credits.`,
        suggestedProductIds: [],
        quickReplies: [
          'How do I track my active shipment?',
          'What is the minimum order for free shipping?',
          'Can I change delivery site address?'
        ],
        isAiLive: false
      };
    }

    // Generic helpful overview
    return {
      reply: `Welcome to **MetaPro Support**! We specialize in direct manufacturer supply of construction fasteners, mechanical expansion anchors, acoustic fluted panels, and UV PVC wall sheets.\n\nHow can our technical team assist your project today?`,
      suggestedProductIds: catalogContext.slice(0, 2).map(p => p.id || ''),
      quickReplies: [
        'Which drywall screws do I need?',
        'Anchor bolts for heavy concrete load',
        'Waterproof panels for wet areas'
      ],
      isAiLive: false
    };
  }
};
