// supabase.js

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://paphpyftojdcogbwtugv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcGhweWZ0b2pkY29nYnd0dWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDE1MTksImV4cCI6MjA2Nzk3NzUxOX0.MNg54k76IWcS_F-hw6ceD6LPwd4iKpg0A7z7Z9mdkUc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
