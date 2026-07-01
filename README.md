# 📷 Wirtualna Księga Gości

Aplikacja webowa do tworzenia wirtualnej księgi gości na wesela i eventy. Goście skanują kod QR i dodają zdjęcia oraz wideo bezpośrednio z telefonu — bez logowania, bez instalowania czegokolwiek.

## Demo

> Wdróż własną instancję w 5 minut korzystając z instrukcji poniżej.

## Funkcje

- 📱 Działa na każdym telefonie — skan QR i gotowe
- 📷 Upload zdjęć i wideo (JPEG, PNG, HEIC, DNG, MOV, MP4 i inne)
- 🖼️ Galeria z podglądem, nawigacją strzałkami i swipe na telefonie
- 🔒 Panel admina z hasłem — moderacja i usuwanie zdjęć
- ⬇️ Pobieranie wszystkich zdjęć jako ZIP
- 🛡️ Rate limiting i walidacja typów plików
- ☁️ Przechowywanie w Cloudflare R2 (10 GB darmowe)
- 🚀 Deploy na Vercel (darmowy tier)

## Stack

- **Frontend:** Next.js 16, Tailwind CSS
- **Storage:** Cloudflare R2
- **Hosting:** Vercel

## Wdrożenie

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/daniecce/ksiega-gosci.git
cd ksiega-gosci
npm install
```

### 2. Skonfiguruj Cloudflare R2

1. Utwórz konto na [cloudflare.com](https://cloudflare.com)
2. Utwórz bucket R2
3. Wygeneruj API token z uprawnieniami R2 Read & Write
4. Włącz Public URL dla bucketa
5. Skonfiguruj CORS Policy:

```json
[
  {
    "AllowedOrigins": ["https://twoja-domena.vercel.app"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Zmienne środowiskowe

Utwórz plik `.env.local`:

```env
R2_ACCOUNT_ID=twoje_account_id
R2_ACCESS_KEY_ID=twoj_access_key
R2_SECRET_ACCESS_KEY=twoj_secret_key
R2_BUCKET=nazwa-bucketa
R2_PUBLIC_URL=https://pub-xxx.r2.dev
ADMIN_HASLO=twoje_haslo_admina
```

### 4. Uruchom lokalnie

```bash
npm run dev
```

### 5. Deploy na Vercel

Połącz repozytorium z [Vercel](https://vercel.com), dodaj zmienne środowiskowe i gotowe.

## Struktura projektu
app/
├── page.js              # Strona główna eventu
├── upload/page.js       # Formularz uploadu
├── gallery/page.js      # Galeria zdjęć
├── admin/page.js        # Panel admina
└── api/
├── presign/route.js # Generowanie presigned URL do R2
├── photos/route.js  # Pobieranie listy zdjęć
└── delete/route.js  # Usuwanie zdjęć

## Licencja

MIT — możesz używać, modyfikować i dystrybuować dowolnie.