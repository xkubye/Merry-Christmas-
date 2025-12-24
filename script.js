document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURASI ---
    const TAPS_REQUIRED = 5; // Jumlah tap yang dibutuhkan untuk membuka kado
    let tapCount = 0;
    let isMusicPlaying = false; // Status awal musik (browser biasanya memblokir autoplay)

    // --- ELEMEN DOM ---
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = musicBtn.querySelector('i');
    const bgMusic = document.getElementById('bgMusic');
    const tapSound = document.getElementById('tapSound');
    
    const giftContainer = document.getElementById('interactiveGift');
    const giftStage = document.getElementById('gift-stage');
    const cardReveal = document.getElementById('card-reveal');
    const tapProgress = document.getElementById('tapProgress');

    // --- FUNGSI KONTROL MUSIK ---
    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-music');
            musicBtn.title = "Nyalakan Musik";
        } else {
            // Coba play musik (perlu interaksi user dulu biasanya)
            bgMusic.play().then(() => {
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-pause');
                musicBtn.title = "Matikan Musik";
            }).catch(error => {
                console.log("Autoplay diblokir browser, perlu interaksi user.");
            });
        }
        isMusicPlaying = !isMusicPlaying;
    }

    // Event listener tombol musik
    musicBtn.addEventListener('click', toggleMusic);

    // Cobalah memutar musik secara otomatis saat halaman dimuat
    // (Catatan: Browser modern sering memblokir ini sampai ada klik pertama)
    bgMusic.volume = 0.5; // Set volume 50%
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
    }).catch(() => {
        // Jika diblokir, biarkan status isMusicPlaying = false
        console.log("Autoplay awal diblokir. Menunggu interaksi.");
    });


    // --- FUNGSI INTERAKSI KADO ---
    giftContainer.addEventListener('click', () => {
        // 1. Mainkan Sound Effect Tap (reset ke 0 agar bisa diputar cepat berulang)
        tapSound.currentTime = 0;
        tapSound.play();

        // 2. Jika musik latar belum nyala karena diblokir browser, nyalakan di klik pertama
        if (!isMusicPlaying) {
            toggleMusic();
        }

        // 3. Tambah hitungan tap
        tapCount++;
        
        // Update progress bar
        const progressPercentage = (tapCount / TAPS_REQUIRED) * 100;
        tapProgress.style.width = `${progressPercentage}%`;

        // 4. Tambahkan kelas animasi
        // Kita hapus dulu kelasnya (jika ada) agar animasi bisa di-trigger ulang
        giftContainer.classList.remove('animating');
        // Gunakan trik setTimeout 0ms untuk memaksa browser me-render ulang sebelum menambah kelas lagi
        setTimeout(() => {
             giftContainer.classList.add('animating');
        }, 10);
       

        // 5. Cek apakah target tap sudah tercapai
        if (tapCount >= TAPS_REQUIRED) {
            // Tunggu animasi lompat terakhir selesai (0.6s di CSS), lalu buka
            setTimeout(openGift, 700);
        }
    });

    // --- FUNGSI MEMBUKA KADO ---
    function openGift() {
        // Sembunyikan panggung kado dengan efek fade out
        giftStage.style.opacity = '0';
        
        // Setelah fade out selesai (0.8s sesuai CSS), tukar tampilan
        setTimeout(() => {
            giftStage.classList.add('hidden'); // Hilangkan total dari layout
            cardReveal.classList.remove('hidden'); // Munculkan kartu
            
            // Opsional: Mainkan efek suara "Tadaa!" atau lonceng di sini jika punya
            // contoh: document.getElementById('tadaSound').play();
            
        }, 800);
    }

    // Hapus kelas animasi setelah selesai agar bisa diklik lagi (jika belum terbuka)
    giftContainer.addEventListener('animationend', () => {
        giftContainer.classList.remove('animating');
    });
});
