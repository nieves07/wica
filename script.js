/* ============================================================
   WiccaWic • Link Sayfası — etkileşimler
   1) Yıldızlı gökyüzü      2) Kazan kabarcıkları
   3) Kaydırınca görünme     4) Kick canlı durumu + takipçi
   5) E-posta kopyalama      6) Toast bildirimi
   ============================================================ */

/* ---------- 1) Yıldızlar ---------- */
(function stars() {
  const box = document.querySelector('.stars');
  if (!box) return;
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#ffd7de', '#ffe9c4', '#e2d4ff'];
  const n = window.innerWidth < 480 ? 45 : 80;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.setProperty('--dur', (2 + Math.random() * 3.5).toFixed(2) + 's');
    s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    s.style.background = colors[(Math.random() * colors.length) | 0];
    const size = Math.random() < 0.15 ? 4 : 2.5;
    s.style.width = s.style.height = size + 'px';
    frag.appendChild(s);
  }
  box.appendChild(frag);
})();

/* ---------- 2) Kazan kabarcıkları ---------- */
(function bubbles() {
  const box = document.querySelector('.bubbles');
  if (!box) return;
  const n = window.innerWidth < 480 ? 8 : 14;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < n; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const size = 7 + Math.random() * 11;
    b.style.width = b.style.height = size + 'px';
    b.style.left = (Math.random() * 100) + '%';
    b.style.setProperty('--dur', (11 + Math.random() * 12).toFixed(1) + 's');
    b.style.setProperty('--sway', (Math.random() * 60 - 30).toFixed(0) + 'px');
    b.style.animationDelay = (Math.random() * 14).toFixed(1) + 's';
    frag.appendChild(b);
  }
  box.appendChild(frag);
})();

/* ---------- 3) Kaydırınca görünme ---------- */
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
})();

/* ---------- 4) Kick canlı durumu + takipçi sayısı ---------- */
async function kickStatus() {
  const pill = document.getElementById('statusPill');
  const dot  = document.getElementById('liveDot');
  const followers = document.getElementById('followerCount');
  if (!pill) return;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch('https://kick.com/api/v2/channels/wiccawic', {
      signal: ctrl.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timer);
    if (!res.ok) return;
    const data = await res.json();

    // Her turda varsayımı sıfırla — yayın bittiğinde çevrimdışıya dönsün
    pill.textContent = 'Şu an çevrimdışı';
    pill.classList.remove('status--live');
    pill.classList.add('status--offline');
    pill.title = '';
    dot.classList.remove('is-live');
    dot.title = 'Yayın durumu';

    // Takipçi sayısını tazele (API bazen string "3197" döndürür → 3197 → "3.197")
    if (followers && data.followers_count != null) {
      const n = Number(data.followers_count);
      if (!Number.isNaN(n)) followers.textContent = n.toLocaleString('tr-TR');
    }

    // Yayın varsa: rozeti yeşile çevir + canlı oyuncuyu (iframe) göster
    const playerCard = document.getElementById('playerCard');
    const playerFrame = document.getElementById('kickPlayer');
    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    if (data.livestream) {
      const title = data.livestream.session_title || data.livestream.title || '';
      const viewers = Number(data.livestream.viewer_count) || 0;
      const cat = (data.livestream.categories && data.livestream.categories[0]
        && data.livestream.categories[0].name) || 'Kick';

      pill.textContent = viewers > 0
        ? `● CANLI • ${viewers} izleyici`
        : '● CANLI YAYINDA';
      pill.classList.remove('status--offline');
      pill.classList.add('status--live');
      pill.title = title ? `Yayında: ${title}` : 'Şu an canlı yayında';
      dot.classList.add('is-live');
      dot.title = title ? 'Şu an canlı: ' + title : 'Şu an canlı yayında';

      // Kick'in resmi oynatıcısını iframe olarak göster
      if (playerCard && playerFrame) {
        playerCard.hidden = false;
        const src = `https://player.kick.com/${data.slug || 'wiccawic'}?autoplay=true&muted=true`;
        if (playerFrame.getAttribute('src') !== src) playerFrame.setAttribute('src', src);
        setText('playerTitle', title || 'Canlı yayın');
        setText('playerViewers', viewers > 0 ? `${viewers} izleyici` : '');
        setText('playerCat', cat);
      }
    } else if (playerCard && playerFrame) {
      // yayın bitti → oynatıcıyı gizle, akışı durdur
      playerCard.hidden = true;
      playerFrame.setAttribute('src', 'about:blank');
    }
  } catch (err) {
    // CORS engeli veya çevrimdışıysa mevcut durum olduğu gibi kalır — sorun yok.
  }
}

kickStatus();                    // sayfa açılır açılmaz kontrol et
setInterval(kickStatus, 60000);  // canlı durumunu dakikada bir tazele

/* ---------- Spotify popup: kapat / aç ---------- */
(function spotifyPop() {
  const pop = document.getElementById('muzik');
  const closeBtn = document.getElementById('popClose');
  const fab = document.getElementById('popFab');
  if (!pop || !closeBtn || !fab) return;

  closeBtn.addEventListener('click', () => {
    pop.classList.add('is-closed');
    // animasyon bitince popup'ı gizle, nota düğmesini göster
    setTimeout(() => {
      pop.hidden = true;
      fab.hidden = false;
    }, 300);
  });

  fab.addEventListener('click', () => {
    fab.hidden = true;
    pop.hidden = false;
    // giriş animasyonunu gecikmesiz yeniden oynat
    pop.style.animation = 'none';
    void pop.offsetWidth;
    pop.style.animation = 'popIn .7s cubic-bezier(.2, .8, .3, 1.15) both';
    pop.classList.remove('is-closed');
  });
})();

/* ---------- 5+6) E-posta kopyalama & toast ---------- */
(function mailCopy() {
  const mail = document.querySelector('.mail');
  const toast = document.getElementById('toast');
  if (!mail || !toast) return;
  let hideTimer;

  mail.addEventListener('click', async (e) => {
    if (!navigator.clipboard) return; // kopyalama yoksa normal mailto akışı
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(mail.textContent.trim());
      toast.textContent = '✦ E-posta kopyalandı';
    } catch {
      toast.textContent = mail.textContent.trim();
    }
    toast.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  });
})();
