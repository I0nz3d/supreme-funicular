// API Base URL
const API_URL = window.location.origin + '/api';

// Store current user
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserData();
    }
}

// Show modals
function showLogin() {
    closeModal('registerModal');
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    closeModal('loginModal');
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMessage('loginMessage', 'Login successful!', 'success');
            
            setTimeout(() => {
                closeModal('loginModal');
                if (data.user.role === 'business') {
                    loadDashboard(data.user);
                } else {
                    location.reload();
                }
            }, 1000);
        } else {
            showMessage('loginMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'An error occurred. Please try again.', 'error');
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const isBusiness = document.getElementById('registerBusiness').checked;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: isBusiness ? 'business' : 'user'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMessage('registerMessage', 'Registration successful!', 'success');
            
            setTimeout(() => {
                closeModal('registerModal');
                if (data.user.role === 'business') {
                    loadDashboard(data.user);
                } else {
                    location.reload();
                }
            }, 1000);
        } else {
            showMessage('registerMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('registerMessage', 'An error occurred. Please try again.', 'error');
    }
}

// Show message
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Select plan
function selectPlan(plan) {
    const token = localStorage.getItem('token');
    if (!token) {
        showRegister();
    } else {
        alert(`You selected the ${plan} plan. This would integrate with payment processing.`);
    }
}

// Fetch user data
async function fetchUserData() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data;
            if (currentUser.role === 'business' && currentUser.businessId) {
                loadDashboard(currentUser);
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Load dashboard
async function loadDashboard(user) {
    // Hide landing page sections
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    document.querySelector('.pricing').style.display = 'none';
    
    // Show dashboard
    document.getElementById('dashboard').style.display = 'block';
    
    // Fetch dashboard data
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/businesses/${user.businessId}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update stats
            document.getElementById('totalReviews').textContent = data.data.stats.totalReviews;
            document.getElementById('averageRating').textContent = data.data.stats.averageRating;
            document.getElementById('pendingReviews').textContent = data.data.stats.pendingReviews;
            
            // Display recent reviews
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = '';
            
            if (data.data.recentReviews.length === 0) {
                reviewsList.innerHTML = '<p>No reviews yet. Start collecting reviews from your customers!</p>';
            } else {
                data.data.recentReviews.forEach(review => {
                    const reviewEl = document.createElement('div');
                    reviewEl.className = 'review-item';
                    
                    const ratingDiv = document.createElement('div');
                    ratingDiv.className = 'review-rating';
                    ratingDiv.textContent = '⭐'.repeat(review.rating);
                    
                    const titleH4 = document.createElement('h4');
                    titleH4.textContent = review.title || 'No title';
                    
                    const infoP = document.createElement('p');
                    const nameStrong = document.createElement('strong');
                    nameStrong.textContent = review.customerName;
                    infoP.appendChild(nameStrong);
                    infoP.appendChild(document.createTextNode(' - ' + new Date(review.createdAt).toLocaleDateString()));
                    
                    const commentP = document.createElement('p');
                    commentP.textContent = review.comment;
                    
                    const statusP = document.createElement('p');
                    const statusSmall = document.createElement('small');
                    statusSmall.textContent = 'Status: ' + review.status;
                    statusP.appendChild(statusSmall);
                    
                    reviewEl.appendChild(ratingDiv);
                    reviewEl.appendChild(titleH4);
                    reviewEl.appendChild(infoP);
                    reviewEl.appendChild(commentP);
                    reviewEl.appendChild(statusP);
                    
                    reviewsList.appendChild(reviewEl);
                });
            }
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
}
