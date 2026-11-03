# 🌙 WiccaWic • Link Sayfası

Kick yayınınıza bağlı, tek sayfalık Linktree tarzı site.
Tema: kızıl gotik (banner sanatınız) + iksir yeşili (Kick) + cadı moru.

## 📁 Dosyalar

| Dosya | Ne işe yarıyor |
|---|---|
| `index.html` | Sayfanın içeriği (linkler, metinler, canlı oynatıcı) |
| `style.css` | Görünüm (renkler, animasyonlar, gotik süsler) |
| `script.js` | Yıldızlar, kabarcıklar, **canlı yayın durumu + iframe**, kopyalama |
| `assets/` | Görseller (`kick-banner.jpg` ve `avatar.webp` kullanılıyor) |

## ✏️ Linkleri değiştirme

Tüm linkler `index.html` içindeki `<a>` etiketlerinde. Örnek — Discord:

```html
<a class="link" style="--brand:#5865F2" href="https://discord.gg/DAVET_LINKINIZ" ...>
```

- **Discord**: `href="https://discord.gg/wiccawic"` → gerçek davet linkinizle değiştirin
  (Kick profilinizde discord alanı boş görünüyor)
- **Spotify**: `href="https://open.spotify.com/"` → kendi profilinizin linkiyle değiştirin
- X, Instagram, TikTok, Kick linkleri Kick API'den **gerçek kullanıcı adlarınızla** dolduruldu:
  `@diloswic`, `@npcdiyelim`, `@wiccawicc`

## ✨ Canlı yayın durumu + oynatıcı

`script.js` sayfa açılışında ve **her 60 saniyede** Kick API'yi kontrol eder:

- Yayında olduğunuzda → yeşil **"● CANLI • N izleyici"** rozeti yanıp söner
- **Aynı anda sayfanın başına Kick'in resmi oynatıcısı iframe olarak açılır**:
  `https://player.kick.com/wiccawic?autoplay=true&muted=true`
  (sessiz başlar — ziyaretçi kendi sesiyle başlatır)
- Oynatıcıda yayın başlığı, kategori ve izleyici sayısı + "Kick'te aç →" linki görünür
- Yayını kapattığınızda → rozet otomatik **"Şu an çevrimdışı"**'na döner,
  iframe gizlenir ve akış durdurulur (`src="about:blank"`)
- Takipçi sayısı da API'den otomatik gelir

Kick API'si tarayıcıya CORS izni verdiği için site `file://` ile açıldığında da çalışır;
herhangi bir sunucu veya API anahtarı gerekmez.

## 🎵 Spotify popup (sağ üst)

Sayfanın **sağ üst köşesinde sabit bir popup** vardır: [6K Labs Amuse](https://6klabs.com)
widget'ı — **yarı saydam siyah, bulanık (blur'lu) zemin**, 20px yuvarlak köşeler,
ince açık kenarlık. Widget içerik olarak içinde durur, keskin köşe yoktur.

- Sayfa açıldıktan ~1 sn sonra popup kayarak açılır
- Sağ üstte her zaman görünür bir **×** vardır; kapatınca yerine küçük yeşil **♪**
  düğmesi kalır, tıklayınca geri açılır
- Şarkı yalnızca Spotify'da bir şey çalarken görünür; çalmıyorken koyu zemin kalır

Kendi widget URL'nizi almak için:
1. <https://6klabs.com> → Login (Twitch ile)
2. Sidebar → **Widgets → Amuse** → Spotify'ı bağlayın
   (Spotify Developer Dashboard'dan Client ID/Secret gerekir — [dökümantasyon](https://docs.6klabs.com/docs/connections/spotify))
3. Widget'ı beğenize göre düzenleyin, **Copy URL**'yi alın
4. `index.html` içindeki iframe'in `src="..."` değerini bu URL ile değiştirin

> Şu an test URL'si gömülü. Widget yalnızca Spotify'da bir şey çalarken içerik gösterir;
> çalmıyorken boş görünür.

## 🌙 Kredi satırı

En altta `developed by NieVes` satırı vardır. Linkin hedefi şimdilik
`https://nieves.example.com` **yer tutucudur** — `index.html` içinde `<a href="...">`
ile gerçek profil/site linkinizle değiştirin.

## 🚀 Yayına alma (ücretsiz)

**En kolayı — Netlify:**
1. <https://app.netlify.com/drop> adresine gidin
2. Bu klasörü (`wicca2`) tarayıcıya sürükleyip bırakın
3. Size bir link verilir, hazır! 🎉

**GitHub Pages:**
1. Bu klasörü bir GitHub deposuna yükleyin
2. Settings → Pages → Branch: `main` → Save

**Kendi bilgisayarınızda görmek için:**
```powershell
cd C:\Users\cesur\Downloads\wicca2
python -m http.server 8747
```
Sonra tarayıcıda <http://127.0.0.1:8747> açın.

## 💡 Notlar

- **Cadı estetiği tamamen CSS**: gotik köşe süsleri, ay fazları, kazan kabarcıkları ve
  yıldızlar kodla çiziliyor — harici görsel yok, sayfa hızlı açılır
- `assets/` klasöründeki cadı illüstrasyonları ve çevrimdışı banner'ı artık kullanılmıyor,
  dilerseniz silebilirsiniz (yalnızca `kick-banner.jpg` ve `avatar.webp` gerekli)
- Banner `assets/kick-banner.jpg` Kick profilinizden indirildi (1.7 MB → 117 KB)
- Görseller WebP/JPEG olarak sıkıştırıldı — toplam boyut küçük kalır
