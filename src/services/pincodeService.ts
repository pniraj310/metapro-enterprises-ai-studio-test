export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  isDeliverable: boolean;
  deliveryDays: number;
  deliveryEstimate: string;
  expressAvailable: boolean;
  hubLocation: string;
  freeDeliveryThreshold: number;
}

// Preset popular cities and hubs across India
export const POPULAR_PINCODES: Record<string, { city: string; state: string; hub: string; days: number }> = {
  // Delhi NCR Hubs
  '110001': { city: 'New Delhi (Connaught Place)', state: 'Delhi', hub: 'Central North Warehouse', days: 1 },
  '110020': { city: 'Okhla Industrial Area', state: 'Delhi', hub: 'Delhi South Depot', days: 1 },
  '122001': { city: 'Gurugram', state: 'Haryana', hub: 'NCR West Hub', days: 1 },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', hub: 'NCR East Hub', days: 1 },
  '121001': { city: 'Faridabad', state: 'Haryana', hub: 'NCR South Hub', days: 1 },
  '201001': { city: 'Ghaziabad', state: 'Uttar Pradesh', hub: 'NCR East Hub', days: 1 },

  // West India Hubs
  '400001': { city: 'Mumbai (Fort / South)', state: 'Maharashtra', hub: 'Bhiwandi Central Depot', days: 1 },
  '400051': { city: 'Bandra Kurla Complex (BKC)', state: 'Maharashtra', hub: 'Mumbai Hub', days: 1 },
  '411001': { city: 'Pune', state: 'Maharashtra', hub: 'Chakan Logistics Park', days: 2 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', hub: 'Sanand Industrial Depot', days: 2 },
  '395001': { city: 'Surat', state: 'Gujarat', hub: 'Surat Express Depot', days: 2 },

  // South India Hubs
  '560001': { city: 'Bengaluru (Central)', state: 'Karnataka', hub: 'Hosur Road Warehouse', days: 2 },
  '560066': { city: 'Whitefield, Bengaluru', state: 'Karnataka', hub: 'Bengaluru East Depot', days: 2 },
  '500001': { city: 'Hyderabad', state: 'Telangana', hub: 'Shamshabad Logistics Hub', days: 2 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', hub: 'Sriperumbudur Depot', days: 2 },
  '682001': { city: 'Kochi', state: 'Kerala', hub: 'Kochi Port Logistics', days: 3 },

  // East & North India Hubs
  '700001': { city: 'Kolkata', state: 'West Bengal', hub: 'Dankuni Logistics Park', days: 2 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', hub: 'Jaipur Ring Road Depot', days: 2 },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', hub: 'Lucknow Transport Nagar', days: 2 },
  '800001': { city: 'Patna', state: 'Bihar', hub: 'Patna Central Depot', days: 3 },
  '141001': { city: 'Ludhiana', state: 'Punjab', hub: 'Ludhiana Cargo Hub', days: 2 },
  '160017': { city: 'Chandigarh', state: 'Chandigarh', hub: 'Chandigarh Tri-city Hub', days: 2 },
  '462001': { city: 'Bhopal', state: 'Madhya Pradesh', hub: 'Bhopal Bypass Logistics', days: 2 },
  '492001': { city: 'Raipur', state: 'Chhattisgarh', hub: 'Raipur Ring Road Hub', days: 3 }
};

// Zone prefixes to approximate any valid Indian 6-digit PIN
const PIN_ZONE_MAP: Record<string, { state: string; sampleCity: string }> = {
  '11': { state: 'Delhi', sampleCity: 'Delhi' },
  '12': { state: 'Haryana', sampleCity: 'Gurugram' },
  '13': { state: 'Haryana', sampleCity: 'Ambala' },
  '14': { state: 'Punjab', sampleCity: 'Ludhiana' },
  '15': { state: 'Punjab', sampleCity: 'Bathinda' },
  '16': { state: 'Chandigarh', sampleCity: 'Chandigarh' },
  '17': { state: 'Himachal Pradesh', sampleCity: 'Shimla' },
  '18': { state: 'Jammu & Kashmir', sampleCity: 'Jammu' },
  '19': { state: 'Jammu & Kashmir', sampleCity: 'Srinagar' },
  '20': { state: 'Uttar Pradesh', sampleCity: 'Noida / Aligarh' },
  '21': { state: 'Uttar Pradesh', sampleCity: 'Prayagraj' },
  '22': { state: 'Uttar Pradesh', sampleCity: 'Lucknow' },
  '23': { state: 'Uttar Pradesh', sampleCity: 'Varanasi' },
  '24': { state: 'Uttarakhand', sampleCity: 'Dehradun' },
  '25': { state: 'Uttar Pradesh', sampleCity: 'Meerut' },
  '26': { state: 'Uttarakhand', sampleCity: 'Haldwani' },
  '27': { state: 'Uttar Pradesh', sampleCity: 'Gorakhpur' },
  '28': { state: 'Uttar Pradesh', sampleCity: 'Agra' },
  '30': { state: 'Rajasthan', sampleCity: 'Jaipur' },
  '31': { state: 'Rajasthan', sampleCity: 'Udaipur' },
  '32': { state: 'Rajasthan', sampleCity: 'Kota' },
  '33': { state: 'Rajasthan', sampleCity: 'Bikaner' },
  '34': { state: 'Rajasthan', sampleCity: 'Jodhpur' },
  '36': { state: 'Gujarat', sampleCity: 'Rajkot' },
  '37': { state: 'Gujarat', sampleCity: 'Gandhidham' },
  '38': { state: 'Gujarat', sampleCity: 'Ahmedabad' },
  '39': { state: 'Gujarat', sampleCity: 'Surat' },
  '40': { state: 'Maharashtra', sampleCity: 'Mumbai' },
  '41': { state: 'Maharashtra', sampleCity: 'Pune' },
  '42': { state: 'Maharashtra', sampleCity: 'Nashik' },
  '43': { state: 'Maharashtra', sampleCity: 'Chhatrapati Sambhajinagar' },
  '44': { state: 'Maharashtra', sampleCity: 'Nagpur' },
  '45': { state: 'Madhya Pradesh', sampleCity: 'Indore' },
  '46': { state: 'Madhya Pradesh', sampleCity: 'Bhopal' },
  '47': { state: 'Madhya Pradesh', sampleCity: 'Gwalior' },
  '48': { state: 'Madhya Pradesh', sampleCity: 'Jabalpur' },
  '49': { state: 'Chhattisgarh', sampleCity: 'Raipur' },
  '50': { state: 'Telangana', sampleCity: 'Hyderabad' },
  '51': { state: 'Andhra Pradesh', sampleCity: 'Tirupati' },
  '52': { state: 'Andhra Pradesh', sampleCity: 'Vijayawada' },
  '53': { state: 'Andhra Pradesh', sampleCity: 'Visakhapatnam' },
  '56': { state: 'Karnataka', sampleCity: 'Bengaluru' },
  '57': { state: 'Karnataka', sampleCity: 'Mangaluru' },
  '58': { state: 'Karnataka', sampleCity: 'Hubballi' },
  '59': { state: 'Karnataka', sampleCity: 'Belagavi' },
  '60': { state: 'Tamil Nadu', sampleCity: 'Chennai' },
  '61': { state: 'Tamil Nadu', sampleCity: 'Tiruchirappalli' },
  '62': { state: 'Tamil Nadu', sampleCity: 'Madurai' },
  '63': { state: 'Tamil Nadu', sampleCity: 'Salem' },
  '64': { state: 'Tamil Nadu', sampleCity: 'Coimbatore' },
  '67': { state: 'Kerala', sampleCity: 'Kozhikode' },
  '68': { state: 'Kerala', sampleCity: 'Kochi' },
  '69': { state: 'Kerala', sampleCity: 'Thiruvananthapuram' },
  '70': { state: 'West Bengal', sampleCity: 'Kolkata' },
  '71': { state: 'West Bengal', sampleCity: 'Howrah' },
  '72': { state: 'West Bengal', sampleCity: 'Medinipur' },
  '73': { state: 'West Bengal', sampleCity: 'Siliguri' },
  '74': { state: 'West Bengal', sampleCity: 'North 24 Parganas' },
  '75': { state: 'Odisha', sampleCity: 'Bhubaneswar' },
  '76': { state: 'Odisha', sampleCity: 'Cuttack' },
  '77': { state: 'Odisha', sampleCity: 'Rourkela' },
  '78': { state: 'Assam', sampleCity: 'Guwahati' },
  '79': { state: 'Northeast Region', sampleCity: 'Shillong / Imphal' },
  '80': { state: 'Bihar', sampleCity: 'Patna' },
  '81': { state: 'Bihar', sampleCity: 'Bhagalpur' },
  '82': { state: 'Jharkhand', sampleCity: 'Gaya / Bokaro' },
  '83': { state: 'Jharkhand', sampleCity: 'Ranchi / Jamshedpur' },
  '84': { state: 'Bihar', sampleCity: 'Muzaffarpur' },
  '85': { state: 'Bihar', sampleCity: 'Purnia' }
};

export const pincodeService = {
  // Validate Indian Pincode format (6 digits, cannot start with 0)
  isValidPincode: (pin: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pin.trim());
  },

  // Lookup pincode delivery information
  getPincodeDetails: (pincode: string): PincodeInfo => {
    const cleanPin = pincode.trim();

    if (!pincodeService.isValidPincode(cleanPin)) {
      return {
        pincode: cleanPin,
        city: 'Invalid PIN',
        state: 'India',
        isDeliverable: false,
        deliveryDays: 0,
        deliveryEstimate: 'Invalid 6-digit Pincode',
        expressAvailable: false,
        hubLocation: 'N/A',
        freeDeliveryThreshold: 499
      };
    }

    // Check exact match in popular hubs
    if (POPULAR_PINCODES[cleanPin]) {
      const match = POPULAR_PINCODES[cleanPin];
      const deliveryEstimate =
        match.days === 1
          ? 'FREE delivery Tomorrow by 11:00 AM'
          : `FREE delivery in ${match.days} business days`;

      return {
        pincode: cleanPin,
        city: match.city,
        state: match.state,
        isDeliverable: true,
        deliveryDays: match.days,
        deliveryEstimate,
        expressAvailable: match.days <= 2,
        hubLocation: match.hub,
        freeDeliveryThreshold: 499
      };
    }

    // Zone-based heuristic for any valid Indian PIN code
    const prefix = cleanPin.substring(0, 2);
    const zone = PIN_ZONE_MAP[prefix];

    const state = zone ? zone.state : 'India';
    const city = zone ? zone.sampleCity : `Area PIN ${cleanPin}`;
    const days = 3;

    return {
      pincode: cleanPin,
      city,
      state,
      isDeliverable: true,
      deliveryDays: days,
      deliveryEstimate: `Delivery within 2-3 business days`,
      expressAvailable: false,
      hubLocation: `Regional Hub (${state})`,
      freeDeliveryThreshold: 499
    };
  }
};
