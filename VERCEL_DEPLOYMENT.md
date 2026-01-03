# Vercel Deployment Guide

## Prerequisites

1. **GitHub Account**: Push code to GitHub
2. **Vercel Account**: Sign up at vercel.com
3. **Environment Variables**: Supabase keys

## Step 1: Push to GitHub

```bash
cd /home/web3joker/Downloads/protobase

# Initialize git (if not already)
git init
git add .
git commit -m "feat: add project workspace system"
git remote add origin https://github.com/YOUR_USERNAME/protobase.git
git branch -M main
git push -u origin main
```

## Step 2: Create Vercel Project

### Option A: Web Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Next.js" (or default)
4. Click "Deploy"

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to connect GitHub and deploy
```

## Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to **Settings → Environment Variables**
2. Add these variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key (optional)
VITE_WALLETCONNECT_PROJECT_ID=your-id
VITE_BASESCAN_API_KEY=your-api-key (optional)
```

3. **Important**: Click "Save" after adding each one
4. Redeploy to apply environment variables

## Step 4: Redeploy

After adding environment variables:

```bash
# Option 1: Via CLI
vercel --prod

# Option 2: Via dashboard
# Push to main branch → Vercel auto-deploys
git push origin main
```

## Step 5: Verify Deployment

1. Check build logs in Vercel dashboard
2. Visit your Vercel URL (e.g., `your-app.vercel.app`)
3. Test:
   - Connect wallet
   - View ideas
   - Launch project
   - Deploy contract (requires Base Sepolia ETH)

## Troubleshooting

### Build Fails
**Problem**: "Cannot find module"
**Solution**: Check all imports are correct
```bash
npm run build  # Test locally first
```

### Environment Variables Not Working
**Problem**: `undefined` values in app
**Solution**: 
1. Check variables are prefixed with `VITE_`
2. Redeploy after adding variables
3. Check browser console for errors

### Supabase Connection Fails
**Problem**: "Cannot connect to Supabase"
**Solution**:
1. Verify URL and key are correct
2. Check CORS settings in Supabase
3. Test locally first: `npm run dev`

### Wallet Doesn't Connect
**Problem**: MetaMask not detected
**Solution**:
1. Install wallet extension
2. Check browser console for errors
3. Verify WalletConnect project ID

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Build passes locally: `npm run build`
- [ ] Deployed to Vercel successfully
- [ ] Wallet connects on live site
- [ ] Can view ideas from Supabase
- [ ] Can create new ideas
- [ ] Can launch projects
- [ ] Can select templates
- [ ] Can deploy contracts to testnet

## Custom Domain (Optional)

1. In Vercel dashboard: **Settings → Domains**
2. Add your domain
3. Update DNS records (instructions provided)
4. Wait for SSL certificate (5-30 min)

## Monitoring & Logs

**View build logs**:
1. Vercel Dashboard → Deployments
2. Click specific deployment
3. See build output

**Monitor errors**:
1. Vercel Dashboard → Analytics
2. Check error rates
3. View function logs

## Auto-Deployment

Once connected to GitHub, Vercel automatically deploys when you push:

```bash
# Push to trigger deployment
git add .
git commit -m "fix: something"
git push origin main
```

This is instant and requires no manual action! 🚀

## Rollback

If something breaks:

1. Go to **Deployments** in Vercel
2. Click the previous working deployment
3. Click **"Redeploy"**
4. It's live immediately

## Success!

Your app is now live on:
```
https://your-app.vercel.app
```

Share this URL with others to use ProtoBase! 🎉
