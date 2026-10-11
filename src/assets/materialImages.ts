import heroShowroomImg from './images/hero_showroom_interiors_1790919377238.jpg';
import flutedWpcPanelsImg from './images/material_fluted_wpc_panels_1790919395083.jpg';
import pvcMarbleCeilingImg from './images/material_pvc_marble_ceiling_1790919414453.jpg';
import fastenersAnchorsImg from './images/material_fasteners_anchors_1790919426419.jpg';
import spaceApplicationsImg from './images/space_applications_showcase_1790919435342.jpg';
import hardwareProfilesTrimsImg from './images/hardware_profiles_trims_1790924245282.jpg';
import adhesivesSealantsToolsImg from './images/adhesives_sealants_tools_1790924264227.jpg';

export const MATERIAL_IMAGES = {
  heroShowroom: heroShowroomImg,
  flutedWpcPanels: flutedWpcPanelsImg,
  pvcMarbleCeiling: pvcMarbleCeilingImg,
  fastenersAnchors: fastenersAnchorsImg,
  spaceApplications: spaceApplicationsImg,
  hardwareProfilesTrims: hardwareProfilesTrimsImg,
  adhesivesSealantsTools: adhesivesSealantsToolsImg,
};

export function resolveMaterialImage(url?: string, category?: string): string {
  if (
    url &&
    !url.includes('images.unsplash.com') &&
    !url.includes('picsum.photos') &&
    !url.includes('placeholder.com')
  ) {
    if (url.includes('hero_showroom_interiors')) return heroShowroomImg;
    if (url.includes('material_fluted_wpc_panels')) return flutedWpcPanelsImg;
    if (url.includes('material_pvc_marble_ceiling')) return pvcMarbleCeilingImg;
    if (url.includes('material_fasteners_anchors')) return fastenersAnchorsImg;
    if (url.includes('space_applications_showcase')) return spaceApplicationsImg;
    if (url.includes('hardware_profiles_trims')) return hardwareProfilesTrimsImg;
    if (url.includes('adhesives_sealants_tools')) return adhesivesSealantsToolsImg;
    return url;
  }
  const cat = (category || '').toLowerCase();
  if (cat.includes('profile') || cat.includes('trim') || cat.includes('channel') || cat.includes('framing')) {
    return hardwareProfilesTrimsImg;
  }
  if (cat.includes('adhesive') || cat.includes('sealant') || cat.includes('tape') || cat.includes('tool')) {
    return adhesivesSealantsToolsImg;
  }
  if (cat.includes('fastener') || cat.includes('screw') || cat.includes('anchor') || cat.includes('hardware')) {
    return fastenersAnchorsImg;
  }
  if (cat.includes('fluted') || cat.includes('wpc')) return flutedWpcPanelsImg;
  if (cat.includes('pvc') || cat.includes('ceiling') || cat.includes('decorative')) return pvcMarbleCeilingImg;
  return hardwareProfilesTrimsImg;
}
