// Base URL for backend API
const BASE_URL = 'http://localhost:5000/api';

// Helper to get auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper for fetch requests
const request = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ── AUTH ──────────────────────────────────────────
export const registerUser  = (data) => request('/auth/register', 'POST', data);
export const loginUser     = (data) => request('/auth/login',    'POST', data);

// ── ALUMNI ────────────────────────────────────────
export const getAlumni     = (params = '') => request(`/alumni${params}`);
export const addAlumni     = (data)        => request('/alumni', 'POST', data);
export const updateAlumni  = (id, data)    => request(`/alumni/${id}`, 'PUT', data);
export const deleteAlumni  = (id)          => request(`/alumni/${id}`, 'DELETE');

// ── EVENTS ────────────────────────────────────────
export const getEvents          = ()   => request('/events');
export const createEvent        = (data) => request('/events', 'POST', data);
export const registerForEvent   = (id)   => request(`/events/${id}/register`, 'PUT');

// ── JOBS ──────────────────────────────────────────
export const getJobs   = ()     => request('/jobs');
export const postJob   = (data) => request('/jobs', 'POST', data);
export const deleteJob = (id)   => request(`/jobs/${id}`, 'DELETE');
