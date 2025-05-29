  // Simple Audio Visualizer
        let song;
        let fft;
        let bassDetector;
        let currentBgColor = '#1919C5'; // Dark blue background

        function preload() {
            // IMPORTANT: Put your MP3 file (e.g., 'your_song.mp3') in the same folder as this HTML file.
            // Or use a full URL if it's hosted online.
            song = loadSound('Lost Sky - Dreams pt. II.mp3');
        }

        function setup() {
            createCanvas(windowWidth, windowHeight);
            colorMode(HSB, 360, 100, 100, 1); // Use HSB for easier color control
            noFill(); // We'll mainly use strokes for the waveform

            // Setup FFT (Fast Fourier Transform) to analyze audio
            fft = new p5.FFT(0.8, 128); // 0.8 smoothing, 128 frequency bins
            fft.setInput(song);

            // Simple bass beat detector: low frequency range, higher sensitivity
            bassDetector = new BeatDetector(20, 100, 1.3);
        }

        function draw() {
            // Smoothly transition background color
            currentBgColor = lerpColor(color(currentBgColor), color(240, 80, 20, 0.1), 0.02);
            background(currentBgColor);

            // Get the current waveform data
            let waveform = fft.waveform();

            // Update beat detector and check for a bass beat
            let bassBeat = bassDetector.update(fft);

            // Change background color on strong bass beat
            if (bassBeat.isBeat && bassBeat.level > 0.5) {
                currentBgColor = color(random(360), 70, 20, 0.1); // Random hue for background
            }

            drawWaveform(waveform, bassBeat); // Draw the main waveform
        }

        function drawWaveform(waveform, bassBeat) {
            push();
            translate(width / 2, height / 2); // Center the waveform

            beginShape();
            strokeWeight(bassBeat.isBeat ? 4 : 2); // Thicker line on beat
            
            // Set color based on beat or normal flow
            if (bassBeat.isBeat) {
                stroke(frameCount % 360, 90, 90, 0.9); // Rainbow effect on beat
            } else {
                stroke(200, 80, 80, 0.7); // Default bluish-purple color
            }

            // Draw the waveform as a continuous line
            for (let i = 0; i < waveform.length; i++) {
                let x = map(i, 0, waveform.length, -width / 2 * 0.8, width / 2 * 0.8); // Map to screen width
                let y = waveform[i] * height / 3; // Scale amplitude to screen height
                vertex(x, y);
            }
            endShape();

            pop();
        }

        function mouseClicked() {
            // Toggle song play/pause on mouse click
            if (song.isPlaying()) {
                song.pause();
            } else {
                song.loop(); // Loop the song when it starts
            }
        }

        // Simple Beat Detector Class
        // This helps figure out if there's a strong "beat" in a certain frequency range.
        class BeatDetector {
            constructor(lowFreq, highFreq, sensitivity = 1.1) {
                this.lowFreq = lowFreq;     // Lower frequency limit
                this.highFreq = highFreq;   // Upper frequency limit
                this.sensitivity = sensitivity; // How sensitive it is to beats
                this.threshold = 0.3;       // Starting level to detect a beat
                this.decayRate = 0.02;      // How quickly the threshold drops
                this.lastBeatTime = 0;      // When the last beat was detected
                this.beatHoldFrames = 10;   // How long to "hold" the beat state
                this.level = 0;             // Current energy level in the frequency range
                this.isBeat = false;        // Is a beat currently happening?
            }
            
            update(fft) {
                // Get the energy (volume) in our frequency range
                this.level = fft.getEnergy(this.lowFreq, this.highFreq) / 255;
                
                // Calculate a dynamic threshold: it adjusts to the music's volume
                const dynamicThreshold = min(this.threshold * this.sensitivity, 0.9);
                
                // Detect a beat if current energy is above the threshold AND enough time has passed
                if (this.level > dynamicThreshold && 
                    frameCount - this.lastBeatTime > this.beatHoldFrames) {
                    this.isBeat = true;
                    this.lastBeatTime = frameCount; // Record this beat's time
                } else {
                    this.isBeat = false;
                }
                
                // Make the threshold decay so it doesn't get stuck too high
                this.threshold = max(this.threshold - this.decayRate, this.level * 0.7);
                
                return {
                    level: this.level,
                    isBeat: this.isBeat
                };
            }
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }