// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Song Data
const songs = [
    {
        name: "Summer Vibes",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg"
    },
    {
        name: "Chill Beats",
        filePath: "songs/2.mp3",
        coverPath: "covers/2.jpg"
    },
    {
        name: "Dance Party",
        filePath: "songs/3.mp3",
        coverPath: "covers/3.jpg"
    },
    {
        name: "Smooth Jazz",
        filePath: "songs/4.mp3",
        coverPath: "covers/4.jpg"
    },
    {
        name: "Rock Anthem",
        filePath: "songs/5.mp3",
        coverPath: "covers/5.jpg"
    },
    {
        name: "Pop Hits",
        filePath: "songs/6.mp3",
        coverPath: "covers/6.jpg"
    },
    {
        name: "Electronic Beats",
        filePath: "songs/7.mp3",
        coverPath: "covers/7.jpg"
    },
    {
        name: "Classical Piano",
        filePath: "songs/8.mp3",
        coverPath: "covers/8.jpg"
    },
    {
        name: "Acoustic Guitar",
        filePath: "songs/9.mp3",
        coverPath: "covers/9.jpg"
    },
    {
        name: "Ambient Sounds",
        filePath: "songs/10.mp3",
        coverPath: "covers/10.jpg"
    }
];

// DOM Elements
const audioElement = new Audio();
const songCards = document.querySelector('.song-cards');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.querySelector('.volume-slider');
const songNameElement = document.querySelector('.song-info .song-name');
const themeToggle = document.getElementById('theme-toggle');
const cursor = document.querySelector('.cursor');

// Create song cards
function createSongCards() {
    songCards.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('songItem');
        songItem.innerHTML = `
            <img src="${song.coverPath}" alt="${song.name}">
            <div class="song-info">
                <span class="song-name">${song.name}</span>
                <button class="play-btn" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        songCards.appendChild(songItem);
    });

    // Add click event listeners to play buttons
    document.querySelectorAll('.songItem .play-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            if (currentSongIndex === index && isPlaying) {
                togglePlay();
            } else {
                currentSongIndex = index;
                loadSong(index);
                togglePlay();
            }
            updatePlayButtons();
        });
    });
}

// Update play buttons
function updatePlayButtons() {
    document.querySelectorAll('.songItem .play-btn i').forEach((icon, index) => {
        if (index === currentSongIndex && isPlaying) {
            icon.classList.replace('fa-play', 'fa-pause');
        } else {
            icon.classList.replace('fa-pause', 'fa-play');
        }
    });
}

// State Variables
let currentSongIndex = 0;
let isPlaying = false;

// Custom Cursor Effect
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('click', () => {
    cursor.style.transform = 'scale(0.8)';
    setTimeout(() => cursor.style.transform = 'scale(1)', 100);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    themeToggle.querySelector('i').classList.toggle('fa-moon');
    themeToggle.querySelector('i').classList.toggle('fa-sun');
});

// GSAP Animations
gsap.from('.hero-content h1', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
});

gsap.from('.hero-content p', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power4.out'
});

// Scroll Animations
gsap.utils.toArray('.songItem').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8
    });
});

// Music Player Functions
function loadSong(index) {
    const song = songs[index];
    audioElement.src = song.filePath;
    songNameElement.textContent = song.name;
    currentSongIndex = index;
    updatePlayButtons();
}

function togglePlay() {
    if (isPlaying) {
        audioElement.pause();
        playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
    } else {
        audioElement.play();
        playBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
        updateMusicVisualizer();
    }
    isPlaying = !isPlaying;
    updatePlayButtons();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audioElement.play();
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audioElement.play();
}

// Music Visualizer
function updateMusicVisualizer() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        const height = Math.random() * 50 + 10;
        bar.style.height = `${height}px`;
    });
    if (isPlaying) {
        requestAnimationFrame(updateMusicVisualizer);
    }
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', previousSong);

// Initialize song cards
document.addEventListener('DOMContentLoaded', () => {
    createSongCards();
    loadSong(0);
});

audioElement.addEventListener('timeupdate', () => {
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = progress + '%';
});

progressBar.addEventListener('click', (e) => {
    const progressWidth = progressBar.clientWidth;
    const clickedWidth = e.offsetX;
    const progress = (clickedWidth / progressWidth) * 100;
    progressBar.style.width = progress + '%';
    audioElement.currentTime = (progress / 100) * audioElement.duration;
});

volumeSlider.addEventListener('input', (e) => {
    audioElement.volume = e.target.value;
});

// Initialize
loadSong(0);

// Populate Song Cards
songs.forEach((song, index) => {
    const songCard = document.createElement('div');
    songCard.classList.add('songItem');
    songCard.innerHTML = `
        <img src="${song.coverPath}" alt="${song.name}">
        <div class="song-info">
            <span class="song-name">${song.name}</span>
            <button class="play-btn" data-index="${index}">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `;
    songCards.appendChild(songCard);

    // Add click event for play button
    const playButton = songCard.querySelector('.play-btn');
    playButton.addEventListener('click', () => {
        const songIndex = parseInt(playButton.dataset.index);
        if (currentSongIndex === songIndex && isPlaying) {
            togglePlay();
        } else {
            loadSong(songIndex);
            isPlaying = false; // Reset state to ensure proper toggle
            togglePlay();
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Newsletter Form Animation
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = newsletterForm.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribed!';
    button.style.background = '#2ecc71';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
});
