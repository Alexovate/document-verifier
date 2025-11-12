# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ Solana CLI installed

## 5-Minute Setup

### 1. Install Dependencies (1 minute)

```bash
cd document-verifier
npm install
```

### 2. Start Solana Validator (1 minute)

Open a **new terminal window** and run:

```bash
solana-test-validator
```

Leave this running! You should see:

```
Ledger location: test-ledger
✅ Started test validator
```

### 3. Start the Application (1 minute)

In your original terminal:

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### 4. Open Browser

Navigate to **http://localhost:3000**

## 🎯 Try It Out (2 minutes)

### Test Document Storage:

1. Upload any PDF, image, or document
2. Wait for hash generation
3. Click "Store on Solana"
4. Copy the **Account Address** (you'll need this!)

### Test Document Verification:

1. Click "Verify a Document"
2. Upload the **same document** you just stored
3. Paste the **Account Address**
4. Click "Verify Document"
5. Should show ✅ **Authentic**

### Test Tampering Detection:

1. Upload a **different document**
2. Use the same **Account Address** from before
3. Click "Verify Document"
4. Should show ❌ **Tampered**

## ⚠️ Common Issues

### "Connection refused" error

**Solution**: Make sure `solana-test-validator` is running in another terminal

### "Module not found" error

**Solution**: Run `npm install` again

### Changes not showing

**Solution**: Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## 🎤 Demo Tips

For live coding demos:

1. **Have test files ready**: Prepare 2-3 small PDFs in advance
2. **Keep validator running**: Start it before your demo
3. **Show the flow**: Upload → Hash → Store → Verify
4. **Explain the magic**: SHA-256 hashing + blockchain immutability
5. **Demo tampering**: Show how even tiny changes are detected

## 📱 What to Show

### The "Wow" Moments:

1. ✨ Instant hash generation
2. ⛓️ Blockchain storage (show the transaction)
3. ✅ Verification of authentic docs
4. 🚫 Detection of tampered docs
5. 🔒 Immutable record on blockchain

## 🛑 Stopping Everything

When done:

1. **Stop the dev server**: Press `Ctrl+C` in the dev terminal
2. **Stop the validator**: Press `Ctrl+C` in the validator terminal

## 🎓 Talking Points for Demo

> "This app creates a cryptographic fingerprint of any document using SHA-256, then stores it permanently on the Solana blockchain. Any change to the document—even a single character—creates a completely different hash, making tampering immediately detectable."

> "Unlike traditional databases, blockchain records can't be altered or deleted, providing an immutable proof of a document's state at a specific point in time."

> "This has real applications in education (verifying degrees), legal (contracts), healthcare (medical records), and supply chain (product documentation)."

---

**Ready to build something awesome! 🚀**
