// app.js

// Doubly Linked List Node for each song
class SongNode {
    constructor(song) {
        this.song = song;
        this.prev = null;
        this.next = null;
    }
}

// Doubly Linked List Class
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.current = null;
    }

    // Add song to the list
    addSong(song) {
        const newNode = new SongNode(song);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            this.current = this.head;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    // Go to the next song
    nextSong() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            return this.current.song;
        } else {
            return null;
        }
    }

    // Go to the previous song
    prevSong() {
        if (this.current && this.current.prev) {
            this.current = this.current.prev;
            return this.current.song;
        } else {
            return null;
        }
    }

    // Get the current song
    getCurrentSong() {
        return this.current ? this.current.song : null;
    }
}

// Queue to manage the playlist
class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(song) {
        this.queue.push(song);
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

// Initialize the doubly linked list and playlist
const songList = new DoublyLinkedList();
const playlist = new Queue();

// Array of songs with titles and file URLs
const songs = [
    { title: "Song 1", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Song 2", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Song 3", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Song 4", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Song 5", file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
];

// Add all songs to doubly linked list
songs.forEach(song => songList.addSong(song));

// Update the UI with current song
const currentSongDisplay = document.getElementById('currentSong');
const audioPlayer = document.getElementById('audioPlayer');
const progressBar = document.getElementById('progressBar');
const playBtn = document.getElementById('playBtn');

function updateCurrentSong() {
    const currentSong = songList.getCurrentSong();
    if (currentSong) {
        currentSongDisplay.textContent = `Playing: ${currentSong.title}`;
        audioPlayer.src = currentSong.file;
        audioPlayer.play();
        playBtn.textContent = 'Pause';
        updateActiveSongInPlaylist();
    } else {
        currentSongDisplay.textContent = "No Song Playing";
        audioPlayer.pause();
        audioPlayer.src = "";
        playBtn.textContent = 'Play';
    }
}

// Update progress bar
function updateProgressBar() {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
}

// Load the song list in the UI
const songListElement = document.getElementById('songList');
songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.title;
    li.addEventListener('click', () => {
        while (!playlist.isEmpty()) playlist.dequeue(); // Clear playlist
        let temp = songList.head;
        while (temp) {
            if (temp.song.title === song.title) {
                songList.current = temp; // Set current song to clicked song
                break;
            }
            temp = temp.next;
        }
        updateCurrentSong();
    });
    songListElement.appendChild(li);
});

// Update active song in playlist
function updateActiveSongInPlaylist() {
    const lis = songListElement.getElementsByTagName('li');
    for (let li of lis) {
        if (li.textContent === songList.getCurrentSong().title) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    }
}

// Event Listeners for the controls
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        playBtn.textContent = 'Play';
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const next = songList.nextSong();
    if (next) {
        updateCurrentSong();
    } else {
        audioPlayer.pause();
        playBtn.textContent = 'Play';
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    const prev = songList.prevSong();
    if (prev) {
        updateCurrentSong();
    } else {
        audioPlayer.pause();
        playBtn.textContent = 'Play';
    }
});

// Audio player event listeners
audioPlayer.addEventListener('timeupdate', updateProgressBar);

audioPlayer.addEventListener('ended', () => {
    // Auto-play next song when current song ends
    const next = songList.nextSong();
    if (next) {
        updateCurrentSong();
    } else {
        audioPlayer.pause();
        playBtn.textContent = 'Play';
    }
});

// Adding to playlist
songs.forEach(song => {
    playlist.enqueue(song); // Adding songs to queue
});

// Initialize by playing the first song
updateCurrentSong();
