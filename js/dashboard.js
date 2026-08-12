// VisionAssist Guardian Portal - Dashboard Module

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dashboard-page')) {
    initDashboard();
  }
});

function initDashboard() {
  updateDashboardMetrics();

  // Periodically refresh dashboard metrics
  setInterval(updateDashboardMetrics, 3000);
}

function updateDashboardMetrics() {
  if (isDemoMode()) {
    // Generate realistic simulated metrics for Demo Mode
    const now = new Date();
    const isOnline = true;
    
    setElText('status-safety', '🟢 Safe');
    setElText('status-user-online', isOnline ? 'Online' : 'Offline');
    setElText('last-updated-time', 'Just now');

    setElText('nav-destination', 'Apollo Hospital, Main Entrance');
    setElText('nav-distance', '650 m');
    setElText('nav-eta', '8 mins');

    setElText('battery-level-text', '78%');
    const bFill = document.getElementById('battery-fill');
    if (bFill) bFill.style.width = '78%';

    setElText('location-address', 'Agni College Campus, OMR Road, Chennai');
    setElText('location-coords', '12.9716° N, 80.2454° E');

    setElText('ai-camera-status', '● Active');
    setElText('ai-mic-status', '● Active');
    setElText('ai-gps-status', '● Active');
    setElText('ai-engine-status', '● Active');
    setElText('network-status-text', 'Online (4G)');

    setElText('stat-objects-count', '247');
    setElText('stat-alerts-count', '3');
    setElText('stat-distance-count', '5.8 km');
    setElText('stat-trips-count', '4');
    return;
  }

  // Fetch real metrics from Supabase database
  fetchSupabaseDashboardMetrics();
}

async function fetchSupabaseDashboardMetrics() {
  const client = getSupabase();
  if (!client) return;

  try {
    // Fetch latest location
    const { data: locData } = await client.from('locations').select('*').order('timestamp', { ascending: false }).limit(1);
    if (locData && locData[0]) {
      setElText('location-coords', `${locData[0].latitude.toFixed(4)}° N, ${locData[0].longitude.toFixed(4)}° E`);
      setElText('location-address', locData[0].address || 'Current Location');
      setElText('last-updated-time', new Date(locData[0].timestamp).toLocaleTimeString());
    }

    // Fetch device status
    const { data: devData } = await client.from('device_status').select('*').limit(1);
    if (devData && devData[0]) {
      setElText('battery-level-text', `${devData[0].battery}%`);
      const bFill = document.getElementById('battery-fill');
      if (bFill) bFill.style.width = `${devData[0].battery}%`;

      setElText('ai-camera-status', `● ${devData[0].camera_status}`);
      setElText('ai-mic-status', `● ${devData[0].microphone_status}`);
      setElText('ai-gps-status', `● ${devData[0].gps_status}`);
      setElText('ai-engine-status', `● ${devData[0].ai_status}`);
      setElText('network-status-text', devData[0].network_status);
    }

    // Fetch active navigation
    const { data: navData } = await client.from('navigation_sessions').select('*').eq('status', 'IN_PROGRESS').limit(1);
    if (navData && navData[0]) {
      setElText('nav-destination', navData[0].destination);
      setElText('nav-distance', `${navData[0].distance || 0} m`);
      setElText('nav-eta', `${Math.round((navData[0].distance || 0) / 80)} mins`);
    }

    // Fetch alerts count
    const { data: alertData } = await client.from('alerts').select('id', { count: 'exact' });
    if (alertData) setElText('stat-alerts-count', alertData.length || 0);

  } catch (err) {
    console.error('Error fetching dashboard metrics:', err);
  }
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
