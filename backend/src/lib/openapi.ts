import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { env } from '@/lib/env';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: env.cookieName,
});

const UserSchema = registry.register(
  'User',
  z
    .object({
      id: z.string().openapi({ example: 'cm1abc123' }),
      email: z.email().openapi({ example: 'user@example.com' }),
      firstName: z.string().openapi({ example: 'Jane' }),
      lastName: z.string().nullable().openapi({ example: 'Doe' }),
      phone: z.string().nullable().openapi({ example: '+34600000000' }),
      photo: z.string().openapi({ example: '' }),
      subscription: z
        .enum(['free', 'pro', 'team'])
        .openapi({ example: 'free' }),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
    .openapi('User')
);

const NoteListItemSchema = registry.register(
  'NoteListItem',
  z
    .object({
      id: z.string().openapi({ example: 'cm1abc456' }),
      title: z.string().openapi({ example: 'Shopping list' }),
      textPreview: z.string().openapi({ example: 'Milk, eggs...' }),
      creator: z.email().openapi({ example: 'user@example.com' }),
      updatedAt: z.string().datetime(),
      pinnedAt: z.string().datetime().nullable(),
    })
    .openapi('NoteListItem')
);

const NoteSchema = registry.register(
  'Note',
  z
    .object({
      id: z.string().openapi({ example: 'cm1abc456' }),
      title: z.string().openapi({ example: 'Shopping list' }),
      text: z.string().openapi({ example: 'Milk, eggs, bread' }),
      creator: z.email().openapi({ example: 'user@example.com' }),
      updatedAt: z.string().datetime(),
      pinnedAt: z.string().datetime().nullable(),
    })
    .openapi('Note')
);

const ErrorSchema = z
  .object({ message: z.string().openapi({ example: 'Unauthorized' }) })
  .openapi('Error');

// ── Auth ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  summary: 'Get current session user',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Authenticated user',
      content: {
        'application/json': { schema: z.object({ user: UserSchema }) },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  summary: 'Log in with email and password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.email().openapi({ example: 'user@example.com' }),
            password: z.string().openapi({ example: 'secret123' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful — sets httpOnly session cookie',
      content: {
        'application/json': { schema: z.object({ user: UserSchema }) },
      },
    },
    401: {
      description: 'Invalid credentials',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    403: {
      description: 'Email not verified',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    429: {
      description: 'Rate limit exceeded (10 req / 15 min)',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  summary: 'Create a new account',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.email().openapi({ example: 'user@example.com' }),
            password: z.string().min(8).openapi({
              example: 'secret123',
              description: 'Min 8 chars, at least 1 letter and 1 number',
            }),
            firstName: z.string().min(1).openapi({ example: 'Jane' }),
            lastName: z.string().optional().openapi({ example: 'Doe' }),
            phone: z.string().optional().openapi({ example: '+34600000000' }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Account created — verification email sent',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'Check your email to complete registration',
            }),
          }),
        },
      },
    },
    409: {
      description: 'Email already registered',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    429: {
      description: 'Rate limit exceeded (10 req / 1 hour)',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/resend-verification',
  summary: 'Resend email verification link',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.email().openapi({ example: 'user@example.com' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description:
        'Link sent if email is registered and unverified (always 200 to prevent enumeration)',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    429: {
      description: 'Rate limit exceeded (5 req / 1 hour)',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/verify-email',
  summary: 'Verify email address and start session',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z
              .string()
              .openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Email verified — sets httpOnly session cookie',
      content: {
        'application/json': { schema: z.object({ user: UserSchema }) },
      },
    },
    400: {
      description: 'Invalid, expired, or already-used token',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  summary: 'Clear session cookie',
  security: [{ cookieAuth: [] }],
  responses: { 204: { description: 'Logged out' } },
});

// ── Notes ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/notes',
  summary: 'List all notes (pinned first, then by updatedAt desc)',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: "User's notes",
      content: {
        'application/json': {
          schema: z.object({ notes: z.array(NoteListItemSchema) }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/notes/{id}',
  summary: 'Get a single note',
  security: [{ cookieAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Note',
      content: {
        'application/json': { schema: z.object({ note: NoteSchema }) },
      },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/notes',
  summary: 'Create a note',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string().optional().openapi({ example: 'Shopping list' }),
            text: z.string().openapi({ example: 'Milk, eggs, bread' }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Created note',
      content: {
        'application/json': { schema: z.object({ note: NoteSchema }) },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/notes/{id}',
  summary: 'Update note title and/or text',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string().optional().openapi({ example: 'Updated title' }),
            text: z.string().optional().openapi({ example: 'Updated content' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated note',
      content: {
        'application/json': { schema: z.object({ note: NoteSchema }) },
      },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/notes/{id}/pin',
  summary: 'Toggle pin on a note',
  security: [{ cookieAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Note with updated pinnedAt',
      content: {
        'application/json': { schema: z.object({ note: NoteSchema }) },
      },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/notes/{id}',
  summary: 'Delete a note',
  security: [{ cookieAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

// ── Payments ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/payments/payment-intent',
  summary: 'Create a Stripe PaymentIntent',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            amount: z
              .number()
              .int()
              .positive()
              .openapi({ example: 999, description: 'Amount in cents (EUR)' }),
            plan: z.enum(['pro', 'team']).openapi({ example: 'pro' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Stripe client secret for frontend payment confirmation',
      content: {
        'application/json': {
          schema: z.object({
            clientSecret: z.string().openapi({ example: 'pi_xxx_secret_yyy' }),
          }),
        },
      },
    },
    400: {
      description: 'Invalid input or Stripe error',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/payments/webhook',
  summary:
    'Stripe webhook receiver — updates subscription on payment_intent.succeeded',
  request: {
    headers: z.object({ 'stripe-signature': z.string() }),
    body: {
      description: 'Raw Stripe event payload (must not be JSON-parsed)',
      content: { 'application/json': { schema: z.record(z.unknown()) } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Event acknowledged',
      content: {
        'application/json': { schema: z.object({ received: z.literal(true) }) },
      },
    },
    400: {
      description: 'Signature verification failed',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
});

// ── Health ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/health',
  summary: 'Health check',
  responses: { 200: { description: 'OK' } },
});

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Snap Notes API',
      version: '1.0.0',
      description:
        'REST API for Snap Notes. Authentication uses httpOnly cookies — log in via POST /auth/login before testing protected endpoints.',
    },
    servers: [{ url: '/', description: 'Current server' }],
  });
}
