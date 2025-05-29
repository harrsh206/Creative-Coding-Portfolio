// Data about car preferences (example: popularity percentage)
        let carTypes = ["Sedan", "SUV", "Truck", "Hatchback", "Sports Car", "Electric", "Hybrid", "Minivan"];
        let popularity = [65, 80, 70, 45, 90, 55, 60, 30]; // Example data, can be changed
        let barColors = [];
        let animatedHeights = []; // For smooth bar animation

        function setup() {
            createCanvas(windowWidth, windowHeight ); // Slightly smaller canvas
            background('#1a1a2e'); // Dark background
            angleMode(DEGREES); // Use degrees for rotations if needed

            // Generate a palette of stylish, vibrant colors
            generateStylishColors();

            // Initialize animated heights to 0 for animation start
            for (let i = 0; i < popularity.length; i++) {
                animatedHeights.push(0);
            }
        }

        function draw() {
            background('#1a1a2e'); // Clear background each frame for animation

            // Animate bar heights
            for (let i = 0; i < popularity.length; i++) {
                let targetHeight = map(popularity[i], 0, 100, 0, height - 200); // Max bar height
                animatedHeights[i] = lerp(animatedHeights[i], targetHeight, 0.05); // Smooth animation
            }

            drawBarChart(); // Draw the bar chart with animated heights
        }

        function generateStylishColors() {
            // A palette of rich, distinct colors
            let hues = [200, 10, 120, 280, 40, 300, 70, 240]; // Specific hues for car types
            let saturations = [70, 80, 75, 85, 70, 80, 75, 85];
            let brightness = [90, 95, 90, 95, 90, 95, 90, 95];

            for (let i = 0; i < carTypes.length; i++) {
                colorMode(HSB, 360, 100, 100);
                barColors.push(color(hues[i % hues.length], saturations[i % saturations.length], brightness[i % brightness.length]));
            }
        }

        function drawBarChart() {
            let margin = 80; // Margin from canvas edges
            let chartWidth = width - (margin * 2);
            let barSpacing = 15; // Space between bars
            let barWidth = (chartWidth - (carTypes.length - 1) * barSpacing) / carTypes.length;
            let startX = margin;
            let startY = height - margin; // Start drawing from the bottom of the chart area
            let cornerRadius = 8;

            // --- Draw Title ---
            fill('#e0e0e0'); // Light gray for title
            textAlign(CENTER, CENTER);
            textSize(36);
            textStyle(BOLD);
            text("Most Popular Car Types", width / 2, 60);

            // --- Draw X-axis Label ---
            textSize(18);
            textStyle(NORMAL);
            fill('#a0a0a0'); // Gray for axis labels
            text("Car Type", width / 2, height - 30);

            // --- Draw Y-axis Label (Rotated) ---
            push();
            translate(margin / 2 + 10, height / 2);
            rotate(-90);
            text("Popularity (%)", 0, 0);
            pop();

            // --- Draw Y-axis values ---
            textAlign(RIGHT, CENTER);
            textSize(16);
            for (let i = 0; i <= 100; i += 20) {
                let yPos = map(i, 0, 100, startY, margin + 40); // 40 offset for title
                fill('#a0a0a0');
                text(i + "%", startX - 10, yPos);
                stroke('#33334f'); // Darker line for grid
                strokeWeight(1);
                line(startX, yPos, startX + chartWidth, yPos);
            }
            noStroke(); // Reset stroke

            // --- Draw Bars ---
            for (let i = 0; i < carTypes.length; i++) {
                let barHeight = animatedHeights[i]; // Use animated height

                let x = startX + i * (barWidth + barSpacing);
                let y = startY - barHeight;

                // Draw subtle glow/shadow effect
                fill(barColors[i]);
                drawingContext.shadowOffsetX = 0;
                drawingContext.shadowOffsetY = 5;
                drawingContext.shadowBlur = 15;
                drawingContext.shadowColor = color(barColors[i].levels[0], barColors[i].levels[1], barColors[i].levels[2], 150); // Match shadow color to bar

                rect(x, y, barWidth, barHeight, cornerRadius);

                drawingContext.shadowBlur = 0; // Reset shadow

                // Draw value labels on top of bars
                fill('#ffffff'); // White text
                textSize(16);
                textAlign(CENTER);
                textStyle(BOLD);
                text(popularity[i] + "%", x + barWidth / 2, y - 10);

                // Draw car type labels below the x-axis
                fill('#e0e0e0'); // Light gray text
                textSize(14);
                textAlign(CENTER, TOP);
                textStyle(NORMAL);
                text(carTypes[i], x + barWidth / 2, startY + 10);
            }
        }

        function windowResized() {
            resizeCanvas(windowWidth * 0.8, windowHeight * 0.8);
            // Re-initialize animated heights on resize to prevent jump
            for (let i = 0; i < popularity.length; i++) {
                animatedHeights[i] = 0;
            }
        }