import React, { useState, useEffect } from 'react';
import { Product, ProductFormData, ProductSpecification } from '../types/product';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../services/productService';
import { MATERIAL_IMAGES, resolveMaterialImage } from '../assets/materialImages';
import {
  Plus,
  Trash2,
  AlertCircle,
  Star,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const STUDIO_IMAGE_PRESETS = [
  { label: 'Fluted & WPC Panels', url: MATERIAL_IMAGES.flutedWpcPanels },
  { label: 'PVC Marble & Ceiling Tiles', url: MATERIAL_IMAGES.pvcMarbleCeiling },
  { label: 'Fasteners & Anchor Bolts', url: MATERIAL_IMAGES.fastenersAnchors },
  { label: 'Aluminium Profiles & Trims', url: MATERIAL_IMAGES.hardwareProfilesTrims },
  { label: 'Adhesives, Mesh Tapes & Tools', url: MATERIAL_IMAGES.adhesivesSealantsTools },
  { label: 'Showroom Interior Overview', url: MATERIAL_IMAGES.heroShowroom },
  { label: 'Commercial Space Application', url: MATERIAL_IMAGES.spaceApplications },
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { categories } = useProducts();

  const availableCategoryNames =
    categories.length > 0
      ? categories.filter((c) => c.active !== false).map((c) => c.name)
      : CATEGORIES.filter((c) => c !== 'All');

  // Basic Information
  const [name, setName] = useState('');
  const [category, setCategory] = useState(availableCategoryNames[0] || 'Fluted Panels');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');

  // Pricing
  const [price, setPrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [unit, setUnit] = useState('sq. ft.');

  // Inventory
  const [stock, setStock] = useState<string>('50');
  const [availability, setAvailability] = useState<'Available' | 'Out of Stock'>('Available');

  // Product Images (Main Image + Additional Images)
  const [mainImage, setMainImage] = useState(MATERIAL_IMAGES.flutedWpcPanels);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Specifications & Applications
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { label: 'Finish', value: '' },
    { label: 'Application', value: '' },
  ]);
  const [applications, setApplications] = useState<string[]>([
    'Living Room',
    'Feature Wall',
    'Office',
  ]);
  const [newApplication, setNewApplication] = useState('');

  // Homepage Featured Toggle
  const [featured, setFeatured] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setSku(initialData.sku || '');
      setPrice(initialData.price.toString());
      setSalePrice(
        initialData.salePrice !== undefined ? initialData.salePrice.toString() : ''
      );
      setUnit(initialData.unit || 'Unit');
      setStock((initialData.stock ?? 50).toString());
      setAvailability(initialData.availability);

      const resolvedMain = resolveMaterialImage(initialData.image, initialData.category);
      setMainImage(resolvedMain);

      const rawGallery =
        initialData.images && initialData.images.length > 0
          ? initialData.images.map((img) => resolveMaterialImage(img, initialData.category))
          : [resolvedMain];
      const extras = rawGallery.filter((img, idx) => idx > 0 || img !== resolvedMain);
      setAdditionalImages(extras);

      setSpecifications(
        initialData.specifications && initialData.specifications.length > 0
          ? initialData.specifications.map((s) => ({ ...s }))
          : [{ label: 'Finish', value: '' }]
      );
      setApplications(
        initialData.applications && initialData.applications.length > 0
          ? [...initialData.applications]
          : []
      );
      setFeatured(Boolean(initialData.featured));
    } else {
      setName('');
      setCategory(availableCategoryNames[0] || 'Fluted Panels');
      setDescription('');
      setSku('');
      setPrice('');
      setSalePrice('');
      setUnit('sq. ft.');
      setStock('50');
      setAvailability('Available');
      setMainImage(MATERIAL_IMAGES.flutedWpcPanels);
      setAdditionalImages([]);
      setSpecifications([
        { label: 'Finish', value: '' },
        { label: 'Dimensions', value: '' },
      ]);
      setApplications(['Living Room', 'Feature Wall', 'Office']);
      setFeatured(false);
    }
  }, [initialData]);

  // Multi-Image Handlers
  const handleAddAdditionalImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!additionalImages.includes(trimmed) && trimmed !== mainImage) {
      setAdditionalImages([...additionalImages, trimmed]);
    }
    setNewImageUrl('');
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const handleSetAsMainImage = (index: number) => {
    const selected = additionalImages[index];
    const previousMain = mainImage;
    const updatedExtras = additionalImages.filter((_, i) => i !== index);
    if (previousMain && !updatedExtras.includes(previousMain)) {
      updatedExtras.unshift(previousMain);
    }
    setMainImage(selected);
    setAdditionalImages(updatedExtras);
  };

  // Specification Handlers
  const handleSpecChange = (index: number, field: 'label' | 'value', text: string) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: text };
    setSpecifications(updated);
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Application Handlers
  const handleAddApplication = () => {
    const trimmed = newApplication.trim();
    if (!trimmed) return;
    if (!applications.includes(trimmed)) {
      setApplications([...applications, trimmed]);
    }
    setNewApplication('');
  };

  const handleRemoveApplication = (index: number) => {
    setApplications(applications.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Enter a valid price greater than 0';
    }
    if (!category.trim()) {
      newErrors.category = 'Select a product category';
    }
    if (!description.trim()) {
      newErrors.description = 'Product description is required';
    }
    if (!mainImage.trim()) {
      newErrors.image = 'Main product image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const validSpecs = specifications.filter(
      (s) => s.label.trim() !== '' && s.value.trim() !== ''
    );
    const allImages = [
      mainImage.trim(),
      ...additionalImages.map((img) => img.trim()).filter((img) => img && img !== mainImage.trim()),
    ];

    onSubmit({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      sku: sku.trim() || `MP-${Date.now().toString().slice(-4)}`,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : Number(price),
      unit: unit.trim() || 'Unit',
      stock: Number(stock) >= 0 ? Number(stock) : 0,
      availability,
      image: mainImage.trim(),
      images: allImages,
      specifications: validSpecs,
      applications: applications.filter(Boolean),
      featured,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans">
      {/* 1. BASIC INFORMATION */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
        <h3 className="text-sm font-semibold text-stone-950 border-b border-stone-100 pb-3">
          1. Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g. WPC Fluted Panel – Natural Oak"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:border-[#08142C]"
            >
              {availableCategoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              SKU Code
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. MP-WPC-OAK-01"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#08142C]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Describe the material composition, finish, and primary benefits..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. PRICING & INVENTORY */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-4">
        <h3 className="text-sm font-semibold text-stone-950 border-b border-stone-100 pb-3">
          2. Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Price (₹ INR) *
            </label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price) setErrors({ ...errors, price: '' });
              }}
              placeholder="145"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm tabular-nums focus:outline-none focus:border-[#08142C]"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.price}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Sale Price (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="145"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm tabular-nums focus:outline-none focus:border-[#08142C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Unit *
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. sq. ft., Panel, Box"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm tabular-nums focus:outline-none focus:border-[#08142C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Availability Status
            </label>
            <select
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value as 'Available' | 'Out of Stock')
              }
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:border-[#08142C]"
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT IMAGES (MAIN IMAGE + ADDITIONAL IMAGES) */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-stone-950">
            3. Product Images (Main Image & Additional Gallery)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage the main product image and additional gallery images displayed on the customer product page.
          </p>
        </div>

        {/* Main Image Input & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <div className="md:col-span-4">
            <span className="block text-xs font-semibold text-stone-700 mb-1.5">
              Main Product Image
            </span>
            <div className="aspect-4/3 rounded-xl border-2 border-[#08142C] overflow-hidden bg-stone-100 relative">
              <img
                src={mainImage}
                alt="Main Product Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-[#08142C] text-[#EAB01E] text-[10px] font-semibold">
                Main Image
              </span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Main Image URL *
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="Paste image URL or select a studio image preset below"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
              />
            </div>

            {/* Quick Studio Image Selector for Main or Additional Images */}
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Studio Material Photography Presets (Click to Set Main or + Add to Gallery)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STUDIO_IMAGE_PRESETS.map((preset) => (
                  <div
                    key={preset.label}
                    className="border border-stone-200 rounded-lg p-1.5 bg-stone-50 flex flex-col justify-between gap-1.5"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-14 object-cover rounded"
                    />
                    <span className="text-[10px] font-medium text-stone-700 line-clamp-1">
                      {preset.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMainImage(preset.url)}
                        className="flex-1 py-1 px-1.5 rounded bg-stone-900 text-white text-[10px] font-medium hover:bg-stone-700 cursor-pointer"
                      >
                        Set Main
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!additionalImages.includes(preset.url) && preset.url !== mainImage) {
                            setAdditionalImages([...additionalImages, preset.url]);
                          }
                        }}
                        className="py-1 px-1.5 rounded border border-stone-300 bg-white text-stone-700 text-[10px] font-medium hover:bg-stone-100 cursor-pointer"
                      >
                        + Extra
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Images List */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="block text-xs font-semibold text-stone-800">
                Additional Product Images ({additionalImages.length})
              </span>
              <span className="text-[11px] text-stone-500">
                Add multiple angles or close-up texture photos for this product
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste additional image URL..."
                className="flex-1 sm:w-64 px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#08142C]"
              />
              <button
                type="button"
                onClick={handleAddAdditionalImage}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#08142C] text-white text-xs font-medium hover:bg-stone-800 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#EAB01E]" />
                <span>+ Add Image</span>
              </button>
            </div>
          </div>

          {additionalImages.length === 0 ? (
            <div className="p-4 rounded-lg bg-stone-50 border border-dashed border-stone-300 text-center text-xs text-stone-500">
              No additional images added yet. Paste an image URL above or click "+ Extra" on any preset.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {additionalImages.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="border border-stone-200 rounded-lg p-2 bg-white space-y-2"
                >
                  <div className="aspect-4/3 rounded overflow-hidden bg-stone-100">
                    <img
                      src={imgUrl}
                      alt={`Additional ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetAsMainImage(idx)}
                      className="flex-1 py-1 px-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-semibold cursor-pointer"
                    >
                      Set as Main
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(idx)}
                      className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. PRODUCT SPECIFICATIONS & APPLICATIONS */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 space-y-6">
        {/* Specifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-950">
                4. Product Specifications
              </h3>
              <p className="text-xs text-stone-500">
                Only specifications entered here will be displayed on the customer product page.
              </p>
            </div>
            <button
              type="button"
              onClick={addSpecRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-900 text-xs font-medium text-stone-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                  placeholder="Label (e.g. Finish, Dimensions)"
                  className="w-1/3 px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Value (e.g. Natural Oak, 2900 × 160 mm)"
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(index)}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  aria-label="Remove specification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="pt-5 border-t border-stone-200 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-950">
              5. Product Applications
            </h3>
            <p className="text-xs text-stone-500">
              Specify where customers can use this product (e.g. Living Room, TV Unit, Feature Wall, Partition, Office).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newApplication}
              onChange={(e) => setNewApplication(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddApplication();
                }
              }}
              placeholder="Add application (e.g. TV Unit, Feature Wall, Partition)..."
              className="flex-1 px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
            />
            <button
              type="button"
              onClick={handleAddApplication}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#08142C] text-white text-xs font-medium hover:bg-stone-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#EAB01E]" />
              <span>Add Application</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {applications.map((app, idx) => (
              <span
                key={`${app}-${idx}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800"
              >
                <span>{app}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveApplication(idx)}
                  className="text-stone-400 hover:text-red-600 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 6. HOMEPAGE FEATURED PRODUCT TOGGLE */}
      <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-200 flex items-start gap-3.5">
        <input
          id="featured-product-checkbox"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-amber-400 text-[#08142C] focus:ring-[#08142C] cursor-pointer"
        />
        <label htmlFor="featured-product-checkbox" className="cursor-pointer space-y-1">
          <span className="text-sm font-semibold text-stone-950 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#EAB01E] fill-[#EAB01E]" />
            <span>Show this product as Featured on the Customer Homepage</span>
          </span>
          <span className="text-xs text-stone-600 block">
            Only one primary Featured Product is active at a time. Selecting this product will automatically replace the previous Featured Product on the customer homepage.
          </span>
        </label>
      </div>

      {/* Form Submit / Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#08142C] hover:bg-stone-900 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4 text-[#EAB01E]" />
          <span>{isLoading ? 'Saving to PostgreSQL...' : 'Save Product'}</span>
        </button>
      </div>
    </form>
  );
};
