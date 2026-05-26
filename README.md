# Harmonic Stabilizer Core — Public Release

A public-safe repository for the Harmonic Stabilizer core evaluator.

This repo is designed for public GitHub visibility without exposing private operational infrastructure. It includes the public evaluator, static demo pages, SDK examples, and test vectors. It intentionally excludes customer billing, API-key provisioning, Supabase service-role access, Stripe webhook handling, private telemetry, and customer console flows.

## What is included

- Static product/demo pages
- `POST /api/evaluate` public core evaluator
- `GET /api/health` public release health check
- SDK examples
- Test vectors
- Public docs

## What is not included

- Supabase service-role routes
- Stripe checkout/webhook routes
- API-key creation/revocation routes
- Customer console routes
- Private evaluation replay storage
- Private schema names, credentials, secrets, or customer data

## Local check

```bash
npm run check
npm run test:vectors
```

## Public boundary

This public release demonstrates the operational boundary:

```text
LLM/system output → Harmonic evaluator → allow / constrain / escalate / block
```

It does not publish private deployment mechanics, customer provisioning logic, billing logic, or internal telemetry architecture.

## Environment

No secrets are required for this public version. See `.env.example`.

## Deployment

Deploy as a simple Vercel static + serverless project.

```bash
vercel deploy
```

## Private deployment note

Keep billing, customer console, API-key provisioning, authenticated replay, and private telemetry in a separate private repository or private branch.
