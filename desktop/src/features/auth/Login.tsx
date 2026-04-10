import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for the confirmation link!');
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col gap-4 p-8 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Welcome to MoneyFlow Cloud</h2>
      <input 
        type="email" 
        placeholder="Email" 
        className="border p-2 rounded"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="border p-2 rounded"
        onChange={(e) => setPassword(e.target.value)} 
      />
      <div className="flex gap-2">
        <button onClick={handleLogin} className="bg-primary text-white px-4 py-2 rounded">Login</button>
        <button onClick={handleSignUp} className="border px-4 py-2 rounded">Sign Up</button>
      </div>
    </div>
  );
};