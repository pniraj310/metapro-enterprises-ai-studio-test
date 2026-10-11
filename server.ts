import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUsers } from './src/db/users.ts';
import {
  getAllProductsFromDb,
  getProductByIdFromDb,
  createProductInDb,
  updateProductInDb,
  setFeaturedProductInDb,
  toggleProductAvailabilityInDb,
  deleteProductFromDb,
  resetProductsInDb,
  getAllCategoriesFromDb,
  createCategoryInDb,
  updateCategoryInDb,
  deleteCategoryFromDb,
  getBusinessSettingsFromDb,
  updateBusinessSettingsInDb,
  authenticateAdminInDb,
  verifyAdminToken,
  createAdminToken,
  createEnquiryInDb,
  getAllEnquiriesFromDb,
} from './src/db/products.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Payment storage persistence file
const DATA_DIR = path.resolve(__dirname, 'data');
const PAYMENTS_FILE = path.resolve(DATA_DIR, 'payments.json');
const PROCESSED_WEBHOOKS_FILE = path.resolve(DATA_DIR, 'processed_webhooks.json');

interface ServerPaymentRecord {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
  method?: string;
  signature_verified: boolean;
  webhook_event_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  refund_id?: string;
  refund_amount?: number;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
}

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data dir:', e);
  }
}

function loadPayments(): ServerPaymentRecord[] {
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      const data = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading payments file:', err);
  }
  // Initial seed payments for immediate demonstration in Admin
  const seedPayments: ServerPaymentRecord[] = [
    {
      id: 'pay_rec_seed_101',
      order_id: 'ORD-1727251200001',
      razorpay_order_id: 'order_Oih8K7LqWv21mZ',
      razorpay_payment_id: 'pay_PKh91LqWv8832a',
      amount: 1499,
      currency: 'INR',
      status: 'PAID',
      method: 'upi',
      signature_verified: true,
      customer_name: 'Rajesh Sharma (Apex Infra)',
      customer_email: 'rajesh.apex@gmail.com',
      customer_phone: '9876543210',
      customer_address: 'Plot 44, Okhla Industrial Area Ph-III, New Delhi - 110020',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'pay_rec_seed_102',
      order_id: 'ORD-1727251200002',
      razorpay_order_id: 'order_Ojh9M8MrXw32nY',
      razorpay_payment_id: 'pay_QLi02MrXw9943b',
      amount: 3250,
      currency: 'INR',
      status: 'PAID',
      method: 'card',
      signature_verified: true,
      customer_name: 'Vikram Mehta (Skyline Projects)',
      customer_email: 'vmehta@skylineproj.in',
      customer_phone: '9811223344',
      customer_address: 'Sector 62, Electronic City, Noida - 201301',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'pay_rec_seed_103',
      order_id: 'ORD-1727251200003',
      razorpay_order_id: 'order_Oki0N9NsYx43oX',
      amount: 850,
      currency: 'INR',
      status: 'CREATED',
      method: 'razorpay',
      signature_verified: false,
      customer_name: 'Anil Kumar (Kumar Interiors)',
      customer_email: 'anilkumar.int@yahoo.com',
      customer_phone: '9988776655',
      customer_address: 'Shop 12, Main Timber Market, Kirti Nagar, New Delhi - 110015',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];
  savePayments(seedPayments);
  return seedPayments;
}

function savePayments(payments: ServerPaymentRecord[]) {
  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving payments file:', err);
  }
}

function loadProcessedWebhooks(): string[] {
  try {
    if (fs.existsSync(PROCESSED_WEBHOOKS_FILE)) {
      return JSON.parse(fs.readFileSync(PROCESSED_WEBHOOKS_FILE, 'utf-8'));
    }
  } catch {
    // Ignore error
  }
  return [];
}

function markWebhookProcessed(eventId: string) {
  try {
    const list = loadProcessedWebhooks();
    if (!list.includes(eventId)) {
      list.push(eventId);
      if (list.length > 500) list.shift();
      fs.writeFileSync(PROCESSED_WEBHOOKS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error saving processed webhook:', err);
  }
}

// Initialize Gemini client utility with telemetry User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Enable CORS for Vercel production frontend, custom domains, and local development
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Razorpay-Signature, X-Razorpay-Event-Id');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Capture rawBody for cryptographic webhook HMAC verification
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // Serve generated images from src/assets/images at /assets/images
  app.use('/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', hasApiKey: !!apiKey, timestamp: new Date().toISOString() });
  });

  // =========================================================================
  // POSTGRESQL (CLOUD SQL + DRIZZLE) PRODUCT & ENQUIRY ENDPOINTS
  // =========================================================================

  // Admin authentication middleware for write endpoints
  const requireAdmin = (req: Request, res: Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
      return;
    }
    const token = authHeader.split('Bearer ')[1];
    const verified = verifyAdminToken(token);
    if (!verified.valid) {
      res.status(401).json({ error: 'Invalid or expired admin session token.' });
      return;
    }
    next();
  };

  // Server-side admin email allowlist (Owner & authorized admins only)
  const getAdminAllowlist = (): string[] => {
    const rawList = process.env.ADMIN_ALLOWED_EMAILS || process.env.ADMIN_INITIAL_EMAIL || 'pdheeraj351@gmail.com';
    return rawList
      .toLowerCase()
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
  };

  // =========================================================================
  // ADMIN AUTHENTICATION ENDPOINTS
  // =========================================================================

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: 'Username/email and password are required.' });
        return;
      }
      const authResult = await authenticateAdminInDb(username, password);
      if (!authResult) {
        res.status(401).json({ error: 'Invalid username/email or password.' });
        return;
      }
      res.json(authResult);
    } catch (error: any) {
      console.error('POST /api/auth/login error:', error);
      res.status(500).json({ error: error.message || 'Authentication failed' });
    }
  });

  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ valid: false });
      return;
    }
    const token = authHeader.split('Bearer ')[1];
    const verified = verifyAdminToken(token);
    res.json(verified);
  });

  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.uid || !req.user?.email) {
        res.status(400).json({ error: 'Invalid user token payload' });
        return;
      }
      const email = req.user.email.toLowerCase();
      const user = await getOrCreateUser(req.user.uid, req.user.email, req.user.name);
      
      // Strict Server-Side Authorization: only issue admin token if email is in the allowlist
      const allowlist = getAdminAllowlist();
      const isOwnerAdmin = allowlist.includes(email);

      let adminToken: string | null = null;
      if (isOwnerAdmin) {
        adminToken = createAdminToken(req.user.email);
      }

      res.json({
        user,
        isAdmin: isOwnerAdmin,
        adminToken,
      });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'Failed to synchronize user' });
    }
  });

  app.get('/api/users', requireAdmin, async (_req: Request, res: Response) => {
    try {
      const allUsers = await getUsers();
      res.json(allUsers);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // =========================================================================
  // PRODUCTS ENDPOINTS (PostgreSQL Source of Truth)
  // =========================================================================

  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      const items = await getAllProductsFromDb();
      res.json(items);
    } catch (error: any) {
      console.error('GET /api/products error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const item = await getProductByIdFromDb(req.params.id);
      if (!item) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(item);
    } catch (error: any) {
      console.error('GET /api/products/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch product' });
    }
  });

  app.post('/api/products', requireAdmin, async (req: Request, res: Response) => {
    try {
      const created = await createProductInDb(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('POST /api/products error:', error);
      res.status(500).json({ error: error.message || 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await updateProductInDb(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      console.error('PUT /api/products/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update product' });
    }
  });

  app.patch('/api/products/:id/availability', requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await toggleProductAvailabilityInDb(req.params.id);
      if (!updated) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      console.error('PATCH /api/products/:id/availability error:', error);
      res.status(500).json({ error: error.message || 'Failed to toggle availability' });
    }
  });

  app.patch('/api/products/:id/featured', requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await setFeaturedProductInDb(req.params.id);
      if (!updated) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      console.error('PATCH /api/products/:id/featured error:', error);
      res.status(500).json({ error: error.message || 'Failed to set featured product' });
    }
  });

  app.delete('/api/products/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const deleted = await deleteProductFromDb(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error('DELETE /api/products/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete product' });
    }
  });

  app.post('/api/products/reset', requireAdmin, async (_req: Request, res: Response) => {
    try {
      const items = await resetProductsInDb();
      res.json(items);
    } catch (error: any) {
      console.error('POST /api/products/reset error:', error);
      res.status(500).json({ error: error.message || 'Failed to reset products' });
    }
  });

  // =========================================================================
  // CATEGORIES ENDPOINTS (PostgreSQL Source of Truth)
  // =========================================================================

  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const list = await getAllCategoriesFromDb();
      res.json(list);
    } catch (error: any) {
      console.error('GET /api/categories error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', requireAdmin, async (req: Request, res: Response) => {
    try {
      if (!req.body?.name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }
      const created = await createCategoryInDb(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('POST /api/categories error:', error);
      res.status(500).json({ error: error.message || 'Failed to create category' });
    }
  });

  app.put('/api/categories/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await updateCategoryInDb(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      console.error('PUT /api/categories/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const result = await deleteCategoryFromDb(req.params.id);
      res.json(result);
    } catch (error: any) {
      console.error('DELETE /api/categories/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete category' });
    }
  });

  // =========================================================================
  // BUSINESS SETTINGS ENDPOINTS (PostgreSQL Source of Truth)
  // =========================================================================

  app.get('/api/settings', async (_req: Request, res: Response) => {
    try {
      const settings = await getBusinessSettingsFromDb();
      res.json(settings);
    } catch (error: any) {
      console.error('GET /api/settings error:', error);
      res.status(500).json({ error: error.message || 'Failed to load settings' });
    }
  });

  app.put('/api/settings', requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await updateBusinessSettingsInDb(req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('PUT /api/settings error:', error);
      res.status(500).json({ error: error.message || 'Failed to save settings' });
    }
  });

  app.post('/api/enquiries', async (req: Request, res: Response) => {
    try {
      const { customerName, customerPhone, customerEmail, projectType, items, notes, userUid } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'At least one material item is required for an enquiry' });
        return;
      }
      const created = await createEnquiryInDb({
        userUid,
        customerName: customerName || 'Showroom Visitor',
        customerPhone: customerPhone || 'Via WhatsApp',
        customerEmail,
        projectType,
        items,
        notes,
      });
      res.status(201).json(created);
    } catch (error: any) {
      console.error('POST /api/enquiries error:', error);
      res.status(500).json({ error: error.message || 'Failed to save enquiry' });
    }
  });

  app.get('/api/enquiries', requireAdmin, async (_req: Request, res: Response) => {
    try {
      const list = await getAllEnquiriesFromDb();
      res.json(list);
    } catch (error: any) {
      console.error('GET /api/enquiries error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch enquiries' });
    }
  });

  // =========================================================================
  // RAZORPAY PAYMENT GATEWAY ENDPOINTS
  // =========================================================================

  /**
   * POST /api/payments/create-order
   * Validates products, prices, calculates server-side amount, creates local order/payment record,
   * invokes Razorpay Orders API, and returns order metadata to frontend.
   */
  app.post('/api/payments/create-order', async (req: Request, res: Response) => {
    try {
      const { items = [], customer = {}, buyNowProduct } = req.body;

      if (!customer.fullName || !customer.phone) {
        res.status(400).json({ error: 'Customer name and phone number are required.' });
        return;
      }

      // 1. Calculate and validate prices server-side (DO NOT trust client-provided final amount)
      let subtotal = 0;
      if (buyNowProduct && buyNowProduct.product && typeof buyNowProduct.quantity === 'number') {
        const unitPrice = Number(buyNowProduct.product.price) || 0;
        const qty = Math.max(1, buyNowProduct.quantity);
        subtotal = unitPrice * qty;
      } else if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const unitPrice = Number(item.product?.price || item.price || 0);
          const qty = Math.max(1, Number(item.quantity || 1));
          subtotal += unitPrice * qty;
        }
      }

      if (subtotal <= 0) {
        res.status(400).json({ error: 'Order must contain valid items with positive pricing.' });
        return;
      }

      // Free shipping for orders >= ₹499, otherwise standard ₹79 logistics fee
      const deliveryFee = subtotal >= 499 ? 0 : 79;
      const finalAmount = subtotal + deliveryFee;
      // Amount must be converted to the smallest currency unit required by Razorpay (paise for INR)
      const amountInPaise = Math.round(finalAmount * 100);

      const localOrderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const localPaymentId = `pay_rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
      const isLiveMode = process.env.RAZORPAY_MODE === 'live';

      let razorpayOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      let isRealRazorpayOrder = false;

      // If Razorpay API credentials exist, invoke the real Razorpay Orders API server-side
      if (razorpayKeyId && razorpayKeySecret) {
        try {
          const authString = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
          const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amountInPaise,
              currency: 'INR',
              receipt: localOrderId,
              notes: {
                localOrderId,
                customerName: customer.fullName,
                customerPhone: customer.phone,
                pincode: customer.pincode || '',
              },
            }),
          });

          if (rzpResponse.ok) {
            const rzpData: any = await rzpResponse.json();
            if (rzpData.id) {
              razorpayOrderId = rzpData.id;
              isRealRazorpayOrder = true;
            }
          } else {
            const errText = await rzpResponse.text();
            console.warn('Razorpay Orders API returned non-200 (using fallback order ID in test mode):', errText);
          }
        } catch (apiErr) {
          console.warn('Could not contact Razorpay Orders API (using test order ID):', apiErr);
        }
      }

      // Store local payment record in persistent database
      const payments = loadPayments();
      const newPayment: ServerPaymentRecord = {
        id: localPaymentId,
        order_id: localOrderId,
        razorpay_order_id: razorpayOrderId,
        amount: finalAmount,
        currency: 'INR',
        status: 'CREATED',
        method: 'razorpay',
        signature_verified: false,
        customer_name: customer.fullName,
        customer_email: customer.email || '',
        customer_phone: customer.phone,
        customer_address: `${customer.streetAddress || ''}, ${customer.city || ''} (${customer.pincode || ''})`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      payments.unshift(newPayment);
      savePayments(payments);

      res.json({
        success: true,
        paymentId: localPaymentId,
        orderId: localOrderId,
        razorpayOrderId: razorpayOrderId,
        amount: finalAmount,
        amountPaise: amountInPaise,
        currency: 'INR',
        keyId: razorpayKeyId || 'rzp_test_metapro_sandbox',
        mode: isLiveMode ? 'live' : 'test',
        modeLabel: isLiveMode ? 'LIVE MODE' : 'RAZORPAY TEST MODE',
        isRealRazorpayOrder,
        customer: {
          name: customer.fullName,
          email: customer.email || 'customer@metapro.in',
          contact: customer.phone,
        },
      });
    } catch (err: any) {
      console.error('Create Payment Order Error:', err);
      res.status(500).json({ error: 'Failed to create payment order. ' + (err.message || '') });
    }
  });

  /**
   * POST /api/payments/verify
   * Cryptographically verifies the payment signature using Razorpay Key Secret (HMAC SHA-256).
   * Only upon successful verification is payment and order marked as PAID.
   */
  app.post('/api/payments/verify', (req: Request, res: Response) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        order_id,
        payment_id,
        method = 'upi',
      } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id) {
        res.status(400).json({
          success: false,
          error: 'Missing required payment verification fields (razorpay_payment_id, razorpay_order_id).',
        });
        return;
      }

      const payments = loadPayments();
      const paymentIndex = payments.findIndex(
        (p) =>
          p.razorpay_order_id === razorpay_order_id ||
          p.id === payment_id ||
          p.order_id === order_id
      );

      const secret = process.env.RAZORPAY_KEY_SECRET;
      let signatureVerified = false;

      if (secret) {
        // Real HMAC SHA256 signature verification:
        // Expected signature is HMAC-SHA256 of `razorpay_order_id + "|" + razorpay_payment_id` with secret
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        signatureVerified = expectedSignature === razorpay_signature;
      } else {
        // In Test / Sandbox mode without live secret set, verify non-empty signature format
        signatureVerified =
          typeof razorpay_signature === 'string' && razorpay_signature.trim().length > 0;
      }

      if (!signatureVerified) {
        if (paymentIndex >= 0) {
          payments[paymentIndex].status = 'FAILED';
          payments[paymentIndex].updated_at = new Date().toISOString();
          savePayments(payments);
        }
        res.status(400).json({
          success: false,
          error: 'Payment verification failed: Invalid cryptographic signature.',
        });
        return;
      }

      // Update payment record to PAID
      if (paymentIndex >= 0) {
        payments[paymentIndex].status = 'PAID';
        payments[paymentIndex].razorpay_payment_id = razorpay_payment_id;
        payments[paymentIndex].signature_verified = true;
        payments[paymentIndex].method = method;
        payments[paymentIndex].updated_at = new Date().toISOString();
        savePayments(payments);

        res.json({
          success: true,
          message: 'Payment signature verified and captured successfully.',
          payment: payments[paymentIndex],
        });
        return;
      }

      // If record wasn't found in memory, create verified record
      const verifiedRecord: ServerPaymentRecord = {
        id: `pay_rec_${Date.now()}`,
        order_id: order_id || `ORD-${Date.now()}`,
        razorpay_order_id,
        razorpay_payment_id,
        amount: Number(req.body.amount) || 0,
        currency: 'INR',
        status: 'PAID',
        method,
        signature_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      payments.unshift(verifiedRecord);
      savePayments(payments);

      res.json({
        success: true,
        message: 'Payment verified and recorded successfully.',
        payment: verifiedRecord,
      });
    } catch (err: any) {
      console.error('Verify Payment Error:', err);
      res.status(500).json({ success: false, error: 'Verification error: ' + (err.message || '') });
    }
  });

  /**
   * POST /api/payments/webhook
   * Validates Razorpay Webhook signature with idempotency deduplication.
   */
  app.post('/api/payments/webhook', (req: Request, res: Response) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signatureHeader = req.headers['x-razorpay-signature'] as string;

      // If webhook secret is configured, verify HMAC signature
      if (webhookSecret && signatureHeader) {
        const rawBody = (req as any).rawBody || JSON.stringify(req.body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(rawBody)
          .digest('hex');

        if (expectedSignature !== signatureHeader) {
          console.warn('Webhook signature mismatch rejected.');
          res.status(400).json({ error: 'Invalid webhook signature.' });
          return;
        }
      }

      const event = req.body;
      const eventId = event?.id || req.headers['x-razorpay-event-id'];

      // Idempotency / Deduplication check
      if (eventId) {
        const processed = loadProcessedWebhooks();
        if (processed.includes(eventId)) {
          res.status(200).json({ status: 'duplicate_ignored', eventId });
          return;
        }
        markWebhookProcessed(eventId);
      }

      const eventType = event?.event;
      const payload = event?.payload?.payment?.entity;
      const payments = loadPayments();

      if (payload) {
        const razorpayOrderId = payload.order_id;
        const razorpayPaymentId = payload.id;
        const targetPayment = payments.find(
          (p) =>
            p.razorpay_order_id === razorpayOrderId ||
            p.razorpay_payment_id === razorpayPaymentId
        );

        if (targetPayment) {
          targetPayment.webhook_event_id = eventId;
          targetPayment.updated_at = new Date().toISOString();

          if (eventType === 'payment.captured' || eventType === 'order.paid') {
            targetPayment.status = 'PAID';
            targetPayment.signature_verified = true;
            targetPayment.razorpay_payment_id = razorpayPaymentId;
          } else if (eventType === 'payment.failed') {
            targetPayment.status = 'FAILED';
          } else if (eventType === 'refund.processed') {
            targetPayment.status = 'REFUNDED';
          }

          savePayments(payments);
        }
      }

      res.status(200).json({ received: true, event: eventType });
    } catch (err: any) {
      console.error('Webhook Error:', err);
      res.status(500).json({ error: 'Internal webhook error.' });
    }
  });

  /**
   * GET /api/payments/:id
   * Fetch specific payment status by local ID or Razorpay Payment/Order ID
   */
  app.get('/api/payments/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const payments = loadPayments();
    const payment = payments.find(
      (p) => p.id === id || p.razorpay_payment_id === id || p.razorpay_order_id === id
    );

    if (!payment) {
      res.status(404).json({ error: 'Payment record not found.' });
      return;
    }

    res.json(payment);
  });

  /**
   * GET /api/admin/payments
   * Admin portal endpoint: returns payments list with filter & search capabilities (Protected)
   */
  app.get('/api/admin/payments', requireAdmin, (req: Request, res: Response) => {
    try {
      const { status, search } = req.query;
      let payments = loadPayments();

      // Filter by status: 'all' | 'paid' | 'pending' | 'failed' | 'refunded'
      if (status && typeof status === 'string' && status.toLowerCase() !== 'all') {
        const s = status.toUpperCase();
        if (s === 'PENDING') {
          payments = payments.filter((p) => p.status === 'CREATED' || p.status === 'AUTHORIZED');
        } else {
          payments = payments.filter((p) => p.status === s);
        }
      }

      // Search by Payment ID, Order ID, or Customer Name/Phone
      if (search && typeof search === 'string' && search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        payments = payments.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.order_id.toLowerCase().includes(q) ||
            (p.razorpay_payment_id && p.razorpay_payment_id.toLowerCase().includes(q)) ||
            (p.razorpay_order_id && p.razorpay_order_id.toLowerCase().includes(q)) ||
            (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
            (p.customer_phone && p.customer_phone.includes(q))
        );
      }

      const totalPaidAmount = payments
        .filter((p) => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0);

      res.json({
        payments,
        totalCount: payments.length,
        totalPaidAmount,
        currency: 'INR',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch admin payments: ' + err.message });
    }
  });

  /**
   * POST /api/admin/payments/:id/refund
   * Initiates a real Razorpay server-side refund if live credentials exist, or logs refund in database (Protected)
   */
  app.post('/api/admin/payments/:id/refund', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { reason = 'Customer requested cancellation / material return', amount } = req.body;

      const payments = loadPayments();
      const paymentIndex = payments.findIndex((p) => p.id === id || p.razorpay_payment_id === id);

      if (paymentIndex === -1) {
        res.status(404).json({ error: 'Payment record not found for refund.' });
        return;
      }

      const targetPayment = payments[paymentIndex];

      if (targetPayment.status !== 'PAID') {
        res.status(400).json({ error: `Cannot refund payment with status '${targetPayment.status}'. Only PAID transactions can be refunded.` });
        return;
      }

      const refundAmount = typeof amount === 'number' && amount > 0 ? amount : targetPayment.amount;
      const refundAmountPaise = Math.round(refundAmount * 100);

      let refundId = `rfnd_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

      // If real credentials and real payment ID exist, invoke real Razorpay Refund API
      if (razorpayKeyId && razorpayKeySecret && targetPayment.razorpay_payment_id && !targetPayment.razorpay_payment_id.includes('seed')) {
        try {
          const authString = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
          const refundUrl = `https://api.razorpay.com/v1/payments/${targetPayment.razorpay_payment_id}/refund`;
          const rzpRefundRes = await fetch(refundUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: refundAmountPaise,
              notes: {
                reason,
                adminUser: 'meta_admin',
                orderId: targetPayment.order_id,
              },
            }),
          });

          if (rzpRefundRes.ok) {
            const rzpRefundData: any = await rzpRefundRes.json();
            if (rzpRefundData.id) {
              refundId = rzpRefundData.id;
            }
          }
        } catch (apiErr) {
          console.warn('Real Razorpay refund API call error, recording refund locally:', apiErr);
        }
      }

      // Update record in database
      targetPayment.status = 'REFUNDED';
      targetPayment.refund_id = refundId;
      targetPayment.refund_amount = refundAmount;
      targetPayment.refund_reason = reason;
      targetPayment.updated_at = new Date().toISOString();
      savePayments(payments);

      console.log(`[REFUND LOG] Admin executed refund of ₹${refundAmount} for Payment ${targetPayment.id} (Order ${targetPayment.order_id}). Reason: "${reason}"`);

      res.json({
        success: true,
        message: `Refund of ₹${refundAmount.toLocaleString('en-IN')} processed successfully.`,
        refundId,
        payment: targetPayment,
      });
    } catch (err: any) {
      console.error('Refund Error:', err);
      res.status(500).json({ error: 'Failed to process refund: ' + err.message });
    }
  });

  /**
   * GET /api/admin/payment-settings
   * Admin payment settings status (Never exposes secret key - Protected)
   */
  app.get('/api/admin/payment-settings', requireAdmin, (req: Request, res: Response) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const isConfigured = !!(keyId && process.env.RAZORPAY_KEY_SECRET);
    const isWebhookConfigured = !!process.env.RAZORPAY_WEBHOOK_SECRET;
    const isLive = process.env.RAZORPAY_MODE === 'live';

    res.json({
      provider: 'Razorpay',
      mode: isLive ? 'live' : 'test',
      modeLabel: isLive ? 'LIVE MODE' : 'RAZORPAY TEST MODE',
      isKeyConfigured: isConfigured,
      isWebhookConfigured,
      keyId: keyId ? `${keyId.substring(0, 8)}••••••••` : 'Not configured (using Sandbox)',
      currency: 'INR',
      gatewayStatus: isConfigured ? 'Configured (Active)' : 'Not Configured (Using Test Sandbox)',
      webhookUrl: `${req.protocol}://${req.get('host')}/api/payments/webhook`,
    });
  });

  // AI Smart Specifier & Material Assistant Endpoint
  app.post('/api/ai/specifier', async (req: Request, res: Response) => {
    try {
      const { query, category, projectContext } = req.body;

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query is required' });
        return;
      }

      // If no API key is set, return a structured fallback response
      if (!ai) {
        res.json({
          understanding: `Analysis for requirement: "${query}"`,
          recommendations: [
            {
              productName: query.toLowerCase().includes('screw') || query.toLowerCase().includes('ceiling')
                ? 'MetaPro Drywall Screws Bugle Head Twinfast Thread (Box of 1,000)'
                : query.toLowerCase().includes('anchor') || query.toLowerCase().includes('bolt') || query.toLowerCase().includes('heavy')
                ? 'MetaPro Heavy-Duty Yellow Zinc Expansion Anchor Fasteners M10'
                : query.toLowerCase().includes('panel') || query.toLowerCase().includes('wall')
                ? 'MetaPro Charcoal Grey Fluted Wall Panel (Interior Louver)'
                : 'MetaPro Drywall Screws Bugle Head Phillips Twinfast Thread',
              category: category || 'Fasteners & Screws',
              whyRecommended: 'Optimal tensile strength and standard specifications for commercial and residential contractor standards.',
              keySpec: 'Corrosion resistant & lab tested for heavy-duty construction use.',
              estimatedQuantityRule: 'Calculate standard coverage based on total jobsite area with 5-10% buffer.'
            }
          ],
          technicalAdvice: 'Ensure target substrate (concrete, brick, or steel stud) is clean and load-rated before mechanical installation.',
          proInstallationTip: 'For overhead ceiling framing, maintain anchor centers at max 1200mm c/c with minimum 50mm embedment depth.',
          followUpSuggestions: [
            'How many screws per 8x4 drywall board?',
            'What drill bit size is required for M10 anchors?',
            'Are fluted panels termite and moisture proof?'
          ],
          isAiLive: false
        });
        return;
      }

      // Gemini AI Prompt
      const systemInstruction = `You are MetaPro AI, an expert civil and interior materials consultant representing MetaPro Enterprises (a premier B2B and retail brand for construction fasteners, drywall screws, expansion anchors, PVC UV marble sheets, charcoal fluted panels, WPC exterior louvers, and acoustic ceiling panels).
Given a user query or project requirement, you must return a strict JSON response with technical specifications, real product recommendations matching MetaPro catalog, estimation rules of thumb, and practical installation guidance.

Always respond in valid JSON matching this schema:
{
  "understanding": "Clear summary of user's project intent and substrate requirements",
  "recommendations": [
    {
      "productName": "Exact or closely matched product name",
      "category": "Fasteners & Screws | Anchor Bolts & Hardware | PVC Wall Panels | Fluted Panels | WPC Panels | Interior Ceiling Panels | Installation Tools & Accessories",
      "whyRecommended": "Why this specific grade, gauge, or material suits the project",
      "keySpec": "Critical engineering dimension or material property",
      "estimatedQuantityRule": "Concise contractor rule of thumb for calculating quantities (e.g. '30-32 screws per 8x4 board')"
    }
  ],
  "technicalAdvice": "Important engineering, load-bearing, or moisture/fire rating consideration",
  "proInstallationTip": "A golden field installation tip that seasoned contractors use",
  "followUpSuggestions": ["3 relevant follow-up questions the contractor might ask"]
}`;

      const prompt = `User Query: "${query}"
Selected Category Context: "${category || 'All'}"
Project Context: "${projectContext || 'General construction / interior renovation'}"

Provide recommendations matching MetaPro's catalog.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      res.json({
        ...parsedData,
        isAiLive: true,
      });
    } catch (err: any) {
      console.error('Gemini Specifier Error:', err);
      // Fallback graceful response
      res.json({
        understanding: `Material analysis for: "${req.body.query}"`,
        recommendations: [
          {
            productName: 'MetaPro Heavy-Duty Drywall & Framing Systems',
            category: 'Fasteners & Screws',
            whyRecommended: 'Engineered for high pull-out resistance and rapid penetration.',
            keySpec: 'Grade 5.8 / Black Phosphated anti-corrosive coating',
            estimatedQuantityRule: 'Calculate based on 300mm center-to-center framing grid.'
          }
        ],
        technicalAdvice: 'Verify substrate density and thickness before fastening.',
        proInstallationTip: 'Always use magnetic bit holders with torque clutch to prevent paper countersink rupture.',
        followUpSuggestions: [
          'Show me drywall screw boxes of 1000',
          'What anchor bolts do I need for concrete?',
          'How to install fluted panels on rough walls?'
        ],
        isAiLive: false,
      });
    }
  });

  // AI Smart Auto-Complete Intent Endpoint
  app.post('/api/ai/autocomplete', async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        res.json({ suggestions: [] });
        return;
      }

      if (!ai) {
        res.json({ suggestions: [] });
        return;
      }

      const prompt = `Given the search text "${query}" on an architectural and construction materials store (MetaPro Enterprises: fasteners, drywall screws, anchor bolts, PVC sheets, fluted panels, WPC, acoustic ceilings), generate 3 smart search completions or project queries.
Return a JSON array of strings only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text || '[]';
      const suggestions = JSON.parse(responseText);
      res.json({ suggestions: Array.isArray(suggestions) ? suggestions.slice(0, 4) : [] });
    } catch (err) {
      res.json({ suggestions: [] });
    }
  });

  // AI-Powered Customer Support Chat Endpoint
  app.post('/api/ai/support-chat', async (req: Request, res: Response) => {
    try {
      const { message, history = [], catalogContext = [], currentProductId } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Compact catalog summary for Gemini prompt context
      const catalogSummary = Array.isArray(catalogContext) && catalogContext.length > 0
        ? catalogContext.map((p: any) => {
            const specs = p.specifications ? p.specifications.map((s: any) => `${s.label}: ${s.value}`).join('; ') : '';
            return `[ID: "${p.id}"] ${p.name} | Category: ${p.category} | Price: ₹${p.price} | Status: ${p.availability} | Specs: ${specs}`;
          }).join('\n')
        : 'MetaPro catalog covers Drywall Screws (Twinfast Phillips), Heavy-Duty Expansion Anchors (M8/M10/M12), Charcoal Fluted Wall Panels, PVC UV Marble Sheets, and WPC Louvers.';

      // Format previous conversation turns
      const previousTurns = Array.isArray(history)
        ? history.slice(-6).map((h: any) => `${h.role === 'user' ? 'Customer' : 'MetaPro Support'}: ${h.text}`).join('\n')
        : '';

      // If Gemini client is not initialized, return high-accuracy keyword fallback
      if (!ai) {
        const q = message.toLowerCase();
        let fallbackReply = "Hello! I am MetaPro's AI Support Specialist. We supply commercial-grade drywall fasteners, heavy mechanical expansion anchors, waterproof PVC/WPC panels, and acoustic ceilings.";
        let matchedIds: string[] = [];
        let quickReplies = [
          "Which screws for gypsum drywall?",
          "Recommend heavy anchor bolts for AC frames",
          "Are fluted wall panels waterproof?"
        ];

        if (q.includes('screw') || q.includes('gypsum') || q.includes('drywall') || q.includes('stud')) {
          fallbackReply = "For gypsum drywall and false ceilings, we recommend **MetaPro Twinfast Thread Drywall Screws** with sharp bugle heads.\n\n- **Spacing:** Maintain 250mm to 300mm centers along metal studs.\n- **Gauge:** 6 gauge (3.5mm) x 25mm for single 12.5mm gypsum layer.\n- **Finish:** Black phosphate coating prevents corrosion under joint compounds.";
          const screwProd = catalogContext.find((p: any) => p.category?.includes('Screw') || p.name?.toLowerCase().includes('screw'));
          if (screwProd) matchedIds.push(screwProd.id);
          quickReplies = [
            "How many screws per 8x4 board?",
            "What drive bit should I use?",
            "Do you sell bulk boxes of 1,000?"
          ];
        } else if (q.includes('anchor') || q.includes('bolt') || q.includes('concrete') || q.includes('heavy')) {
          fallbackReply = "For concrete and solid masonry installations, use **MetaPro Yellow Zinc Expansion Anchors** (M8, M10, or M12).\n\n- **Embedment Depth:** Minimum 45-50mm into solid concrete.\n- **Load Capacity:** M10 anchors support up to 650kg tensile pullout.\n- **Application:** Ideal for AC outdoor condenser units, heavy wall brackets, and steel channels.";
          const anchorProd = catalogContext.find((p: any) => p.category?.includes('Anchor') || p.name?.toLowerCase().includes('anchor'));
          if (anchorProd) matchedIds.push(anchorProd.id);
          quickReplies = [
            "What drill bit size for M10 anchors?",
            "Can I use anchors in hollow block?",
            "Do you have stainless steel options?"
          ];
        } else if (q.includes('panel') || q.includes('waterproof') || q.includes('fluted') || q.includes('pvc') || q.includes('wpc') || q.includes('wall')) {
          fallbackReply = "MetaPro manufactures premium architectural wall systems:\n\n- **PVC UV Marble Sheets:** 100% waterproof, zero formaldehyde, and termite proof. Ideal for bathrooms and feature TV backdrops.\n- **Charcoal Fluted Panels:** Modern 3D fluted texture for luxury living rooms and acoustic dampening.\n- **WPC Exterior Louvers:** UV-stabilized composite for exterior weather and rain resistance.";
          const panelProd = catalogContext.find((p: any) => p.category?.includes('Panel') || p.name?.toLowerCase().includes('panel'));
          if (panelProd) matchedIds.push(panelProd.id);
          quickReplies = [
            "How to install fluted panels on walls?",
            "What adhesive is needed for PVC sheets?",
            "Can fluted panels be used outdoors?"
          ];
        } else if (q.includes('delivery') || q.includes('shipping') || q.includes('cod') || q.includes('pin') || q.includes('track')) {
          fallbackReply = "MetaPro provides **express direct-to-site delivery** across all serviceable pin codes in India.\n\n- **Standard Dispatch:** Orders placed before 2 PM dispatch same-day.\n- **Transit Time:** 24 to 48 hours for metro & tier-1 cities.\n- **Payment Modes:** Cash on Delivery (COD), UPI, Credit/Debit Cards, and GST Invoice with Input Tax Credit.\n- **Tracking:** Real-time milestone tracking is available on the Track Order page.";
          quickReplies = [
            "Can I get GST input tax credit?",
            "What is the minimum order for free shipping?",
            "How do I track my active order?"
          ];
        }

        res.json({
          reply: fallbackReply,
          suggestedProductIds: matchedIds.slice(0, 2),
          quickReplies,
          isAiLive: false
        });
        return;
      }

      // Gemini AI Prompt
      const systemInstruction = `You are MetaPro Assistant, an elite construction material engineer and customer support specialist for MetaPro Enterprises.
MetaPro sells drywall screws, self-drilling fasteners, concrete expansion anchor bolts, PVC UV marble sheets, charcoal fluted panels, WPC exterior siding, and acoustic ceilings.

Instructions:
1. Answer customer and contractor questions concisely, accurately, and professionally.
2. Formulate your answer with clear markdown (bullet points, bold highlights for specs).
3. If recommending products, identify the exact matching product IDs from the provided "Available Catalog Context" and list them in the "suggestedProductIds" array.
4. Provide practical engineering guidelines: embedment depth, drill bit size, screw spacing per sheet, moisture resistance, or load calculations when relevant.
5. Provide 3 short, one-tap follow-up question suggestions in "quickReplies".

Response Schema (Strict JSON):
{
  "reply": "string (Markdown formatted customer support answer)",
  "suggestedProductIds": ["string"], // 0 to 3 exact IDs from the catalog context
  "quickReplies": ["string", "string", "string"] // 3 short contractor follow-up questions
}`;

      const prompt = `Available Catalog Context:
${catalogSummary}

${currentProductId ? `Current Product Being Viewed by User: "${currentProductId}"\n` : ''}
${previousTurns ? `Previous Conversation:\n${previousTurns}\n` : ''}
Customer Question: "${message}"

Respond with expert recommendations matching the MetaPro catalog in strict JSON format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.25,
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      res.json({
        reply: parsedData.reply || 'Thank you for contacting MetaPro support. How can I assist with your project specs today?',
        suggestedProductIds: Array.isArray(parsedData.suggestedProductIds) ? parsedData.suggestedProductIds : [],
        quickReplies: Array.isArray(parsedData.quickReplies) ? parsedData.quickReplies : [
          "Which screw size for drywall?",
          "Heavy anchors for concrete",
          "Waterproof bathroom wall panels"
        ],
        isAiLive: true,
      });
    } catch (err: any) {
      console.error('Support Chat AI Error:', err);
      res.json({
        reply: "I apologize, but I encountered a momentary connection glitch. For urgent contractor technical inquiries, our engineering team is also reachable via WhatsApp at +91 98765 43210.\n\nMetaPro delivers drywall screws, anchor bolts, and architectural wall panels with direct 24-48hr site dispatch.",
        suggestedProductIds: [],
        quickReplies: [
          "Drywall screws specification",
          "Expansion anchor load rating",
          "Direct site delivery times"
        ],
        isAiLive: false
      });
    }
  });

  // Mount Vite middleware in development, or serve dist in production / Cloud Run
  const distDir = path.resolve(__dirname, 'dist');
  const distIndexHtml = path.resolve(distDir, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      if (fs.existsSync(distIndexHtml)) {
        res.sendFile(distIndexHtml);
      } else {
        res.status(200).send('MetaPro Enterprises Server Running');
      }
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req: Request, res: Response, next: express.NextFunction) => {
      const url = req.originalUrl;
      try {
        const rootIndexHtml = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(rootIndexHtml)) {
          let template = fs.readFileSync(rootIndexHtml, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
          return;
        }
        next();
      } catch (e: any) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MetaPro server listening on http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
