// Global variables
let currentPanel = 'home';
let citizenData = {
    streak: 150,
    composted: 2.5,
    ecoPoints: 450,
    achievements: ['segregation-master', 'recycling-champion'],
    collections: {
        'Mon': 'Wet Waste - 7:00 AM',
        'Tue': 'Dry Waste - 7:00 AM',
        'Wed': 'Wet Waste - 7:00 AM',
        'Thu': 'Dry Waste - 7:00 AM',
        'Fri': 'Wet Waste - 7:00 AM',
        'Sat': 'Dry Waste - 7:00 AM',
        'Sun': 'Hazardous - 8:00 AM'
    }
};

let workerData = {
    safetyScore: 95,
    efficiency: 92,
    trainings: [
        { name: 'Basic Safety Protocols', status: 'completed', date: 'Jan 15, 2024' },
        { name: 'Waste Segregation Techniques', status: 'current', progress: 60 },
        { name: 'Equipment Maintenance', status: 'pending', startDate: 'Feb 1, 2024' }
    ],
    schedule: [
        { time: '6:00 AM', location: 'Sector 15-18', task: 'Wet Waste Collection' },
        { time: '10:00 AM', location: 'Commercial Area', task: 'Dry Waste Collection' },
        { time: '2:00 PM', location: 'Processing Plant', task: 'Waste Processing' }
    ]
};

let governmentData = {
    segregationRate: 76,
    trainedCitizens: 1245,
    collectionRate: 89,
    facilities: [
        { name: 'Waste-to-Energy Plant', capacity: 45, status: 'operational' },
        { name: 'Recycling Center', capacity: 32, status: 'operational' },
        { name: 'Compost Plant', capacity: 0, status: 'maintenance' }
    ],
    alerts: [
        { level: 'high', title: 'Landfill Capacity', message: 'Zone C landfill at 95% capacity' },
        { level: 'medium', title: 'Collection Delay', message: 'Sector 22 experiencing collection delays' }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateCitizenPanel();
    updateWorkerPanel();
    updateGovernmentPanel();
    updateRewardsPanel();
});

function initializeApp() {
    // Add event listeners
    setupEventListeners();
    
    // Initialize animations
    initializeAnimations();
    
    // Load saved data from localStorage
    loadSavedData();
}

function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.textContent.toLowerCase().replace(' ', '');
            showPanel(panel);
        });
    });

    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function initializeAnimations() {
    // Add intersection observer for scroll animations
    const cards = document.querySelectorAll('.dashboard-card, .access-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

function loadSavedData() {
    // Load data from localStorage if available
    const savedCitizenData = localStorage.getItem('citizenData');
    if (savedCitizenData) {
        citizenData = { ...citizenData, ...JSON.parse(savedCitizenData) };
    }

    const savedWorkerData = localStorage.getItem('workerData');
    if (savedWorkerData) {
        workerData = { ...workerData, ...JSON.parse(savedWorkerData) };
    }
}

function saveData(dataType, data) {
    localStorage.setItem(dataType, JSON.stringify(data));
}

// Panel navigation
function showPanel(panelName) {
    // Hide all panels
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Show selected panel
    const targetPanel = document.getElementById(panelName);
    if (targetPanel) {
        targetPanel.classList.add('active');
        currentPanel = panelName;
        
        // Update panel-specific data
        switch(panelName) {
            case 'citizen':
                updateCitizenPanel();
                break;
            case 'worker':
                updateWorkerPanel();
                break;
            case 'government':
                updateGovernmentPanel();
                break;
            case 'rewards':
                updateRewardsPanel();
                break;
        }
    }

    // Update navigation button states
    updateNavButtons(panelName);
}

function updateNavButtons(activePanel) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        const btnPanel = btn.textContent.toLowerCase().replace(' ', '');
        if (btnPanel === activePanel || (activePanel === 'home' && btn.textContent === 'Home')) {
            btn.classList.add('active');
        }
    });
}

// Citizens Panel Functions
function updateCitizenPanel() {
    updateImpactStats();
    updateCollectionSchedule();
    animateProgressBars();
}

function updateImpactStats() {
    const streakElement = document.querySelector('.impact-item:nth-child(1) .impact-number');
    const compostElement = document.querySelector('.impact-item:nth-child(2) .impact-number');
    const pointsElement = document.querySelector('.impact-item:nth-child(3) .impact-number');

    if (streakElement) streakElement.textContent = citizenData.streak;
    if (compostElement) compostElement.textContent = citizenData.composted + 'kg';
    if (pointsElement) pointsElement.textContent = citizenData.ecoPoints;
}

function updateCollectionSchedule() {
    // Dynamic schedule updates based on day of week
    const today = new Date().getDay();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Highlight today's collection
    const scheduleItems = document.querySelectorAll('#citizen .schedule-item');
    scheduleItems.forEach((item, index) => {
        const dayElements = item.querySelectorAll('.day');
        dayElements.forEach(dayEl => {
            if (dayEl.textContent.includes(days[today])) {
                item.style.background = 'var(--light-green)';
                item.style.borderLeft = '4px solid var(--accent-green)';
            }
        });
    });
}

// Worker Panel Functions
function updateWorkerPanel() {
    updateTrainingProgress();
    updatePerformanceMetrics();
    updateSafetyGear();
}

function updateTrainingProgress() {
    const progressBars = document.querySelectorAll('#worker .progress');
    progressBars.forEach((bar, index) => {
        const percentage = index === 0 ? workerData.efficiency : workerData.safetyScore;
        bar.style.width = percentage + '%';
    });
}

function updatePerformanceMetrics() {
    const efficiencyValue = document.querySelector('#worker .metric-value');
    if (efficiencyValue) {
        efficiencyValue.textContent = workerData.efficiency + '%';
    }
}

function updateSafetyGear() {
    // Update safety gear status dynamically
    const safetyItems = document.querySelectorAll('#worker .safety-item');
    safetyItems.forEach(item => {
        const badge = item.querySelector('.status-badge');
        if (badge && Math.random() > 0.8) {
            badge.textContent = 'Needs Replacement';
            badge.style.background = 'var(--warning)';
            item.className = 'safety-item maintenance';
        }
    });
}

// Government Panel Functions
function updateGovernmentPanel() {
    updateAnalytics();
    updateFacilityStatus();
    updateAlerts();
}

function updateAnalytics() {
    const trendElements = document.querySelectorAll('#government .trend');
    trendElements.forEach(trend => {
        const isUp = Math.random() > 0.5;
        const percentage = Math.floor(Math.random() * 20) + 1;
        
        if (isUp) {
            trend.textContent = '↑ ' + percentage + '%';
            trend.className = 'trend up';
        } else {
            trend.textContent = '↓ ' + percentage + '%';
            trend.className = 'trend down';
        }
    });
}

function updateFacilityStatus() {
    // Simulate real-time facility updates
    governmentData.facilities.forEach((facility, index) => {
        if (facility.status === 'maintenance' && Math.random() > 0.7) {
            facility.status = 'operational';
            facility.capacity = Math.floor(Math.random() * 50) + 20;
        }
    });
}

function updateAlerts() {
    // Dynamic alert generation
    const alertTypes = [
        { level: 'high', title: 'Equipment Failure', message: 'Compactor unit in Zone B requires immediate attention' },
        { level: 'medium', title: 'Staff Shortage', message: 'Zone D requires additional collection staff' },
        { level: 'low', title: 'Route Optimization', message: 'Consider optimizing collection routes in Zone A' }
    ];

    if (Math.random() > 0.8) {
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        governmentData.alerts.push(randomAlert);
    }
}

// Rewards Panel Functions
function updateRewardsPanel() {
    updatePointsBalance();
    updateLeaderboard();
    updateAchievements();
}

function updatePointsBalance() {
    const pointsElement = document.querySelector('#rewards .points-number');
    if (pointsElement) {
        animateCounter(pointsElement, 0, citizenData.ecoPoints, 1000);
    }
}

function updateLeaderboard() {
    // Simulate dynamic leaderboard updates
    const leaderboardData = [
        { name: 'Priya Sharma', points: 5240 },
        { name: 'Raj Kumar', points: 4890 },
        { name: 'Anita Desai', points: 4650 },
        { name: 'You', points: citizenData.ecoPoints }
    ];

    // Sort by points
    leaderboardData.sort((a, b) => b.points - a.points);

    // Update DOM
    const leaderboardItems = document.querySelectorAll('#rewards .leaderboard-item');
    leaderboardItems.forEach((item, index) => {
        if (leaderboardData[index]) {
            const nameElement = item.querySelector('.name');
            const pointsElement = item.querySelector('.points');
            
            if (nameElement) nameElement.textContent = leaderboardData[index].name;
            if (pointsElement) pointsElement.textContent = leaderboardData[index].points + ' pts';
        }
    });
}

function updateAchievements() {
    // Check for new achievements
    const achievements = document.querySelectorAll('#rewards .achievement');
    achievements.forEach(achievement => {
        const title = achievement.querySelector('strong').textContent;
        
        if (title === 'Compost Expert' && citizenData.composted >= 100) {
            achievement.classList.remove('locked');
            achievement.classList.add('earned');
        }
    });
}

// Modal Functions
function openModal(modalType) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let content = '';
    
    switch(modalType) {
        case 'training':
            content = generateTrainingContent();
            break;
        case 'compost':
            content = generateCompostContent();
            break;
        case 'report':
            content = generateReportContent();
            break;
        case 'track':
            content = generateTrackContent();
            break;
        case 'redeem':
            content = generateRedeemContent();
            break;
        default:
            content = '<h2>Information</h2><p>This feature is coming soon!</p>';
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
    
    // Add event listeners to modal content
    setupModalEventListeners(modalType);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

function setupModalEventListeners(modalType) {
    switch(modalType) {
        case 'training':
            setupTrainingModal();
            break;
        case 'report':
            setupReportModal();
            break;
        case 'redeem':
            setupRedeemModal();
            break;
    }
}

// Modal setup functions
function setupTrainingModal() {
    const continueBtn = document.querySelector('#modal .action-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // Simulate training progress
            const progressBars = document.querySelectorAll('#modal .progress');
            let completedModules = 0;
            
            progressBars.forEach((bar, index) => {
                const currentWidth = parseInt(bar.style.width) || 0;
                if (currentWidth === 100) {
                    completedModules++;
                } else if (currentWidth < 100) {
                    // Complete the current module
                    bar.style.width = '100%';
                    const moduleText = bar.parentElement.previousElementSibling;
                    if (moduleText) {
                        moduleText.innerHTML = moduleText.innerHTML.replace('In Progress', 'Completed').replace('Not Started', 'Completed');
                    }
                    
                    // Award EcoPoints for completion
                    const pointsAwarded = 100;
                    citizenData.ecoPoints += pointsAwarded;
                    updateCitizenPanel();
                    updateRewardsPanel();
                    saveData('citizenData', citizenData);
                    
                    showMessage(`🎓 Module completed! You earned ${pointsAwarded} EcoPoints.`, 'success');
                    return;
                }
            });
            
            if (completedModules === progressBars.length) {
                showMessage('🏆 All training modules completed! You are now a certified waste management expert.', 'success');
            }
        });
    }
}

function setupReportModal() {
    const cameraBtn = document.getElementById('camera-btn');
    const fileInput = document.getElementById('report-photo');
    const cameraPreview = document.getElementById('camera-preview');
    const captureBtn = document.getElementById('capture-btn');
    const wasteTypeSelect = document.getElementById('waste-type-select');
    
    if (cameraBtn) {
        cameraBtn.addEventListener('click', startCamera);
    }
    
    if (captureBtn) {
        captureBtn.addEventListener('click', capturePhoto);
    }
    
    if (wasteTypeSelect) {
        wasteTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            if (selectedType) {
                showWasteSegregationTips(selectedType);
            }
        });
    }
}

function setupRedeemModal() {
    // Redeem modal specific event listeners can be added here
}

// Modal Content Generators
function generateTrainingContent() {
    return `
        <h2>🎓 Waste Management Training</h2>
        <div style="margin: 20px 0;">
            <h3>Module 1: Waste Segregation Basics</h3>
            <div class="progress-bar" style="margin: 10px 0;">
                <div class="progress" style="width: 100%;"></div>
            </div>
            <p>✅ Completed - Understanding different waste types</p>
            
            <h3>Module 2: Home Composting</h3>
            <div class="progress-bar" style="margin: 10px 0;">
                <div class="progress" style="width: 75%;"></div>
            </div>
            <p>🔄 In Progress - Setting up your compost system</p>
            
            <h3>Module 3: Recycling Best Practices</h3>
            <div class="progress-bar" style="margin: 10px 0;">
                <div class="progress" style="width: 0%;"></div>
            </div>
            <p>⏳ Not Started - Maximizing recycling efficiency</p>
        </div>
        <button class="action-btn" onclick="startTraining()" style="width: 100%;">Continue Training</button>
    `;
}

function generateCompostContent() {
    return `
        <h2>🌱 Compost Kit Information</h2>
        <div style="margin: 20px 0;">
            <img src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400" 
                 alt="Compost Kit" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">
            
            <h3>Your Compost Kit Includes:</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Compost bin with ventilation system</li>
                <li>Organic waste activator</li>
                <li>pH testing strips</li>
                <li>Instruction manual</li>
                <li>Digital thermometer</li>
            </ul>
            
            <h3>Composting Tips:</h3>
            <ol style="margin: 15px 0; padding-left: 20px;">
                <li>Maintain green to brown ratio of 3:1</li>
                <li>Turn compost every 2-3 days</li>
                <li>Keep moisture level at 40-60%</li>
                <li>Monitor temperature (130-160°F optimal)</li>
            </ol>
        </div>
        <button class="action-btn" onclick="orderCompostKit()" style="width: 100%;">Order New Kit</button>
    `;
}

function generateReportContent() {
    return `
        <h2>📸 Report Illegal Dumping</h2>
        <div style="margin: 20px 0;">
            <p>Help keep our community clean by reporting illegal dumping sites.</p>
            
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Location:</label>
                <input type="text" id="report-location" placeholder="Enter address or landmark" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
            </div>
            
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Description:</label>
                <textarea id="report-description" placeholder="Describe the dumping site and waste type" 
                          rows="4" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;"></textarea>
            </div>
            
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Waste Type Classification:</label>
                <select id="waste-type-select" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
                    <option value="">Select waste type</option>
                    <option value="wet">🟢 Wet Waste (Organic/Biodegradable)</option>
                    <option value="dry">🔵 Dry Waste (Recyclable)</option>
                    <option value="hazardous">🔴 Hazardous Waste (Toxic/Dangerous)</option>
                    <option value="mixed">⚫ Mixed Waste (Unsegregated)</option>
                </select>
                <div id="waste-tips" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; display: none;">
                    <h4>Segregation Tips:</h4>
                    <div id="tips-content"></div>
                </div>
            </div>
            
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Capture Photo:</label>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button type="button" id="camera-btn" style="flex: 1; padding: 10px; background: var(--accent-green); 
                            color: white; border: none; border-radius: 5px; cursor: pointer;">📷 Use Camera</button>
                    <label for="report-photo" style="flex: 1; padding: 10px; background: var(--secondary-green); 
                           color: white; border-radius: 5px; cursor: pointer; text-align: center;">📁 Upload File</label>
                </div>
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Upload Photo:</label>
                <input type="file" id="report-photo" accept="image/*" 
                       style="display: none;">
                
                <div id="camera-container" style="display: none; margin-top: 10px;">
                    <video id="camera-preview" autoplay style="width: 100%; max-height: 300px; border-radius: 5px;"></video>
                    <button type="button" id="capture-btn" style="width: 100%; padding: 10px; margin-top: 10px; 
                            background: var(--primary-green); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        📸 Capture Photo
                    </button>
                </div>
                
                <canvas id="photo-canvas" style="display: none;"></canvas>
                <div id="captured-photo" style="margin-top: 10px;"></div>
            </div>
            
            <p style="font-size: 0.9em; color: #666; margin: 10px 0;">
                📍 Your location will be automatically detected for geo-tagging
            </p>
        </div>
        <button class="action-btn" onclick="submitReport()" style="width: 100%;">Submit Report</button>
    `;
}

function generateTrackContent() {
    return `
        <h2>🚛 Track Collection Vehicle</h2>
        <div style="margin: 20px 0;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <h3>🟢 Vehicle Status: En Route</h3>
                <p><strong>Vehicle ID:</strong> WM-2024-15</p>
                <p><strong>Driver:</strong> Rajesh Kumar</p>
                <p><strong>Estimated Arrival:</strong> 8:30 AM</p>
                <p><strong>Current Location:</strong> Sector 12, Block B</p>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <h4>📍 Route Progress</h4>
                <div class="progress-bar" style="margin: 10px 0;">
                    <div class="progress" style="width: 65%;"></div>
                </div>
                <p>Stop 4 of 8 - Your location is next!</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 10px;">
                <h4>⚠️ Preparation Reminder</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Place wet waste bin outside by 8:25 AM</li>
                    <li>Ensure proper segregation</li>
                    <li>Keep bins accessible for collection</li>
                </ul>
            </div>
        </div>
        <button class="action-btn" onclick="enableNotifications()" style="width: 100%;">Enable Notifications</button>
    `;
}

function generateRedeemContent() {
    return `
        <h2>🎁 Redeem EcoPoints</h2>
        <div style="margin: 20px 0;">
            <div style="text-align: center; background: linear-gradient(135deg, var(--accent-green), var(--primary-green)); 
                        color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <h3>Available Balance</h3>
                <div style="font-size: 2.5rem; font-weight: bold;">${citizenData.ecoPoints}</div>
                <p>EcoPoints</p>
            </div>
            
            <div style="display: grid; gap: 15px;">
                <div style="border: 2px solid #ddd; padding: 15px; border-radius: 10px; display: flex; 
                           justify-content: space-between; align-items: center;">
                    <div>
                        <strong>🎫 Movie Voucher</strong>
                        <p style="color: #666;">Valid at all PVR cinemas</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: var(--primary-green);">1000 pts</div>
                        <button class="claim-btn" onclick="redeemReward('movie')">Redeem</button>
                    </div>
                </div>
                
                <div style="border: 2px solid #ddd; padding: 15px; border-radius: 10px; display: flex; 
                           justify-content: space-between; align-items: center;">
                    <div>
                        <strong>🌱 Plant Sapling</strong>
                        <p style="color: #666;">Native tree sapling with pot</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: var(--primary-green);">800 pts</div>
                        <button class="claim-btn" onclick="redeemReward('plant')">Redeem</button>
                    </div>
                </div>
                
                <div style="border: 2px solid #ddd; padding: 15px; border-radius: 10px; display: flex; 
                           justify-content: space-between; align-items: center;">
                    <div>
                        <strong>♻️ Eco-friendly Bags</strong>
                        <p style="color: #666;">Set of 5 reusable bags</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: var(--primary-green);">300 pts</div>
                        <button class="claim-btn" onclick="redeemReward('bags')">Redeem</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Interactive Functions
function startTraining() {
    showMessage('🎓 Training module started! Complete all sections to earn bonus points.', 'success');
    closeModal();
    
    // Simulate training completion
    setTimeout(() => {
        citizenData.ecoPoints += 50;
        updateCitizenPanel();
        updateRewardsPanel();
        saveData('citizenData', citizenData);
        showMessage('✅ Training completed! You earned 50 EcoPoints.', 'success');
    }, 3000);
}

function orderCompostKit() {
    showMessage('📦 Compost kit ordered successfully! Delivery within 3-5 business days.', 'success');
    closeModal();
    
    citizenData.ecoPoints -= 500;
    updateCitizenPanel();
    updateRewardsPanel();
    saveData('citizenData', citizenData);
}

function submitReport() {
    const location = document.getElementById('report-location')?.value;
    const description = document.getElementById('report-description')?.value;
    const wasteType = document.getElementById('waste-type-select')?.value;
    
    if (!location || !description || !wasteType) {
        showMessage('⚠️ Please fill in all required fields including waste type classification.', 'warning');
        return;
    }
    
    // Award extra points for proper waste classification
    const basePoints = 100;
    const classificationBonus = 50;
    const totalPoints = basePoints + classificationBonus;
    
    showMessage(`📸 Report submitted successfully! You earned ${totalPoints} EcoPoints (${basePoints} base + ${classificationBonus} classification bonus).`, 'success');
    closeModal();
    
    citizenData.ecoPoints += totalPoints;
    updateCitizenPanel();
    updateRewardsPanel();
    saveData('citizenData', citizenData);
}

function enableNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                showMessage('🔔 Notifications enabled! You will receive collection reminders.', 'success');
            } else {
                showMessage('❌ Notification permission denied.', 'warning');
            }
        });
    } else {
        showMessage('❌ Your browser does not support notifications.', 'warning');
    }
    closeModal();
}

function redeemReward(type) {
    const rewards = {
        movie: { name: 'Movie Voucher', cost: 1000 },
        plant: { name: 'Plant Sapling', cost: 800 },
        bags: { name: 'Eco-friendly Bags', cost: 300 }
    };
    
    const reward = rewards[type];
    
    if (citizenData.ecoPoints >= reward.cost) {
        citizenData.ecoPoints -= reward.cost;
        updateCitizenPanel();
        updateRewardsPanel();
        saveData('citizenData', citizenData);
        showMessage(`🎉 ${reward.name} redeemed successfully! Check your email for details.`, 'success');
        closeModal();
    } else {
        showMessage(`❌ Insufficient EcoPoints. You need ${reward.cost - citizenData.ecoPoints} more points.`, 'warning');
    }
}

// Camera functionality
let currentStream = null;

async function startCamera() {
    try {
        const cameraContainer = document.getElementById('camera-container');
        const cameraPreview = document.getElementById('camera-preview');
        
        // Request camera access
        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment' // Use back camera on mobile
            } 
        });
        
        cameraPreview.srcObject = currentStream;
        cameraContainer.style.display = 'block';
        
        showMessage('📷 Camera activated! Position the untidy area in the frame and capture.', 'success');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showMessage('❌ Unable to access camera. Please check permissions or use file upload.', 'error');
    }
}

function capturePhoto() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('photo-canvas');
    const capturedPhotoDiv = document.getElementById('captured-photo');
    
    if (!video.videoWidth || !video.videoHeight) {
        showMessage('⚠️ Camera not ready. Please wait a moment and try again.', 'warning');
        return;
    }
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Convert to blob and display
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        capturedPhotoDiv.innerHTML = `
            <div style="margin-top: 10px;">
                <h4>📸 Captured Photo:</h4>
                <img src="${url}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 5px;">
                <p style="color: var(--success); font-size: 0.9em; margin-top: 5px;">✅ Photo captured successfully!</p>
            </div>
        `;
        
        // Stop camera stream
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
        }
        
        // Hide camera container
        document.getElementById('camera-container').style.display = 'none';
        
        showMessage('📸 Photo captured! You can now submit the report.', 'success');
    }, 'image/jpeg', 0.8);
}

function showWasteSegregationTips(wasteType) {
    const tipsDiv = document.getElementById('waste-tips');
    const tipsContent = document.getElementById('tips-content');
    
    const tips = {
        wet: `
            <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Kitchen scraps, food waste, fruit peels</li>
                <li>Garden waste, leaves, grass clippings</li>
                <li>Should be composted or sent to biogas plants</li>
                <li>⚠️ Never mix with dry waste</li>
            </ul>
        `,
        dry: `
            <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Paper, cardboard, newspapers</li>
                <li>Plastic bottles, containers, bags</li>
                <li>Metal cans, glass bottles</li>
                <li>♻️ Can be recycled and reused</li>
            </ul>
        `,
        hazardous: `
            <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Batteries, electronic waste</li>
                <li>Medicines, chemicals, paints</li>
                <li>Fluorescent bulbs, thermometers</li>
                <li>⚠️ Requires special disposal methods</li>
            </ul>
        `,
        mixed: `
            <div style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
                <strong>⚠️ Improper Segregation Detected!</strong>
                <p style="margin: 5px 0;">Mixed waste makes recycling difficult and harmful to the environment. 
                Please encourage proper segregation at source.</p>
            </div>
        `
    };
    
    tipsContent.innerHTML = tips[wasteType] || '';
    tipsDiv.style.display = 'block';
    
    // Award points for learning about waste types
    citizenData.ecoPoints += 10;
    updateCitizenPanel();
    updateRewardsPanel();
    saveData('citizenData', citizenData);
}

// Utility Functions
function animateCounter(element, start, end, duration) {
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    // Set background based on type
    switch(type) {
        case 'success':
            messageEl.style.background = 'var(--success)';
            break;
        case 'warning':
            messageEl.style.background = 'var(--warning)';
            messageEl.style.color = 'var(--dark-gray)';
            break;
        case 'error':
            messageEl.style.background = 'var(--danger)';
            break;
        default:
            messageEl.style.background = 'var(--info)';
    }
    
    document.body.appendChild(messageEl);
    
    // Remove message after 4 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 4000);
}

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Simulate real-time data updates
setInterval(() => {
    if (currentPanel === 'government') {
        updateAnalytics();
    }
}, 30000); // Update every 30 seconds

// Simulate vehicle tracking updates
setInterval(() => {
    if (document.querySelector('#modal.active')) {
        const progressBar = document.querySelector('#modal .progress');
        if (progressBar) {
            const currentWidth = parseInt(progressBar.style.width) || 0;
            if (currentWidth < 100) {
                progressBar.style.width = (currentWidth + 5) + '%';
            }
        }
    }
}, 5000); // Update every 5 seconds

// Handle offline/online status
window.addEventListener('offline', () => {
    showMessage('📱 You are offline. Some features may not work properly.', 'warning');
});

window.addEventListener('online', () => {
    showMessage('🌐 Connection restored!', 'success');
});

// Clean up camera stream when modal is closed
const originalCloseModal = closeModal;
closeModal = function() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    originalCloseModal();
};

// Export functions for global access
window.showPanel = showPanel;
window.openModal = openModal;
window.closeModal = closeModal;
window.startTraining = startTraining;
window.orderCompostKit = orderCompostKit;
window.submitReport = submitReport;
window.enableNotifications = enableNotifications;
window.redeemReward = redeemReward;
window.startCamera = startCamera;
window.capturePhoto = capturePhoto;
