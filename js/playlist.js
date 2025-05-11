// Spotify API configuration
const clientId = 'SEU_CLIENT_ID_AQUI'; // Substitua pelo Client ID obtido no Spotify for Developers
const redirectUri = window.location.origin + window.location.pathname;
const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

// Elements
const loginButton = document.getElementById('login-button');
const loginContainer = document.getElementById('login-container');
const playerContainer = document.getElementById('player-container');
const loginMessage = document.getElementById('login-message');
const deviceSelect = document.getElementById('device-select');
const playlist = document.getElementById('playlist');
const input = document.getElementById('headshell');
const vinyl = document.querySelector('.vinyl');
const volumeControl = document.getElementById('volume-control');

// Spotify player state
let accessToken = null;
let deviceId = null;
let player = null;
let isPlaying = false;
let currentTrackId = null;

// Generate a random string for the state parameter
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Get URL parameters
function getUrlParams() {
    const params = {};
    const hashParams = window.location.hash.substring(1).split('&');
    for (let i = 0; i < hashParams.length; i++) {
        const pair = hashParams[i].split('=');
        if (pair[0] && pair[1]) {
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
    }
    return params;
}

// Login with Spotify
function loginWithSpotify() {
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);
    
    const url = 'https://accounts.spotify.com/authorize?' +
        'response_type=token' +
        '&client_id=' + encodeURIComponent(clientId) +
        '&scope=' + encodeURIComponent(scope) +
        '&redirect_uri=' + encodeURIComponent(redirectUri) +
        '&state=' + encodeURIComponent(state);
    
    window.location = url;
}

// Initialize the Spotify Web Playback SDK
function initializePlayer() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: 'Web Playback SDK for Presente para Parceiro',
            getOAuthToken: cb => { cb(accessToken); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => {
            loginMessage.textContent = 'Erro na inicialização: ' + message;
        });
        player.addListener('authentication_error', ({ message }) => {
            loginMessage.textContent = 'Erro na autenticação: ' + message;
        });
        player.addListener('account_error', ({ message }) => {
            loginMessage.textContent = 'Erro na conta: requer Premium ' + message;
        });
        player.addListener('playback_error', ({ message }) => {
            console.error('Erro no playback:', message);
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            deviceId = device_id;
            console.log('Dispositivo pronto com ID:', deviceId);
            
            // Add this device to the device selection
            const option = document.createElement('option');
            option.value = deviceId;
            option.textContent = 'Este navegador';
            deviceSelect.appendChild(option);
            deviceSelect.value = deviceId;
            
            // Get available devices
            getAvailableDevices();
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Dispositivo desconectado:', device_id);
        });

        // Connect to the player
        player.connect();
    };
}

// Get available Spotify devices
function getAvailableDevices() {
    axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        const devices = response.data.devices;
        // Clear existing options except first two
        while (deviceSelect.options.length > 2) {
            deviceSelect.remove(2);
        }
        
        // Add available devices
        devices.forEach(device => {
            if (device.id !== deviceId) {  // Skip our web player which is already added
                const option = document.createElement('option');
                option.value = device.id;
                option.textContent = device.name;
                deviceSelect.appendChild(option);
            }
        });
    })
    .catch(error => {
        console.error('Error getting devices:', error);
    });
}

// Play a track on the selected device
function playTrack(trackId) {
    if (!accessToken || !deviceSelect.value) {
        loginMessage.textContent = 'Selecione um dispositivo ou faça login novamente';
        return;
    }
    
    currentTrackId = trackId;
    
    axios({
        method: 'put',
        url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceSelect.value}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: {
            uris: [`spotify:track:${trackId}`]
        }
    })
    .then(() => {
        isPlaying = true;
        vinyl.style.animation = 'rotate 10s linear infinite';
        vinyl.style.animationPlayState = 'running';
        input.checked = true;
    })
    .catch(error => {
        console.error('Erro ao reproduzir música:', error);
        if (error.response && error.response.status === 401) {
            // Token expired, try to refresh
            loginMessage.textContent = 'Sessão expirada, faça login novamente';
            logout();
        }
    });
}

// Pause playback
function pausePlayback() {
    axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/pause',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(() => {
        isPlaying = false;
        vinyl.style.animationPlayState = 'paused';
    })
    .catch(error => {
        console.error('Erro ao pausar música:', error);
    });
}

// Toggle playback (play/pause)
function togglePlayback() {
    if (!accessToken) {
        loginMessage.textContent = 'Faça login primeiro';
        return;
    }
    
    if (isPlaying) {
        pausePlayback();
    } else {
        if (currentTrackId) {
            playTrack(currentTrackId);
        } else {
            // Play first track in playlist if none is selected
            changeTrack();
        }
    }
}

// Change track
function changeTrack() {
    if (!accessToken) {
        loginMessage.textContent = 'Faça login primeiro';
        return;
    }
    
    let selectedTrackId = playlist.value;
    
    if (!selectedTrackId) {
        loginMessage.textContent = 'Nenhuma música selecionada';
        return;
    }
    
    // Reset animation
    vinyl.style.animation = 'none';
    input.checked = false;
    vinyl.offsetHeight; // Force reflow
    
    // Play the selected track
    playTrack(selectedTrackId);
}

// Adjust volume
function adjustVolume(amount) {
    if (!accessToken) return;
    
    const volume = parseInt(amount) / 100;
    
    axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/volume',
        params: {
            volume_percent: amount,
            device_id: deviceSelect.value
        },
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .catch(error => {
        console.error('Erro ao ajustar volume:', error);
    });
}

// Logout function
function logout() {
    accessToken = null;
    localStorage.removeItem('spotify_auth_state');
    localStorage.removeItem('spotify_access_token');
    
    // Reset UI
    loginContainer.style.display = 'block';
    playerContainer.style.display = 'none';
    
    // Clear URL hash
    window.location.hash = '';
}

// Handle device selection change
deviceSelect.addEventListener('change', function() {
    // If a track is playing, transfer playback to the new device
    if (isPlaying && currentTrackId) {
        playTrack(currentTrackId);
    }
});

// Event listener for headshell (play/pause control)
input.addEventListener('click', function() {
    togglePlayback();
});

// Event listener for login button
loginButton.addEventListener('click', function() {
    loginWithSpotify();
});

// Check if we've just returned from a Spotify auth flow
window.addEventListener('load', function() {
    const params = getUrlParams();
    
    // Check if we have an access token
    if (params.access_token) {
        // Save the access token
        accessToken = params.access_token;
        localStorage.setItem('spotify_access_token', accessToken);
        
        // Update UI
        loginContainer.style.display = 'none';
        playerContainer.style.display = 'block';
        
        // Initialize the Spotify player
        initializePlayer();
    } else {
        // Check if we have a saved token
        const savedToken = localStorage.getItem('spotify_access_token');
        if (savedToken) {
            accessToken = savedToken;
            
            // Update UI
            loginContainer.style.display = 'none';
            playerContainer.style.display = 'block';
            
            // Initialize the Spotify player
            initializePlayer();
        } else {
            // Show login button
            loginContainer.style.display = 'block';
            playerContainer.style.display = 'none';
        }
    }
});