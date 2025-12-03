// data dan state
let state = {
    isLoginMode: true,
    user: null,
    credits: 50,
    activeMitra: null,
    chatHistory: [],
    topupData: {
        selectedPackage: null,
        selectedPayment: null
    },
    modalCallback: null
};

// cek jika sudah login sebelumnya
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
        const userData = JSON.parse(localStorage.getItem('user_' + savedUser));
        state.user = { name: savedUser };
        state.credits = userData.credits || 50;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('main-view').classList.remove('hidden');
        updateCreditDisplay();
        navigateTo('home');
    }

    // hapus error saat user mengetik
    document.getElementById('username').addEventListener('input', function() {
        if (this.value.trim()) {
            document.getElementById('username-error').classList.remove('show');
            this.classList.remove('error');
        }
    });
    document.getElementById('password').addEventListener('input', function() {
        if (this.value) {
            document.getElementById('password-error').classList.remove('show');
            this.classList.remove('error');
        }
    });
    document.getElementById('confirm-password').addEventListener('input', function() {
        if (this.value) {
            document.getElementById('confirm-error').classList.remove('show');
            document.getElementById('confirm-password').classList.remove('error');
        }
    });
});

const mitraData = [
    { id: 1, name: "Siti Nurhaliza", job: "Ibu Rumah Tangga", desc: "Siap mendengarkan curhatan sehari-hari tentang keluarga dan anak.", rate: 5, img: "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=ffb7b2&color=fff" },
    { id: 2, name: "Budi Wijaya", job: "Ayah Kerja", desc: "Berbagi pengalaman sebagai orangtua dan solusi praktis untuk masalah keluarga.", rate: 5, img: "https://ui-avatars.com/api/?name=Budi+Wijaya&background=a2d2ff&color=fff" },
    { id: 3, name: "Dewi Ramadhani", job: "Teman Bicara", desc: "Teman pendengar yang empatik untuk curhat tentang hidup dan hubungan.", rate: 4, img: "https://ui-avatars.com/api/?name=Dewi+Ramadhani&background=cdb4db&color=fff" },
    { id: 4, name: "Agus Santoso", job: "Rekan Kerja", desc: "Mendengarkan persoalan kerja dan karir dari sudut pandang kolega.", rate: 4, img: "https://ui-avatars.com/api/?name=Agus+Santoso&background=b9fbc0&color=fff" }
];

const coinPackages = [
    { id: 1, coins: 50, price: "Rp 10.000", badge: "" },
    { id: 2, coins: 120, price: "Rp 25.000", badge: "Populer" },
    { id: 3, coins: 250, price: "Rp 50.000", badge: "" },
    { id: 4, coins: 500, price: "Rp 100.000", badge: "Nilai Terbaik" }
];

const paymentMethods = [
    { id: 1, name: "Transfer Bank", desc: "Transfer via BCA, Mandiri, BNI", icon: "🏦" },
    { id: 2, name: "E-Wallet", desc: "GCash, Dana, OVO", icon: "📱" },
    { id: 3, name: "Kartu Kredit", desc: "Visa, Mastercard", icon: "💳" },
    { id: 4, name: "Pembayaran Mobile", desc: "GCash, ShopeePay", icon: "💰" }
];

// fungsi login
function toggleAuthMode() {
    state.isLoginMode = !state.isLoginMode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const btn = document.getElementById('auth-btn');
    const switchText = document.getElementById('switch-text');
    const confirmPass = document.getElementById('confirm-pass-group');

    clearAuthErrors();

    if (state.isLoginMode) {
        title.innerText = "Selamat Datang";
        subtitle.innerText = "Login untuk melanjutkan";
        btn.innerText = "Masuk";
        confirmPass.classList.add('hidden');
        switchText.innerHTML = `Belum punya akun? <span onclick="toggleAuthMode()">Daftar</span>`;
    } else {
        title.innerText = "Buat Akun";
        subtitle.innerText = "Mulai perjalanan kesehatan mental Anda";
        btn.innerText = "Daftar";
        confirmPass.classList.remove('hidden');
        switchText.innerHTML = `Sudah punya akun? <span onclick="toggleAuthMode()">Masuk</span>`;
    }
}

function clearAuthErrors() {
    document.getElementById('username-error').classList.remove('show');
    document.getElementById('password-error').classList.remove('show');
    document.getElementById('confirm-error').classList.remove('show');
    document.getElementById('username').classList.remove('error');
    document.getElementById('password').classList.remove('error');
    document.getElementById('confirm-password').classList.remove('error');
}

function showAuthError(field, message) {
    const errorEl = document.getElementById(field + '-error');
    const inputEl = document.getElementById(field);
    errorEl.innerText = message;
    errorEl.classList.add('show');
    inputEl.classList.add('error');
}

function handleAuth(e) {
    e.preventDefault();
    clearAuthErrors();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username) {
        showAuthError('username', 'Username diperlukan');
        return;
    }
    if (!password) {
        showAuthError('password', 'Password diperlukan');
        return;
    }
    
    if (state.isLoginMode) {
        const stored = localStorage.getItem('user_' + username);
        if (stored) {
            const userData = JSON.parse(stored);
            if (userData.password === password) {
                state.user = { name: username };
                state.credits = userData.credits || 50;
                localStorage.setItem('current_user', username);
                document.getElementById('auth-view').classList.add('hidden');
                document.getElementById('main-view').classList.remove('hidden');
                updateCreditDisplay();
                navigateTo('home');
            } else {
                showAuthError('password', 'Password salah');
            }
        } else {
            showAuthError('username', 'Akun tidak ditemukan');
        }
    } else {
        const confirmPass = document.getElementById('confirm-password').value;
        
        if (password !== confirmPass) {
            showAuthError('confirm', 'Password tidak cocok');
            return;
        }
        const stored = localStorage.getItem('user_' + username);
        if (stored) {
            showAuthError('username', 'Username sudah terdaftar');
            return;
        }
        
        const userData = {
            password: password,
            credits: 50
        };
        localStorage.setItem('user_' + username, JSON.stringify(userData));
        localStorage.setItem('current_user', username);
        
        state.user = { name: username };
        state.credits = 50;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('main-view').classList.remove('hidden');
        updateCreditDisplay();
        navigateTo('home');
    }
}

// navigasi dan render
function navigateTo(page, data = null) {
    const content = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    const bottomNav = document.getElementById('bottom-nav');
    const backBtn = document.getElementById('back-btn');

    backBtn.classList.add('hidden');
    bottomNav.classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    if (page === 'home') {
        pageTitle.innerText = "Beranda";
        document.querySelectorAll('.nav-item')[0].classList.add('active');
        renderHome(content);
    } 
    else if (page === 'chats') {
        pageTitle.innerText = "Obrolan Saya";
        document.querySelectorAll('.nav-item')[1].classList.add('active');
        renderChats(content);
    } 
    else if (page === 'profile') {
        pageTitle.innerText = "Profil Saya";
        document.querySelectorAll('.nav-item')[2].classList.add('active');
        renderProfile(content);
    } 
    else if (page === 'mitra-detail') {
        pageTitle.innerText = "Profil Mitra";
        backBtn.classList.remove('hidden');
        state.activeMitra = data;
        renderMitraDetail(content, data);
    }
    else if (page === 'chat-room') {
        pageTitle.innerText = data.name;
        backBtn.classList.remove('hidden');
        bottomNav.classList.add('hidden');
        renderChatRoom(content, data);
    }
    else if (page === 'topup') {
        pageTitle.innerText = "Top Up Koin";
        backBtn.classList.remove('hidden');
        renderTopUp(content);
    }
}

function goBack() {
    const title = document.getElementById('page-title').innerText;
    if (title === "Top Up Koin") {
        navigateTo('home');
        state.topupData.selectedPackage = null;
        state.topupData.selectedPayment = null;
    } else if (state.activeMitra && title === state.activeMitra.name) {
        navigateTo('mitra-detail', state.activeMitra);
    } else {
        navigateTo('home');
    }
}

// render
function renderHome(container) {
    let html = `
        <div class="topup-card">
            <div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Saldo Total</div>
                <div style="font-size: 1.8rem; font-weight: 700;">${state.credits} K</div>
            </div>
            <button class="topup-btn" onclick="navigateTo('topup')">+ Top Up</button>
        </div>

        <div class="section-title">Mitra Tersedia</div>
        <div class="mitra-list">
    `;

    mitraData.forEach(m => {
        html += `
            <div class="mitra-card" onclick="navigateTo('mitra-detail', mitraData.find(x => x.id === ${m.id}))">
                <img src="${m.img}" alt="${m.name}" class="mitra-img">
                <div class="mitra-info">
                    <h3>${m.name}</h3>
                    <p>${m.job}</p>
                    <div class="mitra-rate">${m.rate} Kredit / sesi</div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

function renderMitraDetail(container, mitra) {
    container.innerHTML = `
        <div class="detail-header">
            <img src="${mitra.img}" class="detail-img">
            <h2 style="font-size: 1.4rem;">${mitra.name}</h2>
            <p style="color: var(--text-light);">${mitra.job}</p>
            <div class="mt-2">
                <span class="tag-pill">Ramah</span>
                <span class="tag-pill">Bersertifikat</span>
                <span class="tag-pill">Pendengar</span>
            </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 16px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Tentang</h4>
            <p style="color: var(--text-light); line-height: 1.6; font-size: 0.9rem;">${mitra.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>

        <div style="background: white; padding: 15px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: var(--text-dark);">Biaya per sesi</span>
            <span style="font-weight: 700; color: var(--primary-dark); font-size: 1.2rem;">${mitra.rate} K</span>
        </div>

        <button class="chat-now-btn" onclick="startChat(${mitra.id})">Mulai Obrolan</button>
    `;
}

function renderProfile(container) {
    container.innerHTML = `
        <div class="text-center mt-4">
            <img src="https://ui-avatars.com/api/?name=${state.user.name}&background=random" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
            <h2 id="profile-name">${state.user.name}</h2>
            <p style="color: var(--text-light);">Anggota sejak 2023</p>
        </div>

        <div style="margin-top: 20px; background: #fff; padding: 16px; border-radius:12px;">
            <h3 style="margin-bottom:8px;">Ubah Nama</h3>
            <div style="display:flex; gap:8px; align-items:center;">
                <input id="new-username" type="text" placeholder="Nama baru" style="flex:1; padding:8px; border-radius:8px; border:1px solid #e5e7eb;">
                <button class="btn-primary" style="padding:8px 12px; width:auto;" onclick="renameUser()">Simpan</button>
            </div>
            <div id="rename-msg" style="margin-top:8px; color:#b91c1c; display:none;"></div>
        </div>

        <div style="margin-top: 16px; background: #fff; padding: 16px; border-radius:12px;">
            <h3 style="margin-bottom:8px;">Ganti Kata Sandi</h3>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <input id="current-password" type="password" placeholder="Kata sandi saat ini" style="padding:8px; border-radius:8px; border:1px solid #e5e7eb;">
                <input id="new-password" type="password" placeholder="Kata sandi baru" style="padding:8px; border-radius:8px; border:1px solid #e5e7eb;">
                <input id="confirm-password" type="password" placeholder="Konfirmasi kata sandi baru" style="padding:8px; border-radius:8px; border:1px solid #e5e7eb;">
                <div style="display:flex; gap:8px;">
                    <button class="btn-primary" style="padding:8px 12px;" onclick="changePassword()">Ubah</button>
                    <button class="modal-btn modal-btn-secondary" style="padding:8px 12px;" onclick="clearProfileInputs()">Reset</button>
                </div>
                <div id="password-msg" style="margin-top:6px; color:#b91c1c; display:none;"></div>
            </div>
        </div>

        <div style="margin-top: 16px; display:flex; gap:12px;">
            <div class="mitra-card" style="flex:1; cursor:default;">
                <div>
                    <h3>Pengaturan</h3>
                    <p>Ubah nama & kata sandi akun Anda di sini.</p>
                </div>
            </div>
            <div class="mitra-card" onclick="logout()" style="background:#fff;">
                <div style="color: red;">
                    <h3>Keluar</h3>
                </div>
            </div>
        </div>
    `;
}

function clearProfileInputs() {
    const ids = ['current-password','new-password','confirm-password','new-username'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const msgs = ['rename-msg','password-msg'];
    msgs.forEach(id => { const el = document.getElementById(id); if (el) { el.style.display='none'; el.innerText=''; } });
}

function renameUser() {
    const input = document.getElementById('new-username');
    const msg = document.getElementById('rename-msg');
    if (!input) return;
    const newName = input.value.trim();
    if (!newName) {
        msg.style.display = 'block'; msg.innerText = 'Nama tidak boleh kosong.'; return;
    }
    if (!state.user) { msg.style.display='block'; msg.innerText='Silakan masuk terlebih dahulu.'; return; }
    if (newName === state.user.name) { msg.style.display='block'; msg.innerText='Nama sama seperti sebelumnya.'; return; }

    // cek apakah username sudah dipakai
    if (localStorage.getItem('user_' + newName)) {
        msg.style.display='block'; msg.innerText='Nama pengguna sudah digunakan.'; return;
    }

    const oldKey = 'user_' + state.user.name;
    const data = JSON.parse(localStorage.getItem(oldKey)) || { password: '', credits: state.credits };

    try {
        localStorage.setItem('user_' + newName, JSON.stringify(data));
        localStorage.removeItem(oldKey);
        localStorage.setItem('current_user', newName);
        state.user.name = newName;
        // update UI
        const nameEl = document.getElementById('profile-name'); if (nameEl) nameEl.innerText = newName;
        msg.style.color = '#166534'; msg.style.display = 'block'; msg.innerText = 'Nama berhasil diubah.';
        setTimeout(() => { if (msg) msg.style.display='none'; }, 2500);
    } catch (e) {
        msg.style.display='block'; msg.innerText='Terjadi kesalahan saat menyimpan.';
    }
}

function changePassword() {
    const cur = document.getElementById('current-password');
    const nw = document.getElementById('new-password');
    const cf = document.getElementById('confirm-password');
    const msg = document.getElementById('password-msg');
    if (!cur || !nw || !cf) return;
    const curVal = cur.value;
    const newVal = nw.value;
    const confVal = cf.value;
    if (!state.user) { msg.style.display='block'; msg.innerText='Silakan masuk terlebih dahulu.'; return; }

    const key = 'user_' + state.user.name;
    const userData = JSON.parse(localStorage.getItem(key) || '{}');
    if (!userData.password) userData.password = '';

    if (userData.password !== curVal) {
        msg.style.display='block'; msg.innerText='Kata sandi saat ini salah.'; return;
    }
    if (newVal.length < 4) { msg.style.display='block'; msg.innerText='Kata sandi baru minimal 4 karakter.'; return; }
    if (newVal !== confVal) { msg.style.display='block'; msg.innerText='Konfirmasi kata sandi tidak cocok.'; return; }

    userData.password = newVal;
    try {
        localStorage.setItem(key, JSON.stringify(userData));
        msg.style.color = '#166534'; msg.style.display='block'; msg.innerText='Kata sandi berhasil diubah.';
        setTimeout(() => { if (msg) msg.style.display='none'; }, 2500);
        clearProfileInputs();
    } catch (e) {
        msg.style.display='block'; msg.innerText='Gagal menyimpan kata sandi.';
    }
}

// render daftar chats yang tersimpan untuk user saat ini
function renderChats(container) {
    if (!state.user) {
        container.innerHTML = `<div class="text-center mt-4" style="color:#aaa">Silakan masuk terlebih dahulu.</div>`;
        return;
    }

    let html = `<div class="section-title">Riwayat Obrolan</div>`;
    let chatsHtml = '';
    let hasChats = false;

    mitraData.forEach(m => {
        const key = `chat_${state.user.name}_${m.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            hasChats = true;
            const msgs = JSON.parse(saved);
            const last = msgs[msgs.length - 1];
            const preview = last ? (last.text.length > 60 ? last.text.slice(0, 60) + '...' : last.text) : '';

            chatsHtml += `
                <div class="mitra-card" onclick="navigateTo('chat-room', mitraData.find(x => x.id === ${m.id}))">
                    <img src="${m.img}" alt="${m.name}" class="mitra-img">
                    <div class="mitra-info">
                        <h3>${m.name}</h3>
                        <p style="color: var(--text-light); font-size:0.9rem; margin-top:6px;">${preview}</p>
                    </div>
                    <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
                        <button style="background:#fee2e2;color:#b91c1c;padding:8px 10px;border-radius:8px;border:none;cursor:pointer" onclick="event.stopPropagation(); clearChat(${m.id})">Hapus</button>
                    </div>
                </div>
            `;
        }
    });

    if (!hasChats) {
        container.innerHTML = `<div class="text-center mt-4" style="color:#aaa">Belum ada obrolan. Mulai obrolan dengan mitra.</div>`;
    } else {
        container.innerHTML = html + `<div class="mitra-list">` + chatsHtml + `</div>`;
    }
}

function clearChat(mitraId) {
    if (!state.user) return;
    showModal('Hapus Obrolan', 'Yakin ingin menghapus riwayat obrolan ini?', function() {
        const key = `chat_${state.user.name}_${mitraId}`;
        localStorage.removeItem(key);
        // jika sedang membuka chat yang dihapus, kembali ke halaman chats
        if (state.activeMitra && state.activeMitra.id === mitraId) {
            state.activeMitra = null;
            navigateTo('chats');
        } else {
            navigateTo('chats');
        }
    });
}

function renderChatRoom(container, mitra) {
    // load chat history dari localStorage
    const chatKey = `chat_${state.user.name}_${mitra.id}`;
    const savedChat = localStorage.getItem(chatKey);
    let messagesHtml = `<div class="message msg-in">Halo! Saya ${mitra.name}. Apa yang bisa saya bantu hari ini?</div>`;
    
    if (savedChat) {
        const messages = JSON.parse(savedChat);
        messagesHtml = messages.map(msg => 
            `<div class="message ${msg.type}">${msg.text}</div>`
        ).join('');
    }

    container.innerHTML = `
        <div id="chat-container">
            <div class="chat-messages" id="messages-list">
                ${messagesHtml}
            </div>
            <div class="chat-input-area">
                <input type="text" id="msg-input" class="chat-input" placeholder="Ketik pesan..." onkeypress="handleEnter(event)">
                <button class="send-btn" onclick="sendMessage()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // set timeout untuk scroll ke bawah
    setTimeout(() => {
        const list = document.getElementById('messages-list');
        if (list) list.scrollTop = list.scrollHeight;
    }, 100);
}

function renderTopUp(container) {
    let html = `
        <div style="margin-bottom: 25px;">
            <h3 class="section-title">Pilih Paket Koin</h3>
            <div class="coin-packages">
    `;
    
    coinPackages.forEach(pkg => {
        const badge = pkg.badge ? `<div class="coin-badge">${pkg.badge}</div>` : '';
        html += `
            <div class="coin-package ${state.topupData.selectedPackage?.id === pkg.id ? 'selected' : ''}" onclick="selectCoinPackage(${pkg.id})">
                ${badge}
                <div class="coin-amount">${pkg.coins}</div>
                <div class="coin-label">Koin</div>
                <div class="coin-price">${pkg.price}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div style="margin-bottom: 25px;">
            <h3 class="section-title">Pilih Metode Pembayaran</h3>
            <div class="payment-methods">
    `;

    paymentMethods.forEach(method => {
        html += `
            <div class="payment-method ${state.topupData.selectedPayment?.id === method.id ? 'selected' : ''}" onclick="selectPaymentMethod(${method.id})">
                <div class="payment-icon">${method.icon}</div>
                <div class="payment-info">
                    <h3>${method.name}</h3>
                    <p>${method.desc}</p>
                </div>
                <div class="payment-radio"></div>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="topup-summary">
            <div class="summary-row">
                <span>Paket Terpilih:</span>
                <span id="summary-package">${state.topupData.selectedPackage ? state.topupData.selectedPackage.coins + ' Koin' : 'Belum dipilih'}</span>
            </div>
            <div class="summary-row">
                <span>Metode Pembayaran:</span>
                <span id="summary-method">${state.topupData.selectedPayment ? state.topupData.selectedPayment.name : 'Belum dipilih'}</span>
            </div>
            <div class="summary-row">
                <span>Harga Total:</span>
                <span id="summary-price">${state.topupData.selectedPackage ? state.topupData.selectedPackage.price : 'Rp 0'}</span>
            </div>
        </div>

        <button class="checkout-btn" onclick="processTopUp()" ${!state.topupData.selectedPackage || !state.topupData.selectedPayment ? 'disabled' : ''}>
            Lanjutkan Pembayaran
        </button>
    `;

    container.innerHTML = html;
}

// aksi
function updateCreditDisplay() {
    document.getElementById('credit-display').innerText = `${state.credits} K`;
}

function selectCoinPackage(packageId) {
    const pkg = coinPackages.find(p => p.id === packageId);
    state.topupData.selectedPackage = pkg;
    renderTopUp(document.getElementById('content-area'));
}

function selectPaymentMethod(methodId) {
    const method = paymentMethods.find(m => m.id === methodId);
    state.topupData.selectedPayment = method;
    renderTopUp(document.getElementById('content-area'));
}

function processTopUp() {
    if (!state.topupData.selectedPackage || !state.topupData.selectedPayment) {
        return;
    }

    const pkg = state.topupData.selectedPackage;

    state.credits += pkg.coins;
    
    const userData = JSON.parse(localStorage.getItem('user_' + state.user.name));
    userData.credits = state.credits;
    localStorage.setItem('user_' + state.user.name, JSON.stringify(userData));
    
    updateCreditDisplay();

    state.topupData.selectedPackage = null;
    state.topupData.selectedPayment = null;

    navigateTo('home');
}

function showModal(title, message, callback) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    state.modalCallback = callback;
    document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
    state.modalCallback = null;
}

function confirmModal() {
    if (state.modalCallback) {
        state.modalCallback();
    }
    closeModal();
}

function startChat(mitraId) {
    const mitra = mitraData.find(m => m.id === mitraId);
    if (state.credits >= mitra.rate) {
        showModal(
            'Mulai Obrolan',
            `Mulai obrolan dengan ${mitra.name} untuk ${mitra.rate} kredit?`,
            function() {
                state.credits -= mitra.rate;
                state.activeMitra = mitra;
                
                const userData = JSON.parse(localStorage.getItem('user_' + state.user.name));
                userData.credits = state.credits;
                localStorage.setItem('user_' + state.user.name, JSON.stringify(userData));
                
                updateCreditDisplay();
                navigateTo('chat-room', mitra);
            }
        );
    }
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value;
    if (!text.trim()) return;

    const list = document.getElementById('messages-list');
    const mitra = state.activeMitra;
    
    list.innerHTML += `<div class="message msg-out">${text}</div>`;
    input.value = '';
    list.scrollTop = list.scrollHeight;

    // simpan chat ke localStorage
    const chatKey = `chat_${state.user.name}_${mitra.id}`;
    const messages = Array.from(list.querySelectorAll('.message')).map(el => ({
        type: el.classList.contains('msg-out') ? 'msg-out' : 'msg-in',
        text: el.innerText
    }));
    localStorage.setItem(chatKey, JSON.stringify(messages));

    setTimeout(() => {
        const replies = ["Saya memahami.", "Ceritakan lebih lanjut tentang itu.", "Itu terdengar menantang.", "Bagaimana perasaan Anda tentang itu?", "Saya mengerti."];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        list.innerHTML += `<div class="message msg-in">${randomReply}</div>`;
        list.scrollTop = list.scrollHeight;

        // simpan balasan bot juga
        const updatedMessages = Array.from(list.querySelectorAll('.message')).map(el => ({
            type: el.classList.contains('msg-out') ? 'msg-out' : 'msg-in',
            text: el.innerText
        }));
        localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    }, 1000);
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function logout() {
    state.user = null;
    state.credits = 50;
    state.topupData.selectedPackage = null;
    state.topupData.selectedPayment = null;
    localStorage.removeItem('current_user');
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}