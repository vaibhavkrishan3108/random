// Check which page we're on
const isLandingPage = document.querySelector('.landing-page') !== null;
const isJourneyPage = document.querySelector('.journey-page') !== null;

// Landing Page Logic
if (isLandingPage) {
    // Set your girlfriend's birthday here (format: year, month-1, day, hour, minute)
    // Note: Month is 0-indexed (0 = January, 11 = December)
    const birthday = new Date(2023, 0, 1, 0, 0); // Past date to end countdown immediately 
    
    const countdownElement = document.getElementById('countdown');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const journeyButton = document.getElementById('journey-button');
    
    // Update the countdown timer
    function updateCountdown() {
        const currentTime = new Date();
        const difference = birthday - currentTime;
        
        // If it's her birthday or after
        if (difference <= 0) {
            countdownElement.innerHTML = '<h2 class="birthday-message">Happy Birthday!</h2>';
            journeyButton.classList.remove('hidden');
            return;
        }
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Display countdown
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Check if countdown is very close
        if (days === 0 && hours === 0 && minutes === 0 && seconds <= 30) {
            journeyButton.classList.remove('hidden');
        }
    }
    
    // Initial call and then update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Journey Page Logic
if (isJourneyPage) {
    const chapters = document.querySelectorAll('.chapter');
    const prevButton = document.querySelector('.prev-chapter');
    const nextButton = document.querySelector('.next-chapter');
    let currentChapterIndex = 0;
    let audioPlayer = null;
    
    // Function to show the current chapter and hide others
    function showCurrentChapter() {
        chapters.forEach((chapter, index) => {
            if (index === currentChapterIndex) {
                chapter.style.display = 'block';
                chapter.classList.add('active');
            } else {
                chapter.style.display = 'none';
                chapter.classList.remove('active');
            }
        });
        
        // Update navigation button states
        prevButton.style.visibility = currentChapterIndex > 0 ? 'visible' : 'hidden';
        nextButton.style.visibility = currentChapterIndex < chapters.length - 1 ? 'visible' : 'hidden';
    }
    
    // Initialize chapter display
    showCurrentChapter();
    
    // Event listeners for navigation buttons
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentChapterIndex > 0) {
            stopCurrentAudio();
            currentChapterIndex--;
            showCurrentChapter();
        }
    });
    
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentChapterIndex < chapters.length - 1) {
            stopCurrentAudio();
            currentChapterIndex++;
            showCurrentChapter();
        }
    });
    
    // Music player functionality
    const playButtons = document.querySelectorAll('.play-pause');
    
    // Function to stop currently playing audio
    function stopCurrentAudio() {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            
            // Reset all play buttons
            playButtons.forEach(button => {
                button.textContent = '▶️ Play';
            });
        }
    }
    
    // Add click event to play buttons
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const chapterIndex = button.getAttribute('data-chapter');
            const chapter = document.querySelector(`.chapter[data-chapter="${chapterIndex}"]`);
            const musicPath = chapter ? chapter.getAttribute('data-music') : null;
            
            // If we have a music path
            if (musicPath) {
                // If audio is already playing
                if (audioPlayer && !audioPlayer.paused) {
                    stopCurrentAudio();
                } else {
                    // Stop any currently playing audio first
                    stopCurrentAudio();
                    
                    // Create new audio player
                    audioPlayer = new Audio(musicPath);
                    audioPlayer.play();
                    button.textContent = '⏸️ Pause';
                    
                    // When song ends
                    audioPlayer.onended = () => {
                        button.textContent = '▶️ Play';
                    };
                }
            }
        });
    });
}
